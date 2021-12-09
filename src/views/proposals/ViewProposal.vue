<template>
  <v-row
    v-if="currProposal && currProposal.length !== 0"
  >
    <v-col
      cols="12"
      md="12"
    >
      <v-row
        class="pad-text-left"
      >
        <v-col
          cols="12"
          class="mb-6"
        >
          <v-card>
            <v-btn
              :depressed="false"
              plain
              class="go-back-btn"
              @click="goBackClickHandler()"
            >
              Go Back
            </v-btn>
            <v-row class="ma-0 pb-5 px-2">
              <v-col
                cols="12"
                class="align-text-center"
              >
                <h1>
                  {{ currProposal.title }}
                </h1>
              </v-col>
            </v-row>
            <v-col
              cols="12"
              sm="12"
            >
              <h2>
                Description
              </h2>
              <span class="body-1">{{ currProposal.description }}</span>
            </v-col>
            <v-col
              cols="12"
            >
              <h3>
                Creator
              </h3>
              <span class="body-1">{{ currProposal.creator }}</span>
            </v-col>
            <v-col
              v-if="currProposal.urlLink"
              cols="12"
            >
              <h3>
                URL
              </h3>
              <span class="body-1">
                <a
                  :href="currProposal.urlLink"
                  target="_blank"
                  rel="nofollow"
                >
                  {{ currProposal.urlLink }}
                </a>
              </span>
            </v-col>
            <v-col
              v-if="currProposal.keywords"
              cols="12"
            >
              <h3>
                Keywords
              </h3>
              <span class="body-1">{{ currProposal.keywords }}</span>
            </v-col>
            <v-col
              v-if="currProposal.publishDate && datesLoaded"
              cols="12"
            >
              <h3>
                Publish Date
              </h3>
              <span class="body-1">{{ currProposal.publishDate }}</span>
            </v-col>
            <v-col
              v-if="currProposal.endDate && datesLoaded"
              cols="12"
            >
              <h3>
                End Date
              </h3>
              <span class="body-1">{{ currProposal.endDate }}</span>
            </v-col>
            <v-col
              cols="12"
            >
              <h3>
                Voting Type
              </h3>
              <span class="body-1">{{ currProposal.votingType }}</span>
            </v-col>
            <v-col
              cols="12"
              sm="12"
            >
              <div
                v-if="votingTokensLoaded"
              >
                <h3>
                  Voting Tokens
                </h3>
                <v-badge
                  v-for="(tokenObj, tokenIndex) in currProposal.votingTokens"
                  :key="tokenIndex"
                  :label="tokenObj.tokenName"
                  :value="hover[tokenIndex]"
                  :content="tokenObj.tokenName"
                  bottom
                >
                  <v-hover v-model="hover[tokenIndex]">
                    <v-avatar
                      v-if="require(`@/assets/img/token-images/${tokenObj.tokenTTI}.png`)"
                      size="44"
                      rounded
                      class="elevation-1 mt-3 ml-5"
                    >
                      <img
                        :src="require(`@/assets/img/token-images/${tokenObj.tokenTTI}.png`)"
                        :alt="tokenObj.tokenName"
                      >
                    </v-avatar>
                    <v-avatar
                      v-else
                      size="44"
                      rounded
                      class="elevation-1 mt-3 ml-5"
                    >
                      {{ tokenObj.tokenName }}
                    </v-avatar>
                  </v-hover>
                </v-badge>
              </div>
              <!--<span
                v-for="(tokenObj, index) in currProposal.votingTokens"
                :key="index"
                class="body-1"
              >
                <span
                  v-if="index < currProposal.votingTokens.length-1"
                >
                  {{ `${currProposal.votingTokens[index].tokenTTI}, ` }}
                </span>
                <span
                  v-else
                >
                  {{ `${currProposal.votingTokens[index].tokenTTI}` }}
                </span>
              </span>-->
            </v-col>
            <v-divider
              class="divider-margin-class"
            ></v-divider>
            <voting-results-widget
              v-if="currProposal"
            ></voting-results-widget>
            <voting-ballot-form
              v-if="currProposal.status === 'Active' && currProposal.votingTokens"
              :votingTokens="currProposal.votingTokens"
              :votingType="currProposal.votingType"
              :proposalOptions="currProposal.options"
              :isVoting="isVoting"
              :isStopping="isStopping"
              :prevVoterMap="currProposal.prevVoterMap"
              @onSubmitVote="submitVoteHandler"
            >
            </voting-ballot-form>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {
  votesFirestore,
  proposalsFirestore,
  updateDocData,
  getDataById,
} from '@/firebase/firebase'
import VotingBallotForm from './forms/FormVotingBallot.vue'
import VotingResultsWidget from './widgets/VotingResultsWidget.vue'

