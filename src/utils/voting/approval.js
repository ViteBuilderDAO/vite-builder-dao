export default class ApprovalVoting {
  votingPower
  option

  constructor(votingPower, option) {
    this.votingPower = votingPower
    this.option = option
  }
}

// Each voter may select "approve" on any number of choices.
// Each selected choice will receive equal voting power.
 