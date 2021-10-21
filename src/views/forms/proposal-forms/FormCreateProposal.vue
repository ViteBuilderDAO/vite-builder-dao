<template>
  <!-- Proposal Social Media -->
  <FormulateForm
    v-model="formResponses"
    :schema="createProposalFormSchema"
    @submit="submitHandler"
  />
</template>

<script>
export default {
  setup() {
    return {
    }
  },
  data() {
    return {
      formResponses: {},
      createProposalFormSchema: [
        {
          label: 'Proposal Title',
          name: 'name',
          validation: 'required',
        },
        {
          label: 'Proposal URL',
          name: 'url',
          validation: 'required',
        },
        {
          label: 'Proposal Keywords',
          name: 'name',
          validation: 'required',
        },
        {
          type: 'textarea',
          'v-model': 'value',
          label: 'Description',

          // validation: 'required|max:50,length',
          // :help='`Keep it under 50 characters. ${50 - value.length} left.`',
        },
        {
          type: 'group',
          name: 'accounts',
          validation: 'min:2,length',
          repeatable: true,
          'add-label': '+ Add platform',
          value: [{}],
          children: [
            {
              type: 'select',
              name: 'platform',
              label: 'Social Platform',
              placeholder: 'Select one',
              options: {
                twitter: 'Twitter',
                facebook: 'Facebook',
                instagram: 'Instagram',
                linkedin: 'LinkedIn',
              },
            },
            {
              type: 'text',
              name: 'url',
              label: 'Profile URL',
              validation: 'required|url',
            },
          ],
        },
        {
          type: 'file',
          name: 'file',
          label: 'Select your documents to upload',
          help: 'Select one or more files to upload',
          multiple: true,
        },
        {
          type: 'submit',
        },
      ],
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
</style>
