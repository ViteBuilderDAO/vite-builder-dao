import { query, orderBy } from 'firebase/firestore'
import PROPOSAL_CONTRACT from './proposalContractInfo'
import { callContract, subscribeToEvent, callContractOffChain } from '../contract/contractHelpers'
import { proposalsFirestore, getAllData } from '@/firebase/firebase'

/**
 *
 */
export async function startProposal(proposalParams, startedCallback) {
  await subscribeToEvent(PROPOSAL_CONTRACT, 'ProposalStartedEvent', startedCallback)

  return callContract(PROPOSAL_CONTRACT, 'startProposal', proposalParams, 0)
}

/**
 *
 */
export async function voteOnProposal(voteParams, votedCallback) {
  await subscribeToEvent(PROPOSAL_CONTRACT, 'ProposalVotedOnEvent', votedCallback)

  return callContract(PROPOSAL_CONTRACT, 'voteOnProposal', voteParams, 0)
}

/**
 *
 */
export async function stopProposal(proposalID, endedCallback, resultsCallback) {
  await subscribeToEvent(PROPOSAL_CONTRACT, 'ProposalEndedEvent', endedCallback)
  await subscribeToEvent(PROPOSAL_CONTRACT, 'ProposalResultsCalculated', resultsCallback)

  return callContract(PROPOSAL_CONTRACT, 'stopProposal', [proposalID], 0)
}

/**
 *
 */
export async function stopProposalEarly(proposalID, endedCallback, resultsCallback) {
  await subscribeToEvent(PROPOSAL_CONTRACT, 'ProposalEndedEvent', endedCallback)
  await subscribeToEvent(PROPOSAL_CONTRACT, 'ProposalResultsCalculated', resultsCallback)

  return callContract(PROPOSAL_CONTRACT, 'stopProposalEarly', [proposalID], 0)
}

/**
 *
 */
export async function getTotalNumProposals() {
  return callContractOffChain(PROPOSAL_CONTRACT, 'getNumProposals')
}

/**
 *
 */
export async function getProposalByID(proposalID) {
  return callContractOffChain(PROPOSAL_CONTRACT, 'getProposalByID', [proposalID])
}

/**
 *
 */
export async function getIsProposalComplete(proposalID) {
  return callContractOffChain(PROPOSAL_CONTRACT, 'getIsProposalComplete', [proposalID])
}

/**
 *
 */
export async function checkIfVotedPreviously(voter, proposalID) {
  return callContractOffChain(PROPOSAL_CONTRACT, 'checkIfVotedPreviously', [voter, proposalID])
}

/**
 *
 */
export async function getAllProposalStats() {
  return callContractOffChain(PROPOSAL_CONTRACT, 'getProposalStats', [])
}

/**
 *
 */
export async function getProposalVotingStats(proposalID) {
  return callContractOffChain(PROPOSAL_CONTRACT, 'getProposalVotingStats', [proposalID])
}

/**
 *
 */
export async function getProposalStatus(docId) {
  let status
  await getProposalByID(docId).then(proposal => {
    if (proposal) {
      // console.log('proposal', proposal)
      // console.log('proposalsFirestore', proposalObj)
      // console.log('proposal[0]', proposal[0])
      // proposalObj.publishDate = proposal[2].value
      // proposalObj.deadline = proposal[3].value
      // proposalObj.blocksSinceCreation = proposal[4].value
      // proposalObj.totalVotingPower = proposal[5]
      // proposalObj.totalVotes = proposal[6]
      status = proposal[6]
    }
    console.log('status', status)

    return status
  })
}

/**
 *
 */
export async function getAllProposals() {
  const proposals = []
  const sortedQuery = query(proposalsFirestore, orderBy('publishDate'))
  await getAllData(sortedQuery).then(allProposals => {
    allProposals.forEach(doc => {
      proposals.push({ data: doc.data(), id: doc.id })

      // if (new Date() < doc.data().endDate) {
      //   proposals.push({ data: doc.data(), id: doc.id })
      // }
      // else {
      //
      //   proposals.push({ data: doc.data(), id: doc.id })
      // }
    })
  })

  return proposals
}
