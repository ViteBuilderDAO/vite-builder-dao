<template>
  <v-row>
    <!-- Create new proposal -->
    <v-col
      class="create-proposal-form"
      cols="12"
      md="12"
    >
      <v-card>
        <v-card-title>Create a Proposal</v-card-title>
        <v-card-text>
          <FormulateForm
            v-model="createProposalData"
            :class="$vuetify.theme.dark ? 'create-proposal-light-text' : 'create-proposal-dark-borders'"
            @submit="submitHandler"
          >
            <v-expand-transition>
              <div v-show="!isLoading">
                <FormulateInput
                  v-for="item in createProposalSchema"
                  :key="item.name"
                  v-bind="item"
                >
                  <FormulateInput
                    v-for="childItem in item.children"
                    :key="childItem.name"
                    v-bind="childItem"
                    :options="tokenList ? tokenList : ''"
                  />
                </FormulateInput>
              </div>
            </v-expand-transition>
            <FormulateInput
              type="submit"
              class="submitFormButtonStyle"
              error-behavior="live"
              :validation="!walletConnected ? 'required' : ''"
              validation-name="Vite wallet"
              :label="isLoading ? 'Loading...' : 'Submit'"
              :disabled="hasMissingParams()"
            />
          </FormulateForm>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { getTokenList } from '@/utils/contract/contractHelpers'
import votingTypes from '@/utils/voting/votingController'
import {
  proposalsFirestore,
  votesFirestore,
  proposalStatsFirestore,
  addNewDoc,
  updateDocData,
} from '@/firebase/firebase'
import eventBus from '@/utils/events/eventBus'

// const { abi } = require('@vite/vitejs')
// import { ipfsSetData } from '@/store/ipfs'
// import { startProposal } from '@/utils/proposal/proposalController'

export default {
  data() {
    return {

      isLoading: false,
      tokenList: Array / Object / String / Number,
      createProposalData: {},
      createProposalSchema: [
        {
          type: 'select',
          name: 'votingType',
          label: 'Voting Type',
          options: votingTypes,
          class: 'createProposalDropdown',
        },
        {
          type: 'group',
          name: 'votingTokenData',
          label: 'Voting Token(s)',
          'error-behavior': 'live',
          validation: 'required',
          repeatable: true,
          minimum: 1,
          remove: false,
          class: 'createProposalDropdown',
          'add-label': '+ Add Token',
          value: [{}],
          children: [
            {
              type: 'select',
              placeholder: 'Select a token',
              name: 'tokenTTI',
              'error-behavior': 'live',
              validation: 'required',
              'validation-name': 'Voting token',
            },
          ],
        },
        {
          label: 'Proposal Title',
          name: 'title',
          'error-behavior': 'live',
          validation: 'required',
          'validation-name': 'Proposal title',
        },
        {
          label: 'Proposal URL',
          name: 'urlLink',
          'validation-name': 'Proposal link',
        },
        {
          label: 'Voting Period',
          name: 'durationInHours',
          help: 'Please use duration in hours (e.g. 24 = 1 day)',
          'error-behavior': 'live',
          validation: 'required',
          'validation-name': 'Voting period',
        },
        {
          label: 'Proposal Keywords',
          name: 'keywords',
          'validation-name': 'Proposal keywords',
        },
        {
          type: 'textarea',
          name: 'description',
          label: 'Description',
          'error-behavior': 'live',
          validation: 'required',
          'validation-name': 'Description',
        },
        {
          type: 'group',
          name: 'optionsData',
          label: 'Options',
          repeatable: true,
          'add-label': '+ Add Option',
          value: [{}],
          children: [
            {
              type: 'text',
              name: 'optionName',
              label: 'Name',
              'error-behavior': 'live',
              validation: 'required',
              'validation-name': 'Option name',
            },
          ],
        },
      ],
    }
  },

  computed: {
    ...mapState([
      'walletConnected',
      'connectedWalletAddr',
      'proposalStats',
      'whitelistedAddresses',
    ]),
    ...mapGetters([
      'getIsWalletConnected',
      'getConnectedWalletAddr',
      'getProposalStats',
      'getWhitelistedAddresses',
    ]),
  },

  created() {
    if (this.walletConnected && !this.whitelisted()) {
      this.$router.push('/')
    }
  },

  mounted() {
    eventBus.$on('vite-wallet-connected', () => {
      if (this.walletConnected && !this.whitelisted()) {
        this.$router.push('/')
      }
    })
    this.onMounted()
  },

  beforeDestroy() {
    // removing eventBus listeners
    eventBus.$off('vite-wallet-connected')
  },

  methods: {

    hasMissingParams() {
      if (
        !this.walletConnected
        || !this.whitelisted()
        || !(this.createProposalData.votingTokenData
            && this.createProposalData.votingTokenData[0].tokenTTI)
        || !(this.createProposalData.title
            && this.createProposalData.title.length > 0)
        || !(this.createProposalData.description
            && this.createProposalData.description.length > 0)
        || !(this.createProposalData.durationInHours
            && this.createProposalData.durationInHours.length > 0)
        || !(this.createProposalData.optionsData
            && this.createProposalData.optionsData[0].optionName
            && this.createProposalData.optionsData[0].optionName.length > 0)
      ) {
        return true
      }

      return false
    },

    whitelisted() {
      if (this.connectedWalletAddr
          && this.whitelistedAddresses
          && this.whitelistedAddresses.includes(this.connectedWalletAddr)) {
        return true
      }

      return false
    },

    async submitHandler() {
      const votingTokenArr = []
      this.createProposalData.votingTokenData.forEach(votingTokenObj => {
        this.tokenList.forEach(tokenListObj => {
          if (tokenListObj.value.includes(votingTokenObj.tokenTTI)) {
            votingTokenArr.push({ tokenTTI: votingTokenObj.tokenTTI, tokenName: tokenListObj.label })
          }
        })
      })

      if (this.hasMissingParams()) {
        console.log('VBDAO - Submit Error')

        return
      }

      this.isLoading = true

      const publishDate = new Date()
      const endDate = new Date(publishDate)
      endDate.setHours(endDate.getHours() + parseInt(this.createProposalData.durationInHours, 10))

      const proposalParams = {
        creator: this.connectedWalletAddr,
        title: this.createProposalData.title,
        description: this.createProposalData.description,
        numOptions: this.createProposalData.optionsData.length,
        options: this.createProposalData.optionsData,
        votingType: this.createProposalData.votingType,
        publishDate: publishDate,
        endDate: endDate,
        votingPeriod: this.createProposalData.durationInHours,
        votingTokens: votingTokenArr,
        status: 'Active',
        prevVoterMap: [],
      }

      if (this.createProposalData.urlLink && this.createProposalData.urlLink.length > 0) {
        proposalParams.urlLink = this.createProposalData.urlLink
      }

      if (this.createProposalData.keywords && this.createProposalData.keywords.length > 0) {
        proposalParams.keywords = this.createProposalData.keywords
      }

      const voteStatsInit = {
        totalVotes: 0,
        totalVotingPower: 0,
        optionStats: new Array(proposalParams.numOptions).fill({ optionTotalVotes: 0, optionTotalVotingPower: 0 }),
        results: {
          winningOptionName: '',
          winningOptionIndex: 0,
        },
        castedVotes: [],
      }

      if (voteStatsInit) {
        const votesInitRes = await addNewDoc(votesFirestore, voteStatsInit)
        proposalParams.voteStatsID = votesInitRes.id.toString()
      }

      if (proposalParams.voteStatsID) {
        const dataStorRes = await addNewDoc(proposalsFirestore, proposalParams)
        proposalParams.proposalID = dataStorRes.id.toString()
      }

      if (this.proposalStats.id) {
        await updateDocData(proposalStatsFirestore, this.proposalStats.id, {
          id: this.proposalStats.id,
          totalActiveProposals: this.proposalStats.numActiveProposals + 1,
          totalClosedProposals: this.proposalStats.numClosedProposals,
          totalNumProposals: this.proposalStats.totalProposals + 1,
        })

        if (proposalParams.proposalID) {
          this.$store.commit('initializeStore')
          this.$router.push('/')

          // this.$router.push({ path: `/` }) // -> /home
        }
      }
    },

    async onMounted() {
      this.tokenList = await getTokenList()
    },

    async onProposalStartEvent(eventLog) {
      console.log('VBDAO: onProposalStartEvent', eventLog)
    },
  },
}
</script>

