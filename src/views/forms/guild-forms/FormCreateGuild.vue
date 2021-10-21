<template>
  <v-form>
    <v-text-field
      v-model="guildname"
      :prepend-inner-icon="icons.mdiAccountOutline"
      label="Guild Name"
      outlined
      dense
      placeholder="Guild Name"
    ></v-text-field>

    <v-text-field
      v-model="guildAdminEmail"
      :prepend-inner-icon="icons.mdiEmailOutline"
      label="Guild Admin Email"
      type="email"
      outlined
      dense
      placeholder="Guild Admin Email"
    ></v-text-field>

    <v-text-field
      v-model="guildicon"
      :prepend-inner-icon="icons.mdiDiamondOutline"
      label="Guild Icon"
      outlined
      dense
      placeholder="Guild Icon"
    ></v-text-field>

    <v-btn color="primary">
      Submit
    </v-btn>
    <v-btn
      type="reset"
      outlined
      class="mx-2"
    >
      Reset
    </v-btn>
  </v-form>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiAccountOutline, mdiEmailOutline, mdiDiamondOutline, mdiLockOutline } from '@mdi/js'
import { ref } from '@vue/composition-api'

export default {
  setup() {
    const guildname = ref('')
    const guildAdminEmail = ref('')
    const guildicon = ref()

    return {
      guildname,
      guildAdminEmail,
      guildicon,

      // icons
      icons: {
        mdiAccountOutline,
        mdiEmailOutline,
        mdiDiamondOutline,
        mdiLockOutline,
      },
    }
  },
}
</script>
