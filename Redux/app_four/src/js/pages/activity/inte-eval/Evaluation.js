import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import { Toast } from 'antd-mobile'
import { redirect, login, get, goCertification } from 'utils'
import 'scss/activity/inte-eval.component.scss'

export default class Evaluation extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () {
    document.title = '智能评测'
  }

  eval () {
    Toast.loading('加载中...', 0)
    get('http://credit.xianjincard.com/activity/intelligence-testing/base-verify').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup')
        if (data.code === -1001) {
          Popup.click('a.click', login)
          return
        }
        Popup.click('a.click')
        return
      }
      if (!data.data.base) {
        Popup.alert(Content.forwardHtml(), 'popup')
        Popup.click('a.click', goCertification)
        return
      }
      redirect.push('/activity/evaluation/stepone')
    })
  }

  render () {
    return (
      <div className='transition-group'>
        <div className='eval'>
          <p className='head'>更好的了解自身情况，更利于您的贷款</p>
          <i />
          <h2>贷款额度低？申请被拒？</h2>
          <h3>测评成功后贷款额度将极大提高，还可获得额外的金币奖励</h3>
          <a onClick={this.eval.bind(this)}>开始测评</a>
          <h4>开始测评即表示您同意平台收集信息用于测评</h4>
        </div>
      </div>
    )
  }
}
