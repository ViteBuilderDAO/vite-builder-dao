import Vue from 'vue'
import Vuex from 'vuex'

// import * as storage from '@/utils/storage/storage'

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

    getProposalMode(state) {
      return state.proposalMode
    },

  },
  mutations: {

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

    setProposalMode(state, proposalMode) {
      state.proposalMode = proposalMode
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
  },
  modules: {},
})
