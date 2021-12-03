<template>
  <div
    v-if="proposals"
  >
    <gallery-test-widget
      :proposals="proposals"
    ></gallery-test-widget>
  </div>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import BigNumber from 'bignumber.js'
import { mapState, mapGetters } from 'vuex'
import {
  mdiAlert,
  mdiTrendingUp,
  mdiChevronUp,
  mdiChevronDown,
} from '@mdi/js'
import GalleryTestWidget from './GalleryTestWidget.vue'
import { getAllProposals } from '@/utils/proposal/proposalController'
import {
  votesFirestore,
  proposalsFirestore,
  proposalStatsFirestore,
  getDataById,
  updateDocData,
} from '@/firebase/firebase'
import { getWalletBalanceInfo } from '@/utils/contract/contractHelpers'

export default {
  components: {
    GalleryTestWidget,
  },

  data() {
    return {
      proposals: [],
    }
  },

  computed: {
    ...mapState([
      'proposalMode',
      'proposalStats',
    ]),
    ...mapGetters([
      'getProposalMode',
      'getProposalStats',
    ]),
  },

  setup() {
    return {
      numStats: 4,
      icons: {
        mdiTrendingUp,
        mdiAlert,
        mdiChevronUp,
        mdiChevronDown,
      },
    }
  },

  created() {
    this.$store.commit('initializeStore')
    this.onCreated()
  },

  methods: {

    async onCreated() {
      const allProposals = await getAllProposals()
      for (let i = 0; i < this.proposalStats.totalProposals; ++i) {
        const proposalDoc = allProposals.docs[i]
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
              finalState: '',
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
                  if (vote && vote.voterAddr) {
                    getWalletBalanceInfo(vote.voterAddr).then(({ balance }) => {
                      let totalVotingPower = 0

                      Object.values(balance.balanceInfoMap).forEach(val => {
                        if (votingTokenArr.includes(val.tokenInfo.tokenId)) {
                          totalVotingPower += parseInt(BigNumber(val.balance).dividedBy(`1e${val.tokenInfo.decimals}`).toFixed(), 10)
                        }
                      })

                      Object.values(currCastedVotes[index].votingPowers).forEach((power, powerIndex) => {
                        if (power > 0) {
                          const newPower = (power / 100) * totalVotingPower
                          currCastedVotes[index].votingPowers[powerIndex] = newPower
                          currOptionStats[powerIndex].optionTotalVotingPower += newPower
                          currTotalVotingPower += newPower
                          if (highestVotingPower < currOptionStats[powerIndex].optionTotalVotingPower) {
                            proposalResults.winningOptionName = proposalObj.options[powerIndex].optionName
                            if (powerIndex === (proposalObj.numOptions - 1)) {
                              proposalObj.status = 'Rejected'
                              proposalResults.finalState = proposalObj.status
                            } else {
                              proposalObj.status = 'Approved'
                              proposalResults.finalState = proposalObj.status
                            }
                            proposalResults.winningOptionIndex = powerIndex
                            this.updateProposalResults(proposalObj.voteStatsID, proposalResults)
                            updateDocData(proposalsFirestore, proposalObj.proposalID, {
                              status: proposalResults.finalState,
                            })
                            if (proposalResults.finalState === 'Approved') {
                              updateDocData(proposalStatsFirestore, this.proposalStats.id, {
                                totalActiveProposals: --this.proposalStats.numActiveProposals,
                                totalApprovedProposals: ++this.proposalStats.numApprovedProposals,
                              })
                            } else if (proposalResults.finalState === 'Rejected') {
                              updateDocData(proposalStatsFirestore, this.proposalStats.id, {
                                totalActiveProposals: --this.proposalStats.numActiveProposals,
                                totalRejectedProposals: ++this.proposalStats.numRejectedProposals,
                              })
                            }
                            highestVotingPower = currOptionStats[powerIndex].optionTotalVotingPower
                          }
                        }
                        this.updateVotingStats(proposalObj.voteStatsID, currCastedVotes, currOptionStats, currTotalVotingPower)
                      })
                    })
                  }
                })

                if (votesData.totalVotes <= 0) {
                  proposalObj.status = 'Cancelled'
                  proposalResults.finalState = proposalObj.status
                  this.updateProposalResults(proposalObj.voteStatsID, proposalResults)
                  updateDocData(proposalsFirestore, proposalObj.proposalID, {
                    status: proposalResults.finalState,
                  })
                  updateDocData(proposalStatsFirestore, this.proposalStats.id, {
                    totalActiveProposals: --this.proposalStats.numActiveProposals,
                    totalCancelledProposals: ++this.proposalStats.numCancelledProposals,
                  })
                }

                if (proposalObj) {
                  this.proposals.push(proposalObj)
                }
              }
            })
          } else if (proposalObj) {
            this.proposals.push(proposalObj)
          }
        }
      }
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
