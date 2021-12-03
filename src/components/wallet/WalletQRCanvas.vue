<template>
  <canvas ref="qrcode"></canvas>
</template>

<script>
import QRCode from 'qrcode'
import { getWalletConnectURI, getVbInstance } from '@/utils/wallet/walletClient'
import WalletAccount from '@/utils/wallet/walletAccount'

const vbInst = getVbInstance()

export default {
  async mounted() {
    const uri = await getWalletConnectURI()
    this.generateQRCode(uri)
    vbInst.on('connect', (err, payload) => {
      const address = payload.params[0].accounts[0]
      this.$store.commit('setWalletConnected', true)
      this.$store.dispatch('addAccount', new WalletAccount({ address }))

      // this.$store.commit('initializeBalanceInfo')

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
