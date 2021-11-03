import PROPOSAL_CONTRACT from '@/utils/contract/proposal/proposalContractInfo'
import { callContract, subscribeToEvent } from '../contractHelpers'

/**
 *
 * @param {Array} proposalParams
 */
export async function startProposal(proposalParams, startedCallback) {
  await subscribeToEvent(PROPOSAL_CONTRACT, 'ProposalStartedEvent', startedCallback)

  return callContract(PROPOSAL_CONTRACT, 'startProposal', proposalParams, 0)
}

/**
 *
 * @param {Array} voteParams
 */
export async function voteOnProposal(voteParams, votedCallback) {
  await subscribeToEvent(PROPOSAL_CONTRACT, 'ProposalVotedOnEvent', votedCallback)

  return callContract(PROPOSAL_CONTRACT, 'voteOnProposal', voteParams, 0)
}

/**
 *
 */
export async function stopProposalEarly(proposalID, endedCallback, resultsCallback) {
  await subscribeToEvent(PROPOSAL_CONTRACT, 'ProposalEndedEvent', endedCallback)
  await subscribeToEvent(PROPOSAL_CONTRACT, 'ProposalResultsCalculated', resultsCallback)

  return callContract(PROPOSAL_CONTRACT, 'stopProposalEarly', [proposalID], 0)
}
