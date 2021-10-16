<template>
  <div class="container" style="padding: 50px 0 100px 0">
    <Profile v-if="store.user" />
    <Auth v-else />
  </div>
</template>

<script>
import { store } from "./store/store"
import { supabase } from "./supabase/supabase"
import Auth from "./components/auth/Login.vue"
import Profile from "./components/user/UserProfile.vue"

export default {
  components: {
    Auth,
    Profile,
  },

  setup() {
    store.user = supabase.auth.user()
    supabase.auth.onAuthStateChange((_, session) => {
      store.user = session.user
    })

    return {
      store,
    }
  },
}
</script>