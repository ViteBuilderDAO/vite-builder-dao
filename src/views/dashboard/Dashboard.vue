<template>
  <proposal-gallery></proposal-gallery>
</template>

<script>

const ProposalGallery = () => import('../proposals/ProposalGallery.vue')

export default {
  components: {
    ProposalGallery,
  },
}
</script>
