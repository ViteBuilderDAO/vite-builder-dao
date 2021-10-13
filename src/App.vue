<script setup>
import { computed, onMounted, provide, watch } from 'vue';
import { useRoute } from 'vue-router';

const { loadLocale } = useI18n();
const { init, explore } = useApp();


onMounted(async () =>
{
  await loadLocale();
  init();
});

watch(modalOpen, val =>
{
  const el = document.body;
  el.classList[val ? 'add' : 'remove']('overflow-hidden');
});

</script>

<template>

    <div
      :class="theme"
      id="app"
      class="overflow-hidden pb-4 font-serif text-base"
    >

        <UiLoading v-if="app.loading || !app.init" class="overlay big" />

        <div v-else>
          <Scroller />
            <div :class="{ 'sm:ml-[68px]': !domain }">
                <Topnav />
                <div class="pb-6">
                    <router-view :key="$route.path" class="flex-auto" />
                </div>
            </div>
        </div>

        <div id="modal" />

        <Notifications />

    </div>
</template>