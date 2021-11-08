<template>
  <canvas ref="qrcode"></canvas>
</template>

<script>
import QRCode from 'qrcode'
import { getWalletConnectURI, getVbInstance } from '@/utils/wallet/walletClient'
import WalletAccount from '@/utils/wallet/walletAccount'

export default {
  async mounted() {
    const uri = await getWalletConnectURI()
    this.generateQRCode(uri)
    const vbInst = getVbInstance()
    vbInst.on('connect', (err, payload) => {
      if (err) {
        return console.log(err)
      }
      const address = payload.params[0].accounts[0]
      this.$store.commit('setWalletConnected', true)
      this.$store.dispatch('addAccount', new WalletAccount({ address }))

      return console.log('Vite wallet connected')
    })
    vbInst.on('disconnect', () => {
      this.$store.commit('setWalletConnected', false)
    })
  },
  methods: {
    generateQRCode(uri) {
      QRCode.toCanvas(this.$refs.qrcode, uri)
    },
  },
}
</script>
