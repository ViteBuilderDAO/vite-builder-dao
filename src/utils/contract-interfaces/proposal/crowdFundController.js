import CROWDFUND_CONTRACT from '@/utils/contract-interfaces/proposal/crowdfundContractInfo'

const { WS_RPC } = require('@vite/vitejs-ws')
const { ViteAPI, constant, accountBlock } = require('@vite/vitejs')

const { viteTokenId } = constant
const connection = new WS_RPC('ws://localhost:23457')
const provider = new ViteAPI(connection, () => {
  console.log('client connected')
})

/**
 *
 * @param {Address} creator
 * @param {String} title
 * @param {String} description
 * @param {Uint} durationInDays
 */
export async function startProposal(creator, title, description, durationInDays) {
  const ab = accountBlock.createAccountBlock('vmdebug_callContract', {
    address: CROWDFUND_CONTRACT.acctAddr,
    abi: CROWDFUND_CONTRACT.abi,
    toAddress: CROWDFUND_CONTRACT.address,
    amount: '0',
    tokenId: viteTokenId,
    method: 'startProposal',
    params: [creator, title, description, durationInDays],
  }).setProvider(provider).setPrivateKey(CROWDFUND_CONTRACT.acctPrivKey)
  await ab.autoSetPreviousAccountBlock()
  const startProposalCallResult = await ab.sign().send()
  console.log('startProposal call result: ', startProposalCallResult)
  let startProposalEvent
  try {
    startProposalEvent = await provider.subscribeToEvent(CROWDFUND_CONTRACT.address, 'ProposalStartedEvent')
  } catch (err) {
    console.log(err)
  }
  console.log('ProposalStartedEvent response: ', JSON.stringify(startProposalEvent))
}

/**
 *
 * @param {Address} contributor
 * @param {Uint256} proposalID
 * @param {Uint256} amountValue
 */
export async function contributeToProposal(contributor, proposalID, amountValue) {
  const ab = accountBlock.createAccountBlock('vmdebug_callContract', {
    address: CROWDFUND_CONTRACT.acctAddr,
    abi: CROWDFUND_CONTRACT.abi,
    toAddress: CROWDFUND_CONTRACT.address,
    amount: '0',
    tokenId: viteTokenId,
    method: 'contribute',
    params: [contributor, proposalID, amountValue],
  }).setProvider(provider).setPrivateKey(CROWDFUND_CONTRACT.acctPrivKey)
  await ab.autoSetPreviousAccountBlock()
  const contributeToProposalCallResult = await ab.sign().send()
  console.log('contributeToProposal call result: ', contributeToProposalCallResult)
  let contributeToProposalEvent
  try {
    contributeToProposalEvent = await provider.subscribeToEvent(CROWDFUND_CONTRACT.address, 'ProposalContributionEvent')
  } catch (err) {
    console.log(err)
  }
  console.log('ProposalContributionEvent response: ', JSON.stringify(contributeToProposalEvent))
}

/**
 *
 * @param {Uint256} proposalID
 */
export async function requestPayOutOnProposal(proposalID) {
  const ab = accountBlock.createAccountBlock('vmdebug_callContract', {
    address: CROWDFUND_CONTRACT.acctAddr,
    abi: CROWDFUND_CONTRACT.abi,
    toAddress: CROWDFUND_CONTRACT.address,
    amount: '0',
    tokenId: viteTokenId,
    method: 'requestPayOutOnComplete',
    params: [proposalID],
  }).setProvider(provider).setPrivateKey(CROWDFUND_CONTRACT.acctPrivKey)
  await ab.autoSetPreviousAccountBlock()
  const requestPayOutOnCompleteCallResult = await ab.sign().send()
  console.log('requestPayOutOnComplete call result: ', requestPayOutOnCompleteCallResult)
  let requestPayOutOnCompleteEvent
  try {
    requestPayOutOnCompleteEvent = await provider.subscribeToEvent(CROWDFUND_CONTRACT.address, 'ProposalPaidEvent')
  } catch (err) {
    console.log(err)
  }
  console.log('ProposalPaidEvent response: ', JSON.stringify(requestPayOutOnCompleteEvent))
}

// const ab = accountBlock.createAccountBlock('send', {
//   address: account.address,
//   toAddress: address,
//   amount
// }).setProvider(provider).setPrivateKey(account.privateKey)
// await ab.autoSetPreviousAccountBlock()
// const result = await ab.sign().send()
