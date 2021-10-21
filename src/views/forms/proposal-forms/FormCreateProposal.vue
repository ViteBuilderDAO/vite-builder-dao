<template>
  <v-form>
    <v-row>
      <v-col cols="12">
        <!-- Proposal Title -->
        <v-text-field
          v-model="proposalTitle"
          :prepend-inner-icon="icons.mdiDiamondOutline"
          label="Proposal Title"
          type="text"
          outlined
          dense
          placeholder="Title"
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
      >
        <!-- Proposal Keywords -->
        <v-text-field
          v-model="proposalKeywords"
          :prepend-inner-icon="icons.mdiDiamondOutline"
          label="Keywords"
          type="text"
          outlined
          dense
          placeholder="Comma separated list of keywords"
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
      >
        <!-- Proposal URL -->
        <v-text-field
          v-model="website"
          :prepend-inner-icon="icons.mdiDiamondOutline"
          label="Website"
          type="text"
          outlined
          dense
          placeholder="Website"
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
      >
        <!-- Proposal Social Media -->
        <v-text-field
          v-model="proposalSocialLinks"
          :prepend-inner-icon="icons.mdiDiamondOutline"
          label="Social Media Links"
          type="text"
          outlined
          dense
          placeholder="Social Media Link(s)"
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
      >
        <!-- Proposal Creator(s) Country -->
        <v-text-field
          v-model="proposalCreatorCountry"
          :prepend-inner-icon="icons.mdiDiamondOutline"
          label="Country"
          type="text"
          outlined
          dense
          placeholder="Proposal Creator's Country"
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
      >
        <!-- Proposal Description -->
        <v-textarea
          v-model="proposalDescription"
          :prepend-inner-icon="icons.mdiDiamondOutline"
          label="Description"
          type="text"
          outlined
          dense
          placeholder="Description"
        ></v-textarea>
      </v-col>
      <v-col
        cols="12"
      >
        <!-- Proposal Team Members -->
        <v-text-field
          v-model="proposalTeamMembers"
          :prepend-inner-icon="icons.mdiDiamondOutline"
          label="Proposal Team Members"
          type="text"
          outlined
          dense
          placeholder="Comma separated list of team member's usernames who will be contributing"
        ></v-text-field>
      </v-col>
      <v-col
        cols="12"
      >
        <!-- Proposal Token?
        <v-text-field
          v-model="proposalTitle"
          :prepend-inner-icon="icons.mdiDiamondOutline"
          label="Proposal Token"
          type="text"
          outlined
          dense
          placeholder="Title"
        ></v-text-field> -->
      </v-col>
      <v-col
        cols="12"
      >
        <!-- Proposal Cover Photo -->
        <v-card-text class="d-flex">
          <v-avatar
            rounded
            size="120"
            class="me-6"
          >
            <v-img :src="proposalCoverPhoto"></v-img>
          </v-avatar>

          <!-- upload photo -->
          <div>
            <v-btn
              color="primary"
              class="me-3 mt-5"
              @click="$refs.refInputEl.click()"
            >
              <v-icon class="d-sm-none">
                {{ icons.mdiCloudUploadOutline }}
              </v-icon>
              <span class="d-none d-sm-block">Upload Proposal Photo</span>
            </v-btn>

            <input
              ref="refInputEl"
              type="file"
              accept=".jpeg,.png,.jpg,GIF"
              :hidden="true"
            />

            <v-btn
              color="error"
              outlined
              class="mt-5"
            >
              Reset
            </v-btn>
            <p class="text-sm mt-5">
              Allowed JPG, GIF or PNG. Max size of 800K
            </p>
          </div>
        </v-card-text>
      </v-col>
    </v-row>
    <!-- Submit Button -->
    <v-btn color="primary">
      Submit
    </v-btn>
    <v-btn
      type="reset"
      outlined
      class="mx-2"
    >
      Reset
    </v-btn>
  </v-form>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiDiamondOutline, mdiCloudUploadOutline } from '@mdi/js'
import { ref } from '@vue/composition-api'

export default {
  setup() {
    const proposalTitle = ref('')
    const proposalKeywords = ref('')
    const proposalCoverPhoto = ref()
    const proposalDescription = ref('')
    const proposalURL = ref('')
    const proposalSocialLinks = ref('')
    const proposalCreatorCountry = ref('')
    const proposalTeamMembers = ref('')

    return {
      proposalTitle,
      proposalKeywords,
      proposalCoverPhoto,
      proposalDescription,
      proposalURL,
      proposalSocialLinks,
      proposalCreatorCountry,
      proposalTeamMembers,

      // icons
      icons: {
        mdiDiamondOutline,
        mdiCloudUploadOutline,
      },
    }
  },
}
</script>
