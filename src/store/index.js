import Vue from 'vue'
import Vuex from 'vuex'
import * as viteClient from '@/utils/vite-helpers/viteClient'
import * as storage from '@/utils/storage/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // Wallet Connection Status
    walletConnected: false,
    mnemonics: {},
    accounts: [],
    selectedAddress: {},
    accountStates: {},
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
      state.accounts = state.accounts.concat([account])
    },

    setAccounts(state, accounts) {
      state.accounts = accounts
    },

    setSelectedAddress(state, address) {
      state.selectedAddress = address
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
