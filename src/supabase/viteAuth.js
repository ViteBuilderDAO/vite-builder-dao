import Connector from '@vite/connector'

const BRIDGE = 'vite-connect-bridge ws server url';
const vbInstance = new Connector({ bridge: BRIDGE });

export const getViteURI = () =>
{
    vbInstance.createSession().then(() =>
    {
        // vbInstance.uri can be turn to an QR code image.
        // Then scan the QR code image with Vite App.
        //console.log('connect uri', vbInstance.uri)
        return vbInstance.uri;
    });
}

vbInstance.on('connect', (err, payload) =>
{
    /* 
     * Payload is an Object match the following interface:
     * Usually peer is the Vite App.
     *  {
     *      version: number,    // vite connector version, usually is 2
     *      peerId: string,     // can ignore
     *      peerMeta: {         // Vite App meta info, can show in the html
     *          bridgeVersion: number,
     *          description: string,
     *          url: string,
     *          icons: string[],
     *          name: string,
     *      },
     *      chainId: number,    // can ignore
     *      accounts: string[]  // the address get from Vite App.
     *  }
     * 
     */
    if(err)
    {
        throw new Error(err);
    }

    var payloadObj = JSON.parse(payload);
    if (!payloadObj || !payloadObj[0])
    {
        throw new Error('payload is null');
    }

    const { account } = payloadObj['accounts'];
    if (!account || !account[0])
    {
        throw new Error('address is null');
    }

    auth.createCustomToken(account).then((customToken) =>
    {
        auth.signInWithCustomToken(customToken)
        .then((userCredential) =>
        {
            // Signed in
            const userRef = firestore.collection('users').doc(userCredential.user.uid);
            userRef.set(
            {
                // peerMeta['name'];
                userName: payloadObj['peerMeta']['name'],
                // peerMeta['url'];
                userURL: payloadObj['peerMeta']['url'],
                // peerMeta['description'];
                userBio: payloadObj['peerMeta']['description'],
                // peerMeta['icons'];
                userIcons: payloadObj['peerMeta']['icons'],
                // Timestamp
                createdAt:firebase.firestore.FieldValue.serverTimestamp(),
                // Roles (admin, agent, user, etc)
                roles:{}
        
            },{merge:true})
            // ...
          });
    })
    .catch((error) =>
    {
        console.log('Error creating custom token:', error);
    });
})


vbInstance.on('disconnect', err =>
{
    if(err)
        console.log(err);
})


//export const loginWithVite = () =>
//{
//    auth.signInWithCustomToken(loginToken)
//}

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
