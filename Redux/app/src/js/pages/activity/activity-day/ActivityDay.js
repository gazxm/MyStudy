import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, redirect, share } from 'utils'
import 'scss/activity/activity-day.component.scss'

export default class ActivityDay extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      lit: 0
    }
  }

  componentWillMount () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/activity-day-act/index').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(-2100), 'popup-error')
        Popup.click('a.click')
        return
      }
      this.setState({
        lit: data.data.lit
      })
    })
  }

  componentDidMount () {
    document.title = '现金卡活动日'
    share('ActivityDay')
  }

  gold () {
    redirect.push('/activity/activity-day/gold')
  }

  back () {
    redirect.push('/activity/activity-day/back-two')
  }

  free () {
    redirect.push('/activity/activity-day/free')
  }

  render () {
    const { lit } = this.state
    return (
      <div className='transition-group'>
        <div className='activity-day'>
          <div className='gold-rush'>
            <i onClick={this.gold.bind(this)} />
            <div className={`overlay ${lit !== 1 ? '' : 'no'}`}>即将开始</div>
            <div className={`ongoing ${lit !== 1 ? 'no' : ''}`}><span>进行中</span></div>
          </div>
          <div className='back-now'>
            <i onClick={this.back.bind(this)} />
            <div className={`overlay ${lit !== 2 ? '' : 'no'}`}>即将开始</div>
            <div className={`ongoing ${lit !== 2 ? 'no' : ''}`}><span>进行中</span></div>
          </div>
          <div className='free-div'>
            <i onClick={this.free.bind(this)} />
            <div className={`overlay ${lit !== 3 ? '' : 'no'}`}>即将开始</div>
            <div className={`ongoing ${lit !== 3 ? 'no' : ''}`}><span>进行中</span></div>
          </div>
        </div>
      </div>
    )
  }
}
