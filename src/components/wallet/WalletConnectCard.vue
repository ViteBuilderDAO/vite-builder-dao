<template>
  <v-menu
    bottom
    offset-y
    content-class="elevation-9"
    open-on-hover
    close-delay="500"
    :close-on-content-click="false"
    eager
    transition="slide-y-reverse-transition"
    nudge-bottom="15"
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
        v-if="!walletConnected && walletURI !== ''"
        class="wallet-card-qr-style"
        height="350px"
        :walletURI="walletURI"
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
        Connect with the Vite app
      </v-card-title>
    </v-card>
  </v-menu>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import WalletQrCanvas from './WalletQRCanvas.vue'
import WalletAccountInfo from './WalletAccountInfo.vue'
import eventBus from '@/utils/events/eventBus'
import getWalletConnectURI from '@/utils/wallet/walletClient'
import WalletAccount from '@/utils/wallet/walletAccount'

export default {

  components: {
    WalletQrCanvas,
    WalletAccountInfo,
  },

  data() {
    return {
      walletURI: '',
    }
  },

  computed: {
    ...mapState([
      'walletConnected',
    ]),
    ...mapGetters([
      'getIsWalletConnected',
    ]),
  },

  async mounted() {
    this.initWalletQR()
    eventBus.$on('vite-wallet-connected', eventData => {
      const address = eventData.payload.params[0].accounts[0]
      this.$store.commit('setWalletConnected', true)
      this.$store.dispatch('addAccount', new WalletAccount({ address }))
    })
    eventBus.$on('vite-wallet-disconnected', () => {
      this.walletURI = ''
      this.$store.commit('setWalletConnected', false)
      this.initWalletQR()
    })
  },

  beforeDestroy() {
    // removing eventBus listeners
    eventBus.$off('vite-wallet-connected')
    eventBus.$off('vite-wallet-disconnected')
  },

  methods: {

    async initWalletQR() {
      const vbInstance = await getWalletConnectURI()
      if (!this.walletConnected) {
        await vbInstance.createSession()
        this.walletURI = vbInstance.uri
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.connect-wallet-btn {
  transform: scale(90%);
  .v-application &.v-btn.v-btn--is-elevated {
    box-shadow: 0 1px 20px 1px #8655fd!important;
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
