<template>
  <v-card>
    <v-text-field
      dense
      outlined
      :prepend-inner-icon="icons.mdiMagnify"
      class="guild-explorer-search-bar flex-grow-0"
      hide-details
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="usreList"
      item-key="guild_name"
      class="table-rounded"
      hide-default-footer
    >
      <template #[`item.guild_icon`]="{item}">
        <v-icon>{{ item.guild_icon }}</v-icon>
      </template>
      <template #[`item.guild_name`]="{item}">
        <div>
          <span class="d-block font-weight-semibold text--primary text-truncate">{{ item.guild_name }}</span>
        </div>
      </template>
      <template #[`item.guild_members`]="{item}">
        {{ `${item.guild_members}` }}
      </template>
      <template #[`item.guild_tags`]="{item}">
        {{ `${item.guild_tags}` }}
      </template>
      <template #[`item.guild_start_date`]="{item}">
        <span class="start-data-text">{{ `${item.guild_start_date}` }}</span>
      </template>
      <template
        #[`item.join_guild_button`]="{item}"
        #activator="{ on, attrs }"
      >
        <v-btn
          color="primary"
          v-bind="attrs"
          v-on="on"
        >
          Join
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import { mdiMagnify } from '@mdi/js'
import guildData from './guild-data'

export default {
  setup() {
    return {
      headers: [
        { text: '', value: 'guild_icon' },
        { text: 'NAME', value: 'guild_name' },
        { text: 'MEMBERS', value: 'guild_members' },
        { text: 'TAGS', value: 'guild_tags' },
        { text: 'START DATE', value: 'guild_start_date' },
        { text: '', value: 'join_guild_button' },
      ],
      usreList: guildData,
      icons: {
        mdiMagnify,
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.v-card.v-sheet {
  width: 50%;
  bottom: 40px;
  margin-left: auto;
  margin-right: auto;
}
.v-btn.v-btn--is-elevated {
  float: right;
}
.guild-explorer-search-bar {
}
</style>
