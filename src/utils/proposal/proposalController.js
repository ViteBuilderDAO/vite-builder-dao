import { query, orderBy } from 'firebase/firestore'
import {
  proposalsFirestore,
  proposalStatsFirestore,
  getAllData,
} from '@/firebase/firebase'

/**
 *
 */
export async function getAllProposalStats() {
  // return callContractOffChain(PROPOSAL_CONTRACT, 'getProposalStats', [])
  return getAllData(proposalStatsFirestore)
}

/**
 *
 */
export async function getAllProposals() {
  const sortedProposalsQuery = query(proposalsFirestore, orderBy('publishDate'))

  return getAllData(sortedProposalsQuery)
}
