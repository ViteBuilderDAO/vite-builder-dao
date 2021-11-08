import PROPOSAL_CONTRACT from './proposalContractInfo'
import { callContract, subscribeToEvent, callContractOffChain } from '../contract/contractHelpers'

const { abi } = require('@vite/vitejs')

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
export async function getAllProposals() {
  const proposals = []
  getTotalNumProposals().then(numProposals => {
    if (numProposals) {
      console.log('VBDAO: TOTAL NUM PROPOSALS = ', numProposals.toString())
      for (let i = 0; i < numProposals; ++i) {
        getProposalByID(i).then(proposalObj => {
          if (proposalObj) {
            const decodedProposalObj = abi.decodeParameters(['address', 'string', 'string', 'string', 'string', 'uint', 'uint256[]', 'uint256[]', 'uint256[]', 'string', 'uint256[]', 'string', 'string', 'uint', 'uint256[]', 'uint256', 'uint256', 'string'], proposalObj)
            decodedProposalObj.proposalID = i
            proposals.push(decodedProposalObj)
          }
        })
      }
    }
  })

  return proposals
}

export async function getNumActiveProposals() {
  const numProposals = 0

  return numProposals
}

export async function getNumApprovedProposals() {
  const numProposals = 0

  return numProposals
}

export async function getNumRejectedProposals() {
  const numProposals = 0

  return numProposals
}

export async function getNumCancelledProposals() {
  const numProposals = 0

  return numProposals
}
