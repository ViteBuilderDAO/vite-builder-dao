<template>
  <v-card
    v-if="!currAddrHasVoted"
  >
    <v-expand-transition>
      <div v-show="!isVoting">
        <v-divider
          class="divider-margin-class"
        ></v-divider>
        <v-container
          fluid
        >
          <v-row
            dense
          >
            <v-col
              v-for="(option, index) in filteredOptions"
              :key="index"
              v-bind="option"
              :cols="(numOptions === 3) ? (numOptions + 1) : numOptions"
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
                  :buffer-value="streamBarVals[index]"
                  stream
                ></v-progress-linear>
              </v-card>
              <v-form>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                    >
                      <div class="d-flex">
                        <v-text-field
                          v-model="votingPowers[index]"
                          outlined
                          type="number"
                          :disabled="isSwitchEnabled"
                          :label="`Option #${index+1} Power:`"
                          :class="isSwitchEnabled ? 'ballot-text-field' : ''"
                          @input="validateVoteValue()"
                        ></v-text-field>
                        <v-switch
                          v-if="isSwitchEnabled"
                          v-model="votingOptionsSelected[index]"
                          inset
                          class="switch-rot-90"
                          @click="onOptionClicked(index)"
                        ></v-switch>
                      </div>
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
                  hide-details
                  class="shrink mr-2 mt-9"
                ></v-checkbox>
                <v-radio
                  v-else
                  id="optsSelected"
                  hide-details
                >
                </v-radio>
                <v-text-field
                  v-model="votingPowers[index]"
                  :disabled="isSwitchEnabled"
                  :label="`Option #${index+1} Power:`"
                  class="mr-2 mt-9"
                ></v-text-field>
              </v-row>-->
            </v-col>
          </v-row>
        </v-container>
        <v-container
          fluid
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
                  :buffer-value="streamBarVals[numOptions-1]"
                  stream
                ></v-progress-linear>
              </v-card>
              <v-form>
                <v-container>
                  <v-row>
                    <v-col
                      cols="12"
                    >
                      <div class="d-flex">
                        <v-text-field
                          v-model="votingPowers[numOptions-1]"
                          outlined
                          type="number"
                          :disabled="isSwitchEnabled"
                          :label="`Reject All Options Voting Power:`"
                          :class="isSwitchEnabled ? 'ballot-text-field' : ''"
                          @input="validateVoteValue()"
                        ></v-text-field>
                        <v-switch
                          v-if="isSwitchEnabled"
                          v-model="votingOptionsSelected[numOptions-1]"
                          inset
                          class="switch-rot-90"
                          @change="onOptionClicked(numOptions-1)"
                        ></v-switch>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-col>
          </v-row>
        </v-container>

        <!--<v-container
          fluid
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
        </v-container>-->

        <v-divider
          class="divider-margin-class"
        ></v-divider>
      </div>
    </v-expand-transition>
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
            :disabled="!isValidForSubmit() || disableSubmit"
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
import { getVbInstance } from '@/utils/wallet/walletClient'

// import { checkIfVotedPreviously } from '@/utils/proposal/proposalController'

const vbInst = getVbInstance()

