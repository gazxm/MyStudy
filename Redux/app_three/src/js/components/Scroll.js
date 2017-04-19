import React from 'react'
import GeneratePhone from './GeneratePhone'
import 'scss/components/scroll.component.scss'

let topNum = 1

export default class Scroll extends React.Component {
  constructor (props) {
    super(props)
    this.reward = []
    this.firstArr = []
    this.scroll = this.props.scroll
    this.transition = `all ${this.scroll.time}s ease-in-out`
    this.state = {
      topClass: {
        top: `0rem`,
        transition: this.transition,
        WebkitTranstion: this.transition
      }
    }
  }

  componentWillMount () {
    this.simulation()
    setInterval(() => {
      this.simulation()
    }, this.scroll.rTime * 1000)
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
              transition: this.transition,
              WebkitTranstion: this.transition
            }
          })
          topNum++
        }, 10)
        return
      }
      this.setState({
        topClass: {
          top: `${-height * topNum}px`,
          transition: this.transition,
          WebkitTranstion: this.transition
        }
      })
      topNum++
    }, this.scroll.delayTime * 1000)
  }

  simulation () {
    const length = this.scroll.length
    this.reward = []
    for (let i = 0; i < length; i++) {
      this.concatArr(length, i)
    }
  }

  concatArr (length, i, Str = GeneratePhone.getIndexValue(this.scroll.prize)) {
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
    const { scroll } = this.props

    const List = this.reward.map((v, i) => <li className='scroll-li' key={i}>恭喜<b>{v[0]}</b> 获得<b>{v[1]}</b>优惠奖励</li>)

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
