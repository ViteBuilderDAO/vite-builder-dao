<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="12"
      >
        <v-card-title>Proposal Gallery</v-card-title>
        <v-card-text>
          Number of Proposals: {{ numProposals }}
        </v-card-text>
        <!-- Card for each active proposal -->
        <v-col
          md="4"
          sm="6"
          cols="12"
        >
          <v-card
            v-for="(proposal, index) in proposals"
            :key="index"
          >
            <v-card-title>
              {{ proposal.title }}
            </v-card-title>
            <v-card-text v-if="proposal.state === 'Active'">
              Active
            </v-card-text>
            <v-card-text v-else>
              Complete
            </v-card-text>
            <v-card-text>
              Proposal ID: {{ proposal.proposalID }}
            </v-card-text>
            <v-card-text>
              Description: {{ proposal.description }}
            </v-card-text>
            <v-card-text>
              Creator: {{ proposal.creator }}
            </v-card-text>
            <!-- :disabled="hasMissingParams() || isVoting" -->
            <FormulateInput
              type="submit"
              class="stop-proposal-btn"
              help="Note: Vite wallet must be connected to stop the proposal."
              :label="isVoting ? 'Stopping...' : 'Stop (Debug)'"
              @submit="debugStopProposalHandler(proposal.proposalID)"
            />
            <v-card-actions class="dense">
              <v-btn
                color="primary"
                text
              >
                Details
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                icon
                @click="isCardDetailsVisible = !isCardDetailsVisible"
              >
                <v-icon>{{ isCardDetailsVisible ? icons.mdiChevronUp : icons.mdiChevronDown }}</v-icon>
              </v-btn>
            </v-card-actions>
            <v-expand-transition>
              <div v-show="isCardDetailsVisible">
                <v-card>
                  <v-card-text>
                    urlLink: {{ proposal.urlLink }}
                    keywords: {{ proposal.keywords }}
                    description: {{ proposal.description }}
                    numOptions: {{ proposal.numOptions }}
                    optionsArr: {{ proposal.optionsArr }}
                    optionsVotePowers: {{ proposal.optionsVotePowers }}
                    optionsTotalVotes: {{ proposal.optionsTotalVotes }}
                    coverImage: {{ proposal.coverImage }}
                    attachedFiles: {{ proposal.attachedFiles }}
                    votingType: {{ proposal.votingType }}
                    publishDate: {{ proposal.publishDate }}
                    deadline: {{ proposal.deadline }}
                    votingTokens: {{ proposal.votingTokens }}
                    totalVotingPower: {{ proposal.totalVotingPower }}
                    totalVotes: {{ proposal.totalVotes }}
                    state: {{ proposal.state }}
                  </v-card-text>
                  <!-- <FormulateForm
                    @submit="submitVoteHandler(proposal, optionIndex)"
                  >
                    <FormulateForm
                      v-model="votingTokenGroup"
                    >
                      <FormulateInput
                        :key="votingTokenSelected.name"
                        :options="proposal.votingTokens"
                        class="voting-token-dropdown"
                        name="tokenIndex"
                        type="select"
                        label="Vote Token"
                      />
                    </FormulateForm>
                    <v-card-text>
                      Selected Token ID: {{ proposal.votingTokens[votingTokenGroup.tokenIndex] }}
                    </v-card-text>
                    <FormulateInput
                      type="submit"
                      class="submit-vote-btn"
                      :disabled="hasMissingParams() || isStopping"
                      :label="isVoting ? 'Loading...' : 'Submit Vote'"
                    />
                  </FormulateForm> -->
                </v-card>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {
  mdiChevronUp,
  mdiChevronDown,
} from '@mdi/js'
import BigNumber from 'bignumber.js'
import { getWalletBalanceInfo } from '@/utils/contract/contractHelpers'
import {
  stopProposalEarly,
} from '@/utils/proposal/proposalController'

const { abi } = require('@vite/vitejs')

// stopProposal,
// getAllProposals
// voteOnProposal,
// getIsProposalComplete,
// getProposalByID,

