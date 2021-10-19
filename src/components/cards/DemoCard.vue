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
        color="error"
        class="wallet-connect-card"
        href="#"
        target="_blank"
        rel="nofollow"
        v-bind="attrs"
        v-on="on"
      >
        Demo Card
      </v-btn>
    </template>

    <v-card
      class="elevation-0"
      max-width="400"
    >
      <v-img
        max-width="400"
        eager
        :src="require('@/assets/img/logos/vite-cover-milltay-2.png')"
        alt=""
      ></v-img>
      <v-card-title class="font-weight-semibold">
        Vite Builder DAO
      </v-card-title>
      <v-card-text>
        The most developer friendly &amp; highly customisable DAO Dashboard based on Vite.
      </v-card-text>
      <v-card-text>
        <span>Click on below button to explore.</span>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="primary"
          class="me-2"
          href="#"
          target="_blank"
          rel="nofollow"
        >
          Demo
        </v-btn>
        <v-btn
          color="primary"
          outlined
          href="#"
          target="_blank"
          rel="nofollow"
        >
          Download
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.wallet-connect-card {
  z-index: 4;
  bottom: 5%;
  right: 48px;
  position: fixed;
  .v-application &.v-btn.v-btn--is-elevated {
    box-shadow: 0 1px 20px 1px #ff4c51 !important;
    &:hover {
      box-shadow: none !important;
    }
  }
}
</style>
