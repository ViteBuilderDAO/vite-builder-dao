<template>
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
      :label="isLoading ? 'Awaiting Vite App Approval...' : 'Submit'"
      :disabled="hasMissingParams()"
    />
  </FormulateForm>
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
              help: 'Note: by default a "downvote all" option is added to every proposal',
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
      'connectedAccounts',
      'proposalStats',
    ]),
    ...mapGetters([
      'getIsWalletConnected',
      'getConnectedWalletAddr',
      'getConnectedAccounts',
      'getProposalStats',
    ]),
  },

  mounted() {
    this.onMounted()
  },

  methods: {

    hasMissingParams() {
      if (
        !this.walletConnected
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

    async submitHandler() {
      if (this.hasMissingParams()) {
        console.log('VBDAO - Missing Required Parameter')

        return
      }

      console.log('VBDAO - submitHandler Proposal Started')

      this.isLoading = true

      // console.log('VBDAO CREATE PROPOSAL PARAM - creator: ', this.connectedWalletAddr)
      // console.log('VBDAO CREATE PROPOSAL PARAM - title: ', this.createProposalData.title)
      // console.log('VBDAO CREATE PROPOSAL PARAM - urlLink: ', this.createProposalData.urlLink)
      // console.log('VBDAO CREATE PROPOSAL PARAM - keywords: ', this.createProposalData.keywords)
      // console.log('VBDAO CREATE PROPOSAL PARAM - description: ', this.createProposalData.description)
      // console.log('VBDAO CREATE PROPOSAL PARAM - numOptions: ', this.createProposalData.optionsData.length)
      // console.log('VBDAO CREATE PROPOSAL PARAM - options: ', this.createProposalData.optionsData)
      // console.log('VBDAO CREATE PROPOSAL PARAM - attachedFiles: ', this.createProposalData.attachedFiles)
      // console.log('VBDAO CREATE PROPOSAL PARAM - votingType: ', this.createProposalData.votingType)
      // console.log('VBDAO CREATE PROPOSAL PARAM - publishDate: ', new Date())
      // console.log('VBDAO CREATE PROPOSAL PARAM - votingPeriod: ', this.createProposalData.durationInHours)
      // console.log('VBDAO CREATE PROPOSAL PARAM - votingTokens: ', this.createProposalData.votingTokenData)

      const optionsArr = this.createProposalData.optionsData
      optionsArr.push({ optionName: 'Reject All Options' })

      const publishDate = new Date()
      const endDate = new Date(publishDate)
      endDate.setHours(endDate.getHours() + parseInt(this.createProposalData.durationInHours, 10))

      const proposalParams = {
        creator: this.connectedWalletAddr,
        title: this.createProposalData.title,
        description: this.createProposalData.description,
        numOptions: optionsArr.length,
        options: optionsArr,
        votingType: this.createProposalData.votingType,
        publishDate: publishDate,
        endDate: endDate,
        votingPeriod: this.createProposalData.durationInHours,
        votingTokens: this.createProposalData.votingTokenData,
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
          finalState: '',
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
          totalApprovedProposals: this.proposalStats.numApprovedProposals,
          totalCancelledProposals: this.proposalStats.numCancelledProposals,
          totalNumProposals: this.proposalStats.totalProposals + 1,
          totalRejectedProposals: this.proposalStats.numRejectedProposals,
        })

        if (proposalParams.proposalID) {
          this.$store.commit('initializeStore')
        }
      }

      // const ipfsPath = `ProposalParams_|${proposalID.toString()}`
      // const ipfsHashFile = ipfsSetData(ipfsPath, proposalParams)

      // console.log('VBDAO - PROPOSAL PARAMS proposalID - ', proposalParams.proposalID)
      // console.log('VBDAO - PROPOSAL PARAMS voteStatsID - ', proposalParams.voteStatsID)

      // console.log('VBDAO - PROPOSAL PARAMS ipfspath - ', ipfsPath)
      // console.log('VBDAO - PROPOSAL PARAMS ipfsHashFile.path - ', ipfsHashFile.path)
      // console.log('VBDAO - PROPOSAL PARAMS ipfsHashFile.cid - ', ipfsHashFile.cid)

      // if (proposalParams.proposalID) {
      //   startProposal([proposalParams.proposalID, proposalParams.creator, proposalParams.votingPeriod, proposalParams.numOptions]).then(block => {
      //     if (block) {
      //       this.$store.commit('initializeStore', true)

      //       // window.location.reload()
      //       // this.$store.commit('setProposalMode', 'gallery')
      //       // console.log('VBDAO: CALL TO CONTRACT SUCCESS')
      //     }
      //   })
      // }
    },

    async onMounted() {
      this.tokenList = await getTokenList()

      // this.tokenList.forEach((token, index) => {
      //   this.tokenList[index].value = token.value
      //   this.tokenList[index].value = token.label
      // })
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
<!--
:class="isLoading ? 'hidden-form-container' : 'visible-form-container'"
{
  component: 'div',
  class: 'double-row',
  children: [
    {

    },
    {

    },
  ]
}
-->
