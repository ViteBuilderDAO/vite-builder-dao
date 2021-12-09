import { query, orderBy, where } from 'firebase/firestore'
import {
  proposalsFirestore,
  proposalStatsFirestore,
  getAllData,
} from '@/firebase/firebase'

/**
 *
 */
export async function getAllProposalStats() {
  return getAllData(proposalStatsFirestore)
}

/**
 *
 */
export async function getAllProposals() {
  const sortedActiveProposalsQuery = query(proposalsFirestore, where('status', '==', 'Active'), orderBy('publishDate'))
  const sortedClosedProposalsQuery = query(proposalsFirestore, where('status', '==', 'Closed'), orderBy('endDate'))
  const activeProposals = await getAllData(sortedActiveProposalsQuery)
  const closedProposals = await getAllData(sortedClosedProposalsQuery)

  return [].concat(closedProposals.docs, activeProposals.docs)
}
