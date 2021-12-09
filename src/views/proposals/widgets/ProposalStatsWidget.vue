<template>
  <v-col
    cols="6"
    md="3"
    class="d-flex align-center"
  >
    <v-avatar
      size="44"
      :color="color"
      rounded
      class="elevation-1 ms-15"
    >
      <v-icon
        dark
        color="white"
        size="30"
      >
        {{ icon }}
      </v-icon>
    </v-avatar>
    <div class="ms-3">
      <p class="text-xs mb-0">
        {{ title }}
      </p>
      <h3 class="text-xl font-weight-semibold">
        {{ total }}
      </h3>
    </div>
  </v-col>
</template>

<script>

export default {
  props: {
    title: { type: String, default: '' },
    icon: { type: String, default: '' },
    color: { type: String, default: '' },
    total: { type: Number, default: 0 },
  },
}

</script>
