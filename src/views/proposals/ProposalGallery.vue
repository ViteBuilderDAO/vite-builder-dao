<template>
  <div>
    <v-row>
      <!-- Card for each active proposal -->
      <ul>
        <li
          v-for="(proposal, index) in currActiveProposals"
          :key="index"
        >
          <v-col
            md="4"
            sm="6"
            cols="12"
          >
            <v-card>
              <v-img
                :src="proposal.cover_photo"
                height="250"
              />
              <v-card-title>
                {{ proposal.title }}
              </v-card-title>
              <v-card-text>
                {{ proposal.description }}
              </v-card-text>
            </v-card>
          </v-col>
        </li>
      </ul>
      <!-- Card for each active proposal -->
      <ul>
        <li
          v-for="(proposal, index) in currActiveProposals"
          :key="index"
        >
          <v-col
            md="4"
            sm="6"
            cols="12"
            class="align-self-start"
          >
            <v-card>
              <v-img
                :src="proposal.cover_photo"
                height="250"
              />
              <v-card-title>
                {{ proposal.title }}
              </v-card-title>
              <v-card-text>
                {{ proposal.description }}
              </v-card-text>
              <v-card-actions class="dense">
                <v-btn
                  color="primary"
                  text
                >
                  Attached Files
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  icon
                  @click="isCardDetailsVisible = !isCardDetailsVisible"
                >
                  <v-icon>{{ isCardDetailsVisible ? icons.mdiChevronUp : icons.mdiChevronDown }}</v-icon>
                </v-btn>
              </v-card-actions>
              <v-expand-transition>
                <div v-show="isCardDetailsVisible">
                  <v-divider></v-divider>
                  <ul>
                    <li
                      v-for="(attachedFile, attachedFileIndex) in proposal.attached_files"
                      :key="attachedFileIndex"
                    >
                      <v-img
                        :src="attachedFile"
                        height="250"
                      />
                    </li>
                  </ul>
                </div>
              </v-expand-transition>
            </v-card>
          </v-col>
        </li>
      </ul>
    </v-row>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import {
  mdiChevronUp,
  mdiChevronDown,
} from '@mdi/js'

export default {
  setup() {
    const isCardDetailsVisible = false

    return {
      isCardDetailsVisible,

      // icons
      icons: {
        mdiChevronUp,
        mdiChevronDown,
      },
    }
  },
  computed: {
    ...mapState([
      'currActiveProposals',
    ]),
    ...mapGetters([
      'getCurrActiveProposals',
    ]),
  },
}
</script>
