export default class SingleChoiceVoting {
  votingPower
  option

  constructor(votingPower, option) {
    this.votingPower = votingPower
    this.option = option
  }
}

// Each voter may select a single choice to give their total voting power to.
