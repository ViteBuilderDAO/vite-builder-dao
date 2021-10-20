import Connector from '@vite/connector'

// url to vite connect server
const BRIDGE = 'wss://biforst.vite.net'
const vbInstance = new Connector({ bridge: BRIDGE })

export const getWalletConnectURI = async () => {
  await vbInstance.createSession()

  return vbInstance.uri
}

export const getVbInstance = () => vbInstance
