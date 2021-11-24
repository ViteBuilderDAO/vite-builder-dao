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
        v-if="proposalStatsLoaded"
        class="pt-3"
      >
        <v-col
          v-if="proposalStatsLoaded"
          cols="6"
          md="3"
          class="d-flex align-center"
        >
          <v-avatar
            size="44"
            color="primary"
            rounded
            class="elevation-1 ms-15"
          >
            <v-icon
              dark
              color="white"
              size="30"
            >
              {{ icons.mdiTrendingUp }}
            </v-icon>
          </v-avatar>
          <div class="ms-3">
            <p class="text-xs mb-0">
              Active
            </p>
            <h3 class="text-xl font-weight-semibold">
              {{ proposalStats.numActiveProposals }}
            </h3>
          </div>
        </v-col>
        <proposal-stats-widget
          v-if="proposalStatsLoaded"
          title="Approved"
          :icon="icons.mdiChevronUp"
          color="success"
          :total="proposalStats.numApprovedProposals"
        ></proposal-stats-widget>
        <proposal-stats-widget
          v-if="proposalStatsLoaded"
          title="Rejected"
          :icon="icons.mdiChevronDown"
          color="red"
          :total="proposalStats.numRejectedProposals"
        ></proposal-stats-widget>
        <proposal-stats-widget
          v-if="proposalStatsLoaded"
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
      'proposalStatsLoaded',
    ]),
    ...mapGetters([
      'getProposalStats',
      'getProposalStatsLoaded',
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
