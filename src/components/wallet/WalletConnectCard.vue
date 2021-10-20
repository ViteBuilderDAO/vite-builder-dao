<template>
  <v-menu
    top
    offset-y
    content-class="elevation-9"
    open-on-hover
    close-delay="750"
    :close-on-content-click="false"
    eager
    transition="slide-y-reverse-transition"
    left
    nudge-top="15"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        v-if="!walletConnected"
        color="error"
        class="wallet-connect-card"
        href="#"
        target="_blank"
        rel="nofollow"
        v-bind="attrs"
        v-on="on"
      >
        Connect Vite Wallet
      </v-btn>
      <v-btn
        v-else
        color="success"
        class="wallet-connect-card"
        href="#"
        target="_blank"
        rel="nofollow"
        v-bind="attrs"
        v-on="on"
      >
        Wallet Connected
      </v-btn>
    </template>

    <v-card
      class="elevation-0"
      max-width="400"
    >
      <wallet-qr-canvas
        v-if="!walletConnected"
        class="wallet-card-qr-style"
        height="300px"
      >
      </wallet-qr-canvas>
      <wallet-account-info
        v-else
      >
      </wallet-account-info>
      <v-card-title
        v-if="!walletConnected"
        class="font-weight-semibold"
      >
        Connect with the Vite app to login
      </v-card-title>
      <v-card-text v-if="!walletConnected">
        The most developer friendly &amp;   highly customizable DAO Dashboard using Vite protocol based governance.
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex'
import WalletQrCanvas from './WalletQRCanvas.vue'
import WalletAccountInfo from './WalletAccountInfo.vue'

export default {
  components: {
    WalletQrCanvas,
    WalletAccountInfo,
  },
  computed: {
    ...mapState([
      'accounts',
    ]),
  },
}
</script>

<style lang="scss" scoped>
.wallet-connect-card {
    position: absolute;
    left: 15px;
    bottom: 25px;
}
.wallet-connect-card {
  .v-application &.v-btn.v-btn--is-elevated {
    box-shadow: 0 1px 20px 1px #ff4c51 !important;
    &:hover {
      box-shadow: none !important;
    }
  }
}
.wallet-card-qr-style {
    margin-left: 35px;
    margin-top: 15px;
}
</style>
