<template>
  <v-card>
    <div class="d-flex flex-sm-row flex-column">
      <div class="flex-grow-1">
        <v-card-title>
          <!--<span
            v-if="status === 'Active'"
            class="me-3"
          >
            Voting Stats
          </span>
          <span
            v-else
            class="me-3"
          >
            Voting Results
          </span>-->
          <span class="me-3">Total Votes</span>
        </v-card-title>

        <vue-apex-charts
          v-if="currVotingStatsLoaded && totalVotesData"
          ref="totalVotesChart"
          type="bar"
          width="500"
          :options="options"
          :series="totalVotesData"
          :class="$vuetify.theme.dark ? 'voting-results-dark' : 'voting-results-light'"
        ></vue-apex-charts>
      </div>

      <v-divider
        :vertical="$vuetify.breakpoint.smAndUp"
      ></v-divider>

      <div class="flex-grow-1">
        <v-card-title>
          <span class="me-3">Voting Power</span>
        </v-card-title>
        <vue-apex-charts
          v-if="currVotingStatsLoaded && votingPowerData"
          ref="votingPowerChart"
          type="bar"
          width="500"
          :options="options"
          :series="votingPowerData"
          :class="$vuetify.theme.dark ? 'voting-results-dark' : 'voting-results-light'"
        ></vue-apex-charts>
      </div>
    </div>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import VueApexCharts from 'vue-apexcharts'

export default {

  components: {
    VueApexCharts,
  },

  props: {
    status: { type: String, required: true, default: '' },
    proposalOptions: { type: Array, default: null },
  },

  data() {
    return {
      options: {
        chart: {
          id: 'Voting Results Chart',
        },
        xaxis: {
          categories: [],
        },
      },
      totalVotesData: [],
      votingPowerData: [],
    }
  },

  computed: {
    ...mapState([
      'currProposalVotingStats',
      'currVotingStatsLoaded',
    ]),
    ...mapGetters([
      'getCurrProposalVotingStats',
      'getCurrVotingStatsLoaded',
    ]),
  },

  created() {
    this.onCreated()
  },

  mounted() {
    this.onMounted()
  },

  methods: {

    onCreated() {
      // console.log('proposalOptions', this.proposalOptions)
      if (this.proposalOptions) {
        this.proposalOptions.forEach((val, index) => {
          this.options.xaxis.categories[index] = val.optionName
        })
      }
    },

    onMounted() {
      if (this.currProposalVotingStats) {
        this.totalVotesData = this.currProposalVotingStats.optTotalVotesData
        this.votingPowerData = this.currProposalVotingStats.optVotingPowerData
      }
    },

  },
}
</script>
