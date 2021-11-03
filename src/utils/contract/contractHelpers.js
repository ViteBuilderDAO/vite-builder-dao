import { getVbInstance } from '@/utils/client/walletClient'

const { WS_RPC } = require('@vite/vitejs-ws')
const { ViteAPI, accountBlock, abi } = require('@vite/vitejs')

const TEST_WS_NET = 'wss://buidl.vite.net/gvite/ws'

// const LIVE_WS_NET = 'wss://node.vite.net/gvite/ws'

const VITE_WSS = process.env.NODE_ENV === 'production' ? TEST_WS_NET : TEST_WS_NET

/**
 *
 */
export function getWalletBalanceByToken(walletAcct) {
  console.log('VBDAO: GET WALLET BALANCE BY TOKEN REQUEST')
  const connection = new WS_RPC(VITE_WSS)
  const provider = new ViteAPI(connection, () => {
    console.log('VBDAO: getWalletBalanceByToken() client connected')
  })

  if (walletAcct) {
    return walletAcct.getBalance(provider)
  }

  return null
}

/**
 *
 */
export async function getTokenList() {
  console.log('VBDAO: GET TOKEN INFO REQUEST')
  const connection = new WS_RPC(VITE_WSS)
  const provider = new ViteAPI(connection, () => {
    console.log('VBDAO: getTokenList() client connected')
  })
  const tokenList = []
  const tokenInfo = await provider.request('contract_getTokenInfoList', 0, 100)
  tokenInfo.tokenInfoList.forEach(value => {
    const tokenSymbol = value.tokenSymbol.toString()
    const tokenId = value.tokenId.toString()
    if (!Number.isNaN(value.tokenSymbol)) {
      tokenList.push({
        label: tokenSymbol,
        value: tokenId,
      })
    }
  })

  return tokenList
}

function sendVcTx(vbInstance, ...args) {
  return vbInstance
    .sendCustomRequest({ method: 'vite_signAndSendTx', params: args })
    .then(signedBlock => signedBlock)
}

/**
 *
 */
export async function callContract(contract, methodName, inputParams, amount) {
  console.log('VBDAO: ATTEMPTING CALL TO CONTRACT')

  const vbInstance = getVbInstance()
  const block = await accountBlock.createAccountBlock('callContract', {
    address: vbInstance.accounts[0],
    abi: contract.abi,
    toAddress: contract.address,
    params: inputParams,
    methodName,
    amount: String(amount),
  })
  const callContractBlock = block.accountBlock

  return sendVcTx(vbInstance, { block: callContractBlock, abi: contract.abi })
}

/**
 *
 */
export async function subscribeToEvent(contract, eventName, functor) {
  console.log('VBDAO: ATTEMPTING SUBSCRIBE TO EVENT', eventName)
  const connection = new WS_RPC(VITE_WSS)
  const provider = new ViteAPI(connection, () => {
    console.log('VBDAO: subscribeToEvent() client connected')
  })
  const filterParams = { 'addressHeightRange': { [contract.address]: { 'fromHeight': '0', 'toHeight': '0' } } }
  const subscription = await provider.subscribe('createVmlogSubscription', filterParams).then(event => {
    event.on(res => {
      console.log('EVENT:', res)
      if (!Array.isArray(res)) return
      const sig = abi.encodeLogSignature(contract.abi, eventName)
      if (sig === res[0]['vmlog']['topics'][0]) {
        const data = Buffer.from(res[0]['vmlog']['data'], 'base64').toString('hex')
        const log = abi.decodeLog(contract.abi, data, sig, eventName)
        functor(log)
      }
    })
  }).catch(err => {
    console.log(err)
  })
  console.log('VBDAO: SUBSCRIBE TO EVENT SUCCESS', subscription)

  return subscription
}

// /**
//  *
//  */
//  export async function getNumProposals() {
//   const connection = new WS_RPC(VITE_WSS)
//   const provider = new ViteAPI(connection, () => {
//     console.log('client connected')
//   })
//   const offchainBinary = PROPOSAL_CONTRACT.getNumProposalsBinary
//
//   return JSON.stringify(await provider.request('contract_callOffChainMethod', offchainBinary))
// }

// const ab = accountBlock.createAccountBlock('send', {
//   address: account.address,
//   toAddress: address,
//   amount
// }).setProvider(provider).setPrivateKey(account.privateKey)
// await ab.autoSetPreviousAccountBlock()
// const result = await ab.sign().send()
