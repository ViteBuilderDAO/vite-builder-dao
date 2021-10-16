//  Used from https://docs.vite.org/go-vite/tutorial/sppguide/tutorials/hello-world.html
//  Test Contract:
//  pragma soliditypp ^0.4.3;
//  
//  contract HelloWorld {
//      event MyLog(address indexed addr, string log);
//  
//      onMessage sayHello(address dest) payable {
//          dest.transfer(msg.tokenid, msg.amount);
//          emit MyLog(dest, "Hello! Have some Vite!");
//      }
//  }
//
// Example Output can be found commented out at the bottom of this file 

const { WS_RPC } = require('@vite/vitejs-ws');
const { ViteAPI, wallet, utils, abi, accountBlock, keystore } =require('@vite/vitejs');

// test account
const seed = "turtle siren orchard alpha indoor indicate wasp such waste hurt patient correct true firm goose elegant thunder torch hurt shield taste under basket burger";

// connect to node
const connection = new WS_RPC('ws://localhost:23457');
const provider = new ViteAPI(connection, () => {
    console.log("client connected");
});
 
// derive account from seed phrase
const myAccount = wallet.getWallet(seed).deriveAddress(0);
const recipientAccount = wallet.getWallet(seed).deriveAddress(1);

// fill in contract info
const CONTRACT = {
    binary: '608060405234801561001057600080fd5b50610141806100206000396000f3fe608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806391a6cb4b14610046575b600080fd5b6100896004803603602081101561005c57600080fd5b81019080803574ffffffffffffffffffffffffffffffffffffffffff16906020019092919050505061008b565b005b8074ffffffffffffffffffffffffffffffffffffffffff164669ffffffffffffffffffff163460405160405180820390838587f1505050508074ffffffffffffffffffffffffffffffffffffffffff167faa65281f5df4b4bd3c71f2ba25905b907205fce0809a816ef8e04b4d496a85bb346040518082815260200191505060405180910390a25056fea165627a7a7230582095190ce167757b6308031ed4b9893929f96d866542f660a6918457a96dac7d870029',    // binary code
    abi: [{"constant":false,"inputs":[{"name":"addr","type":"address"}],"name":"sayHello","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"amount","type":"uint256"}],"name":"transfer","type":"event"}],                    // JSON ABI
    offChain: '',  // binary offchain code
    address: '',   // contract address
}

CONTRACT.address = 'vite_c1905cc76eaa02c02c564b2afa0639fab53a303cbef0599bd2';

async function receiveTransaction(account) {
    // get the first unreceived tx
    const data = await provider.request('ledger_getUnreceivedBlocksByAddress', account.address, 0, 1);
    if (!data || !data.length) {
        console.log('[LOG] No Unreceived Blocks');
        return;
    }
    // create a receive tx
    const ab = accountBlock.createAccountBlock('receive', {
        address: account.address,
        sendBlockHash: data[0].hash
    }).setProvider(provider).setPrivateKey(account.privateKey);

    await ab.autoSetPreviousAccountBlock();
    const result = await ab.sign().send();
    console.log('receive success', result);
}

async function sendTx(account, address ,amount) {
    const ab = accountBlock.createAccountBlock('send', {
        address: account.address,
        toAddress: address,
        amount
    }).setProvider(provider).setPrivateKey(account.privateKey);

    await ab.autoSetPreviousAccountBlock();
    const result = await ab.sign().send();
    console.log('send success', result);
}

async function callContract(account, methodName, abi, params, amount) {
    const block = accountBlock.createAccountBlock('callContract', {
        address: account.address,
        abi,
        methodName,
        amount,
        toAddress: CONTRACT.address,
        params
    }).setProvider(provider).setPrivateKey(account.privateKey);

    await block.autoSetPreviousAccountBlock();
    const result = await block.sign().send();
    console.log('call success', result);
}

async function main() {
    // call the contract we deployed and send over 150 VITE
    await callContract(myAccount, 'sayHello', CONTRACT.abi, [recipientAccount.address], '150000000000000000000');
    // send 10 VITE 
    await sendTx(myAccount, recipientAccount.address, '10000000000000000000');
    // recipient receives the tx
    await receiveTransaction(recipientAccount);
}

main().then(res => {}).catch(err => console.error(err));


//  user$ node helloworld.js 
//  client connected
//  call success {
//    blockType: 2,
//    address: 'vite_e8ff5e8fc9cbcfbeaddc46f0921bb7ae22ef4dc8b2f4542a1e',
//    fee: '0',
//    data: 'dSar2AAAAAAAAAAAAAAAA1RSgudqRzbtcZeH4ziQdUFAFaYA',
//    sendBlockHash: undefined,
//    toAddress: 'vite_a6fd116d7ea20d6431dc6ef2e4bcff8b79c227f0ea59f341e9',
//    tokenId: 'tti_5649544520544f4b454e6e40',
//    amount: '150000000000000000000',
//    height: '20',
//    previousHash: '8b5a2d9179e7046e6805330732e7b17199c96fc63628701832f8be48842f4d3b',
//    difficulty: undefined,
//    nonce: undefined,
//    hash: '8e09ea828ab9cd46f38da67282ad2c0479c7db81d67fa3c743f7438879067e55',
//    publicKey: 'gcw7RKJMHcSy1vxk8q7CGQVy0ezIQ9uIuUaStExUdA4=',
//    signature: 'V/IMrp7JWEcMYQxZ/1FSGMuYlkOCMiPbfp/vM0vyjOsejgm1Pd3iCRUiFZKDhG/fzRSuAe8kcBcIu5vX/iesCg=='
//  }
//  send success {
//    blockType: 2,
//    address: 'vite_e8ff5e8fc9cbcfbeaddc46f0921bb7ae22ef4dc8b2f4542a1e',
//    fee: undefined,
//    data: undefined,
//    sendBlockHash: undefined,
//    toAddress: 'vite_03545282e76a4736ed719787e3389075414015a6bc12ad6b49',
//    tokenId: 'tti_5649544520544f4b454e6e40',
//    amount: '10000000000000000000',
//    height: '21',
//    previousHash: '8e09ea828ab9cd46f38da67282ad2c0479c7db81d67fa3c743f7438879067e55',
//    difficulty: undefined,
//    nonce: undefined,
//    hash: 'e0c64b58bbd952d60ca8a988002b8a67cd30832589c66f981561314f2b4a90d0',
//    publicKey: 'gcw7RKJMHcSy1vxk8q7CGQVy0ezIQ9uIuUaStExUdA4=',
//    signature: 'YJSWUeLe0vAWx/CGa7ACPjomfp0Y+frruWOzcxGpHYXkU4Si1hmKz6JEPmr9nwzA4uuQhnttQyM/TMQ5N6sfBQ=='
//  }
//  receive success {
//    blockType: 4,
//    address: 'vite_03545282e76a4736ed719787e3389075414015a6bc12ad6b49',
//    fee: undefined,
//    data: undefined,
//    sendBlockHash: '986a85ed2bab6c9e3baaa42853a8c20ac1fe65badcb52fcfc99796d1fe631283',
//    toAddress: undefined,
//    tokenId: undefined,
//    amount: undefined,
//    height: '8',
//    previousHash: 'a4b5d865c40c15ed81bda93f3dee903d764930de1a128dfd0735e2937b217dfd',
//    difficulty: undefined,
//    nonce: undefined,
//    hash: '7ae726293178e9702c570ba2e651bca26dd8c6269696fca165b6a9207a4a191f',
//    publicKey: 'vJxY00O7PWwHcm3d++lPsJ3laPYtgrmTeucwUioZjiQ=',
//    signature: '/ZEE4rkz3c6mv4Prv/eaJh1lgkb8I/flcsRjoKDxgmY7XOHfTz+yQtbcqF8iUjLHS2px93mMun6t6yRmty2MDw=='
//  }
