<template>
  <canvas ref="qrcode"></canvas>
</template>

<script>
import QRCode from 'qrcode'

export default {
  props: {
    walletURI: { type: String, default: '' },
  },

  mounted() {
    if (this.walletURI !== '') {
      QRCode.toCanvas(this.$refs.qrcode, this.walletURI)
    }
  },
}
</script>
