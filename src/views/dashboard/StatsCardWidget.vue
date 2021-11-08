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
        <v-col
          v-for="data in proposalStatsData"
          :key="data.title"
          cols="6"
          md="3"
          class="d-flex align-center"
        >
          <v-avatar
            size="44"
            :color="resolveIconVariation (data.title).color"
            rounded
            class="elevation-1 ms-15"
          >
            <v-icon
              dark
              color="white"
              size="30"
            >
              {{ resolveIconVariation (data.title).icon }}
            </v-icon>
          </v-avatar>
          <div class="ms-3">
            <p class="text-xs mb-0">
              {{ data.title }}
            </p>
            <h3 class="text-xl font-weight-semibold">
              {{ data.total }}
            </h3>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import {
  mdiAlert,
  mdiTrendingUp,
  mdiChevronUp,
  mdiChevronDown,
} from '@mdi/js'
import {
  getNumActiveProposals,
  getNumApprovedProposals,
  getNumRejectedProposals,
  getNumCancelledProposals,
} from '@/utils/proposal/proposalController'

export default {
  setup() {
    const proposalStatsData = {
      Active: {
        title: 'Active',
        total: 0,
      },
      Approved: {
        title: 'Approved',
        total: 0,
      },
      Rejected: {
        title: 'Rejected',
        total: 0,
      },
      Cancelled: {
        title: 'Cancelled',
        total: 0,
      },
    }

    const resolveIconVariation = data => {
      if (data === 'Active') return { icon: mdiTrendingUp, color: 'primary' }
      if (data === 'Approved') return { icon: mdiChevronUp, color: 'success' }
      if (data === 'Rejected') return { icon: mdiChevronDown, color: 'error' }
      if (data === 'Cancelled') return { icon: mdiAlert, color: 'info' }

      return { icon: mdiAlert, color: 'warning' }
    }

    return {
      proposalStatsData,
      resolveIconVariation,

      // icons
      icons: {
        mdiTrendingUp,
        mdiAlert,
        mdiChevronUp,
        mdiChevronDown,
      },
    }
  },
  mounted() {
    this.onMounted()
  },
  methods: {
    async onMounted() {
      this.proposalStatsData.Active.total = await getNumActiveProposals()
      this.proposalStatsData.Approved.total = await getNumApprovedProposals()
      this.proposalStatsData.Rejected.total = await getNumRejectedProposals()
      this.proposalStatsData.Cancelled.total = await getNumCancelledProposals()
    },

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
      // if (this.hasMissingParams()) {
      //   console.log('VBDAO - Missing Required Parameter')

      //   return
      // }

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
