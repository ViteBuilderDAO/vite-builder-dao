<template>
  <div>
    <p class="subtitle-2 account-info-text">
      Wallet Address<br />
      {{ connectedWalletAddr }}
    </p>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState([
      'connectedWalletAddr',
    ]),
    ...mapGetters(['getConnectedWalletAddr']),
    getWalletBalance() {
      const { walletAddr } = this.connectedWalletAddr

      return walletAddr && walletAddr.balance
    },
  },
}
</script>

<style lang="scss" scoped>
.account-info-text {
  margin-top: 5px;
  text-align: center;
}
</style>
