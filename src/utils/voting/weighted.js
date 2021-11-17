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
  votingPower
  option

  constructor(votingPower, option) {
    this.votingPower = votingPower
    this.option = option
  }
}

// Each voter may spread voting power across any number of choices.
