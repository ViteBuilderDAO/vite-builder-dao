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
              v-for="(option, index) in proposalOptions"
              :key="index"
              v-bind="option"
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
                  {{ option.optionName }}
                </v-card-title>
                <v-progress-linear
                  color="blue lighten-2"
                  :buffer-value="votingPowers[index]"
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
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="votingPowers[index]"
                              outlined
                              type="number"
                              :disabled="isSwitchEnabled"
                              :label="`Option #${index+1} Power:`"
                              :class="isSwitchEnabled ? 'ballot-text-field' : ''"
                              suffix="%"
                              v-bind="attrs"
                              v-on="on"
                              @input="validateVoteValue()"
                            ></v-text-field>
                          </template>
                          <span>Percent amount of voting power placed towards this option. Balances are verified at the end of a proposal.</span>
                        </v-tooltip>
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
            </v-col>
          </v-row>
        </v-container>

        <v-container
          v-if="walletConnected && userBalance > 0"
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
                  Your Voting Power: {{ userBalance }}
                </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </v-container>

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
            :label="isVoting ? 'Loading...' : 'Submit Vote'"
            class="cast-vote-submit-btn"
            :disabled="!isValidForSubmit() || disableSubmit"
          />
        </FormulateForm>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import BigNumber from 'bignumber.js'
import {
  mdiAlert,
} from '@mdi/js'
import { mapState, mapGetters } from 'vuex'
import { getWalletBalanceInfo } from '@/utils/contract/contractHelpers'
import eventBus from '@/utils/events/eventBus'

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
      icons: {
        mdiAlert,
      },
    }
  },

  data() {
    return {
      votingOptionsSelected: [],
      votingPowers: [],
      currAddrHasVoted: false,
      userBalance: 0,
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
    eventBus.$on('vite-wallet-connected', eventData => {
      if (eventData) {
        this.initVotingPower()
        this.onMounted()
      }
    })
    eventBus.$on('vite-wallet-disconnected', () => {
      this.userBalance = 0
    })

    this.onMounted()
  },

  beforeDestroy() {
    // removing eventBus listeners
    eventBus.$off('vite-wallet-connected')
    eventBus.$off('vite-wallet-disconnected')
  },

  methods: {

    isValidForSubmit() {
      if (!this.walletConnected) {
        return false
      }

      if (this.isSwitchEnabled && this.currNumOptsSelected <= 0) {
        return false
      }

      return true
    },

    onCreated() {
      this.numOptions = this.proposalOptions.length

      this.votingPowers = new Array(this.numOptions).fill(0)
      this.votingOptionsSelected = new Array(this.numOptions).fill(false)
      this.streamBarVals = new Array(this.numOptions).fill(0)

      this.initVotingBallots()
    },

    async onMounted() {
      this.initVotingPower()
      if (this.walletConnected && this.prevVoterMap) {
        if (this.prevVoterMap.includes(this.connectedWalletAddr)) {
          this.currAddrHasVoted = true
        } else {
          this.currAddrHasVoted = false
        }
      }
    },

    initVotingPower() {
      this.userBalance = 0
      if (this.walletConnected) {
        const votingTokenArr = []
        Object.values(this.votingTokens).forEach(token => {
          votingTokenArr.push(token.tokenTTI)
        })

        getWalletBalanceInfo(this.connectedWalletAddr).then(({ balance }) => {
          Object.values(balance.balanceInfoMap).forEach(val => {
            if (votingTokenArr.includes(val.tokenInfo.tokenId)) {
              this.userBalance += parseInt(BigNumber(val.balance).dividedBy(`1e${val.tokenInfo.decimals}`).toFixed(), 10)
            }
          })
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
      this.hideBallot = true
      this.currAddrHasVoted = true
      this.$emit('onSubmitVote', { votingPowers: this.votingPowers, userBalance: this.userBalance })
    },

    async onOptionClicked(index) {
      if (this.votingOptionsSelected[index]) {
        ++this.currNumOptsSelected
        if (this.votingType === 'Single-Choice') {
          this.votingPowers.forEach((val, powerIndex) => {
            if (index !== powerIndex) {
              this.votingPowers[index] = 0
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

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
-webkit-appearance: none;
margin: 0;
}

/* Firefox */
input[type=number] {
-moz-appearance: textfield;
}
</style>
