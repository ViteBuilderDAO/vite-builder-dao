<template>
  <v-row class="match-height">
    <!-- Create new proposal -->
    <v-col
      cols="12"
      md="12"
    >
      <v-card>
        <v-card-title>Create a Proposal</v-card-title>
        <v-card-text>
          <create-proposal-form></create-proposal-form>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
const CreateProposalForm = () => import('@/views/forms/proposal-forms/FormCreateProposal.vue')

export default {
  components: {
    CreateProposalForm,
  },
  setup() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.v-card.v-sheet {
  width: 50%;
  margin-left: auto;
  margin-right: auto;
}
</style>
