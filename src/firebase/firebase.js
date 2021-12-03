import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
} from 'firebase/firestore'
import { getDatabase } from 'firebase/database'
import firebaseCredentials from './firebaseCredentials'

// const jc = require('json-cycle')

// Initialize Firebase
const app = initializeApp(firebaseCredentials.config)

export const database = getDatabase()
export const firestoreDB = getFirestore()

export const proposalsFirestore = collection(firestoreDB, 'proposals')
export const proposalStatsFirestore = collection(firestoreDB, 'proposal-stats')
export const votesFirestore = collection(firestoreDB, 'votes')

// export async function writeData(path, data) {
//   return set(ref(database, path), data)
// }

// export async function readData(path, callbackHandle) {
//   const readRef = ref(database, path);
//   onValue(readRef, snapshot => {
//     const data = snapshot.val()
//     callbackHandle(data)
//   })
// }

export async function addNewDoc(storeCollection, data) {
  return addDoc(storeCollection, data)
}

export async function getAllData(storeCollection) {
  return getDocs(storeCollection)
}

export async function getDataById(storeCollection, docID) {
  return getDoc(doc(storeCollection, docID))
}

export async function updateDocData(storeCollection, docID, newData) {
  return updateDoc(doc(storeCollection, docID), newData)
}

export default app
