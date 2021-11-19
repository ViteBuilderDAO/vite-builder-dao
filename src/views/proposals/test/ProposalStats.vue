<template>
  <v-card>
    <div class="w-full">
      <div class="d-flex align-center mx-6 mb-9 pt-6">
        <h2>
          Proposals
        </h2>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          class="create-proposal-btn"
          @click="createProposalHandler()"
        >
          Create Proposal
        </v-btn>
      </div>
    </div>
    <v-divider></v-divider>
    <v-card-text>
      <v-row
        class="pt-3"
      >
        <proposal-stats-widget
          title="Active"
          :icon="icons.mdiTrendingUp"
          color="primary"
          :total="proposalStats.numActiveProposals"
        ></proposal-stats-widget>
        <proposal-stats-widget
          title="Approved"
          :icon="icons.mdiChevronUp"
          color="success"
          :total="proposalStats.numApprovedProposals"
        ></proposal-stats-widget>
        <proposal-stats-widget
          title="Rejected"
          :icon="icons.mdiChevronDown"
          color="red"
          :total="proposalStats.numRejectedProposals"
        ></proposal-stats-widget>
        <proposal-stats-widget
          title="Cancelled"
          :icon="icons.mdiAlert"
          color="grey"
          :total="proposalStats.numCancelledProposals"
        ></proposal-stats-widget>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mapState, mapGetters } from 'vuex'
import {
  mdiAlert,
  mdiTrendingUp,
  mdiChevronUp,
  mdiChevronDown,
} from '@mdi/js'
import ProposalStatsWidget from './ProposalStatsWidget.vue'

export default {
  components: {
    ProposalStatsWidget,
  },
  setup() {
    return {
      icons: {
        mdiTrendingUp,
        mdiAlert,
        mdiChevronUp,
        mdiChevronDown,
      },
    }
  },

  computed: {
    ...mapState([
      'proposalStats',
    ]),
    ...mapGetters([
      'getProposalStats',
    ]),
  },

  methods: {

    /**
     *
     */
    hasMissingParams() {
      if (!this.walletConnected) {
        return true
      }

      return false
    },

    /**
     *
     */
    async createProposalHandler() {
      this.$store.commit('setProposalMode', 'create')
    },
  },
}
</script>

<style lang="scss" scoped>
.create-proposal-btn {
  box-shadow: 0 1px 20px 1px #127bf0 !important;
}
</style>
