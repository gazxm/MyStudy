import React from 'react'
import Barrage from './Barrage'

export default class BarrageContent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: this.props.data,
      barrageDate: [],
      inputData: ''
    }
    this.barrageLength = 15
    this.inputType = 1
  }

  componentWillMount () {
    const { data } = this.state
    this.setData(data)
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      data: nextProps.data,
      inputData: nextProps.inputData
    })
    this.inputType = 1
    this.setData(nextProps.data)
  }

  setData (data) {
    let barrageDate = []
    for (let i = 0; i < this.barrageLength; i++) {
      if (data.length === 0) {
        break
      }
      barrageDate = [...barrageDate, data[Math.floor(Math.random() * data.length)]]
    }
    this.setState({
      barrageDate: barrageDate
    })
  }

  refresh (i) {
    const { data } = this.state
    const { barrageDate } = this.state
    barrageDate[i] = data[Math.floor(Math.random() * data.length)]
    this.setState({
      barrageDate: barrageDate
    })
  }

  setType () {
    this.inputType = 2
  }

  render () {
    const { barrageDate, inputData } = this.state

    const barr = barrageDate.length > 0 ? barrageDate.map((v, i) => <Barrage key={i} index={i} word={v.word} refresh={this.refresh.bind(this)} />) : null
    const input = inputData !== '' ? <Barrage word={inputData} type={this.inputType} setType={this.setType.bind(this)} /> : null

    return (
      <div className='barrage-content'>
        {barr}
        {input}
      </div>
    )
  }
}
