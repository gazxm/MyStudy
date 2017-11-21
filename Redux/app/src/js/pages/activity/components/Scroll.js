import React from 'react'
import GeneratePhone from './GeneratePhone'

let topNum = 1
let dataInterval = null
let scrollInterval = null

export default class Scroll extends React.Component {
  constructor (props) {
    super(props)
    this.reward = []
    this.firstArr = []
    this.state = {
      topClass: {
        top: `0rem`,
        transition: `all 0.5s ease-in-out`,
        WebkitTranstion: `all 0.5s ease-in-out`
      },
      data: {
        mainData: this.props.data.mainData,
        length: this.props.data.length ? this.props.data.length : 20,
        dataTime: this.props.data.dataTime ? this.props.data.dataTime : 60,
        animTime: this.props.data.animTime ? this.props.data.animTime : 3
      },
      reward: []
    }
  }

  componentWillMount () {
    this.interval()
  }

  componentWillReceiveProps (nextProps) {
    this.setState({
      data: {
        ...nextProps.data
      }
    })
    clearInterval(dataInterval)
    setTimeout(() => {
      this.interval()
    }, 100)
  }

  componentDidMount () {
    const length = document.querySelectorAll('li').length
    if (length === 0) {
      return
    }
    const height = document.querySelectorAll('li')[0].offsetHeight
    const { animTime } = this.state.data

    scrollInterval = setInterval(() => {
      if (topNum >= length) {
        topNum = 0
        this.setState({
          topClass: {
            top: `${-height * topNum}px`
          }
        })
        topNum++
        setTimeout(() => {
          this.setState({
            topClass: {
              top: `${-height * topNum}px`,
              transition: `all 0.5s ease-in-out`,
              WebkitTranstion: `all 0.5s ease-in-out`
            }
          })
          topNum++
        })
        return
      }
      this.setState({
        topClass: {
          top: `${-height * topNum}px`,
          transition: `all 0.5s ease-in-out`,
          WebkitTranstion: `all 0.5s ease-in-out`
        }
      })
      topNum++
    }, animTime * 1000)
  }

  componentWillUnmount () {
    clearInterval(dataInterval)
    clearInterval(scrollInterval)
  }

  interval () {
    const { dataTime } = this.state.data
    this.simulation()
    dataInterval = setInterval(() => {
      this.simulation()
    }, dataTime * 1000)
  }

  simulation () {
    this.reward = []
    this.setState({
      reward: []
    })
    const { length } = this.state.data
    for (let i = 0; i < length; i++) {
      this.concatArr(length, i)
    }
  }

  concatArr (length, i, Str = GeneratePhone.getIndexValue(this.state.data.mainData)) {
    let arr = [[GeneratePhone.phone().replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'), Str]]
    if (i === 0) {
      this.firstArr = arr
    }
    this.reward = [...this.reward, ...arr]
    if (i === (length - 1)) {
      this.reward = [...this.reward, ...this.firstArr]
      this.setState({
        reward: this.reward
      })
    }
  }

  render () {
    const { topClass, reward } = this.state

    const List = reward.map((v, i) => <li key={i}>恭喜<b>{v[0]}</b> 获得<b>{v[1]}</b></li>)

    return (
      <div className='scroll-div'>
        <div className='scroll-bar'>
          <div className='scroll' style={topClass}>
            {List}
          </div>
        </div>
      </div>
    )
  }
}
