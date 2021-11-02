export function percentageOfTotal(i, values, total) {
  const reducedTotal = total.reduce((a, b) => a + b, 0)
  const percent = (values[i] / reducedTotal) * 100

  return percent.isNaN ? 0 : percent
}

export function weightedPower(i, choice, balance) {
  return (
    (percentageOfTotal(i + 1, choice, Object.values(choice)) / 100) * balance
  )
}

export default class WeightedVoting {
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
