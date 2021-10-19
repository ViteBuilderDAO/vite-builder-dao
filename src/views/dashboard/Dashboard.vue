<template>
  <v-row>
    <v-col
      cols="12"
      md="4"
    >
      <user-congrats-widget></user-congrats-widget>
    </v-col>
    <v-col
      cols="12"
      md="8"
    >
      <stats-card-widget></stats-card-widget>
    </v-col>

    <v-col
      cols="12"
      sm="6"
      md="4"
    >
      <weekly-overview-widget></weekly-overview-widget>
    </v-col>

    <v-col
      cols="12"
      md="4"
      sm="6"
    >
      <total-funding-widget></total-funding-widget>
    </v-col>

    <v-col
      cols="12"
      md="4"
    >
      <v-row class="match-height">
        <v-col
          cols="12"
          sm="6"
        >
          <statistics-card-vertical
            :change="totalProfit.change"
            :color="totalProfit.color"
            :icon="totalProfit.icon"
            :statistics="totalProfit.statistics"
            :stat-title="totalProfit.statTitle"
            :subtitle="totalProfit.subtitle"
          ></statistics-card-vertical>
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <statistics-card-vertical
            :change="totalFunding.change"
            :color="totalFunding.color"
            :icon="totalFunding.icon"
            :statistics="totalFunding.statistics"
            :stat-title="totalFunding.statTitle"
            :subtitle="totalFunding.subtitle"
          ></statistics-card-vertical>
        </v-col>
        <v-col
          cols="12"
          sm="6"
        >
          <statistics-card-vertical
            :change="newProject.change"
            :color="newProject.color"
            :icon="newProject.icon"
            :statistics="newProject.statistics"
            :stat-title="newProject.statTitle"
            :subtitle="newProject.subtitle"
          ></statistics-card-vertical>
        </v-col>

        <v-col
          cols="12"
          sm="6"
        >
          <statistics-card-vertical
            :change="fundingQueries.change"
            :color="fundingQueries.color"
            :icon="fundingQueries.icon"
            :statistics="fundingQueries.statistics"
            :stat-title="fundingQueries.statTitle"
            :subtitle="fundingQueries.subtitle"
          ></statistics-card-vertical>
        </v-col>
      </v-row>
    </v-col>

    <v-col
      cols="12"
      md="4"
    >
      <demo-country-stats-widget></demo-country-stats-widget>
    </v-col>
    <v-col
      cols="12"
      md="8"
    >
      <token-growth-widget></token-growth-widget>
    </v-col>
    <v-col cols="12">
      <dashboard-datatable></dashboard-datatable>
    </v-col>
  </v-row>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiPoll, mdiLabelVariantOutline, mdiCurrencyUsd, mdiHelpCircleOutline } from '@mdi/js'
import StatisticsCardVertical from '@/components/cards/statistics-cards/StatisticsCardVertical.vue'

// demos
const UserCongratsWidget = () => import('./UserCongratsWidget.vue')
const StatsCardWidget = () => import('./StatsCardWidget.vue')
const TotalFundingWidget = () => import('./TotalFundingWidget.vue')
const TokenGrowthWidget = () => import('./TokenGrowthWidget.vue')
const DemoCountryStatsWidget = () => import('./DemoCountryStatsWidget.vue')
const WeeklyOverviewWidget = () => import('./WeeklyOverviewWidget.vue')
const DashboardDatatable = () => import('./DashboardDatatable.vue')

export default {
  components: {
    StatisticsCardVertical,
    UserCongratsWidget,
    StatsCardWidget,
    TotalFundingWidget,
    TokenGrowthWidget,
    DemoCountryStatsWidget,
    WeeklyOverviewWidget,
    DashboardDatatable,
  },
  setup() {
    const totalProfit = {
      statTitle: 'Total Profit',
      icon: mdiPoll,
      color: 'success',
      subtitle: 'Weekly Project',
      statistics: '$25.6k',
      change: '+42%',
    }

    const totalFunding = {
      statTitle: 'Refunds',
      icon: mdiCurrencyUsd,
      color: 'secondary',
      subtitle: 'Past Month',
      statistics: '$78',
      change: '-15%',
    }

    // vertical card options
    const newProject = {
      statTitle: 'New Project',
      icon: mdiLabelVariantOutline,
      color: 'primary',
      subtitle: 'Yearly Project',
      statistics: '862',
      change: '-18%',
    }

    const fundingQueries = {
      statTitle: 'Proposals Funded',
      icon: mdiHelpCircleOutline,
      color: 'warning',
      subtitle: 'Last week',
      statistics: '15',
      change: '-18%',
    }

    return {
      totalProfit,
      totalFunding,
      newProject,
      fundingQueries,
    }
  },
}
</script>
