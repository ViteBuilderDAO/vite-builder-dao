<template>
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
          v-if="currProposal.publishDate"
          cols="12"
        >
          <h3>
            Publish Date
          </h3>
          <span class="body-1">{{ currProposal.publishDate }}</span>
        </v-col>
        <v-col
          v-if="currProposal.publishDate"
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
          <h3>
            Voting Tokens
          </h3>
          <span
            v-for="(tokens, index) in currProposal.votingTokens"
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
          </span>
        </v-col>
        <v-divider
          class="divider-margin-class"
        ></v-divider>
        <voting-results-widget
          :status="currProposal.status"
          :proposalOptions="currProposal.options"
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
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {
  votesFirestore,
  proposalsFirestore,
  updateDocData,
  getDataById,
} from '@/firebase/firebase'
import VotingBallotForm from '../forms/FormVotingBallot.vue'
import VotingResultsWidget from './VotingResultsWidget.vue'

// import { voteOnProposal } from '@/utils/proposal/proposalController'
// import { ipfsSetData } from '@/store/ipfs'
// const ViewProposalTestWidget = () => import('./ViewProposalTestWidget.vue')

export default {

  components: {
    VotingBallotForm,
    VotingResultsWidget,
  },

  props: {
    proposal: { type: Object, required: true },
  },

  data() {
    return {
      votingBalance: 0,
      isVoting: false,
      isStopping: false,
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

  mounted() {
    this.onMounted()
  },

  methods: {

    hasMissingParams() {
      if (!this.walletConnected) {
        return true
      }

      return false
    },

    async goBackClickHandler() {
      this.$store.commit('setProposalMode', 'gallery')
    },

    async submitVoteHandler(voteData) {
      if (this.hasMissingParams()) {
        console.log('VBDAO - Missing Required Parameter')

        return
      }

      // console.log('~ VBDAO - ATTEMPTING SUBMIT VOTE TEST ~')
      // console.log('VBDAO - CALLBACK VOTE DATA votingPowers: ', voteData.votingPowers)

      this.isVoting = true

      const newStatTotals = []
      voteData.votingPowers.forEach((val, index) => {
        const optionTotalVotes = parseInt(this.currProposalVotingStats.optTotalVotesData[0].data[index], 10)
        const optionTotalPowers = parseInt(this.currProposalVotingStats.optVotingPowerData[0].data[index], 10)

        if (val) {
          const parsedPower = parseInt(voteData.votingPowers[index], 10)
          newStatTotals[index] = { optionTotalVotes: optionTotalVotes + 1, optionTotalVotingPower: optionTotalPowers + parsedPower }
        } else {
          newStatTotals[index] = { optionTotalVotes: optionTotalVotes, optionTotalVotingPower: optionTotalPowers }
        }
      })

      // console.log('VBDAO VOTE PARAM - proposalID: ', voteParams.proposalID)
      // console.log('VBDAO VOTE PARAM - voter: ', voteParams.voter)
      // console.log('VBDAO VOTE PARAM - optionsVoted: ', voteParams.optionsVoted)
      // console.log('VBDAO VOTE PARAM - votingPowers: ', voteParams.votingPowers)
      // console.log('VBDAO VOTE PARAM - votingBalance: ', voteParams.votingBalance)
      // console.log('VBDAO VOTE PARAM - newStatTotals: ', newStatTotals)

      await updateDocData(votesFirestore, this.currProposal.voteStatsID, {
        timestamp: new Date(),
        totalVotes: ++this.currProposalVotingStats.totalVotes,
        totalVotingPower: this.currProposalVotingStats.totalVotingPower + this.votingBalance,
        optionStats: newStatTotals,
      })

      const currVoterMap = this.currProposal.prevVoterMap
      currVoterMap.push(this.connectedWalletAddr)

      await updateDocData(proposalsFirestore, this.currProposal.proposalID, {
        prevVoterMap: currVoterMap,
      })

      getDataById(votesFirestore, this.currProposal.voteStatsID).then(dataRes => {
        if (dataRes) {
          let currCastedVotes = []
          if (dataRes.castedVotes && dataRes.castedVotes.length) {
            currCastedVotes = dataRes.castedVotes
            currCastedVotes.push({ voterAddr: this.connectedWalletAddr, votingPowers: voteData.votingPowers })
          } else {
            currCastedVotes = new Array(1).fill({ voterAddr: this.connectedWalletAddr, votingPowers: voteData.votingPowers })
          }
          updateDocData(votesFirestore, this.currProposal.voteStatsID, {
            castedVotes: currCastedVotes,
          })
        }
      })

      this.$store.commit('initializeCurrProposalVotingStats', this.currProposal.voteStatsID)
      this.isVoting = false

      // const ipfsPath = `VoteParams_|${voteParams.proposalID.toString()}|_${voteParams.voteID}`
      // const ipfsHashFile = ipfsSetData(ipfsPath, voteParams)

      // (proposalID, voter, voterPower, ipfsData)
      // console.log('VBDAO VOTE PARAM - voteID: ', voteParams.voteID)
      // console.log('VBDAO VOTE PARAM - proposalID: ', voteParams.proposalID)
      // console.log('VBDAO VOTE PARAM - voter: ', voteParams.voter)
      // console.log('VBDAO VOTE PARAM - optionsVoted: ', voteParams.optionsVoted)
      // console.log('VBDAO VOTE PARAM - votingPowers: ', voteParams.votingPowers)
      // console.log('VBDAO VOTE PARAM - TYPEOF(votingPowers): ', typeof voteParams.votingPowers)
      // console.log('VBDAO VOTE PARAM - votingBalance: ', voteParams.votingBalance)

      // console.log('VBDAO - VOTE PARAMS ipfspath - ', ipfsPath)
      // console.log('VBDAO - VOTE PARAMS ipfsHashFile.path - ', ipfsHashFile.path)
      // console.log('VBDAO - VOTE PARAMS ipfsHashFile.cid - ', ipfsHashFile.cid)

      // voteOnProposal([this.currProposal.proposalID, this.connectedWalletAddr, this.votingBalance, voteData.votingPowers]).then(block => {
      //   if (block) {
      //     this.$store.commit('initializeCurrProposalVotingStats', this.currProposal.voteStatsID)
      //   }
      //   this.isVoting = false
      // })
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
    async onCreated() {
      this.$store.commit('initializeCurrProposalVotingStats', this.currProposal.voteStatsID)
      this.currProposal.publishDate = await this.transformDate(this.currProposal.publishDate)
      this.currProposal.endDate = await this.transformDate(this.currProposal.endDate)
    },

    /**
     *
     */
    async onMounted() {
      this.currProposal.publishDate = await this.transformDate(this.currProposal.publishDate)
      this.currProposal.endDate = await this.transformDate(this.currProposal.endDate)
    },

    /**
     *
     */
    transformDate(lhsDate) {
      const secDate = new Date(lhsDate.seconds * 1000)

      return `${secDate.toDateString()} at ${secDate.toTimeString()}`

      // let month = secDate.getMonth() + 1
      // if (month < 9) {
      //   month = `0${month}`
      // }
      // let day = secDate.getDate()
      // if (day < 9) {
      //   day = `0${day}`
      // }
      // return `${month}/${day}/${secDate.getFullYear()}`
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

<!-- <style lang="scss">
.stop-proposal-btn {
  margin: 10px;
  left: 0;
}
.submit-vote-btn {
  margin-top: 40px;
}
</style> -->