export default {
  setup() {
    return {
      numProposals: 0,
      proposals: Array,
      isCardDetailsVisible: false,
      isVoting: false,
      isStopping: false,
      icons: {
        mdiChevronUp,
        mdiChevronDown,
      },
    }
  },
  computed: {
    ...mapState([
      'walletConnected',
      'connectedWalletAddr',
      'connectedAccounts',
    ]),
    ...mapGetters([
      'getIsWalletConnected',
      'getConnectedWalletAddr',
      'getConnectedAccounts',
    ]),
  },
  mounted() {
    this.onMounted()
  },
  methods: {
    /**
     *
     */
    hasMissingParams() {
      if (!this.walletConnected) {
        return true
      }

      return false
    },

    /**
     * async submitVoteHandler(proposalID, voteToken, voterPower(balance), optionNumber)
     */
    async submitVoteHandler(proposal, optionNumber) {
      // if (this.hasMissingParams()) {
      //   console.log('VBDAO - Missing Required Parameter')

      //   return
      // }

      console.log('VBDAO - ATTEMPTING TO SUBMIT VOTE: ')

      this.isLoading = true

      const voteToken = proposal.votingTokens[this.votingTokenGroup.tokenIndex]

      // Get the balance of connected wallet by tokenId
      // FIX ME - Use the tokenId to parse
      let tokenBalance = 0
      await getWalletBalanceInfo(this.connectedAccounts[0]).then(({ balance, unreceived }) => {
        console.log('balance: ', balance, unreceived)
        console.log('balanceInfoMap: ', balance.balanceInfoMap)
        Object.values(balance.balanceInfoMap).forEach(val => {
          console.log(val)
          tokenBalance += parseInt(BigNumber(val.balance).dividedBy(`1e${val.tokenInfo.decimals}`).toFixed(), 10)
        })
      })

      // FIX ME - Use the balance and voting type to calculate the weight of this vote
      const voteWeight = tokenBalance

      const voteParams = {
        voter: this.connectedAccounts[0],
        proposalID: proposal.proposalID,
        voteToken: voteToken,
        voterPower: voteWeight,
        optionNumber: optionNumber,
        voteTimestamp: new Date(),
      }

      console.log('VBDAO VOTE PARAM DECODED - voter: ', voteParams.voter)
      console.log('VBDAO VOTE PARAM DECODED - proposalID: ', voteParams.proposalID)
      console.log('VBDAO VOTE PARAM DECODED - votingToken: ', voteParams.votingToken)
      console.log('VBDAO VOTE PARAM DECODED - voterPower: ', voteParams.voterPower)
      console.log('VBDAO VOTE PARAM DECODED - optionNumber: ', voteParams.optionNumber)
      console.log('VBDAO VOTE PARAM DECODED - voteTimestamp: ', voteParams.voteTimestamp)

      const encodedParameters = abi.encodeParameters(['address', 'uint256', 'uint256', 'uint256', 'uint'], voteParams)

      console.log('VBDAO VOTE PARAM ENCODED - voter: ', encodedParameters.voter)
      console.log('VBDAO VOTE PARAM ENCODED - proposalID: ', encodedParameters.proposalID)
      console.log('VBDAO VOTE PARAM ENCODED - votingToken: ', encodedParameters.votingToken)
      console.log('VBDAO VOTE PARAM ENCODED - voterPower: ', encodedParameters.voterPower)
      console.log('VBDAO VOTE PARAM ENCODED - optionNumber: ', encodedParameters.optionNumber)
      console.log('VBDAO VOTE PARAM ENCODED - voteTimestamp: ', encodedParameters.voteTimestamp)

      // voteOnProposal([
      //   voteParams.voter.address,
      //   voteParams.proposalID,
      //   voteParams.voteToken,
      //   voteParams.voterPower,
      //   voteParams.optionNumber,
      // ], this.onProposalVoteEvent).then(block => {
      //   if (block && voteParams) {
      //     this.$store.dispatch('addProposalVote', voteParams.proposalID, voteParams)
      //     console.log('VBDAO: CALL TO CONTRACT (voteOnProposal) SUCCESS', block)
      //     getProposalByID(voteParams.proposalID).then(proposalObj => {
      //       if (proposalObj) {
      //         this.proposals[voteParams.proposalID] = proposalObj)
      //         this.isLoading = false
      //       }
      //     })
      //   }
      // })
    },

    /**
     *
     */
    async debugStopProposalHandler(proposalID) {
      // if (this.hasMissingParams()) {
      //   console.log('VBDAO - Missing Required Parameter')

      //   return
      // }

      console.log('VBDAO - ATTEMPTING TO STOP PROPOSAL: ')
      this.isStopping = true
      if (!this.walletConnected) {
        console.log('VBDAO: debugStopProposalHandler error - wallet is not connected')

        return
      }

      console.log('VBDAO STOP PROPOSAL PARAM - proposalID: ', proposalID)
      console.log('VBDAO STOP PROPOSAL PARAM - onProposalEndEvent: ', this.onProposalEndEvent)
      console.log('VBDAO STOP PROPOSAL PARAM - onProposalResultsEvent: ', this.onProposalResultsEvent)

      stopProposalEarly(proposalID, this.onProposalEndEvent, this.onProposalResultsEvent).then(block => {
        if (block) {
          console.log('VBDAO: debugStopProposalHandler success', block)
          this.isStopping = false
        }
      })
    },

    /**
     *
     */
    async onProposalVoteEvent(eventLog) {
      console.log('VBDAO - onProposalVoteEvent:', eventLog)
      this.isLoading = false
    },

    /**
     *
     */
    async onProposalEndEvent(eventLog) {
      console.log('VBDAO - onProposalEndEvent:', eventLog)
    },

    /**
     *
     */
    async onProposalResultsEvent(eventLog) {
      console.log('VBDAO - onProposalResultsEvent:', eventLog)
    },

    /**
     *
     */
    async onMounted() {
      // this.proposals = await getAllProposals()
      // this.numProposals = this.proposals.length
    },
  },
}
</script>

<style lang="scss">
.stop-proposal-btn {
  margin: 10px;
  left: 0;
}
.submit-vote-btn {
  margin-top: 40px;
}
.voting-token-dropdown {
  max-width: 200px !important;
}
</style>