// import { voteOnProposal } from '@/utils/proposal/proposalController'
// import { ipfsSetData } from '@/store/ipfs'

export default {

  components: {
    VotingBallotForm,
    VotingResultsWidget,
  },

  data() {
    return {
      votingBalance: 100,
      isVoting: false,
      isStopping: false,
      datesLoaded: false,
      votingTokensLoaded: false,
      hover: [],
    }
  },

  computed: {
    ...mapState([
      'walletConnected',
      'connectedWalletAddr',
      'currProposalVotingStats',
      'currProposal',
    ]),
    ...mapGetters([
      'getIsWalletConnected',
      'getConnectedWalletAddr',
      'getCurrProposalVotingStats',
      'getCurrProposal',
    ]),
  },

  created() {
    this.onCreated()
  },

  methods: {

    hasMissingParams() {
      if (!this.walletConnected) {
        return true
      }

      return false
    },

    async goBackClickHandler() {
      if (window.history.length) {
        this.$router.go(-1)
      } else {
        this.$router.push('/')
      }

      // this.$router.push({ path: `/` }) // -> /home
    },

    async submitVoteHandler(voteData) {
      if (this.hasMissingParams()) {
        console.log('VBDAO - Submit Error')

        return
      }

      this.isVoting = true

      let powerSum = 0
      const newStatTotals = []
      voteData.votingPowers.forEach((val, index) => {
        const optionTotalVotes = parseInt(this.currProposalVotingStats.optTotalVotesData[0].data[index], 10)
        const optionTotalPowers = parseInt(this.currProposalVotingStats.optVotingPowerData[0].data[index], 10)

        if (val) {
          const parsedPower = ((parseInt(voteData.votingPowers[index], 10) * voteData.userBalance) / 100)
          powerSum += parsedPower
          newStatTotals[index] = {
            optionTotalVotes: optionTotalVotes + 1,
            optionTotalVotingPower: optionTotalPowers + parsedPower,
          }
        } else {
          newStatTotals[index] = {
            optionTotalVotes: optionTotalVotes,
            optionTotalVotingPower: optionTotalPowers,
          }
        }
      })

      if (this.currProposalVotingStats) {
        await updateDocData(votesFirestore, this.currProposal.voteStatsID, {
          timestamp: new Date(),
          totalVotes: ++this.currProposalVotingStats.totalVotes,
          totalVotingPower: this.currProposalVotingStats.totalVotingPower + powerSum,
          optionStats: newStatTotals,
        })
      }

      const currVoterMap = this.currProposal.prevVoterMap
      currVoterMap.push(this.connectedWalletAddr)

      if (currVoterMap) {
        await updateDocData(proposalsFirestore, this.currProposal.proposalID, {
          prevVoterMap: currVoterMap,
        })
      }

      getDataById(votesFirestore, this.currProposal.voteStatsID).then(dataRes => {
        if (dataRes) {
          const castedVotesData = dataRes.data()
          if (castedVotesData) {
            const currCastedVotes = castedVotesData.castedVotes
            if (currCastedVotes) {
              currCastedVotes.push({ voterAddr: this.connectedWalletAddr, votingPowers: voteData.votingPowers })

              updateDocData(votesFirestore, this.currProposal.voteStatsID, {
                castedVotes: currCastedVotes,
              })
            }
          }
        }
      })

      this.$store.commit('initializeCurrProposalVotingStats', this.currProposal.voteStatsID)
      this.isVoting = false
    },

    /**
     *
     */
    async debugStopProposalHandler() {
      // if (this.hasMissingParams()) {
      //   console.log('VBDAO - Missing Required Parameter')

      //   return
      // }

      // console.log('VBDAO - ATTEMPTING TO STOP PROPOSAL: ')
      // this.isStopping = true
      // if (!this.walletConnected) {
      //   console.log('VBDAO: debugStopProposalHandler error - wallet is not connected')

      //   return
      // }

      // console.log('VBDAO STOP PROPOSAL PARAM - proposalID: ', this.currProposal.proposalID)
      // console.log('VBDAO STOP PROPOSAL PARAM - onProposalEndEvent: ', this.onProposalEndEvent)
      // console.log('VBDAO STOP PROPOSAL PARAM - onProposalResultsEvent: ', this.onProposalResultsEvent)

      // stopProposalEarly(this.currProposal.proposalID).then(block => {
      //   if (block) {
      //     console.log('VBDAO: debugStopProposalHandler success', block)
      //     this.isStopping = false
      //   }
      // })
    },

    /**
     *
     */
    async onProposalVoteEvent(eventLog) {
      console.log('VBDAO - onProposalVoteEvent:', eventLog)
      this.isVoting = false
    },

    /**
     *
     */
    async onProposalEndEvent(eventLog) {
      console.log('VBDAO - onProposalEndEvent:', eventLog)
    },

    /**
     *
     */
    async onProposalResultsEvent(eventLog) {
      console.log('VBDAO - onProposalResultsEvent:', eventLog)
    },

    /**
     *
     */
    async calculateVotingPowers() {
      console.log('VBDAO - calculateVotingPowers:', this.currProposal.votingTokens)
    },

    /**
     *
     */
    async initializeCurrProposal() {
      if (this.currProposal.length !== 0) {
        this.$store.commit('initializeCurrProposalVotingStats', this.currProposal.voteStatsID)
        this.currProposal.publishDate = await this.transformDate(this.currProposal.publishDate)
        this.currProposal.endDate = await this.transformDate(this.currProposal.endDate)
        this.hover = new Array(this.currProposal.votingTokens.length).fill(false)
        this.votingTokensLoaded = true
      }
    },

    /**
     *
     */
    async onCreated() {
      if (!this.currProposal) {
        getDataById(proposalsFirestore, this.$router.history._startLocation.replace('/view/', '')).then(dataRes => {
          if (dataRes) {
            this.$store.commit('setCurrProposal', dataRes.data())
            this.initializeCurrProposal()
          }
        })
      } else {
        this.initializeCurrProposal()
      }
    },

    /**
     *
     */
    async transformDate(lhsDate) {
      if (!lhsDate) {
        return ''
      }

      const secDate = new Date(lhsDate.seconds * 1000)
      this.datesLoaded = true

      return `${secDate.toDateString()} at ${secDate.toTimeString()}`
    },

  },
}
</script>

<style lang="scss">
@import '@braid/vue-formulate/themes/snow/snow.scss';
.align-text-center {
  text-align: center;
}
.pad-text-left {
  margin-left: 15px;
}
.center-flex {
  .d-flex {
    margin: unset !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }
}
.cast-vote-submit-btn {
  margin: 20px;
}
.options-row-style {
  margin-top: 10px;
}
.divider-margin-class {
  margin: 20px;
}
.go-back-btn {
  margin: 10px;
}
</style>
