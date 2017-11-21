import React from 'react'

export default class Barrage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      word: ''
    }
    this.animTime = 8
    this.barrageInterval = null
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
    const totalTime = this.animTime + delayTime
    this.barrage(barrage, delayTime, totalTime)
    if (this.props.type === 1) {
      return
    }
    this.barrageInterval = setInterval(() => {
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
      this.barrage(barrage, 0.5, this.animTime + 1)
    }
  }

  componentWillUnmount () {
    clearInterval(this.barrageInterval)
  }

  barrage (domNode, delayTime, totalTime) {
    const top = Math.random() * 3.5
    if (this.props.refresh) {
      this.props.refresh(this.props.index)
    }
    const width = domNode.offsetWidth / 75
    setTimeout(() => {
      domNode.style.left = `-${Math.random() * 5 + width + 4}rem`
      domNode.style.top = `${top}rem`
      domNode.className = `transition color-${Math.floor(Math.random() * 4)}`
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
