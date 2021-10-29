import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'
import 'firebase/database'
import 'firebase/performance'
import firebaseCredentials from './firebaseCredentials';

// Initialize Firebase
firebase.initializeApp(firebaseCredentials.config);
export const firestore = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const perf = firebase.performance();
export const db = firebase.database();
export default firebase;

//// Github Auth
//export const githubProvider = new firebase.auth.GithubAuthProvider();
//export const loginWithGithub = () =>
//{
//	//auth.signInWithPopup(githubProvider).catch(alert);
//	auth.signInWithRedirect(githubProvider);
//}
//
//// Store our user auth info
//export const CreateUserProfileDocument = () =>
//{
//	const userRef = firestore.collection('users').doc(auth.currentUser.uid);
//	userRef.set(
//	{
//        // peerMeta['name'];
//		userName: auth.currentUser.displayName,
//        // peerMeta['url'];
//		userURL: auth.currentUser.email,
//        // peerMeta['description'];
//		userAddress: auth.currentUser.phoneNumber,
//        // peerMeta['icons'];
//		userIcons: auth.currentUser.photoURL,
//        // Timestamp
//		createdAt:firebase.firestore.FieldValue.serverTimestamp(),
//        // Roles (admin, agent, user, etc)
//		roles:{}
//
//	},{merge:true})
//}