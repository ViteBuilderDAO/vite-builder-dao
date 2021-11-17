<template>
  <div
    v-if="proposals != null"
  >
    <gallery-test-widget
      :proposals="proposals"
    ></gallery-test-widget>
  </div>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mapState, mapGetters } from 'vuex'
import {
  mdiAlert,
  mdiTrendingUp,
  mdiChevronUp,
  mdiChevronDown,
} from '@mdi/js'
import GalleryTestWidget from './GalleryTestWidget.vue'
import {
  getAllProposals,
} from '@/utils/proposal/proposalController'

export default {
  components: {
    GalleryTestWidget,
  },

  computed: {
    ...mapState([
      'proposalMode',
    ]),
    ...mapGetters([
      'getProposalMode',
    ]),
  },

  setup() {
    return {
      proposals: null,
      icons: {
        mdiTrendingUp,
        mdiAlert,
        mdiChevronUp,
        mdiChevronDown,
      },
    }
  },

  created() {
    this.onCreated()
  },
  methods: {
    /**
     *
     */
    async viewProposalHandler(proposal) {
      this.$store.commit('setCurrProposal', proposal)
      this.$store.commit('setProposalMode', 'view', false)
    },

    async onCreated() {
      await getAllProposals().then(res => {
        this.proposals = []
        res.forEach(value => {
          const proposalObj = value.data
          proposalObj.proposalID = value.id
          this.proposals.push(proposalObj)
          console.log('GALLERYTEST.JS: onCreated getAllProposals()')
        })
      })
    },

  },
}
</script>

<style lang="scss" scoped>

</style>
