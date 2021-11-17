<template>
  <v-card>
    <v-divider
      class="divider-margin-class"
    ></v-divider>
    <v-container
      fluid
      :class="hideBallot ? 'hidden-ballot-container' : 'visible-ballot-container'"
    >
      <v-row
        dense
      >
        <v-col
          v-for="(option, index) in filteredOptions"
          :key="index"
          v-bind="option"
          :cols="numOptions + 1"
          class="ballot-flex"
        >
          <v-card
            elevation="2"
            outlined
            shaped
            min-height="200px"
          >
            <v-card-title>
              {{ option.optionName }}
            </v-card-title>
            <v-progress-linear
              color="blue lighten-2"
              :buffer-value="calcBufferStreamVal(index)"
              stream
            ></v-progress-linear>
            <v-img
              v-if="option.file"
              :src="option.file"
              height="200px"
            ></v-img>
          </v-card>
          <v-form>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                >
                  <v-text-field
                    v-model="votingPowers[index]"
                    outlined
                    type="text"
                    :disabled="isVotingPowerDisabled"
                    :label="`Option #${index+1} Power:`"
                    class="ballot-text-field"
                  >
                    <template
                      v-slot:append-outer
                      @click:append-outer="onOptionClicked(index)"
                    >
                      <v-switch
                        v-if="isSwitchEnabled"
                        id="optsSelected"
                        v-model="votingOptionsSelected[index]"
                        inset
                        class="switch-rot-90"
                      ></v-switch>
                      <v-radio
                        v-else
                        id="optsSelected"
                        v-model="votingOptionsSelected[index]"
                        hide-details
                        class="switch-rot-90"
                      >
                      </v-radio>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
          <!--<v-row
            align="center"
          >
            <v-checkbox
              v-if="isSwitchEnabled"
              id="optsSelected"
              v-model="votingOptionsSelected[index]"
              hide-details
              class="shrink mr-2 mt-9"
            ></v-checkbox>
            <v-radio
              v-else
              id="optsSelected"
              v-model="votingOptionsSelected[index]"
              hide-details
            >
            </v-radio>
            <v-text-field
              v-model="votingPowers[index]"
              :disabled="isVotingPowerDisabled"
              :label="`Option #${index+1} Power:`"
              class="mr-2 mt-9"
            ></v-text-field>
          </v-row>-->
        </v-col>
      </v-row>
    </v-container>
    <v-container
      fluid
      :class="hideBallot ? 'hidden-ballot-container' : 'visible-ballot-container'"
    >
      <v-row
        dense
      >
        <v-col
          cols="4"
          class="ballot-flex"
        >
          <v-card
            elevation="2"
            outlined
            shaped
            min-height="200px"
          >
            <v-card-title>
              Reject All Options
            </v-card-title>
            <v-progress-linear
              color="red lighten-2"
              :buffer-value="calcBufferStreamVal(numOptions-1)"
              stream
            ></v-progress-linear>
          </v-card>
          <v-form>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                >
                  <v-text-field
                    v-model="votingPowers[numOptions-1]"
                    outlined
                    type="text"
                    :disabled="isVotingPowerDisabled"
                    :label="`Reject All Options Voting Power:`"
                    class="ballot-text-field"
                  >
                    <template v-slot:append-outer>
                      <v-switch
                        v-if="isSwitchEnabled"
                        v-model="votingOptionsSelected[numOptions-1]"
                        inset
                        class="switch-rot-90"
                      ></v-switch>
                      <v-radio
                        v-else
                        v-model="votingOptionsSelected[numOptions-1]"
                        hide-details
                        class="switch-rot-90"
                      >
                      </v-radio>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-col>
      </v-row>
    </v-container>
    <v-container
      fluid
      :class="hideBallot ? 'hidden-ballot-container' : 'visible-ballot-container'"
    >
      <v-row
        dense
      >
        <v-col
          cols="4"
        >
          <v-card
            elevation="2"
            outlined
            min-height="150px"
          >
            <v-card-title>
              Voting Balance
            </v-card-title>
            <v-card-subtitle>
              Your Voting Power: {{ votingBalance }}
            </v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-divider
      class="divider-margin-class"
    ></v-divider>
    <v-row>
      <v-col
        cols="12"
      >
        <FormulateForm
          @submit="fireVotingCallback()"
        >
          <FormulateInput
            type="submit"
            help="Note: Vite wallet must be connected to cast vote."
            :label="isVoting ? 'Awaiting Vite App Approval...' : 'Submit Vote'"
            class="cast-vote-submit-btn"
            :disabled="!isValidForSubmit()"
          />
        </FormulateForm>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import {
  mdiAlert,
} from '@mdi/js'
import { mapState, mapGetters } from 'vuex'
import BigNumber from 'bignumber.js'
import { getWalletBalanceInfo } from '@/utils/contract/contractHelpers'
import { getVbInstance } from '@/utils/wallet/walletClient'

const vbInst = getVbInstance()

