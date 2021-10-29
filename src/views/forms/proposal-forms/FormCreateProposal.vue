<template>
  <FormulateForm
    @submit="submitHandler"
  >
    <FormulateForm
      v-model="votingTypeSelected"
      :schema="selectVotingTypeSchema"
      class="voteTypeDropdownStyle"
    />
    <FormulateForm
      v-model="templateSelected"
      :schema="selectProposalTypeSchema"
      class="proposalTypeDropdownStyle"
    />
    <FormulateInput
      v-for="item in templateSelected.proposalType === 'default' ? defaultProposalSchema : multiChoiceProposalSchema"
      :key="item.name"
      v-bind="item"
    />
    <FormulateForm
      v-if="templateSelected.proposalType === 'multiple_choice'"
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
    />
  </FormulateForm>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import singleChoice from '@/utils/contract/voting/singleChoice'
import approval from '@/utils/contract/voting/approval'
import quadratic from '@/utils/contract/voting/quadratic'
import weighted from '@/utils/contract/voting/weighted'
import proposalTypes from '@/contracts/contractTypes.json'
import defaultProposalTemplate from './DefaultProposalSchema.json'
import multiChoiceTemplate from './MultiChoiceProposalSchema.json'

// import { startProposal } from '@/utils/contract/proposal/proposalController'

export default {
  setup() {
    return {
    }
  },
  data() {
    return {
      formResponses: {},
      votingTypeSelected: {},
      selectVotingTypeSchema: [
        {
          type: 'select',
          name: 'votingType',
          label: 'Voting Type',
          options: [
            { value: weighted, label: 'Weighted' },
            { value: singleChoice, label: 'Single-Choice' },
            { value: approval, label: 'Approval' },
            { value: quadratic, label: 'Quadratic' },
          ],
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
          name: 'multiple_choice_data',
          repeatable: true,
          'add-label': '+ Add Choice',
          validation: 'required',
          value: [{}],
          children: [
            {
              type: 'text',
              name: 'choice_title',
              label: 'Title',
              validation: 'required',
            },
            {
              type: 'file',
              name: 'choice_file',
              label: 'File',
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
      'connectedWalletAddr',
    ]),
    ...mapGetters([
      'getIsWalletConnected',
      'getNumActiveProposals',
    ]),
    ...mapState([
      'connectedWalletAddr',
      'getConnectedWalletAddr',
    ]),
  },
  methods: {
    async submitHandler(data) {
      if (data) {
        console.log(this.connectedWalletAddr)
        console.log(data.description)
        console.log(data.durationInDays)

        // const proposalID = startProposal(this.connectedWalletAddr, this.formResponses.title, this.formResponses.description, this.formResponses.durationInDays)
        // this.$store.dispatch('addNewProposal', proposal, proposalID)
      }
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
.voteTypeDropdownStyle,
.proposalTypeDropdownStyle {
  margin-bottom: 20px;
  max-width: 200px !important;
  margin-left: 0 !important;
}
.submitFormButtonStyle {
  margin-top: 20px;
}
.formulate-input[data-classification=select] select {
  color: white;
  line-height: unset !important;
}
#formulate--create-proposal-231 {
  color: white;
}
.formulate-input .formulate-input-element {
  max-width: 40em;
  margin-left: auto;
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
</style>
