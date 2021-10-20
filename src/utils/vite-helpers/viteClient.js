import WS_RPC from '@vite/vitejs-ws'
import { ViteAPI, abi as abiutils, wallet } from '@vite/vitejs'
import WalletAccount from '@/utils/vite-helpers/walletAccount'

const BigNumber = require('bignumber.js')

const VITE_TOKEN_ID = 'tti_5649544520544f4b454e6e40'
const WS_SERVER = 'ws://localhost:23457'

let viteClient
let mnemonicsDeriveIndex = 0

export function setupNode(inputServer, cb) {
  const server = inputServer || WS_SERVER
  const provider = new WS_RPC(server, 30 * 1000, {
    retryInterval: 100,
    retryTimes: 100,
  })

  viteClient = new ViteAPI(provider, cb)

  return viteClient
}

export function getVite() {
  return viteClient
}

export function createAccount(mnemonics, index = mnemonicsDeriveIndex) {
  const { privateKey } = wallet.deriveAddress({
    mnemonics,
    index,
  })
  const account = new WalletAccount({
    privateKey,
  })
  mnemonicsDeriveIndex = index + 1

  return account
}

export async function createContract(
  account,
  contract,
  amount,
  responseLatency,
  quotaMultiplier,
  randomDegree,
  params,
) {
  const createContractBlock = await account.createContract({
    amount: amount.toString(),
    hexCode: contract.bytecodes,
    quotaMultiplier: quotaMultiplier,
    responseLatency: responseLatency,
    randomDegree: randomDegree,
    abi: contract.abi,
    params: params,
  })

  return createContractBlock
}

export async function sendContractTx(
  account,
  contractAddress,
  abi,
  amount = 0,
  params,
  tokenId = VITE_TOKEN_ID,
) {
  console.log(params)
  const callContractBlock = await account.callContract({
    tokenId,
    amount: amount.toString(),
    abi: abi,
    params: params,
    toAddress: contractAddress,
  })

  return callContractBlock
}

export async function callOffchainMethod(
  contractAddress,
  abi,
  offchaincode,
  params,
) {
  const data = abiutils.encodeFunctionCall(abi, params)
  const dataBase64 = Buffer.from(data, 'hex').toString('base64')
  const result = await viteClient.request('contract_callOffChainMethod', {
    selfAddr: contractAddress,
    offChainCode: offchaincode,
    data: dataBase64,
  })
  if (result) {
    const resultBytes = Buffer.from(result, 'base64').toString('hex')
    const outputs = []
    for (let i = 0; i < abi.outputs.length; ++i) {
      outputs.push(abi.outputs[i].type)
    }
    const offchainDecodeResult = abiutils.decodeParameters(outputs, resultBytes)
    const resultList = []
    for (let i = 0; i < abi.outputs.length; ++i) {
      if (abi.outputs[i].name) {
        resultList.push({
          name: abi.outputs[i].name,
          value: offchainDecodeResult[i],
        })
      } else {
        resultList.push({
          name: '',
          value: offchainDecodeResult[i],
        })
      }
    }

    return resultList
  }

  return ''
}

export function transformTokenAmount(amount, units) {
  return new BigNumber(amount)
    .multipliedBy(new BigNumber(`1e${units || 0}`))
    .toFixed()
}

export function isSendBlock(blockType) {
  return (
    blockType === 1 || blockType === 2 || blockType === 3 || blockType === 6
  )
}

export function isReceiveBlock(blockType) {
  return blockType === 4 || blockType === 5 || blockType === 7
}
