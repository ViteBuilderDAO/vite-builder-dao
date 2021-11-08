<template>
  <v-row>
    <v-col
      cols="12"
      md="12"
    >
      <gallery-test-widget></gallery-test-widget>
    </v-col>
  </v-row>
</template>

<script>
const GalleryTestWidget = () => import('./GalleryTestWidget.vue')

export default {
  components: {
    GalleryTestWidget,
  },
  setup() {
  },
}
</script>
