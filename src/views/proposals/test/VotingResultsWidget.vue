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
          v-if="totalVotesData"
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
          v-if="votingPowerData"
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
      console.log('proposalOptions', this.proposalOptions)
      if (this.proposalOptions) {
        this.proposalOptions.forEach((val, index) => {
          this.options.xaxis.categories[index] = val.optionName
        })
      }
    },

    onMounted() {
      console.log('VotingResultsWidget onMounted()')
      if (this.currProposalVotingStats) {
        this.totalVotesData = this.currProposalVotingStats.optTotalVotesData
        this.votingPowerData = this.currProposalVotingStats.optVotingPowerData
      }

      // this.$refs.votingPowerChart.updateSeries([{
      //   data: this.currProposalVotingStats.optVotingPowerData[0].data,
      // }], false, true)
      // this.$refs.totalVotesChart.updateSeries([{
      //   data: this.currProposalVotingStats.optTotalVotesData[0].data,
      // }], false, true)
    },

    // /**
    //  *
    //  */
    // async initVotingStats() {
    //   console.log('initVotingStats')
    //   await getDataById(votesFirestore, this.voteStatsID).then(dataRes => {
    //     if (dataRes) {
    //       this.votingStats.optionStats = new Array(this.numOptions).fill({ optionTotalVotes: 0, optionTotalVotingPower: 0 })
    //       this.votingStats.optionStats = dataRes.data().optionStats
    //       this.votingStats.totalVotes = dataRes.data().totalVotes
    //       this.votingStats.totalVotingPower = dataRes.data().totalVotingPower
    //       console.log('ViewProposalTest optionStats: ', this.votingStats.optionStats)
    //     }
    //   })
    // },
  },
}
</script>
