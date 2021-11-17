import Vue from 'vue'
import Vuex from 'vuex'

// import * as storage from '@/utils/storage/storage'
import {
  getAllProposalStats,
} from '@/utils/proposal/proposalController'
import {
  votesFirestore,
  getDataById,
} from '@/firebase/firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // Wallet Connection Status
    walletConnected: false,
    mnemonics: '',
    connectedAccounts: [],
    connectedWalletAddr: '',
    accountStates: '',
    proposalMode: 'gallery',
    proposals: [],
    proposalStatuses: [],
    currProposal: [],
    currProposalVotingStats: {
      totalVotes: 0,
      totalVotingPower: 0,
      optTotalVotesData: [{
        data: [],
      }],
      optVotingPowerData: [{
        data: [],
      }],
    },
    currVotingStatsLoaded: false,
    proposalStats: {
      totalProposals: 0,
      numActiveProposals: 0,
      numApprovedProposals: 0,
      numRejectedProposals: 0,
      numCancelledProposals: 0,
    },
  },
  getters: {

    getIsWalletConnected(state) {
      return state.walletConnected
    },

    getWalletMnemonics(state) {
      return state.mnemonics
    },

    getConnectedAccounts(state) {
      return state.connectedAccounts
    },

    getConnectedWalletAddr(state) {
      return state.connectedWalletAddr || {}
    },

    getAccountStates(state) {
      return state.accountStates
    },

    getProposals(state) {
      return state.proposals
    },

    getProposalStatuses(state) {
      return state.proposalStatuses
    },

    getProposalMode(state) {
      return state.proposalMode
    },

    getCurrProposal(state) {
      return state.currProposal
    },

    getProposalStats(state) {
      return state.proposalStats
    },

    getCurrProposalVotingStats(state) {
      return state.currProposalVotingStats
    },

    getCurrVotingStatsLoaded(state) {
      return state.currVotingStatsLoaded
    },

  },
  mutations: {
    async initializeStore(state) {
      getAllProposalStats().then(stats => {
        state.proposalStats.totalProposals = parseInt(stats[0], 10)
        state.proposalStats.numActiveProposals = parseInt(stats[1], 10)
        state.proposalStats.numApprovedProposals = parseInt(stats[2], 10)
        state.proposalStats.numRejectedProposals = parseInt(stats[3], 10)
        state.proposalStats.numCancelledProposals = parseInt(stats[4], 10)
        console.log('STORE.JS: initializeStore()')
      })
    },

    initializeCurrProposalVotingStats(state, voteStatsID) {
      getDataById(votesFirestore, voteStatsID).then(dataRes => {
        if (dataRes) {
          const votesData = dataRes.data()
          votesData.optionStats.forEach((val, index) => {
            state.currProposalVotingStats.optTotalVotesData[0].data[index] = val.optionTotalVotes
            state.currProposalVotingStats.optVotingPowerData[0].data[index] = val.optionTotalVotingPower
          })
          state.currProposalVotingStats.totalVotes = votesData.totalVotes
          state.currProposalVotingStats.totalVotingPower = votesData.totalVotingPower
          console.log('STORE.JS: initializeCurrProposalStats()', votesData)
          state.currVotingStatsLoaded = true
        }
      })
    },

    setWalletConnected(state, status) {
      state.walletConnected = status
    },

    setMnemonics(state, payload) {
      state.mnemonics = payload
    },

    addAccount(state, { account }) {
      state.connectedAccounts = state.connectedAccounts.concat([account])
    },

    setAccounts(state, accounts) {
      state.connectedAccounts = accounts
    },

    setSelectedAddress(state, address) {
      state.connectedWalletAddr = address
    },

    updateAccountState(state, { address, accountState }) {
      state.accountStates = {
        ...state.accountStates,
        [address]: accountState,
      }
    },

    setProposals(state, proposals) {
      state.proposals = proposals
    },

    setProposalStatuses(state, statuses) {
      state.proposalStatuses = statuses
    },

    setProposalMode(state, proposalMode, isNewProposal) {
      if (isNewProposal) {
        ++state.proposalStats.totalProposals
        ++state.proposalStats.numActiveProposals
      }
      state.proposalMode = proposalMode
    },

    setCurrProposal(state, proposal) {
      state.currProposal = proposal
    },

    setProposalStats(state, proposalStats) {
      state.proposalStats.totalProposals = parseInt(proposalStats[0], 10)
      state.proposalStats.numActiveProposals = parseInt(proposalStats[1], 10)
      state.proposalStats.numApprovedProposals = parseInt(proposalStats[2], 10)
      state.proposalStats.numRejectedProposals = parseInt(proposalStats[3], 10)
      state.proposalStats.numCancelledProposals = parseInt(proposalStats[4], 10)
    },

    setCurrProposalVotingStats(state, proposalVotingStats) {
      state.currProposalVotingStats.optionStats = proposalVotingStats.optionStats
      state.currProposalVotingStats.totalVotes = proposalVotingStats.totalVotes
      state.currProposalVotingStats.totalVotingPower = proposalVotingStats.totalVotingPower
    },

  },
  actions: {

    addAccount({ commit }, newAccount) {
      commit('addAccount', { account: newAccount })
      commit('setSelectedAddress', newAccount.address)
    },

    setProposalMode({ commit }, proposalMode, isNewProposal) {
      commit('setProposalMode', proposalMode, isNewProposal)
    },

    setProposals({ commit }, proposals) {
      commit('setProposals', proposals)
    },

    setProposalStatuses({ commit }, statuses) {
      commit('setProposalStatuses', statuses)
    },

    setCurrProposal({ commit }, proposal) {
      commit('setCurrProposal', proposal)
    },

    setProposalStats({ commit }, proposalStats) {
      commit('setProposalStats', proposalStats)
    },

    setCurrProposalVotingStats({ commit }, proposalVotingStats) {
      commit('setCurrProposalVotingStats', proposalVotingStats)
    },
  },
  modules: {},
})
