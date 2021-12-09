<template>
  <v-card>
    <div class="w-full">
      <div class="d-flex align-center mx-6 mb-9 pt-6">
        <h2>
          Proposals
        </h2>
        <v-spacer></v-spacer>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <!--<v-btn
              color="primary"
              class="create-proposal-btn"
              :disabled="!whitelisted() || !walletConnected"
              v-bind="attrs"
              v-on="on"
              @click="createProposalHandler()"
            >
              Create Proposal
            </v-btn>-->
            <span
              v-bind="attrs"
              v-on="on"
            >
              <FormulateForm
                @submit="createProposalHandler()"
              >
                <FormulateInput
                  type="submit"
                  label="Create Proposal"
                  color="primary"
                  class="create-proposal-btn"
                  :disabled="!whitelisted() || !walletConnected"
                />
              </FormulateForm>
            </span>
          </template>
          <span>Vite wallet must be connected and your address whitelisted to create a proposal.</span>
        </v-tooltip>
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
          class="d-flex align-center proposal-stats-row"
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
          title="Closed"
          :icon="icons.mdiCheckBold"
          color="grey"
          :total="proposalStats.numClosedProposals"
          class="proposal-stats-row"
        ></proposal-stats-widget>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mapState, mapGetters } from 'vuex'
import {
  mdiTrendingUp,
  mdiCheckBold,
} from '@mdi/js'
import ProposalStatsWidget from './widgets/ProposalStatsWidget.vue'

export default {
  components: {
    ProposalStatsWidget,
  },
  setup() {
    return {
      icons: {
        mdiTrendingUp,
        mdiCheckBold,
      },
    }
  },

  computed: {
    ...mapState([
      'proposalStats',
      'proposalStatsLoaded',
      'walletConnected',
      'connectedWalletAddr',
      'whitelistedAddresses',
    ]),
    ...mapGetters([
      'getProposalStats',
      'getProposalStatsLoaded',
      'getConnectedWalletAddr',
      'getIsWalletConnected',
      'getWhitelistedAddresses',
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

    whitelisted() {
      if (this.walletConnected
          && this.connectedWalletAddr
          && this.whitelistedAddresses.includes(this.connectedWalletAddr)) {
        return true
      }

      return false
    },

    /**
     *
     */
    async createProposalHandler() {
      this.$router.push('create-proposal')
    },
  },
}
</script>

<style lang="scss">
@import '@braid/vue-formulate/themes/snow/snow.scss';

.proposal-stats-row {
  margin-left: auto;
  margin-right: auto;
}
</style>
