<template>
  <div>
    <v-row>
      <v-col
        cols="12"
        md="12"
      >
        <v-card-title>Proposal Gallery</v-card-title>
        <v-card-text>
          Active Proposals: {{ getNumTotalProposals }}
        </v-card-text>
        <!-- Card for each active proposal -->
        <v-col
          md="4"
          sm="6"
          cols="12"
        >
          <v-card
            v-for="(proposal, index) in proposalsMap"
            :key="index"
          >
            <v-img
              v-if="proposal.coverImage"
              :src="proposal.coverImage"
              height="250"
            />
            <v-card-title>
              {{ proposal.title }}
            </v-card-title>
            <v-card-text v-if="proposal.isActive">
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
            <FormulateInput
              type="submit"
              class="stop-proposal-btn"
              :disabled="!walletConnected || isVoting"
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
                <v-card-text>
                  URL: {{ proposal.urlLink }}
                </v-card-text>
                <v-card-text>
                  Keywords: {{ proposal.keywords }}
                </v-card-text>
                <v-card-text>
                  Voting Type: {{ proposal.votingType }}
                </v-card-text>
                <v-card-text>
                  Voting Period: {{ proposal.votingPeriod }}
                </v-card-text>
                <v-card-text>
                  Voting Tokens: {{ proposal.votingTokens }}
                </v-card-text>
                <v-card-text>
                  Timestamp: {{ proposal.publishTimestamp }}
                </v-card-text>
                <v-img
                  v-for="(attachedFile, attachedFileIndex) in proposal.attachedFiles"
                  :key="attachedFileIndex"
                  :src="attachedFile"
                  height="250"
                />
                <v-card-text>
                  Total Voting Power: {{ getTotalVotingPowerByID(proposal.proposalID) }}
                </v-card-text>
                <v-card
                  v-for="(option, optionIndex) in proposal.options"
                  :key="optionIndex"
                >
                  <v-card-text>
                    Option {{ optionIndex + 1 }}:
                  </v-card-text>
                  <v-card>
                    {{ option }}
                  </v-card>
                  <FormulateForm
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
                      :disabled="!walletConnected || isStopping"
                      :label="isVoting ? 'Loading...' : 'Submit Vote'"
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
import { getWalletBalanceByToken } from '@/utils/contract/contractHelpers'
import { voteOnProposal, stopProposalEarly } from '@/utils/contract/proposal/proposalController'