export default {

  props: {
    votingTokens: { type: Array, default: null },
    votingType: { type: String, default: '' },
    proposalOptions: { type: Array, default: null },
    isVoting: { type: Boolean, default: false },
    isStopping: { type: Boolean, default: false },
  },

  setup() {
    return {
      hideBallot: false,
      isVotingPowerDisabled: false,
      isSwitchEnabled: true,
      numOptions: 0,
      votingBalance: 0,
      currSpendAmount: 0,
      votingPowers: [],
      quadraticPowers: [],
      votingOptionsSelected: [],
      currNumOptsSelected: 0,
      filteredOptions: [],
      icons: {
        mdiAlert,
      },
    }
  },

  computed: {
    ...mapState([
      'walletConnected',
      'connectedWalletAddr',
      'connectedAccounts',
    ]),
    ...mapGetters([
      'getIsWalletConnected',
      'getConnectedWalletAddr',
      'getConnectedAccounts',
    ]),
  },

  created() {
    this.onCreated()
  },

  methods: {

    isValidForSubmit() {
      if (
        !this.walletConnected
      ) {
        return false
      }

      return true
    },

    async onCreated() {
      this.numOptions = this.proposalOptions.length
      this.initVotingPower()
      this.proposalOptions.forEach((val, index) => {
        if (index < this.numOptions - 1) {
          this.filteredOptions.push(val)
        }
      })
      this.votingOptionsSelected = new Array(this.numOptions).fill(false)
      this.votingPowers = new Array(this.numOptions).fill(0)
      if (this.votingType === 'Quadratic') {
        this.quadraticPowers = new Array(this.numOptions).fill(0)
      }
      this.initVotingBallots()
      if (this.balance > 0) {
        this.dataStreamMult = (100.0 / this.balance)
      }

      vbInst.on('connect', () => {
        this.initVotingPower()
      })
      vbInst.on('disconnect', () => {
        this.votingBalance = 0
      })
    },

    /**
     *
     */
    async initVotingPower() {
      if (this.walletConnected) {
        await getWalletBalanceInfo(this.connectedAccounts[0]).then(({ balance }) => {
          const votingTokenArr = []
          Object.values(this.votingTokens).forEach(token => {
            votingTokenArr.push(token.votingTokens)
          })
          Object.values(balance.balanceInfoMap).forEach(val => {
            if (votingTokenArr.includes(val.tokenInfo.tokenId)) {
              this.votingBalance += parseInt(BigNumber(val.balance).dividedBy(`1e${val.tokenInfo.decimals}`).toFixed(), 10)
            }
          })
        })
      }
    },

    async initVotingBallots() {
      switch (this.votingType) {
        case 'Approval':
          this.isVotingPowerDisabled = true
          this.isSwitchEnabled = true
          break
        case 'Quadratic':
          this.isVotingPowerDisabled = false
          this.isSwitchEnabled = true
          break
        case 'Weighted':
          this.isVotingPowerDisabled = false
          this.isSwitchEnabled = true
          break
        case 'SingleChoice':
          this.isVotingPowerDisabled = true
          this.isSwitchEnabled = false
          break
        default:
          this.isVotingPowerDisabled = false
          this.isSwitchEnabled = true
          break
      }
    },

    async fireVotingCallback() {
      // console.log('fireVotingCallback(), votingOptionsSelected:', this.votingOptionsSelected)
      // console.log('fireVotingCallback(), votingPowers:', this.votingPowers)
      if (this.votingType === 'Quadratic') {
        this.votingPowers = this.quadraticPowers
      }

      this.hideBallot = true

      this.$emit('onSubmitVote', { optionsVoted: this.votingOptionsSelected, votingPowers: this.votingPowers })
    },

    async calcCurrPowersTotal() {
      let sum = 0
      this.votingPowers.forEach(powerVal => {
        sum += powerVal
      })

      return sum
    },

    async isAnyOptionSelected() {
      let optSelected = false
      this.votingOptionsSelected.forEach(optVal => {
        if (optVal) {
          optSelected = true
        }
      })

      return optSelected
    },

    async onOptionClicked(index) {
      console.log('onOptionsClicked() index:', index)
      if (this.votingOptionsSelected[index]) {
        ++this.currNumOptsSelected
        switch (this.votingType) {
          case 'Approval':
            this.votingPowers[index] = (this.votingBalance / this.currNumOptsSelected)
            break
          case 'Quadratic':
            this.quadraticPowers[index] = Math.sqrt(this.votingPowers[index])
            break
          case 'SingleChoice':
            this.votingPowers[index] = this.votingBalance
            break
          default:
            break
        }
      } else {
        --this.currNumOptsSelected
        if (this.votingType === 'SingleChoice') {
          this.votingPowers[index] = 0
        }
      }
    },

    calcBufferStreamVal(index) {
      if (this.balance > 0) {
        return this.dataStreamMult * this.votingPowers[index]
      }

      return 0
    },

  },
}

</script>

<style lang="scss">
@import '@braid/vue-formulate/themes/snow/snow.scss';

.ballot-flex {
  margin-left: auto;
  margin-right: auto;
}

.formulate-form.vote-ballot-form-light-text {
  color: white;
}

.vote-ballot-form-light-text {
  .formulate-input-help.formulate-input-help {
    color: gray;
  }

  .formulate-input {
    &[data-classification='text'] {
      input {
        color: white;
      }
    }
  }

  .formulate-input-element--textarea textarea {
    color: white;
  }

  .formulate-input[data-classification=select] select {
    color: white;
  }

  .formulate-input .formulate-input-error,
  .formulate-input .formulate-file-upload-error {
    color: red;
  }
}

.vote-ballot-form-dark-borders {

}

.ballot-text-field {
  transform: translateX(15px);
}

.switch-rot-90 {
  transform: rotate(-90deg) + translate(37.5px, 0px);
}

.visible-ballot-container {
  display: block;
}

.hidden-ballot-container {
  display: none;
}
</style>
