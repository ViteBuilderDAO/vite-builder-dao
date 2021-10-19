<template>
  <v-row class="match-height">
    <!-- Create new guild -->
    <v-col
      cols="12"
      md="12"
    >
      <v-card>
        <v-card-title>Create a Guild</v-card-title>
        <v-card-text>
          <create-guild-form-with-icons></create-guild-form-with-icons>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
const CreateGuildFormWithIcons = () => import('@/views/forms/guild-forms/FormCreateGuild.vue')

export default {
  components: {
    CreateGuildFormWithIcons,
  },
  setup() {
    return {}
  },
}
</script>

<style lang="scss" scoped>
.v-card.v-sheet {
  width: 50%;
  margin-left: auto;
  margin-right: auto;
}
</style>