export default {
  setup() {
    return {
      isCardDetailsVisible: false,
      isVoting: false,
      isStopping: false,
      icons: {
        mdiChevronUp,
        mdiChevronDown,
      },
      votingTokenSelected: String,
      votingTokenGroup: {},
    }
  },
  computed: {
    ...mapState([
      'walletConnected',
      'connectedWalletAddr',
      'connectedAccounts',
      'proposalsMap',
      'votingMap',
    ]),
    ...mapGetters([
      'getIsWalletConnected',
      'getConnectedWalletAddr',
      'getConnectedAccounts',
      'getProposalsMap',
      'getVotingMap',
      'getNumTotalProposals',
      'getNumVotesOnProposal',
      'getProposalByID',
    ]),
  },
  methods: {

    /**
     *
     */
    async getTotalVotingPowerByID(proposalID) {
      const proposalVotes = this.votingMap[proposalID]
      let totalVotingPower = 0
      proposalVotes.forEach(tokenVoteObj => {
        tokenVoteObj.forEach(votingPower => {
          totalVotingPower += votingPower
        })
      })

      return totalVotingPower
    },

    /**
     * async submitVoteHandler(proposalID, voteToken, voterPower(balance), optionNumber)
     */
    async submitVoteHandler(proposal, optionNumber) {
      console.log('VBDAO - ATTEMPTING TO SUBMIT VOTE: ')

      this.isLoading = true

      const voteToken = proposal.votingTokens[this.votingTokenGroup.tokenIndex]

      // Get the balance of connected wallet by tokenId
      let tokenBalance = 0
      await getWalletBalanceByToken(this.connectedAccounts[0]).then(({ balance, unreceived }) => {
        console.log('balance: ', balance, unreceived)
        console.log('balanceInfoMap: ', balance.balanceInfoMap)
        Object.values(balance.balanceInfoMap).forEach(val => {
          console.log(val)
          tokenBalance += parseInt(BigNumber(val.balance).dividedBy(`1e${val.tokenInfo.decimals}`).toFixed(), 10)
        })
      })

      // FIX ME - Using the balance and voting type to calculate the weight of this vote
      const voteWeight = tokenBalance

      const voteParams = {
        voter: this.connectedAccounts[0],
        proposalID: proposal.proposalID,
        voteToken: voteToken,
        voterPower: voteWeight,
        optionNumber: optionNumber,
        voteTimestamp: new Date(),
      }

      console.log('VBDAO VOTE PARAM - voter: ', voteParams.voter)
      console.log('VBDAO VOTE PARAM - proposalID: ', voteParams.proposalID)
      console.log('VBDAO VOTE PARAM - votingToken: ', voteParams.voteToken)
      console.log('VBDAO VOTE PARAM - voterPower: ', voteParams.voterPower)
      console.log('VBDAO VOTE PARAM - optionNumber: ', voteParams.optionNumber)
      console.log('VBDAO VOTE PARAM - voteTimestamp: ', voteParams.voteTimestamp)

      voteOnProposal([
        voteParams.voter.address,
        voteParams.proposalID,
        voteParams.voteToken,
        voteParams.voterPower,
        voteParams.optionNumber,
      ], this.onProposalVoteEvent).then(block => {
        if (block && voteParams && voteParams.proposalID) {
          this.$store.dispatch('addProposalVote', voteParams.proposalID, voteParams)
          console.log('VBDAO: CALL TO CONTRACT (voteOnProposal) SUCCESS', block)
          this.isLoading = false
        }
      })
    },

    /**
     *
     */
    async debugStopProposalHandler(proposalID) {
      this.isLoading = true
      if (!this.walletConnected) {
        console.log('VBDAO: debugStopProposalHandler error - wallet is not connected')

        return
      }

      console.log('VBDAO STOP PROPOSAL PARAM - proposalID: ', proposalID)
      console.log('VBDAO STOP PROPOSAL PARAM - onProposalEndEvent: ', this.onProposalEndEvent)
      console.log('VBDAO STOP PROPOSAL PARAM - onProposalResultsEvent: ', this.onProposalResultsEvent)

      stopProposalEarly(proposalID, this.onProposalEndEvent, this.onProposalResultsEvent).then(block => {
        if (block && proposalID) {
          this.$store.commit('setProposalStatusById', {
            proposalID: proposalID,
            status: false,
          })
          console.log('VBDAO: debugStopProposalHandler success', block)
          this.isLoading = false
        }
      })
    },

    /**
     *
     * ProposalVotedOnEvent(
     *  uint256 proposalID,
     *  address proposalVoter,
     *  uint votingPower,
     *  uint256 proposalTotalVotingPower,
     *  uint256 proposalTotalVotes
     * )
     * @param {Array} eventLog
     */
    async onProposalVoteEvent(eventLog) {
      console.log('VBDAO - onProposalVoteEvent:', eventLog)
      this.isLoading = false
    },

    /**
     * ProposalEndedEvent(
     *   uint256 proposalID,
     *   uint proposalEndTime
     * )
     * @param {Array} eventLog
     */
    async onProposalEndEvent(eventLog) {
      console.log('VBDAO - onProposalEndEvent:', eventLog)
    },

    /**
     *
     * @param {Array} eventLog
     */
    async onProposalResultsEvent(eventLog) {
      console.log('VBDAO - onProposalResultsEvent:', eventLog)
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

<!-- Card for each active proposal
      <ul>
        <li
          v-for="(proposal, index) in proposalsMap"
          :key="index"
        >
          <v-col
            md="4"
            sm="6"
            cols="12"
            class="align-self-start"
          >
            <v-card>
              <v-img
                :src="proposal.coverImage"
                height="250"
              />
              <v-card-title>
                {{ proposal.title }}
              </v-card-title>
              <v-card-text v-if="proposal.isActive">
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
              <v-card-text>
                URL: {{ proposal.urlLink }}
              </v-card-text>
              <v-card-text>
                Keywords: {{ proposal.keywords }}
              </v-card-text>
              <v-card-text>
                Options: {{ proposal.options }}
              </v-card-text>
              <v-card-text>
                Voting Type: {{ proposal.votingType }}
              </v-card-text>
              <v-card-text>
                Voting Period: {{ proposal.votingPeriod }}
              </v-card-text>
              <v-card-text>
                Voting Tokens: {{ proposal.votingTokens }}
              </v-card-text>
              <v-card-text>
                Timestamp: {{ proposal.publishTimestamp }}
              </v-card-text>
              <v-card-actions class="dense">
                <v-btn
                  color="primary"
                  text
                >
                  Attached Files
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
                  <v-divider></v-divider>
                  <ul>
                    <li
                      v-for="(attachedFile, attachedFileIndex) in proposal.attachedFiles"
                      :key="attachedFileIndex"
                    >
                      <v-img
                        :src="attachedFile"
                        height="250"
                      />
                      <FormulateInput
                        type="submit"
                        :disabled="!walletConnected"
                        help="Note: Vite wallet must be connected to vote."
                        :label="isLoading ? 'Loading...' : 'Submit Vote'"
                        @submit="submitVoteHandler(proposal.proposalID)"
                      />
                    </li>
                  </ul>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>
        </li>
      </ul>

selectTokenSchema: [
  {
    type: 'group',
    name: 'tokenGroup',
    label: 'Voting Token(s)',
    repeatable: true,
    'add-label': '+ Add Token',
    validation: 'required',
    value: [{}],
    children: [
      {
        type: 'select',
        name: 'tokenSelected',
      },
    ],
  },
],
<FormulateInput
  v-for="tokenChoiceItem in selectTokenSchema"
  :key="tokenChoiceItem.name"
  v-bind="tokenChoiceItem"
  class="proposalDropdownStyle"
>
  <FormulateInput
    v-for="childItem in tokenChoiceItem.children"
    :key="childItem.name"
    v-bind="childItem"
    placeholder="Select a token"
    :options="tokenList ? tokenList : ''"
    validation="required"
    validation-name="Token type"
    class="proposalDropdownStyle"
  />
</FormulateInput>

const tokensSelected = {}
this.tokensSelectedData.tokenGroup.forEach((tokenObj, index) => {
  tokensSelected[index] = tokenObj.tokenSelected
})
-->
