<template>
  <div>
    <v-row class="match-height">
      <v-col
        cols="12"
        md="12"
      >
        <v-card>
          <v-card-title>Proposal Gallery</v-card-title>
          <v-card-text>
            Active Proposals: {{ getNumActiveProposals }}
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Card for each active proposal -->
      <ul>
        <li
          v-for="(proposal, index) in currActiveProposals"
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
    </v-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {
  mdiChevronUp,
  mdiChevronDown,
} from '@mdi/js'
import { voteOnProposal, stopProposalEarly } from '@/utils/contract/proposal/proposalController'

export default {
  setup() {
    return {
      isCardDetailsVisible: false,
      isLoading: false,
      voteParams: {
        voter: String,
        proposalID: Number,
        voteToken: String,
        voterPower: Number,
        optionNumber: Number,
        voteDate: Object / String,
      },
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
      'currActiveProposals',
    ]),
    ...mapGetters([
      'getIsWalletConnected',
      'getConnectedWalletAddr',
      'getCurrActiveProposals',
      'getNumActiveProposals',
    ]),
  },
  methods: {

    /**
     * async submitVoteHandler(proposalID, voteToken, voterPower(balance), optionNumber)
     */
    async submitVoteHandler(proposalID) {
      this.isLoading = true
      this.voteParams = {
        voter: this.connectedWalletAddr,
        proposalID: proposalID,
        voteToken: String,
        voterPower: Number,
        optionNumber: Number,
        voteTimestamp: new Date(),
      }

      await voteOnProposal(this.voteParams, this.onProposalVoteEvent)
      console.log('VBDAO: submitVoteHandler success')
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
      await stopProposalEarly(proposalID, this.connectedWalletAddr, this.onProposalEndEvent, this.onProposalResultsEvent)
      console.log('VBDAO: debugStopProposalHandler success')
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

<!--
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