export default {

  props: {
    votingTokens: { type: Array, default: null },
    votingType: { type: String, default: '' },
    proposalOptions: { type: Array, default: null },
    isVoting: { type: Boolean, default: false },
    isStopping: { type: Boolean, default: false },
    prevVoterMap: { type: Array, default: null },
  },

  setup() {
    return {
      hideBallot: false,
      disableSubmit: false,
      isSwitchEnabled: false,
      numOptions: 0,
      votingBalance: 100,
      currSpendAmount: 0,
      currNumOptsSelected: 0,
      filteredOptions: [],
      icons: {
        mdiAlert,
      },
    }
  },

  data() {
    return {
      votingOptionsSelected: [],
      votingPowers: [],
      quadraticPowers: [],
      streamBarVals: [],
      currAddrHasVoted: false,
    }
  },

  computed: {
    ...mapState([
      'walletConnected',
      'connectedBalanceInfo',
      'connectedWalletAddr',
      'currProposalID',
    ]),
    ...mapGetters([
      'getIsWalletConnected',
      'getConnectedBalanceInfo',
      'getConnectedWalletAddr',
      'getCurrProposalID',
    ]),
  },

  created() {
    this.onCreated()
  },

  mounted() {
    this.onMounted()
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

    onCreated() {
      this.numOptions = this.proposalOptions.length

      // this.initVotingPower()

      this.proposalOptions.forEach((val, index) => {
        if (index < this.numOptions - 1) {
          this.filteredOptions.push(val)
        }
      })

      this.votingPowers = new Array(this.numOptions).fill(0)
      this.votingOptionsSelected = new Array(this.numOptions).fill(false)
      this.streamBarVals = new Array(this.numOptions).fill(0)

      if (this.votingType === 'Quadratic') {
        this.quadraticPowers = new Array(this.numOptions).fill(0)
      }

      this.initVotingBallots()

      vbInst.on('connect', () => {
        // this.initVotingPower()
        this.onMounted()
      })

      vbInst.on('disconnect', () => {
        this.votingBalance = 0
      })
    },

    async onMounted() {
      if (this.walletConnected && this.prevVoterMap) {
        if (this.prevVoterMap.includes(this.connectedWalletAddr)) {
          this.currAddrHasVoted = true
        } else {
          this.currAddrHasVoted = false
        }

        // await checkIfVotedPreviously(this.connectedWalletAddr, this.currProposalID).then(res => {
        //   if (res) {
        //     this.currAddrHasVoted = parseInt(res[0], 10)
        //   }
        // })
      }
    },

    /**
     *
     */
    async initVotingPower() {
      if (this.walletConnected) {
        const votingTokenArr = []

        Object.values(this.votingTokens).forEach(token => {
          votingTokenArr.push(token.tokenTTI)
        })

        Object.values(this.connectedBalanceInfo).forEach(val => {
          if (votingTokenArr.includes(val.tokenInfo.tokenId)) {
            this.votingBalance += parseInt(BigNumber(val.balance).dividedBy(`1e${val.tokenInfo.decimals}`).toFixed(), 10)
          }
        })
      }
    },

    async initVotingBallots() {
      switch (this.votingType) {
        case 'Approval':
          this.isSwitchEnabled = true
          break
        case 'Quadratic':
          this.isSwitchEnabled = false
          break
        case 'Weighted':
          this.isSwitchEnabled = false
          break
        case 'Single-Choice':
          this.isSwitchEnabled = true
          break
        default:
          this.isSwitchEnabled = false
          break
      }
    },

    async fireVotingCallback() {
      // console.log('fireVotingCallback(), votingPowers:', this.votingPowers)
      this.hideBallot = true
      this.currAddrHasVoted = true

      if (this.votingType === 'Quadratic') {
        this.votingPowers.forEach((val, index) => {
          if (val > 0) {
            this.quadraticPowers[index] = Math.round(Math.sqrt(val))
          }
        })

        this.votingPowers = this.quadraticPowers
      }

      this.$emit('onSubmitVote', { votingPowers: this.votingPowers })
    },

    async calcCurrPowersTotal() {
      let sum = 0
      this.votingPowers.forEach(powerVal => {
        sum += powerVal
      })

      return sum
    },

    async onOptionClicked(index) {
      // console.log('onOptionsClicked() this.currNumOptsSelected:', this.currNumOptsSelected)
      // console.log('onOptionsClicked() this.votingPowers:', this.votingPowers)
      // console.log('onOptionsClicked() this.votingOptionsSelected:', this.votingOptionsSelected)

      if (this.votingOptionsSelected[index]) {
        ++this.currNumOptsSelected
        if (this.votingType === 'Single-Choice') {
          this.votingPowers.forEach((val, powerIndex) => {
            if (index !== powerIndex) {
              this.votingPowers[powerIndex] = 0
              if (this.votingOptionsSelected[powerIndex]) {
                this.votingOptionsSelected[powerIndex] = false
                --this.currNumOptsSelected
              }
            } else {
              this.votingPowers[index] = this.votingBalance
            }
          })
        }
      } else {
        --this.currNumOptsSelected
        if (this.votingType === 'Single-Choice') {
          this.votingPowers[index] = 0
        }
      }

      if (this.votingType === 'Approval') {
        this.votingPowers.forEach((val, powerIndex) => {
          if (this.votingOptionsSelected[powerIndex]) {
            this.votingPowers[powerIndex] = (this.votingBalance / this.currNumOptsSelected)
          } else {
            this.votingPowers[powerIndex] = 0
          }
        })
      }

      // console.log('onOptionsClicked() this.currNumOptsSelected:', this.currNumOptsSelected)
      // console.log('onOptionsClicked() this.votingPowers:', this.votingPowers)
      // console.log('onOptionsClicked() this.votingOptionsSelected:', this.votingOptionsSelected)
    },

    validateVoteValue() {
      let sum = 0
      this.votingPowers.forEach((val, index) => {
        const parsedVal = parseInt(val, 10)
        if (Number.isNaN(parsedVal)) {
          this.votingPowers[index] = 0
        } else {
          sum += parsedVal
        }

        this.streamBarVals[index] = val
      })
      if (sum > this.votingBalance || sum <= 0) {
        this.disableSubmit = true
      } else {
        this.disableSubmit = false
      }
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
  transform: rotate(-90deg) + translate(30px, 30px);
}

.visible-ballot-container {
  display: block;
}

.hidden-ballot-container {
  display: none;
}
</style>
