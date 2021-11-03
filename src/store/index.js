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
    voteParamObj: {
      voter: '',
      proposalID: 0,
      voteToken: '',
      voterPower: 0,
      optionNumber: 1,
      voteTimestamp: '',
    },
    votingMap: [[]],
    proposalParamObj: {
      proposalID: 0,
      creator: '',
      title: '',
      urlLink: '',
      keywords: '',
      description: '',
      options: [],
      coverImage: [],
      attachedFiles: [],
      votingType: '',
      votingPeriod: 0,
      votingTokens: [],
      publishDate: '',
      isActive: false,
    },
    proposalsMap: [],
    currProposalID: 0,
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

    getVotingMap(state) {
      if (localStorage.getItem('votingMap')) {
        this.replaceState(
          Object.assign(state.votingMap, JSON.parse(localStorage.getItem('votingMap'))),
        )
      }

      return state.votingMap
    },

    getProposalsMap(state) {
      if (localStorage.getItem('proposalsMap')) {
        this.replaceState(
          Object.assign(state.proposalsMap, JSON.parse(localStorage.getItem('proposalsMap'))),
        )
      }

      return state.proposalsMap
    },

    getProposalByID(state, proposalID) {
      return state.proposalsMap[proposalID]
    },

    getNumVotesOnProposal(state, proposalID) {
      return state.votingMap[proposalID] ? state.votingMap[proposalID].length : 0
    },

    getVoteInfoByID(state, proposalID) {
      return state.votingMap[proposalID]
    },

    getNumTotalProposals(state) {
      return state.proposalsMap.length
    },

    getCurrProposalID(state) {
      if (localStorage.getItem('currProposalID')) {
        this.replaceState(
          Object.assign(state.currProposalID, JSON.parse(localStorage.getItem('currProposalID'))),
        )
      }

      return state.currProposalID
    },
  },
  mutations: {
    // Init local storage and set the state object
    initialiseStore(state) {
      if (localStorage.getItem('votingMap')) {
        this.replaceState(
          Object.assign(state.votingMap, JSON.parse(localStorage.getItem('votingMap'))),
        )
      }
      if (localStorage.getItem('currProposalID')) {
        this.replaceState(
          Object.assign(state.currProposalID, JSON.parse(localStorage.getItem('currProposalID'))),
        )
      }
      if (localStorage.getItem('proposalsMap')) {
        this.replaceState(
          Object.assign(state.proposalsMap, JSON.parse(localStorage.getItem('proposalsMap'))),
        )
      }
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

    addNewProposal(state, proposal) {
      Vue.set(state.proposalParamObj, 'proposalID', state.currProposalID)
      Vue.set(state.proposalParamObj, 'creator', proposal.creator)
      Vue.set(state.proposalParamObj, 'title', proposal.title)
      Vue.set(state.proposalParamObj, 'urlLink', proposal.urlLink)
      Vue.set(state.proposalParamObj, 'keywords', proposal.keywords)
      Vue.set(state.proposalParamObj, 'description', proposal.description)
      Vue.set(state.proposalParamObj, 'options', proposal.options)
      Vue.set(state.proposalParamObj, 'coverImage', proposal.coverImage)
      Vue.set(state.proposalParamObj, 'attachedFiles', proposal.attachedFiles)
      Vue.set(state.proposalParamObj, 'votingType', proposal.votingType)
      Vue.set(state.proposalParamObj, 'votingPeriod', proposal.votingPeriod)
      Vue.set(state.proposalParamObj, 'votingTokens', proposal.votingTokens)
      Vue.set(state.proposalParamObj, 'publishDate', proposal.publishDate)
      Vue.set(state.proposalParamObj, 'isActive', proposal.isActive)
      state.proposalsMap[state.currProposalID] = state.proposalParamObj
      localStorage.setItem('currProposalID', state.currProposalID)
      localStorage.setItem('proposalsMap', state.proposalsMap)
      state.currProposalID++
    },

    addProposalVote(state, voteParams) {
      Vue.set(state.voteParamObj, 'voter', voteParams.voter)
      Vue.set(state.voteParamObj, 'proposalID', voteParams.proposalID)
      Vue.set(state.voteParamObj, 'voteToken', voteParams.voteToken)
      Vue.set(state.voteParamObj, 'voterPower', voteParams.voterPower)
      Vue.set(state.voteParamObj, 'optionNumber', voteParams.optionNumber)
      Vue.set(state.voteParamObj, 'voteTimestamp', voteParams.voteTimestamp)
      state.votingMap[voteParams.proposalID].push(state.voteParamObj)
      localStorage.setItem('votingMap', state.votingMap)
    },

    setProposalByID(state, proposal) {
      state.proposalsMap[proposal.proposalID] = proposal
      localStorage.setItem('proposalsMap', state.proposalsMap)
    },

    setProposalStatusById(state, { proposalID, status }) {
      state.proposalsMap[proposalID].isActive = status
      localStorage.setItem('proposalsMap', state.proposalsMap)
    },
  },
  actions: {

    addAccount({ commit }, newAccount) {
      commit('addAccount', { account: newAccount })
      commit('setSelectedAddress', newAccount.address)
    },

    addNewProposal({ commit }, proposal) {
      commit('addNewProposal', proposal)
    },

    addProposalVote({ commit }, voteParams) {
      commit('addProposalVote', voteParams)
    },

    setProposalByID({ commit }, proposal) {
      commit('setProposalByID', proposal)
    },
  },
  modules: {},
})
