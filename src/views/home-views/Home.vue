<script setup>

import { useRoute } from 'vue-router';

const route = useRoute();
const { explore } = useApp();
</script>

<template>
  <div>
    <div class="text-center mb-4 mx-auto">
      <Container class="flex items-center">
        <div class="flex-auto text-left flex">
          <UiButton class="pl-3 pr-0 w-full md:w-7/12">
            <SearchWithFilters />
          </UiButton>
        </div>
        <div class="ml-3 text-right hidden sm:block lg:w-4/12">
          {{ $tc('guildCount', [_n(orderedGuilds.length)]) }}
        </div>
      </Container>
    </div>
    <Container :slim="true">
      <div class="grid lg:grid-cols-4 md:grid-cols-3 gap-4">
        <a
          @click="
            $router.push({ name: 'guildProposals', params: { key: guild.id } })
          "
          v-for="guild in orderedGuilds.slice(0, limit)"
          :key="guild.id"
        >
          <div>
            <!-- Added mb-0 to remove mb-4 added by block component -->
            <Block
              class="text-center extra-icon-container mb-0"
              style="height: 266px"
            >
              <div class="relative inline-block mb-2">
                <Token
                  :guild="guild"
                  symbolIndex="guild"
                  size="82"
                  class="mb-1"
                />
                <UiCounter
                  v-if="guild.activeProposals"
                  :counter="guild.activeProposals"
                  class="absolute top-0 right-0 !bg-green"
                />
              </div>
              <h3
                v-text="_shorten(guild.name, 16)"
                class="mb-0 pb-0 mt-0 text-[22px] !h-[32px] overflow-hidden"
              />
              <div class="mb-[12px] text-color">
                {{
                  $tc('members', guild.followers, {
                    count: _n(guild.followers)
                  })
                }}
              </div>
              <FollowButton :guild="guild" />
            </Block>
          </div>
        </a>
      </div>
      <NoResults :block="true" v-if="Object.keys(orderedGuilds).length < 1" />
    </Container>
    <div ref="endElement" />
  </div>
</template>
