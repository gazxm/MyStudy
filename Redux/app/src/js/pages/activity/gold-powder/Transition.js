import React from 'react'
import 'scss/activity/gold-powder.component.scss'
import { goHome, share } from 'utils'
import 'img/activity/gold-powder/1.gif'
import 'img/activity/gold-powder/2.gif'
import 'img/activity/gold-powder/3.gif'

export default class Transition extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      day: 3
    }
  }

  componentWillMount () {
    const now = new Date().getTime() / 1000
    if (now < 1500307200) {
      this.setState({
        day: 3
      })
      return
    }
    if (now < 1500393600) {
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
    share('powderTransition')
  }

  go () {
    goHome()
  }

  render () {
    const { day } = this.state

    return (
      <div className={`transition transition-${day}`}>
        <img src={`../../assets/img/activity/gold-powder/${day}.gif`} alt='' />
        <a onClick={this.go.bind(this)} />
      </div>
    )
  }
}
