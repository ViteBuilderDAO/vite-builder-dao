<template>
  <v-card>
    <div class="d-flex flex-sm-row flex-column">
      <div class="flex-grow-1">
        <v-card-title>
          <span class="me-3">Total Raw Votes</span>
        </v-card-title>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <div
              v-bind="attrs"
              v-on="on"
            >
              <vue-apex-charts
                v-if="currVotingStatsLoaded && totalVotesData && chartOptionsLoaded"
                ref="totalVotesChart"
                width="500"
                :options="totalVotesOptions"
                :series="totalVotesData"
                :class="$vuetify.theme.dark ? 'voting-results-dark' : 'voting-results-light'"
              ></vue-apex-charts>
            </div>
          </template>
          <span>Total number of addresses (people) who voted towards this proposal per option.</span>
        </v-tooltip>
      </div>

      <v-divider
        :vertical="$vuetify.breakpoint.smAndUp"
      ></v-divider>

      <div class="flex-grow-1">
        <v-card-title>
          <span class="me-3">Total Projected Effective Votes</span>
        </v-card-title>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <div
              v-bind="attrs"
              v-on="on"
            >
              <vue-apex-charts
                v-if="currVotingStatsLoaded && votingPowerData && chartOptionsLoaded"
                ref="votingPowerChart"
                width="500"
                :options="votingPowerOptions"
                :series="votingPowerData"
                :class="$vuetify.theme.dark ? 'voting-results-dark' : 'voting-results-light'"
              ></vue-apex-charts>
            </div>
          </template>
          <span>Projected voting power totals per option, subject to change due to final balances being taken at the end of a proposal.</span>
        </v-tooltip>
      </div>
    </div>
  </v-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import VueApexCharts from 'vue-apexcharts'
import eventBus from '@/utils/events/eventBus'

export default {

  components: {
    VueApexCharts,
  },

  data() {
    return {
      totalVotesOptions: {
        chart: {
          id: 'totalVotesChart',
          type: 'bar',
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          tickAmount: 2,
          decimalsInFloat: 1,
        },
        colors: [value => {
          const index = value.dataPointIndex
          let color = '#008ffb'
          if (this.currProposalVotingStats
              && this.currProposalVotingStats.winningIndices.includes(index)) {
            color = '#13d8aa'
          }

          return color
        }],
      },
      votingPowerOptions: {
        chart: {
          id: 'votingPowerChart',
          type: 'bar',
        },
        xaxis: {
          categories: [],
        },
        yaxis: {
          tickAmount: 2,
          decimalsInFloat: 1,
        },
        colors: [value => {
          const index = value.dataPointIndex
          let color = '#008ffb'
          if (this.currProposalVotingStats
              && this.currProposalVotingStats.winningIndices.includes(index)) {
            color = '#13d8aa'
          }

          return color
        }],
      },
      totalVotesData: [
        {
          name: 'totalVotesSeries',
          data: [],
        },
      ],
      votingPowerData: [
        {
          name: 'votingPowerSeries',
          data: [],
        },
      ],
      chartOptionsLoaded: false,
    }
  },

  computed: {
    ...mapState([
      'currProposal',
      'currProposalVotingStats',
      'currVotingStatsLoaded',
    ]),
    ...mapGetters([
      'getCurrProposal',
      'getCurrProposalVotingStats',
      'getCurrVotingStatsLoaded',
    ]),
  },

  // created() {
  //   this.onCreated()
  // },

  mounted() {
    this.onMounted()

    // adding eventBus listener
    eventBus.$on('voting-results-updated', eventRes => {
      this.totalVotesData = [
        {
          data: eventRes.optTotalVotesData,
        },
      ]
      this.votingPowerData = [
        {
          data: eventRes.optVotingPowerData,
        },
      ]
    })
  },

  beforeDestroy() {
    // removing eventBus listener
    eventBus.$off('voting-results-updated')
  },

  methods: {

    // onCreated() {
    //   console.log('Voting Results onCreated currProposal: ', this.currProposal)
    //   this.chartOptionsLoaded = false

    //   if (this.currProposalVotingStats) {
    //     this.totalVotesData = this.currProposalVotingStats.optTotalVotesData
    //     this.votingPowerData = this.currProposalVotingStats.optVotingPowerData
    //   }

    //   if (this.currProposal && this.currProposal.options) {
    //     this.currProposal.options.forEach((val, index) => {
    //       this.options.xaxis.categories[index] = val.optionName
    //     })
    //   }

    //   this.chartOptionsLoaded = true
    // },

    onMounted() {
      // console.log('Voting Results onMounted currProposal: ', this.currProposal)
      // console.log('Voting Results onMounted currProposalVotingStats: ', this.currProposalVotingStats)

      this.chartOptionsLoaded = false

      // if (this.currProposalVotingStats) {
      //   this.totalVotesData = [
      //     {
      //       data: this.currProposalVotingStats.optTotalVotesData[0].data,
      //     },
      //   ]
      //   this.votingPowerData = [
      //     {
      //       data: this.currProposalVotingStats.optVotingPowerData[0].data,
      //     },
      //   ]
      // }

      if (this.currProposal && this.currProposal.options) {
        this.currProposal.options.forEach((val, index) => {
          this.totalVotesOptions.xaxis.categories[index] = val.optionName
          this.votingPowerOptions.xaxis.categories[index] = val.optionName
        })
      }
      this.chartOptionsLoaded = true

      // console.log('Voting Results onMounted chartOptionsLoaded: ', this.chartOptionsLoaded)
    },
  },
}
</script>
