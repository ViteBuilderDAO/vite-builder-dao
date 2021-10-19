<template>
  <v-card id="account-setting-card">
    <!-- tabs -->
    <v-tabs
      v-model="tab"
      show-arrows
    >
      <v-tab
        v-for="tab in tabs"
        :key="tab.icon"
      >
        <v-icon
          size="20"
          class="me-3"
        >
          {{ tab.icon }}
        </v-icon>
        <span>{{ tab.title }}</span>
      </v-tab>
    </v-tabs>

    <!-- tabs item -->
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <user-settings-account :account-data="accountSettingData.account"></user-settings-account>
      </v-tab-item>

      <v-tab-item>
        <user-settings-security></user-settings-security>
      </v-tab-item>

      <v-tab-item>
        <user-settings-info :information-data="accountSettingData.information"></user-settings-info>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
import { mdiAccountOutline, mdiLockOpenOutline, mdiInformationOutline } from '@mdi/js'
import { ref } from '@vue/composition-api'

// demos
const UserSettingsAccount = () => import('./UserSettingsAccount.vue')
const UserSettingsSecurity = () => import('./UserSettingsSecurity.vue')
const UserSettingsInfo = () => import('./UserSettingsInfo.vue')

export default {
  components: {
    UserSettingsAccount,
    UserSettingsSecurity,
    UserSettingsInfo,
  },
  setup() {
    const tab = ref('')

    // tabs
    const tabs = [
      { title: 'Account', icon: mdiAccountOutline },
      { title: 'Security', icon: mdiLockOpenOutline },
      { title: 'Info', icon: mdiInformationOutline },
    ]

    // account settings data
    const accountSettingData = {
      account: {
        avatarImg: require('@/assets/img/avatars/1.png'),
        username: 'johnDoe',
        name: 'john Doe',
        email: 'johnDoe@example.com',
        role: 'Admin',
        status: 'Active',
        company: 'Vite Labs',
      },
      information: {
        bio: 'The name’s User Doe.',
        birthday: 'February 22, 1895',
        phone: '000-000-0000',
        website: 'DemoWebsite.com',
        country: 'USA',
        languages: ['English'],
        gender: 'male',
      },
    }

    return {
      tab,
      tabs,
      accountSettingData,
      icons: {
        mdiAccountOutline,
        mdiLockOpenOutline,
        mdiInformationOutline,
      },
    }
  },
}
</script>
