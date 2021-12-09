import Connector from '@vite/connector'
import eventBus from '@/utils/events/eventBus'

// url to vite connect server

export default async () => {
  const BRIDGE = 'wss://biforst.vite.net'
  const vbInstance = new Connector({ bridge: BRIDGE })

  vbInstance.on('connect', (err, payload) => {
    if (err) {
      console.log(err.message)
    }
    eventBus.$emit('vite-wallet-connected', { payload: payload })
    console.log('Vite Wallet Connected')
  })

  vbInstance.on('disconnect', err => {
    if (err) {
      console.log(err.message)
    }
    eventBus.$emit('vite-wallet-disconnected')
    console.log('Vite Wallet Disconnected')
  })

  return vbInstance
}
