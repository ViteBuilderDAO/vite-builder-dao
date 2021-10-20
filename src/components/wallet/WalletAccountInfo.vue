<template>
  <div>
    <p class="subtitle-2 account-info-text">
      Wallet Address<br />
      {{ selectedAddress }}
    </p>
  </div>
</template>

<script>

export default {
  computed: {
    selectedAddress: {
      get() {
        return this.$store.state.selectedAddress
      },
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
