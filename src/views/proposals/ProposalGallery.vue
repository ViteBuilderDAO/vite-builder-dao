<template>
  <v-row>
    <v-col
      cols="12"
      md="12"
    >
      <proposal-stats></proposal-stats>
      <div
        v-if="proposals"
      >
        <proposal-gallery-widget
          :proposals="proposals"
        ></proposal-gallery-widget>
      </div>
    </v-col>
  </v-row>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import BigNumber from 'bignumber.js'
import { mapState, mapGetters } from 'vuex'
import {
  mdiAlert,
  mdiTrendingUp,
} from '@mdi/js'
import ProposalGalleryWidget from './widgets/ProposalGalleryWidget.vue'
import { getAllProposals } from '@/utils/proposal/proposalController'
import {
  votesFirestore,
  proposalsFirestore,
  proposalStatsFirestore,
  getDataById,
  updateDocData,
} from '@/firebase/firebase'
import { getWalletBalanceInfo } from '@/utils/contract/contractHelpers'

const ProposalStats = () => import('./ProposalStats.vue')

export default {
  components: {
    ProposalGalleryWidget,
    ProposalStats,
  },

  data() {
    return {
      proposals: [],
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

  setup() {
    return {
      numStats: 2,
      icons: {
        mdiTrendingUp,
        mdiAlert,
      },
    }
  },

  created() {
    this.$store.commit('initializeStore')
    this.onCreated()
  },

  methods: {

    async onCreated() {
      await getAllProposals().then(allProposals => {
        for (let i = 0; i < this.proposalStats.totalProposals; ++i) {
          const proposalDoc = allProposals[i]
          if (proposalDoc) {
            const proposalObj = proposalDoc.data()
            proposalObj.proposalID = proposalDoc.id
            const today = new Date()
            const endDate = new Date(proposalObj.endDate.seconds * 1000)
            if (proposalObj.status === 'Active' && today > endDate) {
              const votingTokenArr = []
              const proposalResults = {
                winningOptionName: '',
                winningOptionIndex: 0,
              }

              getDataById(votesFirestore, proposalObj.voteStatsID).then(dataRes => {
                if (dataRes) {
                  let currTotalVotingPower = 0
                  let highestVotingPower = 0
                  const votesData = dataRes.data()
                  const currCastedVotes = votesData.castedVotes
                  const currOptionStats = votesData.optionStats

                  Object.values(currOptionStats).forEach((optionStat, optionStatIndex) => {
                    const optionStatPower = optionStat.optionTotalVotingPower
                    currOptionStats[optionStatIndex].optionTotalVotingPower -= optionStatPower
                  })

                  Object.values(proposalObj.votingTokens).forEach(token => {
                    votingTokenArr.push(token.tokenTTI)
                  })

                  Object.values(currCastedVotes).forEach((vote, index) => {
                    if (vote) {
                      getWalletBalanceInfo(vote.voterAddr).then(({ balance }) => {
                        let totalVotingPower = 0

                        Object.values(balance.balanceInfoMap).forEach(val => {
                          if (votingTokenArr.includes(val.tokenInfo.tokenId)) {
                            totalVotingPower += parseInt(BigNumber(val.balance).dividedBy(`1e${val.tokenInfo.decimals}`).toFixed(), 10)
                          }
                        })

                        Object.values(currCastedVotes[index].votingPowers).forEach((power, powerIndex) => {
                          if (power > 0) {
                            let newPower = (power / 100) * totalVotingPower
                            if (proposalObj.votingType === 'Quadratic') {
                              const temp = newPower
                              newPower = Math.round(Math.sqrt(temp))
                            }
                            currCastedVotes[index].votingPowers[powerIndex] = newPower
                            currOptionStats[powerIndex].optionTotalVotingPower += newPower
                            currTotalVotingPower += newPower
                            if (highestVotingPower < currOptionStats[powerIndex].optionTotalVotingPower) {
                              proposalResults.winningOptionName = proposalObj.options[powerIndex].optionName
                              proposalResults.winningOptionIndex = powerIndex

                              // this.updateProposalResults(proposalObj.voteStatsID, proposalResults)
                              // proposalObj.status = 'Closed'
                              // updateDocData(proposalsFirestore, proposalObj.proposalID, {
                              //   status: 'Closed',
                              // })
                              // updateDocData(proposalStatsFirestore, this.proposalStats.id, {
                              //   totalActiveProposals: --this.proposalStats.numActiveProposals,
                              //   totalClosedProposals: ++this.proposalStats.numClosedProposals,
                              // })

                              highestVotingPower = currOptionStats[powerIndex].optionTotalVotingPower
                            }
                          }

                          // this.updateVotingStats(proposalObj.voteStatsID, currCastedVotes, currOptionStats, currTotalVotingPower)
                        })
                      })
                    }
                  })

                  if (proposalObj) {
                    proposalObj.status = 'Closed'
                    this.updateProposalResults(proposalObj.voteStatsID, proposalResults)
                    updateDocData(proposalsFirestore, proposalObj.proposalID, {
                      status: proposalObj.status,
                    })
                    updateDocData(proposalStatsFirestore, this.proposalStats.id, {
                      totalActiveProposals: --this.proposalStats.numActiveProposals,
                      totalClosedProposals: ++this.proposalStats.numClosedProposals,
                    })
                    this.updateVotingStats(proposalObj.voteStatsID, currCastedVotes, currOptionStats, currTotalVotingPower)

                    // console.log('ProposalGallery onCreated - proposalResults: ', proposalResults)
                    // console.log('ProposalGallery onCreated - proposalObj.status: ', proposalObj.status)
                    // console.log('ProposalGallery onCreated - proposalStats: ', this.proposalStats)

                    this.proposals.push(proposalObj)
                  }
                }
              })
            } else if (proposalObj) {
              this.proposals.push(proposalObj)
            }
          }
        }
      })
    },

    async updateVotingStats(voteStatsID, currCastedVotes, currOptionStats, currTotalVotingPower) {
      const res = await updateDocData(votesFirestore, voteStatsID, {
        castedVotes: currCastedVotes,
        optionStats: currOptionStats,
        totalVotingPower: currTotalVotingPower,
      })

      return res
    },

    async updateProposalResults(voteStatsID, results) {
      const res = await updateDocData(votesFirestore, voteStatsID, {
        results: results,
      })

      return res
    },
  },
}
</script>
