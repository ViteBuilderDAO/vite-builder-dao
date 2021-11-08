export default class ApprovalVoting {
  proposal
  votes
  selected

  constructor(proposal, votes, selected) {
    this.proposal = proposal
    this.votes = votes
    this.selected = selected
  }
}
