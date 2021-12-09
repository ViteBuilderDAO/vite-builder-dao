const { WS_RPC } = require('@vite/vitejs-ws')
const { ViteAPI, abi } = require('@vite/vitejs')

// const { accountBlock } = require('@vite/vitejs')
// import { getVbInstance } from '@/utils/wallet/walletClient'

const TEST_WS_NET = 'wss://buidl.vite.net/gvite/ws'

// const LIVE_WS_NET = 'wss://node.vite.net/gvite/ws'

const VITE_WSS = process.env.NODE_ENV === 'production' ? TEST_WS_NET : TEST_WS_NET

/**
 *
 */
export function getWalletBalanceInfo(walletAddr) {
  console.log('VBDAO: GET WALLET BALANCE BY TOKEN REQUEST')
  const connection = new WS_RPC(VITE_WSS)
  const provider = new ViteAPI(connection, () => {
    console.log('VBDAO: getWalletBalanceByToken() client connected')
  })

  if (walletAddr) {
    return provider.getBalanceInfo(walletAddr)
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

// /**
//  *
//  */
// function sendVcTx(vbInstance, ...args) {
//   return vbInstance
//     .sendCustomRequest({ method: 'vite_signAndSendTx', params: args })
//     .then(signedBlock => signedBlock)
// }

// /**
//  *
//  */
// export async function callContract(contract, methodName, inputParams, amount) {
//   console.log('VBDAO: ATTEMPTING CALL TO CONTRACT')
//
//   const vbInstance = getVbInstance()
//
//   // const quotaInfo = getQuotaByAccount()
//   // let currentQuota = 0
//   // let stakeAmount = 0
//   // quotaInfo.forEach(value => {
//   //   currentQuota = value.currentQuota
//   //   console.log('VBDAO: getQuotaByAccount - currentQuota: ', currentQuota)
//   //   console.log('VBDAO: getQuotaByAccount - maxQuota: ', value.maxQuota)
//   //   stakeAmount = value.stakeAmount
//   //   console.log('VBDAO: getQuotaByAccount - stakeAmount: ', stakeAmount)
//   // })
//
//   // if (stakeAmount <= 0) {
//   //   stakeQuotaForContract(vbInstance, contract, 134)
//   // }
//
//   const block = await accountBlock.createAccountBlock('callContract', {
//     address: vbInstance.accounts[0],
//     abi: contract.abi,
//     toAddress: contract.address,
//     params: inputParams,
//     methodName,
//     amount: String(amount),
//   })
//   const callContractBlock = block.accountBlock
//
//   return sendVcTx(vbInstance, { block: callContractBlock, abi: contract.abi })
// }

/**
 *
 */
export async function callContractOffChain(contract, methodName, inputParams) {
  console.log('VBDAO: ATTEMPTING OFF-CHAIN CALL TO CONTRACT')
  const connection = new WS_RPC(VITE_WSS)
  const provider = new ViteAPI(connection, () => {
    console.log('VBDAO: callContractOffChain() client connected')
  })

  const encodedFuncCall = abi.encodeFunctionCall(contract.abi, inputParams, methodName)
  const dataBuf = Buffer.from(encodedFuncCall, 'hex').toString('base64')
  const code = Buffer.from(contract.offChain, 'hex').toString('base64')

  const offchainResult = await provider.request('contract_callOffChainMethod', {
    address: contract.address,
    code,
    data: dataBuf,
  }).then(result => {
    console.log('VBDAO: SUCCESS - OFF-CHAIN CONTRACT CALL ')

    return result
  }).catch(err => {
    console.log('VBDAO: ERROR - OFF-CHAIN CONTRACT CALL: ', err)
  })

  const resultDataBuf = Buffer.from(offchainResult, 'base64').toString('hex')
  const abiOutputs = contract.abi.find(x => x.name === methodName).outputs
  let decodedParams = null
  decodedParams = abi.decodeParameters(abiOutputs, resultDataBuf)

  return decodedParams
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

/**
 *
 */
// async function getContractInfo(address) {
//   console.log('VBDAO: GET TOKEN INFO REQUEST')
//   const connection = new WS_RPC(VITE_WSS)
//   const provider = new ViteAPI(connection, () => {
//     console.log('VBDAO: getContractInfo() client connected')
//   })
//
//   return await provider.request('contract_getContractInfo', address)
// }

// /**
//  *
//  */
// async function getQuotaByAccount(address) {
//   console.log('VBDAO: GET TOKEN INFO REQUEST')
//   const connection = new WS_RPC(VITE_WSS)
//   const provider = new ViteAPI(connection, () => {
//     console.log('VBDAO: getQuotaByAccount() client connected')
//   })
//
//   return await provider.request('contract_getQuotaByAccount', address)
// }

/**
 *
 */
// export async function stakeQuotaForContract(vbInstance, contract, stakeAmount) {
//   console.log('VBDAO: ATTEMPTING CALL TO CONTRACT')
//
//   const contractInfo = getContractInfo(contract.address)
//   const quotaMult = 1
//   contractInfo.forEach(value => {
//     quotaMult = value.quotaMultiplier
//   })
//
//   const stakeAmount = stakeAmount * quotaMult
//   stakeQuotaForContract(vbInstance, contract, stakeAmount).then(result => {
//     console.log('VBDAO: QUOTA STAKING SUCCESS: ', result)
//   }).catch(err => {
//     console.log('VBDAO: ERROR - QUOTA STAKING: ', err)
//   })
//
//   const block = await accountBlock.createAccountBlock('stakeForQuota', {
//     address: vbInstance.accounts[0],
//     beneficiaryAddress: contract.address,
//     amount: stakeAmount.toString()
//   })
//   const stakeQuotaBlock = block.accountBlock
//
//   return sendVcTx(vbInstance, { block: stakeQuotaBlock, abi: contract.abi })
// }

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
