import PROPOSAL_CONTRACT from '@/utils/contract/proposal/proposalContractInfo'
import { callContract } from '../contractHelpers' /* subscribeToEvent */

/**
 *
 * @param {Array} proposalParams
 */
export async function startProposal(proposalParams, startedCallback) {
  // await subscribeToEvent(PROPOSAL_CONTRACT, 'ProposalStartedEvent', startedCallback)
  console.log(startedCallback)

  return callContract(PROPOSAL_CONTRACT, 'startProposal', proposalParams, 0)
}

/**
 *
 * @param {Array} voteParams
 */
export async function voteOnProposal(voteParams, votedCallback) {
  // await subscribeToEvent(PROPOSAL_CONTRACT, 'ProposalVotedOnEvent', votedCallback)
  console.log(votedCallback)

  return callContract(PROPOSAL_CONTRACT, voteParams.voter, 'voteOnProposal', voteParams, 0)
}

/**
 *
 */
export async function stopProposalEarly(proposalID, walletAcct, endedCallback, resultsCallback) {
  // await subscribeToEvent(PROPOSAL_CONTRACT, 'ProposalEndedEvent', endedCallback)
  // await subscribeToEvent(PROPOSAL_CONTRACT, 'ProposalResultsCalculated', resultsCallback)
  console.log(endedCallback, resultsCallback)

  return callContract(PROPOSAL_CONTRACT, walletAcct, 'stopProposalEarly', [proposalID], 0)
}
