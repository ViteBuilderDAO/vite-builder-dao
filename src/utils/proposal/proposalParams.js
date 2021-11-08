export default class Car {
  constructor(name, year) {
    this.name = name
    this.year = year
  }

  age() {
    const date = new Date()

    return date.getFullYear() - this.year
  }
}
