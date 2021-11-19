<template>
  <FormulateForm
    v-model="createProposalData"
    :class="$vuetify.theme.dark ? 'create-proposal-light-text' : 'create-proposal-dark-borders'"
    @submit="submitHandler"
  >
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
    <FormulateInput
      type="submit"
      class="submitFormButtonStyle"
      help="Note: Vite wallet must be connected to submit."
      :label="isLoading ? 'Awaiting Vite App Approval...' : 'Submit'"
      :disabled="hasMissingParams()"
    />
  </FormulateForm>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { getTokenList } from '@/utils/contract/contractHelpers'
import votingTypes from '@/utils/voting/votingController'
import { startProposal } from '@/utils/proposal/proposalController'
import { proposalsFirestore, votesFirestore, addNewDoc } from '@/firebase/firebase'

// const { abi } = require('@vite/vitejs')
// import { ipfsSetData } from '@/store/ipfs'

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
              name: 'votingTokens',
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
          type: 'file',
          name: 'proposalIcon',
          label: 'Upload a photo to be used as a cover',
          help: 'Select one image to upload',
          single: true,
          'error-behavior': 'live',
          validation: 'required',
          'validation-name': 'Cover photo',
        },
        {
          type: 'group',
          name: 'optionsData',
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
            {
              type: 'file',
              name: 'attachment',
              label: 'File',
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

    hasMissingParams() {
      if (
        !this.walletConnected
        || !this.createProposalData.votingTokenData
        || !this.createProposalData.title
        || !this.createProposalData.description
        || !this.createProposalData.durationInHours
        || !this.createProposalData.proposalIcon
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

      // const carTest = new Car('Car name', 25)
      // console.log('VBDAO - CAR CLASS TEST - NAME ', carTest.name)
      // console.log('VBDAO - CAR CLASS TEST - AGE ', carTest.age())

      // console.log('VBDAO CREATE PROPOSAL PARAM - creator: ', this.connectedWalletAddr)
      // console.log('VBDAO CREATE PROPOSAL PARAM - title: ', this.createProposalData.title)
      // console.log('VBDAO CREATE PROPOSAL PARAM - urlLink: ', this.createProposalData.urlLink)
      // console.log('VBDAO CREATE PROPOSAL PARAM - keywords: ', this.createProposalData.keywords)
      // console.log('VBDAO CREATE PROPOSAL PARAM - description: ', this.createProposalData.description)
      // console.log('VBDAO CREATE PROPOSAL PARAM - numOptions: ', this.createProposalData.optionsData.length)
      // console.log('VBDAO CREATE PROPOSAL PARAM - options: ', this.createProposalData.optionsData)
      // console.log('VBDAO CREATE PROPOSAL PARAM - proposalIcon: ', this.createProposalData.proposalIcon)
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
        urlLink: this.createProposalData.urlLink,
        keywords: this.createProposalData.keywords,
        description: this.createProposalData.description,
        numOptions: optionsArr.length,
        options: optionsArr,
        votingType: this.createProposalData.votingType,
        publishDate: publishDate,
        endDate: endDate,
        votingPeriod: this.createProposalData.durationInHours,
        votingTokens: this.createProposalData.votingTokenData,
        status: 'Active',
      }

      const voteStatsInit = {
        totalVotes: 0,
        totalVotingPower: 0,
        optionStats: new Array(proposalParams.numOptions).fill({ optionTotalVotes: 0, optionTotalVotingPower: 0 }),
      }

      const votesInitRes = await addNewDoc(votesFirestore, voteStatsInit)
      proposalParams.voteStatsID = votesInitRes.id.toString()
      const dataStorRes = await addNewDoc(proposalsFirestore, proposalParams)
      proposalParams.proposalID = dataStorRes.id.toString()

      // const ipfsPath = `ProposalParams_|${proposalID.toString()}`
      // const ipfsHashFile = ipfsSetData(ipfsPath, proposalParams)

      console.log('VBDAO - PROPOSAL PARAMS proposalID - ', proposalParams.proposalID)
      console.log('VBDAO - PROPOSAL PARAMS dataStorRes.id - ', dataStorRes.id)
      console.log('VBDAO - PROPOSAL PARAMS voteStatsID - ', proposalParams.voteStatsID)
      console.log('VBDAO - PROPOSAL PARAMS votesInitRes - ', votesInitRes.id)

      // console.log('VBDAO - PROPOSAL PARAMS ipfspath - ', ipfsPath)
      // console.log('VBDAO - PROPOSAL PARAMS ipfsHashFile.path - ', ipfsHashFile.path)
      // console.log('VBDAO - PROPOSAL PARAMS ipfsHashFile.cid - ', ipfsHashFile.cid)

      startProposal([proposalParams.proposalID, proposalParams.creator, proposalParams.title, proposalParams.votingPeriod, proposalParams.numOptions], this.onProposalStartEvent).then(block => {
        if (block) {
          this.$store.commit('initializeStore')
          window.location.reload()

          // this.$store.commit('setProposalMode', 'gallery')
          // console.log('VBDAO: CALL TO CONTRACT SUCCESS')
        }
      })
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
    color: red;
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
