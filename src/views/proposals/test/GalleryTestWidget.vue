<template>
  <v-container
    v-if="proposals.length > 0"
    class="py-8 px-6"
    fluid
  >
    <v-row
      v-for="proposal in proposals.slice().reverse()"
      :key="proposal.title"
    >
      <v-col
        cols="12"
      >
        <v-card>
          <v-list two-line>
            <v-list-item
              class="proposal-gallery-widget"
              @click="viewProposalHandler(proposal)"
            >
              <v-list-item-avatar
                color="grey darken-1"
                class="proposal-icon-avatar"
              >
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ proposal.title }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ proposal.description }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-chip
                v-if="proposal.status"
                small
                label
                :color="statusColor[proposal.status]"
                class="font-weight-medium proposal-status-chip"
              >
                {{ proposal.status }}
              </v-chip>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  props: {
    proposals: { type: Array, default: null },
  },

  setup() {
    const statusColor = {
      'Active': 'primary',
      'Approved': 'success',
      'Rejected': 'red',
      'Cancelled': 'grey',
    }

    return {
      statusColor,
    }
  },

  methods: {
    async viewProposalHandler(proposal) {
      this.$store.commit('setCurrProposal', proposal)
      this.$store.commit('setProposalMode', 'view', false)
    },
  },

}

</script>

<style lang="scss" scoped>
.proposal-gallery-widget {
  box-shadow: none !important;
    &:hover {
      box-shadow: 0 1px 10px 1px #06368b !important;
    }
}

.proposal-icon-avatar {
  margin-left: 10px;
  margin-right: 15px;
}

.proposal-status-chip {
  margin-left: 10px;
  margin-right: 5px;
}
</style>
