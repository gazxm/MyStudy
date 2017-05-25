import React from 'react'
import { platform } from 'utils'
import GeneratePhone from './GeneratePhone'

let topNum = 1

let prize = ['30%', '50%']

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
      }
    }
  }

  componentWillMount () {
    this.simulation()
    setInterval(() => {
      this.simulation()
    }, 300000)
  }

  componentDidMount () {
    const length = document.querySelectorAll('li').length
    const height = document.querySelectorAll('li')[0].offsetHeight

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

  simulation () {
    this.reward = []
    const length = 20
    for (let i = 0; i < length; i++) {
      this.concatArr(length, i)
    }
  }

  concatArr (length, i, Str = GeneratePhone.getIndexValue(prize)) {
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
    const { topClass } = this.state
    const { type } = this.props

    const List = this.reward.map((v, i) => <li key={i}>恭喜<b>{v[0]}</b> 获得<b>{v[1]}</b>优惠奖励</li>)

    return (
      <div className={`scroll-div ${!type ? '' : 'scroll-not'}`}>
        <div className='scroll-bar'>
          <div className='scroll' style={topClass}>
            {List}
          </div>
        </div>
      </div>
    )
  }
}
