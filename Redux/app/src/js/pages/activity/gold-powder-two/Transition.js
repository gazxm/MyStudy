import React from 'react'
import 'scss/activity/gold-powder-two.component.scss'
import { goHome, share, redirect, statistics} from 'utils'
import 'img/activity/gold-powder-two/1.gif'
import 'img/activity/gold-powder-two/2.gif'
import 'img/activity/gold-powder-two/3.gif'

export default class Transition extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      day: 3
    }
  }

  componentWillMount () {
    const now = new Date().getTime() / 1000
    // 2017/8/18 0:0:0  1502985600
    if (now < 1502985600) {
      this.setState({
        day: 3
      })
      return
    }
    // 2017/8/19 0:0:0 1503072000
    if (now < 1503072000) {
      this.setState({
        day: 2
      })
      return
    }
    this.setState({
      day: 1
    })
  }

  componentDidMount () {
    document.title = '将就倒计时'
    share('powderTwoTransition')
  }

  go () {
    statistics({
      type: 'goldPowderTwo',
      tag: `金币不够`
    })
    redirect.push('http://h.xian jincard.com/signin')
  }
  render () {
    const { day } = this.state

    return (
      <div className={`transition transition-${day}`}>
        <img src={`../../assets/img/activity/gold-powder-two/${day}.gif`} alt='' />
        <a onClick={this.go.bind(this)} />
      </div>
    )
  }
}
