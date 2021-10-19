<template>
  <v-row>
    <v-col
      cols="12"
      class="mb-6"
    >
      <typography-headlines></typography-headlines>
    </v-col>
    <v-col cols="12">
      <typography-texts></typography-texts>
    </v-col>
  </v-row>
</template>

<script>
const TypographyHeadlines = () => import('./TypographyHeadlines.vue')
const TypographyTexts = () => import('./TypographyTexts.vue')

export default {
  components: {
    TypographyHeadlines,
    TypographyTexts,
  },
}
</script>
