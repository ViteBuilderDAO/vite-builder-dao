<template>
  <form class="row flex flex-center" @submit.prevent="handleLogin">
    <div class="col-6 form-widget">
      <h1 class="header">Vite Builder DAO</h1>
      <p class="description">Sign in via the Vite app</p>
      <div>
        <qrcode-vue :value="value" :size="size" level="H" />
      </div>
    </div>
  </form>
</template>

<script>
import { ref } from "vue"
import QrcodeVue from "qrcode.vue"
import { supabase } from "../../supabase/supabase"
import { getViteURI } from "../../supabase/viteAuth"

export default {
    data()
    {
        const qrCodeURI = getViteURI()
        return {
            value: qrCodeURI,
            size: 300,
        }
    },
    components: {
        QrcodeVue,
    },
    setup() {
      const loading = ref(false)
      const email = ref("")
    
      const handleLogin = async () => {
        try {
          loading.value = true
          const { error } = await supabase.auth.signIn({ email: email.value })
          if (error) throw error
          alert("Check your email for the login link!")
        } catch (error) {
          alert(error.error_description || error.message)
        } finally {
          loading.value = false
        }
      }
    
      return {
        loading,
        email,
        handleLogin,
      }
    },
}
</script>