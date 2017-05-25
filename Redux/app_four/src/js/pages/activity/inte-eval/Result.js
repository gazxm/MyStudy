import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import { Toast } from 'antd-mobile'
import { get, login, redirect } from 'utils'
import 'scss/activity/inte-eval.component.scss'
import 'img/activity/inte-eval/eval-05.jpg'

export default class Result extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: {}
    }
  }

  componentWillMount () {
    Toast.loading('加载中...', 0)
    get('http://credit.xianjincard.com/activity/intelligence-testing/my-test').then(data => data.data).then(data => {
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
      this.setState({
        data: data.data
      })
    })
  }

  componentDidMount () {
    document.title = '测评结果'
  }

  receive () {
    redirect.push('/integral/tasks')
  }

  test () {
    redirect.push('/activity/evaluation/stepone')
  }

  render () {
    const { data } = this.state

    return (
      <div className='transition-group'>
        <div className='result'>
          <h1>阶段智能测评完成</h1>
          <p className='loan'>您的贷款额度<b>已提升</b><br />您的贷款成功率提升至<b>{data.score}%</b></p>
          <p className='quota'><img src='../../../assets/img/activity/inte-eval/eval-05.jpg' /><span><b>{data.quota}</b><br />我的额度</span></p>
          <div className='gold clearfix'>
            <p><span>继续测评额度最高可提至5000<br />还可获得额外的金币奖励。</span></p>
            <a onClick={this.receive.bind(this)}>领取金币奖励</a>
          </div>
          <a className='test' onClick={this.test.bind(this)}>继续测试</a>
        </div>
      </div>
    )
  }
}
