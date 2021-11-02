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
        class="connect-wallet-btn"
        v-bind="attrs"
        v-on="on"
      >
        Connect Vite Wallet
      </v-btn>
      <v-btn
        v-else
        color="success"
        class="wallet-connected"
        v-bind="attrs"
        v-on="on"
      >
        Wallet Connected
      </v-btn>
    </template>

    <v-card
      class="elevation-0"
      :width="!walletConnected ? '300' : '460'"
      :max-width="!walletConnected ? '300' : '460'"
    >
      <wallet-qr-canvas
        v-if="!walletConnected"
        class="wallet-card-qr-style"
        height="350px"
      >
      </wallet-qr-canvas>
      <wallet-account-info
        v-else
        class="wallet-connected-card-style"
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
import { mapState, mapGetters } from 'vuex'
import WalletQrCanvas from './WalletQRCanvas.vue'
import WalletAccountInfo from './WalletAccountInfo.vue'

export default {
  components: {
    WalletQrCanvas,
    WalletAccountInfo,
  },
  computed: {
    ...mapState([
      'walletConnected',
    ]),
    ...mapGetters(['getIsWalletConnected']),
  },
}
</script>

<style lang="scss" scoped>
.connect-wallet-btn {
    position: absolute;
    left: 15px;
    bottom: 25px;
}
.connect-wallet-btn {
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
.wallet-connected {
    position: absolute;
    left: 15px;
    bottom: 25px;
}
.wallet-connected {
  .v-application &.v-btn.v-btn--is-elevated {
    box-shadow: 0 1px 18px 1px #4DFFF9 !important;
    &:hover {
      box-shadow: none !important;
    }
  }
}
.wallet-connected-card-style {
  overflow: hidden;
  height: 75px;
  font-size: 10px;
}
</style>
