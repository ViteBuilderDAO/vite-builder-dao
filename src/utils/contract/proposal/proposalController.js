import PROPOSAL_CONTRACT from '@/utils/contract/proposal/proposalContractInfo'

const { WS_RPC } = require('@vite/vitejs-ws')
const { ViteAPI, accountBlock } = require('@vite/vitejs')

/**
 *
 */
 export async function getTokenList() {
  const connection = new WS_RPC('ws://localhost:23457')
  const provider = new ViteAPI(connection, () => {
    console.log('client connected')
  })

  return JSON.stringify(await provider.request('contract_getTokenInfoList', 0, 1000))
}

/**
 *
 * @param {Address} creator
 * @param {String} title
 * @param {String} description
 * @param {Uint} durationInDays
 */
export async function startProposal(creator, tokenID, title, description, durationInDays) {
  const connection = new WS_RPC('ws://localhost:23457')
  const provider = new ViteAPI(connection, () => {
    console.log('client connected')
  })
  const ab = accountBlock.createAccountBlock('callContract', {
    address: PROPOSAL_CONTRACT.acctAddr,
    abi: PROPOSAL_CONTRACT.abi,
    toAddress: PROPOSAL_CONTRACT.address,
    amount: '0',
    tokenId: tokenID,
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
export async function voteOnProposal(contributor, tokenID, proposalID, amountValue) {
  const connection = new WS_RPC('ws://localhost:23457')
  const provider = new ViteAPI(connection, () => {
    console.log('client connected')
  })
  const ab = accountBlock.createAccountBlock('callContract', {
    address: PROPOSAL_CONTRACT.acctAddr,
    abi: PROPOSAL_CONTRACT.abi,
    toAddress: PROPOSAL_CONTRACT.address,
    amount: '0',
    tokenId: tokenID,
    methodName: 'voteOnProposal',
    params: [contributor, proposalID, amountValue],
  }).setProvider(provider).setPrivateKey(PROPOSAL_CONTRACT.acctPrivKey)
  await ab.autoSetPreviousAccountBlock()
  const voteOnProposalCallResult = await ab.sign().send()
  console.log('voteOnProposal call result: ', voteOnProposalCallResult)
  let voteOnProposalEvent
  try {
    voteOnProposalEvent = JSON.stringify(await provider.subscribeToEvent(PROPOSAL_CONTRACT.address, 'ProposalContributionEvent'))
  } catch (err) {
    console.log(err)
  }
  console.log('ProposalContributionEvent response: ', voteOnProposalEvent)
}

/**
 *
 * @param {Uint256} proposalID
 */
export async function stopProposalEarly(proposalID, tokenID) {
  const connection = new WS_RPC('ws://localhost:23457')
  const provider = new ViteAPI(connection, () => {
    console.log('client connected')
  })
  const ab = accountBlock.createAccountBlock('callContract', {
    address: PROPOSAL_CONTRACT.acctAddr,
    abi: PROPOSAL_CONTRACT.abi,
    toAddress: PROPOSAL_CONTRACT.address,
    amount: '0',
    tokenId: tokenID,
    methodName: 'stopProposalEarly',
    params: [proposalID],
  }).setProvider(provider).setPrivateKey(PROPOSAL_CONTRACT.acctPrivKey)
  await ab.autoSetPreviousAccountBlock()
  const stopProposalEarlyResult = await ab.sign().send()
  console.log('stopProposalEarly call result: ', stopProposalEarlyResult)
  let stopProposalEarlyEvent
  try {
    stopProposalEarlyEvent = JSON.stringify(await provider.subscribeToEvent(PROPOSAL_CONTRACT.address, 'ProposalEndedEvent'))
  } catch (err) {
    console.log(err)
  }
  console.log('ProposalEndedEvent response: ', stopProposalEarlyEvent)
}

// const ab = accountBlock.createAccountBlock('send', {
//   address: account.address,
//   toAddress: address,
//   amount
// }).setProvider(provider).setPrivateKey(account.privateKey)
// await ab.autoSetPreviousAccountBlock()
// const result = await ab.sign().send()