<style lang="scss">
@import '@braid/vue-formulate/themes/snow/snow.scss';

.formulate-form.create-proposal-light-text {
  color: white;
}

.create-proposal-light-text {
  .formulate-input-help.formulate-input-help {
    color: gray;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .formulate-input {
    &[data-classification='text'] {
      input {
        color: white;
      }
    }
  }

  .formulate-input-element--textarea textarea {
    color: white;
  }

  .formulate-input[data-classification=select] select {
    color: white;
  }

  .formulate-input .formulate-input-error,
  .formulate-input .formulate-file-upload-error {
    color: gold;
    font-size: 0.90em;
  }

}

.create-proposal-dark-borders {

}

.createProposalDropdown {
  margin-bottom: 20px;
  max-width: 200px !important;
  margin-left: 0 !important;
}

.submitFormButtonStyle {
  margin-top: 40px;
}

.formulate-input[data-classification=select] select {
  line-height: unset !important;
}

.formulate-input .formulate-input-element {
  max-width: 40em;
  margin-left: 0 !important;
  margin-right: auto;
}

.formulate-input[data-classification="textarea"] textarea {
  height: 150px;
}

.v-card.v-sheet[data-v-14f11f54] {
  width: 40%;
  margin-left: auto;
  margin-right: auto;
}

.formulate-input .formulate-input-error,
.formulate-input .formulate-file-upload-error {
  font-size: 0.85em;
}

.formulate-input-help.formulate-input-help {
  font-size: 0.85em;
}

.formulate-input-label {
  margin-top: 20px;
}

.formulate-input-help {
  margin-bottom: 20px;
}

.create-proposal-form {
  .v-card.v-sheet {
    width: 50%;
    margin-left: auto;
    margin-right: auto;
  }
}

.visible-form-container {
  display: block;
}

.hidden-form-container {
  display: none;
}
</style>
