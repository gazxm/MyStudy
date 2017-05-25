import React from 'react'

const animTime = 8

export default class Barrage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      barrageData: [],
      inputData: ''
    }
  }

  componentWillMount () {
    const { timeFlag } = this.props
    if (timeFlag !== 0) {
      return
    }
    this.randomData()
  }

  componentWillReceiveProps (nextProps) {
    const { timeFlag } = this.props
    if (timeFlag !== 0) {
      return
    }
    const { inputData } = nextProps
    if (inputData) {
      this.setState({
        inputData: inputData
      })
    }
  }

  componentDidMount () {
    const { timeFlag } = this.props
    if (timeFlag !== 0) {
      return
    }
    for (let i in this.refs) {
      const delayTime = Math.random() * 10
      let totalTime = animTime + delayTime
      this.barrage(this.refs[i], delayTime, totalTime)
      setInterval(() => {
        this.barrage(this.refs[i], delayTime, totalTime)
      }, totalTime * 1000)
    }
  }

  componentDidUpdate () {
    const { timeFlag } = this.props
    if (timeFlag !== 0) {
      return
    }
    const top = Math.random() * 1.2
    setTimeout(() => {
      this.refs.inputData.className = `transition color-${Math.floor(Math.random() * 3)}`
      this.refs.inputData.style.top = `${top}rem`
      this.refs.inputData.style.left = `-${Math.random() * 5 + 5}rem`
    }, 100)
    setTimeout(() => {
      this.refs.inputData.className = ''
      this.refs.inputData.style.left = ``
      this.refs.inputData.style.top = ``
    }, animTime * 1000 + 100)
  }

  barrage (domNode, delayTime, totalTime) {
    const { timeFlag } = this.props
    if (timeFlag !== 0) {
      return
    }
    const { data } = this.props.data
    const textData = data[Math.floor(Math.random() * 50)].word
    const top = Math.random() * 1.5
    domNode.innerHTML = textData
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

  randomData () {
    const { data, length } = this.props.data
    let finalData = []
    for (let i = 0; i < length; i++) {
      finalData = [...finalData, ...[data[Math.floor(Math.random() * 50)]]]
    }
    this.setState({
      barrageData: finalData
    })
  }

  render () {
    const { barrageData, inputData } = this.state
    const { timeFlag } = this.props
    const barrage = barrageData && timeFlag === 0 ? barrageData.map((v, i) => <div key={i} ref={`barrage${i}`}>{v.word}</div>) : null
    const input = inputData ? <div ref='inputData'>{inputData}</div> : null

    return (
      <div className='barrage'>
        <div className='barrage-content'>
          {barrage}
          {input}
        </div>
      </div>
    )
  }
}
