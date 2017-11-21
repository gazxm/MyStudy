import React from 'react'
import GeneratePhone from './GeneratePhone'

let topNum = 1

export default class Scroll extends React.Component {
  constructor (props) {
    super(props)
    this.firstArr = []
    this.reward = []
    this.prize = []
    this.state = {
      reward: [],
      topClass: {
        top: `0rem`,
        transition: `all 0.5s ease-in-out`,
        WebkitTranstion: `all 0.5s ease-in-out`
      }
    }
  }

  componentWillMount () {
    this.prize = this.props.scroll.prize
    this.simulation()
    setInterval(() => {
      this.simulation()
    }, 300000)
  }

  componentWillReceiveProps (nextProps) {
    if (this.prize !== nextProps.scroll.prize) {
      this.prize = nextProps.scroll.prize
      this.simulation(nextProps.scroll.prize)
      return
    }
  }

  componentDidMount () {
    const length = document.querySelectorAll('li.scroll-li').length
    const height = document.querySelectorAll('li.scroll-li')[0].offsetHeight
    setInterval(() => {
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
        }, 10)
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
    }, 3000)
  }

  simulation (prize) {
    const length = 20
    this.reward = []
    for (let i = 0; i < length; i++) {
      if (prize) {
        this.concatArr(length, i, GeneratePhone.getIndexValue(prize))
        continue
      }
      this.concatArr(length, i)
    }
    this.setState({
      reward: this.reward
    })
  }

  concatArr (length, i, Str = GeneratePhone.getIndexValue(this.props.scroll.prize)) {
    let arr = [[GeneratePhone.phone().replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'), Str]]
    if (i === 0) {
      this.firstArr = arr
    }
    this.reward = [...this.reward, ...arr]
    if (i === (length - 1)) {
      this.reward = [...this.reward, ...this.firstArr]
    }
  }

  render () {
    const { topClass, reward } = this.state
    const List = reward.map((v, i) => <li className='scroll-li' key={i}>恭喜<b>{v[0]}</b> 抢到<b>{v[1]}</b></li>)

    return (
      <div className={'scroll-div'}>
        <div className='scroll-bar'>
          <div className='scroll' style={topClass}>
            {List}
          </div>
        </div>
      </div>
    )
  }
}
