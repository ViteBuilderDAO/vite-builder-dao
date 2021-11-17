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
              {{ proposal.title }}
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
          <span class="body-1">{{ proposal.description }}</span>
        </v-col>
        <v-col
          cols="12"
        >
          <h3>
            Creator
          </h3>
          <span class="body-1">{{ proposal.creator }}</span>
        </v-col>
        <v-col
          v-if="proposal.urlLink"
          cols="12"
        >
          <h3>
            URL
          </h3>
          <span class="body-1">
            <a
              :href="proposal.urlLink"
              target="_blank"
              rel="nofollow"
            >
              {{ proposal.urlLink }}
            </a>
          </span>
        </v-col>
        <v-col
          cols="12"
          sm="12"
        >
          <h3>
            Keywords
          </h3>
          <span class="body-1">{{ proposal.keywords }}</span>
        </v-col>
        <v-col
          v-if="proposal.keywords"
          cols="12"
        >
          <h3>
            Publish Date
          </h3>
          <span class="body-1">{{ proposal.publishDate }}</span>
        </v-col>
        <v-col
          v-if="proposal.publishDate"
          cols="12"
        >
          <h3>
            End Date
          </h3>
          <span class="body-1">{{ proposal.endDate }}</span>
        </v-col>
        <v-col
          cols="12"
          sm="12"
        >
          <h3>
            Voting Period
          </h3>
          <span class="body-1">{{ proposal.votingPeriod }} Days</span>
        </v-col>
        <v-col
          cols="12"
        >
          <h3>
            Voting Type
          </h3>
          <span class="body-1">{{ proposal.votingType }}</span>
        </v-col>
        <v-col
          cols="12"
          sm="12"
        >
          <h3>
            Voting Tokens
          </h3>
          <span
            v-for="(tokens, index) in proposal.votingTokens"
            :key="index"
            class="body-1"
          >
            <span
              v-if="index < proposal.votingTokens.length-1"
            >
              {{ `${proposal.votingTokens[index].votingTokens}, ` }}
            </span>
            <span
              v-else
            >
              {{ `${proposal.votingTokens[index].votingTokens}` }}
            </span>
          </span>
        </v-col>
        <v-divider
          class="divider-margin-class"
        ></v-divider>
        <voting-results-widget
          :status="proposal.status"
          :votingStatID="proposal.voteStatsID"
          :proposalOptions="proposal.options"
        ></voting-results-widget>
        <voting-ballot-form
          v-if="proposal.status === 'Active' && proposal.votingTokens"
          :votingTokens="proposal.votingTokens"
          :votingType="proposal.votingType"
          :proposalOptions="proposal.options"
          :isVoting="isVoting"
          :isStopping="isStopping"
          @onSubmitVote="submitVoteHandler"
        >
        </voting-ballot-form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import BigNumber from 'bignumber.js'
import {
  stopProposalEarly,
  voteOnProposal,
} from '@/utils/proposal/proposalController'
import {
  votesFirestore,
  updateDocData,
} from '@/firebase/firebase'
import { getWalletBalanceInfo } from '@/utils/contract/contractHelpers'
import VotingBallotForm from '../forms/FormVotingBallot.vue'
import VotingResultsWidget from './VotingResultsWidget.vue'
import { getVbInstance } from '@/utils/wallet/walletClient'

