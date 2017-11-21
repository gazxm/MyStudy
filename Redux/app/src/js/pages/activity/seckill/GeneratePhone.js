const OPERATORS = [{
  key: 3,
  value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
}, {
  key: 5,
  value: [0, 1, 2, 3, 5, 6, 7, 8, 9]
}, {
  key: 7,
  value: [0, 1, 2, 3, 6, 7, 8]
}, {
  key: 8,
  value: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
}]

export default new class GeneratePhone {
  phone (options = {}) {
    let operator = this.operators()
    let rests = this.rests()
    return [1, operator, rests].join('')
  }

  rests () {
    let temps = []
    for (let i = 0; i < 8; i++) {
      temps.push(this.random(9))
    }
    return temps.join('')
  }

  random (number = 0) {
    let temp = Math.random() * number
    return Math.floor(temp < 1 ? 0 : temp)
  }

  operators () {
    let operator = this.getIndexValue(OPERATORS)
    let lastone = this.getIndexValue(operator.value)
    return [operator.key, lastone].join('')
  }

  getIndexValue (data = []) {
    return data[this.random(data.length)] || 0
  }
}()
