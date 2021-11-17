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
                    proposalIcon: {{ proposal.proposalIcon }}
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
                    @submit="submitVoteHandler(proposal)"
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
                      v-model="value"
                      :options="{first: 'First', second: 'Second', third: 'Third', fourth: 'Fourth'}"
                      type="checkbox"
                      label="This is a label for all the options (FIX ME)"
                    />
                    <FormulateInput
                      type="submit"
                      class="submit-vote-btn"
                      :disabled="hasMissingParams() || isStopping"
                      :label="isVoting ? 'Loading...' : 'Submit Vote'"
                    />
                  </FormulateForm> -->
                  <FormulateForm
                    v-model="proposalVoteData"
                    @submit="submitVoteHandler(proposal)"
                  >
                    <FormulateInput
                      v-for="item in proposalVoteSchema"
                      :key="item.name"
                      v-bind="item"
                    >
                      <FormulateInput
                        v-for="childItem in item.children"
                        :key="childItem.name"
                        v-bind="childItem"
                        :options="proposal.optionsArr ? proposal.optionsArr : ''"
                      />
                    </FormulateInput>
                    <FormulateInput
                      type="submit"
                      class="submitFormButtonStyle"
                      help="Note: Vite wallet must be connected to submit."
                      :label="isLoading ? 'Awaiting Vite App Approval...' : 'Submit'"
                    />
                </FormulateForm>
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
import { ipfsGetData, ipfsSetData } from '@/store/ipfs'

// stopProposal,
// voteOnProposal,
// getIsProposalComplete,
// getProposalByID,

export default {
  props: {
    proposal: {
      type: Array / Object / String / Number,
      required: true,
    },
  },
  setup() {
    return {
      isCardDetailsVisible: false,
      isVoting: false,
      isStopping: false,
      icons: {
        mdiChevronUp,
        mdiChevronDown,
      },
      proposalVoteData: {},
      proposalVoteSchema: [
        {
          type: 'select',
          name: 'votingType',
          label: 'Voting Type',
          options: votingTypes,
          class: 'createProposalDropdown',
        },
      ],
      votingPowers = {},
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
    async submitVoteHandler(proposal) {
      // if (this.hasMissingParams()) {
      //   console.log('VBDAO - Missing Required Parameter')

      //   return
      // }

      console.log('VBDAO - ATTEMPTING TO SUBMIT VOTE: ')

      this.isLoading = true

      // (uint256 proposalID, address voter, uint256 voterPower, uint256 ipfsData)
      console.log('VBDAO VOTE PARAM - voter: ', this.connectedAccounts[0])
      console.log('VBDAO VOTE PARAM - proposalID: ', proposal.proposalID)
      console.log('VBDAO VOTE PARAM - optionsVoted: ', this.proposalVoteData)
      console.log('VBDAO VOTE PARAM - votingPowers: ', votingPowers)

      const voteParams = {
        voter: this.connectedAccounts[0],
        proposalID: proposal.proposalID,
        optionsVoted: this.proposalVoteData,
        votingPowers: votingPowers,
      }

      console.log('VBDAO VOTE PARAM ENCODED - voter: ', voteParams.voter)
      console.log('VBDAO VOTE PARAM ENCODED - proposalID: ', voteParams.proposalID)
      console.log('VBDAO VOTE PARAM ENCODED - optionsVoted: ', voteParams.optionsVoted)
      console.log('VBDAO VOTE PARAM ENCODED - votingPowers: ', voteParams.votingPowers)

      // voteOnProposal(voteParams, this.onProposalVoteEvent).then(block => {
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
    async calculateVotingPowers(votingTokens, votingType) {
      console.log('VBDAO - calculateVotingPowers:', votingTokens, votingType)

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
      calculateVotingPowers
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
.submitFormButtonStyle {
  margin-top: 40px;
}
</style>
