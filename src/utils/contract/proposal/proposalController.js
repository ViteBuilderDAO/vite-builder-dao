import PROPOSAL_CONTRACT from '@/utils/contract/proposal/proposalContractInfo'

const { WS_RPC } = require('@vite/vitejs-ws')
const { ViteAPI, constant, accountBlock } = require('@vite/vitejs')

const { viteTokenId } = constant

/**
 *
 * @param {Address} creator
 * @param {String} title
 * @param {String} description
 * @param {Uint} durationInDays
 */
export async function startProposal(creator, title, description, durationInDays) {
  const connection = new WS_RPC('ws://localhost:23457')
  const provider = new ViteAPI(connection, () => {
    console.log('client connected')
  })
  const ab = accountBlock.createAccountBlock('callContract', {
    address: PROPOSAL_CONTRACT.acctAddr,
    abi: PROPOSAL_CONTRACT.abi,
    toAddress: PROPOSAL_CONTRACT.address,
    amount: '0',
    tokenId: viteTokenId,
    methodName: 'startProposal',
    params: [creator, title, description, durationInDays],
  }).setProvider(provider).setPrivateKey(PROPOSAL_CONTRACT.acctPrivKey)
  await ab.autoSetPreviousAccountBlock()
  const startProposalCallResult = await ab.sign().send()
  console.log('startProposal call result: ', startProposalCallResult)
  let startProposalEvent
  try {
    startProposalEvent = JSON.stringify(await provider.subscribeToEvent(PROPOSAL_CONTRACT.address, 'ProposalStartedEvent'))
  } catch (err) {
    console.log(err)
  }
  console.log('ProposalStartedEvent response: ', startProposalEvent)

  return startProposalEvent.proposalID
}

/**
 *
 * @param {Address} contributor
 * @param {Uint256} proposalID
 * @param {Uint256} amountValue
 */
export async function contributeToProposal(contributor, proposalID, amountValue) {
  const connection = new WS_RPC('ws://localhost:23457')
  const provider = new ViteAPI(connection, () => {
    console.log('client connected')
  })
  const ab = accountBlock.createAccountBlock('callContract', {
    address: PROPOSAL_CONTRACT.acctAddr,
    abi: PROPOSAL_CONTRACT.abi,
    toAddress: PROPOSAL_CONTRACT.address,
    amount: '0',
    tokenId: viteTokenId,
    methodName: 'contribute',
    params: [contributor, proposalID, amountValue],
  }).setProvider(provider).setPrivateKey(PROPOSAL_CONTRACT.acctPrivKey)
  await ab.autoSetPreviousAccountBlock()
  const contributeToProposalCallResult = await ab.sign().send()
  console.log('contributeToProposal call result: ', contributeToProposalCallResult)
  let contributeToProposalEvent
  try {
    contributeToProposalEvent = JSON.stringify(await provider.subscribeToEvent(PROPOSAL_CONTRACT.address, 'ProposalContributionEvent'))
  } catch (err) {
    console.log(err)
  }
  console.log('ProposalContributionEvent response: ', contributeToProposalEvent)
}

/**
 *
 * @param {Uint256} proposalID
 */
export async function requestPayOutOnProposal(proposalID) {
  const connection = new WS_RPC('ws://localhost:23457')
  const provider = new ViteAPI(connection, () => {
    console.log('client connected')
  })
  const ab = accountBlock.createAccountBlock('callContract', {
    address: PROPOSAL_CONTRACT.acctAddr,
    abi: PROPOSAL_CONTRACT.abi,
    toAddress: PROPOSAL_CONTRACT.address,
    amount: '0',
    tokenId: viteTokenId,
    methodName: 'requestPayOutOnComplete',
    params: [proposalID],
  }).setProvider(provider).setPrivateKey(PROPOSAL_CONTRACT.acctPrivKey)
  await ab.autoSetPreviousAccountBlock()
  const requestPayOutOnCompleteCallResult = await ab.sign().send()
  console.log('requestPayOutOnComplete call result: ', requestPayOutOnCompleteCallResult)
  let requestPayOutOnCompleteEvent
  try {
    requestPayOutOnCompleteEvent = JSON.stringify(await provider.subscribeToEvent(PROPOSAL_CONTRACT.address, 'ProposalPaidEvent'))
  } catch (err) {
    console.log(err)
  }
  console.log('ProposalPaidEvent response: ', requestPayOutOnCompleteEvent)
}

// const ab = accountBlock.createAccountBlock('send', {
//   address: account.address,
//   toAddress: address,
//   amount
// }).setProvider(provider).setPrivateKey(account.privateKey)
// await ab.autoSetPreviousAccountBlock()
// const result = await ab.sign().send()
