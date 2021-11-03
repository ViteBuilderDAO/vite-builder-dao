<template>
  <v-navigation-drawer
    :value="isDrawerOpen"
    app
    floating
    width="260"
    class="app-navigation-menu"
    :right="$vuetify.rtl"
    @input="val => $emit('update:is-drawer-open', val)"
  >
    <!-- Navigation Header -->
    <div class="vertical-nav-header d-flex items-center ps-6 pe-5 pt-5 pb-2">
      <router-link
        to="/"
        class="d-flex align-center text-decoration-none"
      >
        <v-img
          :src="require('@/assets/img/logos/logo.svg')"
          max-height="30px"
          max-width="30px"
          alt="logo"
          contain
          eager
          class="app-logo me-3"
        ></v-img>
        <v-slide-x-transition>
          <h2 class="app-title text--primary">
            VITE BUILDER DAO
          </h2>
        </v-slide-x-transition>
      </router-link>
    </div>

    <!-- Navigation Items -->
    <v-list
      expand
      shaped
      class="vertical-nav-menu-items pr-5"
    >
      <nav-menu-link
        title="Dashboard"
        :to="{ name: 'home' }"
        :icon="icons.mdiHomeOutline"
      ></nav-menu-link>
      <nav-menu-group
        title="Guilds"
        :icon="icons.mdiFileOutline"
      >
        <nav-menu-link
          title="Explore Guilds"
          :to="{ name: 'explore-guilds' }"
        ></nav-menu-link>
        <nav-menu-link
          title="Create Guild"
          :to="{ name: 'create-guild' }"
        ></nav-menu-link>
      </nav-menu-group>
      <nav-menu-section-title title="Contract Demos"></nav-menu-section-title>
      <nav-menu-group
        title="Proposals"
        :icon="icons.mdiFileOutline"
      >
        <nav-menu-link
          title="Create Proposal Demo"
          :to="{ name: 'create-proposal' }"
        ></nav-menu-link>
        <nav-menu-link
          title="View/Vote for Proposal Demo"
          :to="{ name: 'proposal-gallery' }"
        ></nav-menu-link>
      </nav-menu-group>
      <nav-menu-section-title title="Demo UI"></nav-menu-section-title>
      <nav-menu-link
        title="Typography"
        :to="{ name: 'typography' }"
        :icon="icons.mdiAlphaTBoxOutline"
      ></nav-menu-link>
      <nav-menu-link
        title="Icons"
        :to="{ name: 'icons' }"
        :icon="icons.mdiEyeOutline"
      ></nav-menu-link>
      <nav-menu-link
        title="Cards"
        :to="{ name: 'cards' }"
        :icon="icons.mdiCreditCardOutline"
      ></nav-menu-link>
      <nav-menu-link
        title="Tables"
        :to="{ name: 'tables' }"
        :icon="icons.mdiTable"
      ></nav-menu-link>
      <nav-menu-link
        title="Form Layouts"
        :to="{ name: 'forms' }"
        :icon="icons.mdiFormSelect"
      ></nav-menu-link>
    </v-list>
    <wallet-connect-card class="vite-wallet"></wallet-connect-card>
  </v-navigation-drawer>
</template>
<script>
// eslint-disable-next-line object-curly-newline
import {
  mdiHomeOutline,
  mdiAlphaTBoxOutline,
  mdiEyeOutline,
  mdiCreditCardOutline,
  mdiTable,
  mdiFileOutline,
  mdiFormSelect,
  mdiAccountCogOutline,
} from '@mdi/js'
import NavMenuSectionTitle from './NavMenuSectionTitle.vue'
import NavMenuGroup from './NavMenuGroup.vue'
import NavMenuLink from './NavMenuLink.vue'

const WalletConnectCard = () => import('@/components/wallet/WalletConnectCard.vue')

export default {
  components: {
    NavMenuSectionTitle,
    NavMenuGroup,
    NavMenuLink,
    WalletConnectCard,
  },
  props: {
    isDrawerOpen: {
      type: Boolean,
      default: null,
    },
  },
  setup() {
    return {
      icons: {
        mdiHomeOutline,
        mdiAlphaTBoxOutline,
        mdiEyeOutline,
        mdiCreditCardOutline,
        mdiTable,
        mdiFileOutline,
        mdiFormSelect,
        mdiAccountCogOutline,
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.app-title {
  font-size: 1.15rem;
  font-weight: 700;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: 0.3px;
}

// ? Adjust this `translateX` value to keep logo in center when vertical nav menu is collapsed (Value depends on your logo)
.app-logo {
  transition: all 0.18s ease-in-out;
  .v-navigation-drawer--mini-variant & {
    transform: translateX(-4px);
  }
}

@include theme(app-navigation-menu) using ($material) {
  background-color: map-deep-get($material, 'background');
}

.app-navigation-menu {
  .v-list-item {
    &.vertical-nav-menu-link {
      ::v-deep .v-list-item__icon {
        .v-icon {
          transition: none !important;
        }
      }
    }
  }
}
</style>
