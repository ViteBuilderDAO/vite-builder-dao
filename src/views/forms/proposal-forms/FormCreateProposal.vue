<template>
  <FormulateForm>
    <FormulateForm
      v-model="templateSelected"
      :schema="selectProposalTypeSchema"
      class="proposalDropdownStyle"
    />
    <FormulateForm
      v-if="templateSelected.proposalType === 'crowdfund'"
      v-model="formResponses"
      :schema="crowdfundProposalSchema"
      @submit="submitHandler"
    />
    <FormulateForm
      v-if="templateSelected.proposalType === 'multiple_choice'"
      v-model="formResponses"
      :schema="multiChoiceProposalSchema"
      @submit="submitHandler"
    />
  </FormulateForm>
</template>

<script>
import proposalTypes from '@/contracts/contractTypes.json'
import crowdfundTemplate from './CrowdFundProposalSchema.json'
import multiChoiceTemplate from './MultiChoiceProposalSchema.json'

export default {
  setup() {
    return {
    }
  },
  data() {
    return {
      formResponses: {},
      templateSelected: {},
      selectProposalTypeSchema: [
        {
          type: 'select',
          name: 'proposalType',
          label: 'Proposal Type',
          options: proposalTypes,
        },
      ],
      crowdfundProposalSchema: crowdfundTemplate,
      multiChoiceProposalSchema: multiChoiceTemplate,
    }
  },
  methods: {
    async submitHandler(data) {
      if (data) {

        // data
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
.proposalDropdownStyle {
  margin-bottom: 20px;
  max-width: 200px !important;
  margin-left: 0 !important;
}
#formulate--create-proposal-1 {
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
</style>
