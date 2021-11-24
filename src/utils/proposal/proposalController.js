import { query, orderBy } from 'firebase/firestore'
import PROPOSAL_CONTRACT from './proposalContractInfo'
import { callContract, callContractOffChain } from '../contract/contractHelpers'
import {
  proposalsFirestore,
  votesFirestore,
  resultsFirestore,
  getAllData,
  getDataById,
  updateDocData,
} from '@/firebase/firebase'

// import { subscribeToEvent } from '../contract/contractHelpers'

/**
 *
 */
async function _calculateResults(proposalObj) {
  console.log('_calculateResults')
  getDataById(votesFirestore, proposalObj.voteStatsID).then(dataRes => {
    let status = ''
    if (dataRes) {
      const proposalResults = {
        winningOptionName: '',
        winningOptionTotalVotes: 0,
        winningOptionVotingPower: 0,
        finalState: '',
      }
      const votesData = dataRes.data()
      if (votesData.totalVotes > 0) {
        votesData.optionStats.forEach((val, index) => {
          if (proposalResults.winningOptionTotalVotes < val.optionTotalVotes) {
            proposalResults.winningOptionName = proposalObj.options[index].optionName
            if (index === (proposalObj.numOptions - 1)) {
              proposalResults.finalState = 'Rejected'
            } else {
              proposalResults.finalState = 'Approved'
            }
            status = proposalResults.finalState
            proposalResults.winningOptionVotingPower = val.optionTotalVotingPower
            proposalResults.winningOptionTotalVotes = val.optionTotalVotes
          }
        })

        updateDocData(resultsFirestore, proposalObj.proposalID, proposalResults)
        console.log('_calculateResults Results Doc Updated - proposalResults: ', proposalResults)
      } else {
        status = 'Cancelled'
      }
    }

    return status
  })
}

/**
 *
 */
export async function startProposal(proposalParams) {
  // await subscribeToEvent(PROPOSAL_CONTRACT, 'ProposalStartedEvent', startedCallback)

  return callContract(PROPOSAL_CONTRACT, 'startProposal', proposalParams, 0)
}

/**
 *
 */
export async function voteOnProposal(voteParams) {
  // await subscribeToEvent(PROPOSAL_CONTRACT, 'ProposalVotedOnEvent', votedCallback)

  return callContract(PROPOSAL_CONTRACT, 'voteOnProposal', voteParams, 0)
}

/**
 *
 */
export async function parseProposal(proposalDoc) {
  let proposalObj = []
  if (proposalDoc) {
    proposalObj = proposalDoc.data()
    proposalObj.proposalID = proposalDoc.id

    if (new Date() > new Date(proposalObj.endDate)) {
      proposalObj.status = await _calculateResults(proposalObj)
    }

    // else {
    //
    //   proposals.push({ data: proposalDoc.data(), id: proposalDoc.id })
    // }
  }

  return proposalObj
}

// /**
//  *
//  */
// export async function stopProposal(proposalID) {
//   // await subscribeToEvent(PROPOSAL_CONTRACT, 'ProposalEndedEvent', endedCallback)
//   // await subscribeToEvent(PROPOSAL_CONTRACT, 'ProposalResultsCalculated', resultsCallback)
//
//   return callContract(PROPOSAL_CONTRACT, 'stopProposal', [proposalID], 0)
// }
//
// /**
//  *
//  */
// export async function stopProposalEarly(proposalID) {
//   // await subscribeToEvent(PROPOSAL_CONTRACT, 'ProposalEndedEvent', endedCallback)
//   // await subscribeToEvent(PROPOSAL_CONTRACT, 'ProposalResultsCalculated', resultsCallback)
//
//   return callContract(PROPOSAL_CONTRACT, 'stopProposalEarly', [proposalID], 0)
// }

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
export async function getAllProposals() {
  const sortedProposalsQuery = query(proposalsFirestore, orderBy('publishDate'))

  return getAllData(sortedProposalsQuery)
}
