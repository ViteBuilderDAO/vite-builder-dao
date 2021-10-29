export default class SingleChoiceVoting {
  proposal

  votes

  strategies

  selected

  constructor(proposal, votes, strategies, selected) {
    this.proposal = proposal
    this.votes = votes
    this.strategies = strategies
    this.selected = selected
  }
}
