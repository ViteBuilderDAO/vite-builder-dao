<template>
  <div>
    <p class="text-2xl mb-6">
      Basic Cards
    </p>

    <card-basic></card-basic>

    <p class="text-2xl mt-14 mb-6">
      Navigation Cards
    </p>

    <card-navigation></card-navigation>

    <p class="text-2xl mt-14 mb-6">
      Solid Cards
    </p>

    <card-solid></card-solid>
  </div>
</template>

<script>
const CardBasic = () => import('./CardBasic.vue')
const CardNavigation = () => import('./CardNavigation.vue')
const CardSolid = () => import('./CardSolid.vue')

export default {
  components: {
    CardBasic,
    CardNavigation,
    CardSolid,
  },
}
</script>
