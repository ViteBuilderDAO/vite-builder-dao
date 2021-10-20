import Connector from '@vite/connector'

// url to vite connect server
const BRIDGE = 'http://192.168.31.82:5001'
const vbInstance = new Connector({ bridge: BRIDGE })

export const getWalletConnectURI = async () => {
  await vbInstance.createSession()

  return vbInstance.uri
}

export const getVbInstance = () => vbInstance
