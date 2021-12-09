import Vue from 'vue'
import Vuex from 'vuex'

// import * as storage from '@/utils/storage/storage'
// import Connector from '@vite/connector'
import {
  getAllProposalStats,
} from '@/utils/proposal/proposalController'
import {
  votesFirestore,
  proposalStatsFirestore,
  getDataById,
} from '@/firebase/firebase'
import { getWalletBalanceInfo } from '@/utils/contract/contractHelpers'
import eventBus from '@/utils/events/eventBus'

// url to vite connect server
// const BRIDGE = 'wss://biforst.vite.net'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // Wallet Connection Status
    walletConnected: false,
    mnemonics: '',
    connectedWalletAddr: '',
    connectedBalanceInfo: [],
    accountStates: '',
    proposals: [],
    proposalStatuses: [],
    currProposal: null,
    currProposalID: '',
    currProposalVotingStats: {
      totalVotes: 0,
      totalVotingPower: 0,
      winningIndices: [],
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
      numClosedProposals: 0,
    },
    proposalStatsLoaded: false,
    whitelistedAddresses: [
      'vite_04d31e740dbca35a0e00db5fb1ef12fb4cedbd1e66e7895774',
      'vite_f30697191707a723c70d0652ab80304195e5928dcf71fcab99',
      'vite_940c816f5527b63ba425a2ca9abd6380535c9f7f53803d620c',
      'vite_471d56e8d25ca76c4abbd6b097794b9190f052ac7eea880c88',
      'vite_9a4c9281f8770751f7281a6a89f2d32c30d45d322304c447a9',
      'vite_1e6fcaa6ade80cb29b981bc70b2e8396bbdfd70a04e6164705',
    ],

  },
  getters: {

    getIsWalletConnected(state) {
      return state.walletConnected
    },

    getWalletMnemonics(state) {
      return state.mnemonics
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

    getWhitelistedAddresses(state) {
      return state.whitelistedAddresses
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
            state.proposalStats.numClosedProposals = statsData.totalClosedProposals
            state.proposalStatsLoaded = true
          }
        })
      } else {
        getAllProposalStats().then(dataRes => {
          const statsData = dataRes.docs[0].data()
          state.proposalStats.id = statsData.id
          state.proposalStats.totalProposals = statsData.totalNumProposals
          state.proposalStats.numActiveProposals = statsData.totalActiveProposals
          state.proposalStats.numClosedProposals = statsData.totalClosedProposals
        })
      }

      state.proposalStatsLoaded = true
    },

    initializeCurrProposalVotingStats(state, voteStatsID) {
      state.currVotingStatsLoaded = false
      getDataById(votesFirestore, voteStatsID).then(dataRes => {
        if (dataRes) {
          const votesData = dataRes.data()
          if (votesData) {
            state.currProposalVotingStats.optTotalVotesData[0].data = []
            state.currProposalVotingStats.optVotingPowerData[0].data = []
            let winningOptPower = 0
            votesData.optionStats.forEach((val, index) => {
              state.currProposalVotingStats.optTotalVotesData[0].data[index] = val.optionTotalVotes
              state.currProposalVotingStats.optVotingPowerData[0].data[index] = val.optionTotalVotingPower
              if (winningOptPower < val.optionTotalVotingPower) {
                winningOptPower = val.optionTotalVotingPower
                state.currProposalVotingStats.winningIndices = new Array(1).fill(index)
              } else if (winningOptPower === val.optionTotalVotingPower) {
                state.currProposalVotingStats.winningIndices.push(index)
              }
            })
            state.currProposalVotingStats.totalVotes = votesData.totalVotes
            state.currProposalVotingStats.totalVotingPower = votesData.totalVotingPower
            state.currVotingStatsLoaded = true
            eventBus.$emit('voting-results-updated', {
              optTotalVotesData: state.currProposalVotingStats.optTotalVotesData[0].data,
              optVotingPowerData: state.currProposalVotingStats.optVotingPowerData[0].data,
            })
          }
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
      state.proposalStats.numClosedProposals = statsData.totalClosedProposals
      state.proposalStatsLoaded = true
    },

    addWhitelistedAddress(state, { address }) {
      state.whitelistedAddresses = state.whitelistedAddresses.concat([address])
    },

  },
  actions: {

    addAccount({ commit }, newAccount) {
      commit('setSelectedAddress', newAccount.address)
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

    addWhitelistedAddress({ commit }, newAddress) {
      commit('addWhitelistedAddress', { address: newAddress })
    },
  },
  modules: {},
})
