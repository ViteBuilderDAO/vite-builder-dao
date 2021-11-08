export function percentageOfTotal(i, values, total) {
  const reducedTotal = total.reduce((a, b) => a + b, 0)
  const percent = (values[i] / reducedTotal) * 100

  return percent.isNaN ? 0 : percent
}

export function quadraticMath(i, choice, balance) {
  return Math.sqrt(
    (percentageOfTotal(i + 1, choice, Object.values(choice)) / 100) * balance,
  )
}

export default class QuadraticVoting {
  proposal
  votes
  selected

  constructor(proposal, votes, selected) {
    this.proposal = proposal
    this.votes = votes
    this.selected = selected
  }
}
