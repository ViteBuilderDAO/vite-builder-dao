<script setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const { t } = useI18n();
const route = useRoute();


const loadBy = 8;
const limit = ref(loadBy);

const { endElement } = useScrollMonitor(() => (limit.value += loadBy));
</script>

<template>
  <div>
    <div class="mb-4 mx-auto">
      <Container class="flex items-center">
        <div class="flex-auto text-left flex">
          <UiButton class="pl-3 pr-0 w-full lg:w-7/12 md:w-10/12">
            <SearchWithFilters />
          </UiButton>
        </div>
        <div class="ml-3 hidden sm:flex text-right items-center">
          <div class="flex flex-col">
            {{ _n(items.length) }} {{ resultsStr }}
          </div>
          <a
            v-if="buttonStr"
            href="https://discord.snapshot.org"
            target="_blank"
            class="hidden md:block ml-3"
          >
            <UiButton>{{ buttonStr }}</UiButton>
          </a>
        </div>
      </Container>
    </div>
    <Container :slim="true">
      <div class="overflow-hidden">
        <NoResults :block="true" v-if="Object.keys(items).length < 1" />
      </div>
    </Container>
    <div ref="endElement" />
  </div>
</template>