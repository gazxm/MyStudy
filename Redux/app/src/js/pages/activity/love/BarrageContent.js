import React from 'react'
import Barrage from './Barrage'

const barrageLength = 10
let inputType = 1

export default class BarrageContent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: this.props.data,
      barrageDate: [],
      inputData: ''
    }
  }

  componentWillMount () {
    const { data } = this.state
    let barrageDate = []
    for (let i = 0; i < barrageLength; i++) {
      barrageDate = [...barrageDate, data[Math.floor(Math.random() * 50)]]
    }
    this.setState({
      barrageDate: barrageDate
    })
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      data: nextProps.data,
      inputData: nextProps.inputData
    })
    inputType = 1
  }

  refresh (i) {
    const { data } = this.state
    const { barrageDate } = this.state
    barrageDate[i] = data[Math.floor(Math.random() * 50)]
    this.setState({
      barrageDate: barrageDate
    })
  }

  setType () {
    inputType = 2
  }

  render () {
    const { barrageDate, inputData } = this.state

    const barr = barrageDate.length > 0 ? barrageDate.map((v, i) => <Barrage key={i} index={i} word={v.word} refresh={this.refresh.bind(this)} />) : null
    const input = inputData !== '' ? <Barrage word={inputData} type={inputType} setType={this.setType.bind(this)} /> : null

    return (
      <div className='barrage'>
        <div className='barrage-content'>
          {barr}
          {input}
        </div>
      </div>
    )
  }
}