const vbInst = getVbInstance()

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

  setup() {
    return {
      isVoting: false,
      isStopping: false,
      votingBalance: 0,
    }
  },

  computed: {
    ...mapState([
      'walletConnected',
      'connectedWalletAddr',
      'connectedAccounts',
      'currProposalVotingStats',
    ]),
    ...mapGetters([
      'getIsWalletConnected',
      'getConnectedWalletAddr',
      'getConnectedAccounts',
      'getCurrProposalVotingStats',
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
      this.$store.commit('setProposalMode', 'gallery', false)
    },

    async submitVoteHandler(voteData) {
      if (this.hasMissingParams()) {
        console.log('VBDAO - Missing Required Parameter')

        return
      }

      console.log('~ VBDAO - ATTEMPTING SUBMIT VOTE TEST ~')

      console.log('VBDAO - CALLBACK VOTE DATA optionsVoted: ', voteData.optionsVoted)
      console.log('VBDAO - CALLBACK VOTE DATA votingPowers: ', voteData.votingPowers)

      this.isVoting = true
      this.calculateVotingPowers()

      const newStatTotals = []
      voteData.optionsVoted.forEach((val, index) => {
        const optionTotalVotes = parseInt(this.currProposalVotingStats.optTotalVotesData[0].data[index], 10)
        const optionTotalPowers = parseInt(this.currProposalVotingStats.optVotingPowerData[0].data[index], 10)
        if (val) {
          const parsedPower = parseInt(voteData.votingPowers[index], 10)
          newStatTotals[index] = { optionTotalVotes: optionTotalVotes + 1, optionTotalVotingPower: optionTotalPowers + parsedPower }
        } else {
          newStatTotals[index] = { optionTotalVotes: optionTotalVotes, optionTotalVotingPower: optionTotalPowers }
        }
      })

      const voteParams = {
        voteID: this.currProposalVotingStats.totalVotes + 1,
        proposalID: this.proposal.proposalID,
        voter: this.connectedWalletAddr,
        optionsVoted: voteData.optionsVoted,
        votingPowers: voteData.votingPowers,
        votingBalance: this.votingBalance,
      }

      // console.log('VBDAO VOTE PARAM - proposalID: ', voteParams.proposalID)
      // console.log('VBDAO VOTE PARAM - voter: ', voteParams.voter)
      // console.log('VBDAO VOTE PARAM - optionsVoted: ', voteParams.optionsVoted)
      // console.log('VBDAO VOTE PARAM - votingPowers: ', voteParams.votingPowers)
      // console.log('VBDAO VOTE PARAM - votingBalance: ', voteParams.votingBalance)
      // console.log('VBDAO VOTE PARAM - newStatTotals: ', newStatTotals)

      const updateRes = new Date()
      await updateDocData(votesFirestore, this.proposal.voteStatsID, {
        totalVotes: voteParams.voteID,
        totalVotingPower: this.currProposalVotingStats.totalVotingPower + this.votingBalance,
        optionStats: newStatTotals,
      })

      // const ipfsPath = `VoteParams_|${voteParams.proposalID.toString()}|_${voteParams.voteID}`
      // const ipfsHashFile = ipfsSetData(ipfsPath, voteParams)

      // console.log('VBDAO - PROPOSAL votesFirestore storRes - ', updateRes.toString())

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

      voteOnProposal([voteParams.proposalID, voteParams.voter, voteParams.votingBalance, voteParams.votingPowers, updateRes.toString()], this.onProposalVoteEvent).then(block => {
        if (block) {
          this.$store.commit('initializeCurrProposalVotingStats', this.proposal.voteStatsID)
          this.isVoting = false
          console.log('VBDAO: CALL TO CONTRACT SUCCESS (voteOnProposal)', block)
        }
      })
    },

    /**
     *
     */
    async debugStopProposalHandler() {
      // if (this.hasMissingParams()) {
      //   console.log('VBDAO - Missing Required Parameter')

      //   return
      // }

      console.log('VBDAO - ATTEMPTING TO STOP PROPOSAL: ')
      this.isStopping = true
      if (!this.walletConnected) {
        console.log('VBDAO: debugStopProposalHandler error - wallet is not connected')

        return
      }

      // console.log('VBDAO STOP PROPOSAL PARAM - proposalID: ', this.proposal.proposalID)
      // console.log('VBDAO STOP PROPOSAL PARAM - onProposalEndEvent: ', this.onProposalEndEvent)
      // console.log('VBDAO STOP PROPOSAL PARAM - onProposalResultsEvent: ', this.onProposalResultsEvent)

      stopProposalEarly(this.proposal.proposalID, this.onProposalEndEvent, this.onProposalResultsEvent).then(block => {
        if (block) {
          console.log('VBDAO: debugStopProposalHandler success', block)
          this.isStopping = false
        }
      })
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
      console.log('VBDAO - calculateVotingPowers:', this.proposal.votingTokens)
    },

    /**
     *
     */
    async onCreated() {
      this.$store.commit('initializeCurrProposalVotingStats', this.proposal.voteStatsID)
      vbInst.on('connect', () => {
        this.initVotingPower()
      })
      vbInst.on('disconnect', () => {
        this.votingBalance = 0
      })
      this.initVotingPower()
      this.proposal.publishDate = await this.transformDate(this.proposal.publishDate)
      this.proposal.endDate = await this.transformDate(this.proposal.endDate)
    },

    /**
     *
     */
    async initVotingPower() {
      if (this.walletConnected) {
        await getWalletBalanceInfo(this.connectedAccounts[0]).then(({ balance }) => {
          const votingTokenArr = []
          Object.values(this.proposal.votingTokens).forEach(token => {
            votingTokenArr.push(token.votingTokens)
          })
          Object.values(balance.balanceInfoMap).forEach(val => {
            if (votingTokenArr.includes(val.tokenInfo.tokenId)) {
              this.votingBalance += parseInt(BigNumber(val.balance).dividedBy(`1e${val.tokenInfo.decimals}`).toFixed(), 10)
            }
          })
        })
      }
    },

    /**
     *
     */
    transformDate(lhsDate) {
      const secDate = new Date(lhsDate.seconds * 1000)

      return secDate.toUTCString()

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
