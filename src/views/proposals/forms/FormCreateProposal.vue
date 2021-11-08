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
    />
  </FormulateForm>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { getTokenList } from '@/utils/contract/contractHelpers'
import votingTypes from '@/utils/voting/votingInterface'
import Car from '@/utils/proposal/proposalParams'

const { abi } = require('@vite/vitejs')

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
          name: 'durationInDays',
          help: 'Please use duration in days (e.g. 1)',
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
          name: 'coverImage',
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
              name: 'optionsItemName',
              label: 'Name',
              'error-behavior': 'live',
              validation: 'required',
              'validation-name': 'Option name',
            },
            {
              type: 'file',
              name: 'optionsItemFile',
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
    /**
     *
     */
    hasMissingParams() {
      if (
        !this.walletConnected
        || !this.tokensSelectedData.tokenGroup
        || !this.tokensSelectedData.tokenGroup[0].tokenSelected
        || !this.createProposalData.title
        || !this.createProposalData.description
        || !this.createProposalData.durationInDays
        || !this.createProposalData.coverImage
      ) {
        return true
      }

      return false
    },

    /**
     *
     */
    async submitHandler() {
      // if (this.hasMissingParams()) {
      //   console.log('VBDAO - Missing Required Parameter')

      //   return
      // }

      console.log('VBDAO - submitHandler Proposal Started')

      this.isLoading = true

      const tokensSelected = {}
      this.tokensSelectedData.tokenGroup.forEach((tokenObj, index) => {
        tokensSelected[index] = tokenObj.tokenSelected
      })

      const carTest = new Car('Car name', 25)
      console.log('VBDAO - CAR CLASS TEST - NAME ', carTest.name)
      console.log('VBDAO - CAR CLASS TEST - AGE ', carTest.age())

      // console.log('VBDAO - PROPOSAL PARAMS ARRAY DECODED - ', proposalParams)
      console.log('VBDAO CREATE PROPOSAL PARAM DECODED - creator: ', this.connectedAccounts[0])
      console.log('VBDAO CREATE PROPOSAL PARAM DECODED - title: ', this.createProposalData.title)
      console.log('VBDAO CREATE PROPOSAL PARAM DECODED - urlLink: ', this.createProposalData.urlLink)
      console.log('VBDAO CREATE PROPOSAL PARAM DECODED - keywords: ', this.createProposalData.keywords)
      console.log('VBDAO CREATE PROPOSAL PARAM DECODED - description: ', this.createProposalData.description)
      console.log('VBDAO CREATE PROPOSAL PARAM DECODED - numOptions: ', this.createProposalData.optionsData.length)
      console.log('VBDAO CREATE PROPOSAL PARAM DECODED - options: ', this.createProposalData.optionsData)
      console.log('VBDAO CREATE PROPOSAL PARAM DECODED - coverImage: ', this.createProposalData.coverImage)
      console.log('VBDAO CREATE PROPOSAL PARAM DECODED - attachedFiles: ', this.createProposalData.attachedFiles)
      console.log('VBDAO CREATE PROPOSAL PARAM DECODED - votingType: ', this.createProposalData.votingType)
      console.log('VBDAO CREATE PROPOSAL PARAM DECODED - publishDate: ', new Date())
      console.log('VBDAO CREATE PROPOSAL PARAM DECODED - votingPeriod: ', this.createProposalData.durationInDays)
      console.log('VBDAO CREATE PROPOSAL PARAM DECODED - votingTokens: ', this.votingTokenData.votingTokens)

      let base64Image = ''
      const coverReader = new FileReader()
      coverReader.onload = imageEncoded => {
        base64Image = imageEncoded.target.result.replace(/^data:.+;base64,/, '')
        console.log('Encoded Image: ', base64Image)

        // Decode the Base64 string and show result
        // var html = atob(base64Image);
      }
      coverReader.readAsText(this.createProposalData.coverImage)

      const base64Attachments = []
      this.createProposalData.attachedFiles.forEach(file => {
        const attachmentReader = new FileReader()
        attachmentReader.onload = fileEncoded => {
          base64Attachments.push(fileEncoded.target.result.replace(/^data:.+;base64,/, ''))
          console.log('Encoded File: ', base64Attachments.top())

          // Decode the Base64 string and show result
          // var html = atob(base64Attachments.top());
        }

        if (file) {
          attachmentReader.readAsText(file)
        }
      })

      const proposalParams = {
        creator: this.connectedAccounts[0],
        title: this.createProposalData.title,
        urlLink: this.createProposalData.urlLink,
        keywords: this.createProposalData.keywords,
        description: this.createProposalData.description,
        numOptions: this.optionsData.length,
        options: this.optionsData,
        coverImage: base64Image,
        attachedFiles: base64Attachments,
        votingType: this.votingTypeSelected.votingType,
        publishDate: new Date(),
        votingPeriod: this.createProposalData.durationInDays,
        votingTokens: this.votingTokenData.votingTokens,
      }

      const encodedParameters = abi.encodeParameters(['address', 'string', 'string', 'string', 'string', 'uint', 'uint256[]', 'string', 'uint256[]', 'string', 'string', 'uint', 'uint256[]'], proposalParams)

      // console.log('VBDAO - PROPOSAL PARAMS ARRAY ENCODED - ', proposalParams)
      console.log('VBDAO CREATE PROPOSAL PARAM ENCODED - creator: ', encodedParameters.creator)
      console.log('VBDAO CREATE PROPOSAL PARAM ENCODED - title: ', encodedParameters.title)
      console.log('VBDAO CREATE PROPOSAL PARAM ENCODED - urlLink: ', encodedParameters.urlLink)
      console.log('VBDAO CREATE PROPOSAL PARAM ENCODED - keywords: ', encodedParameters.keywords)
      console.log('VBDAO CREATE PROPOSAL PARAM ENCODED - description: ', encodedParameters.description)
      console.log('VBDAO CREATE PROPOSAL PARAM ENCODED - numOptions: ', encodedParameters.options.length)
      console.log('VBDAO CREATE PROPOSAL PARAM ENCODED - options: ', encodedParameters.options)
      console.log('VBDAO CREATE PROPOSAL PARAM ENCODED - coverImage: ', encodedParameters.coverImage)
      console.log('VBDAO CREATE PROPOSAL PARAM ENCODED - attachedFiles: ', encodedParameters.attachedFiles)
      console.log('VBDAO CREATE PROPOSAL PARAM ENCODED - votingType: ', encodedParameters.votingType)
      console.log('VBDAO CREATE PROPOSAL PARAM ENCODED - publishDate: ', encodedParameters.publishDate)
      console.log('VBDAO CREATE PROPOSAL PARAM ENCODED - votingPeriod: ', encodedParameters.votingPeriod)
      console.log('VBDAO CREATE PROPOSAL PARAM ENCODED - votingTokens: ', encodedParameters.votingTokens)

      // startProposal(encodedParameters, this.onProposalStartEvent).then(block => {
      //   if (block && encodedParameters) {
      //     console.log('VBDAO: CALL TO CONTRACT SUCCESS', block)
      //     this.isLoading = false
      //     // this.$router.push('view-proposals')
      //     this.$store.commit('setProposalMode', 'gallery')
      //   }
      // })
    },

    /**
     *
     */
    async onMounted() {
      this.tokenList = await getTokenList()

      // this.tokenList.forEach((token, index) => {
      //   this.tokenList[index].value = token.value
      //   this.tokenList[index].value = token.label
      // })
    },

    /**
     *
     * @param {Array} eventLog
     */
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
    color: #ff0909;
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
</style>
