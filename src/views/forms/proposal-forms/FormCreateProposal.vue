<template>
  <FormulateForm
    @submit="submitHandler"
  >
    <FormulateForm
      v-model="votingTypeSelected"
      :schema="selectVotingTypeSchema"
      class="proposalDropdownStyle"
    />
    <FormulateForm
      v-model="templateSelected"
      :schema="selectProposalTypeSchema"
      class="proposalDropdownStyle"
    />
    <FormulateForm
      v-model="tokensSelectedData"
    >
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
    </FormulateForm>
    <FormulateForm
      v-model="formResponses"
    >
      <FormulateInput
        v-for="item in templateSelected.proposalType === 'default' ? defaultProposalSchema : multiChoiceProposalSchema"
        :key="item.name"
        v-bind="item"
      />
    </FormulateForm>
    <FormulateForm
      v-if="templateSelected.proposalType === 'multiple_choice'"
      v-model="multiChoiceData"
    >
      <FormulateInput
        v-for="multiChoiceItem in multiChoiceSchema"
        :key="multiChoiceItem.name"
        v-bind="multiChoiceItem"
        class="proposalTypeDropdownStyle"
      >
        <FormulateInput
          v-for="childItem in multiChoiceItem.children"
          :key="childItem.name"
          v-bind="childItem"
          class="proposalTypeDropdownStyle"
        />
      </FormulateInput>
    </FormulateForm>
    <FormulateInput
      type="submit"
      :disabled="!walletConnected"
      class="submitFormButtonStyle"
      help="Note: Vite wallet must be connected to submit."
      :label="isLoading ? 'Loading...' : 'Submit'"
    />
  </FormulateForm>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { getTokenList } from '@/utils/contract/contractHelpers'
import { startProposal } from '@/utils/contract/proposal/proposalController'
import proposalTypes from '@/contracts/contractTypes.json'
import { defaultProposalTemplate, multiChoiceTemplate } from './proposal-schemas/proposalSchemas'
import votingTypes from '@/utils/voting/votingInterface'

export default {
  data() {
    return {
      isLoading: false,
      tokenList: Array / Object / String / Number,
      formResponses: {},
      votingTypeSelected: {},
      selectVotingTypeSchema: [
        {
          type: 'select',
          name: 'votingType',
          label: 'Voting Type',
          options: votingTypes,
        },
      ],
      templateSelected: {},
      selectProposalTypeSchema: [
        {
          type: 'select',
          name: 'proposalType',
          label: 'Proposal Type',
          options: proposalTypes,
        },
      ],
      multiChoiceData: {},
      multiChoiceSchema: [
        {
          type: 'group',
          name: 'multipleChoiceGroup',
          repeatable: true,
          'add-label': '+ Add Choice',
          validation: 'required',
          value: [{}],
          children: [
            {
              type: 'text',
              name: 'optionTitle',
              label: 'Title',
              validation: 'required',
            },
            {
              type: 'file',
              name: 'optionFile',
              label: 'File',
            },
          ],
        },
      ],
      tokensSelectedData: {},
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
      defaultProposalSchema: defaultProposalTemplate,
      multiChoiceProposalSchema: multiChoiceTemplate,
    }
  },
  computed: {
    ...mapState([
      'walletConnected',
      'connectedAccounts',
      'proposalsMap',
      'currProposalID',
    ]),
    ...mapGetters([
      'getIsWalletConnected',
      'getConnectedAccounts',
      'getCurrActiveProposals',
      'getCurrProposalID',
    ]),
  },
  mounted() {
    this.onMounted()
  },
  methods: {

    /**
     *
     */
    async submitHandler() {
      // console.log(this.votingTypeSelected.votingType)
      // console.log(this.templateSelected.proposalType)
      // this.tokensSelectedData.tokenGroup.forEach(tokenObj => {
      //   console.log(tokenObj.tokenSelected)
      // })
      // console.log(this.connectedAccounts[0])
      // console.log(this.formResponses.title)
      // console.log(this.formResponses.description)
      // console.log(this.formResponses.durationInDays)

      console.log('VBDAO - submitHandler Proposal Started')

      this.isLoading = true

      let optionGroup = {}
      switch (this.templateSelected.proposalType) {
        case 'multiple_choice':
          optionGroup = this.multiChoiceData
          break
        default:
          optionGroup = [this.formResponses.title]
          break
      }

      const tokensSelected = {}
      this.tokensSelectedData.tokenGroup.forEach((tokenObj, index) => {
        tokensSelected[index] = tokenObj.tokenSelected
      })

      const proposalParams = {
        proposalID: this.currProposalID + 1,
        creator: this.connectedAccounts[0],
        title: this.formResponses.title,
        urlLink: this.formResponses.urlLink,
        keywords: this.formResponses.keywords,
        description: this.formResponses.description,
        options: optionGroup,
        coverImage: this.formResponses.coverPhoto,
        attachedFiles: this.formResponses.attachedFiles,
        votingType: this.votingTypeSelected.votingType,
        votingPeriod: this.formResponses.durationInDays,
        votingTokens: tokensSelected,
        publishTimestamp: new Date(),
        isActive: true,
      }

      startProposal([
        proposalParams.creator.address,
        proposalParams.title,
        proposalParams.description,
        proposalParams.options.length,
        proposalParams.votingPeriod,
      ], this.onProposalStartEvent).then(block => {
        if (block && proposalParams) {
          this.$store.dispatch('addNewProposal', proposalParams)
          console.log('VBDAO: CALL TO CONTRACT SUCCESS', block)
          this.isLoading = false
          this.$router.push('proposal-gallery')
        }
      })
    },

    /**
     *
     */
    async onMounted() {
      this.tokenList = await getTokenList()
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
.formulate-input {
  &[data-classification='text'] {
    input {
      color: white;
    }
  }
}
.proposalDropdownStyle {
  margin-bottom: 20px;
  max-width: 200px !important;
  margin-left: 0 !important;
}
.submitFormButtonStyle {
  margin-top: 40px;
}
.formulate-input[data-classification=select] select {
  color: white;
  line-height: unset !important;
}
.formulate-input-element--textarea textarea {
  color: white;
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
  color: #ff0909;
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
