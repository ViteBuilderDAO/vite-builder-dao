<template>
  <div
    v-if="proposals"
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
  parseProposal,
} from '@/utils/proposal/proposalController'

export default {
  components: {
    GalleryTestWidget,
  },

  data() {
    return {
      proposals: [],
    }
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
      numStats: 4,
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

    async onCreated() {
      await getAllProposals().then(allProposals => {
        allProposals.forEach(doc => {
          parseProposal(doc).then(parsedProposal => {
            if (parsedProposal) {
              const proposalObj = parsedProposal
              this.proposals.push(proposalObj)
            }
          })
        })
      })
    },

  },
}
</script>

<style lang="scss" scoped>

</style>
