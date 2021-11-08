<template>
  <v-row>
    <v-col
      v-if="proposalMode === 'gallery'"
      cols="12"
      md="12"
    >
      <stats-card-widget></stats-card-widget>
    </v-col>
    <!-- Create new proposal -->
    <v-col
      v-if="proposalMode === 'create'"
      class="create-proposal-form"
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
    <v-col
      v-if="proposalMode === 'view'"
      cols="12"
      md="12"
    >
      <stats-card-widget></stats-card-widget>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

const StatsCardWidget = () => import('./StatsCardWidget.vue')
const CreateProposalForm = () => import('../proposals/forms/FormCreateProposal.vue')

export default {
  components: {
    StatsCardWidget,
    CreateProposalForm,
  },
  computed: {
    ...mapState([
      'proposalMode',
    ]),
    ...mapGetters([
      'getProposalMode',
    ]),
  },
}
</script>

<style lang="scss" scoped>
.create-proposal-form {
  .v-card.v-sheet {
    width: 50%;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
