import Vue from 'vue'
import Vuex from 'vuex'
import * as viteClient from '@/utils/vite-helpers/viteClient'
import * as storage from '@/utils/storage/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // Wallet Connection Status
    walletConnected: false,
    mnemonics: '',
    connectedAccounts: [],
    connectedWalletAddr: '',
    accountStates: '',
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
    getaccountStatesr(state) {
      return state.accountStates
    },
  },
  mutations: {
    // Set Wallet Connection Status
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
  },
  actions: {
    addAccount({ commit }, newAccount) {
      commit('addAccount', { account: newAccount })
      commit('setSelectedAddress', newAccount.address)
    },
    importWallet({ commit, state }, payload) {
      if (payload === state.mnemonics) {
        return
      }
      commit('setMnemonics', payload)
      storage.set('mnemonics', payload)
      const newAccount = viteClient.createAccount(payload, 0)
      commit('setAccounts', [newAccount])
      commit('setSelectedAddress', newAccount.address)
    },
  },
  modules: {},
})
