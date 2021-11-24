<template>
  <v-row>
    <v-col
      v-if="proposalMode === 'gallery'"
      cols="12"
      md="12"
    >
      <proposal-stats></proposal-stats>
      <gallery-test></gallery-test>
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
      <view-proposal-test
        :proposal="currProposal"
      ></view-proposal-test>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

const ProposalStats = () => import('./test/ProposalStats.vue')
const CreateProposalForm = () => import('./forms/FormCreateProposal.vue')
const GalleryTest = () => import('./test/GalleryTest.vue')
const ViewProposalTest = () => import('./test/ViewProposalTest.vue')

export default {
  components: {
    ProposalStats,
    CreateProposalForm,
    GalleryTest,
    ViewProposalTest,
  },
  computed: {
    ...mapState([
      'proposalMode',
      'currProposal',
    ]),
    ...mapGetters([
      'getProposalMode',
      'getCurrProposal',
    ]),
  },
  created() {
    this.$store.commit('initializeStore')
  },
}
</script>
