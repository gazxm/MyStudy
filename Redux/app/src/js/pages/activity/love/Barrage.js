import React from 'react'

const animTime = 8
let barrageInterval = null

export default class Barrage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      word: ''
    }
  }

  componentWillMount () {
    this.setState({
      word: this.props.word
    })
  }

  componentDidMount () {
    const { barrage } = this.refs
    let delayTime = Math.random() * 10
    if (this.props.type === 1) {
      delayTime = 0.5
    }
    const totalTime = animTime + delayTime
    this.barrage(barrage, delayTime, totalTime)
    if (this.props.type === 1) {
      return
    }
    barrageInterval = setInterval(() => {
      this.barrage(barrage, delayTime, totalTime)
    }, totalTime * 1000)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      word: nextProps.word
    })
    if (nextProps.type === 1) {
      const { barrage } = this.refs
      nextProps.setType()
      this.barrage(barrage, 0.5, animTime + 1)
    }
  }

  componentWillUnmount () {
    clearInterval(barrageInterval)
  }

  barrage (domNode, delayTime, totalTime) {
    const top = Math.random() * 1.5
    if (this.props.refresh) {
      this.props.refresh(this.props.index)
    }
    setTimeout(() => {
      domNode.style.left = `-${Math.random() * 5 + 5}rem`
      domNode.style.top = `${top}rem`
      domNode.className = `transition color-${Math.floor(Math.random() * 3)}`
    }, delayTime * 1000)
    setTimeout(() => {
      domNode.className = ''
      domNode.style.left = ``
      domNode.style.top = ``
    }, totalTime * 1000)
  }

  render () {
    const { word } = this.state

    return (
      <div ref='barrage'>{word}</div>
    )
  }
}
