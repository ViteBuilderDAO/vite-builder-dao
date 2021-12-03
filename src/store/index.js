import Vue from 'vue'
import Vuex from 'vuex'

// import * as storage from '@/utils/storage/storage'
import {
  getAllProposalStats,
} from '@/utils/proposal/proposalController'
import {
  votesFirestore,
  proposalStatsFirestore,
  getDataById,
} from '@/firebase/firebase'
import { getWalletBalanceInfo } from '@/utils/contract/contractHelpers'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // Wallet Connection Status
    walletConnected: false,
    mnemonics: '',
    connectedAccounts: [],
    connectedWalletAddr: '',
    connectedBalanceInfo: [],
    accountStates: '',
    proposalMode: 'gallery',
    proposals: [],
    proposalStatuses: [],
    currProposal: [],
    currProposalID: '',
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
      id: '',
      totalProposals: 0,
      numActiveProposals: 0,
      numApprovedProposals: 0,
      numRejectedProposals: 0,
      numCancelledProposals: 0,
    },
    proposalStatsLoaded: false,

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

    getCurrProposalID(state) {
      return state.currProposalID
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

    getConnectedBalanceInfo(state) {
      return state.connectedBalanceInfo
    },

    getProposalStatsLoaded(state) {
      return state.proposalStatsLoaded
    },

  },
  mutations: {
    initializeStore(state) {
      state.proposalStatsLoaded = false
      if (state.proposalStats.id !== '') {
        getDataById(proposalStatsFirestore, state.proposalStats.id).then(dataRes => {
          if (dataRes) {
            const statsData = dataRes.data()
            state.proposalStats.totalProposals = statsData.totalNumProposals
            state.proposalStats.numActiveProposals = statsData.totalActiveProposals
            state.proposalStats.numApprovedProposals = statsData.totalApprovedProposals
            state.proposalStats.numRejectedProposals = statsData.totalRejectedProposals
            state.proposalStats.numCancelledProposals = statsData.totalCancelledProposals
            state.proposalMode = 'gallery'
            state.proposalStatsLoaded = true
          }
        })
      } else {
        getAllProposalStats().then(dataRes => {
          const statsData = dataRes.docs[0].data()
          state.proposalStats.id = statsData.id
          state.proposalStats.totalProposals = statsData.totalNumProposals
          state.proposalStats.numActiveProposals = statsData.totalActiveProposals
          state.proposalStats.numApprovedProposals = statsData.totalApprovedProposals
          state.proposalStats.numRejectedProposals = statsData.totalRejectedProposals
          state.proposalStats.numCancelledProposals = statsData.totalCancelledProposals
        })
      }

      state.proposalMode = 'gallery'
      state.proposalStatsLoaded = true
    },

    initializeCurrProposalVotingStats(state, voteStatsID) {
      state.currVotingStatsLoaded = false
      getDataById(votesFirestore, voteStatsID).then(dataRes => {
        if (dataRes) {
          const votesData = dataRes.data()
          state.currProposalVotingStats.optTotalVotesData[0].data = []
          state.currProposalVotingStats.optVotingPowerData[0].data = []
          votesData.optionStats.forEach((val, index) => {
            state.currProposalVotingStats.optTotalVotesData[0].data[index] = val.optionTotalVotes
            state.currProposalVotingStats.optVotingPowerData[0].data[index] = val.optionTotalVotingPower
          })
          state.currProposalVotingStats.totalVotes = votesData.totalVotes
          state.currProposalVotingStats.totalVotingPower = votesData.totalVotingPower
          state.currVotingStatsLoaded = true
        }
      })
    },

    async initializeBalanceInfo(state) {
      if (state.walletConnected) {
        await getWalletBalanceInfo(state.connectedWalletAddr).then(({ balance }) => {
          state.connectedBalanceInfo = balance.balanceInfoMap
        })
      }
    },

    setWalletConnected(state, status) {
      state.walletConnected = status
      if (!status) {
        state.connectedBalanceInfo = []
      }
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

    setProposalMode(state, proposalMode) {
      state.proposalMode = proposalMode
    },

    setCurrProposal(state, proposal) {
      state.currProposalID = proposal.proposalID
      state.currProposal = proposal
    },

    setProposalStatsLoaded(state, loaded) {
      state.proposalStatsLoaded = loaded
    },

    setProposalStats(state, statsData) {
      state.proposalStatsLoaded = false
      state.proposalStats.id = statsData.id
      state.proposalStats.totalProposals = statsData.totalNumProposals
      state.proposalStats.numActiveProposals = statsData.totalActiveProposals
      state.proposalStats.numApprovedProposals = statsData.totalApprovedProposals
      state.proposalStats.numRejectedProposals = statsData.totalRejectedProposals
      state.proposalStats.numCancelledProposals = statsData.totalCancelledProposals
      state.proposalMode = 'gallery'
      state.proposalStatsLoaded = true
    },
  },
  actions: {

    addAccount({ commit }, newAccount) {
      commit('addAccount', { account: newAccount })
      commit('setSelectedAddress', newAccount.address)
    },

    setProposalMode({ commit }, proposalMode) {
      commit('setProposalMode', proposalMode)
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

    setProposalStats({ commit }, statsData) {
      commit('setProposalStats', statsData)
    },
  },
  modules: {},
})
