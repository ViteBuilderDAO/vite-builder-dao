<template>
  <QRCanvas
    :options="options"
    @beforeUpdate="onBeforeUpdate"
    @updated="onUpdated"
  />
</template>

<script>
import { QRCanvas } from 'qrcanvas-vue'
import { getWalletConnectURI, getVbInstance } from '@/utils/vite-helpers/walletClient'
import WalletAccount from '@/utils/vite-helpers/walletAccount'

export default {
  components: {
    QRCanvas,
  },
  data() {
    return {
      options: {
        data: {
          initQRCode() {
            return getWalletConnectURI()
          },
        },
      },
    }
  },
  async mounted() {
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
    onBeforeUpdate() {
      console.log('beforeUpdate')
    },
    onUpdated() {
      console.log('updated')
    },
  },
}
</script>
