import React from 'react'
import GeneratePhone from './GeneratePhone'

let topNum = 1

let prize = ['1天免息券', '2天免息券', '3天免息券', '5天免息券', '10个金币', '20个金币', '50个金币', '100个金币', '150个金币', '0.1元现金红包', '0.2元现金红包', '0.5元现金红包', '0.8元现金红包', '1元现金红包', '2元现金红包', '2元抵扣券', '5元抵扣券', '8元抵扣券', '10元抵扣券', '15元抵扣券', '100元提额券', '100M流量']

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
    }, 60000)
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
    }, 3000)
  }

  simulation () {
    this.reward = []
    const length = 20
    let ipN = Math.floor(Math.random() * length)
    let goldN = Math.floor(Math.random() * length)
    if (ipN === goldN) {
      goldN++
    }
    for (let i = 0; i < length; i++) {
      if (ipN === i) {
        this.concatArr(length, i, 'iPhone 7')
        continue
      }
      if (goldN === i) {
        this.concatArr(length, i, '10g金条')
        continue
      }
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

    const List = this.reward.map((v, i) => <li key={i}>恭喜<b>{v[0]}</b> 获得<b>{v[1]}</b></li>)

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
