import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import { Toast } from 'antd-mobile'
import { get, login, redirect, resolveUrl } from 'utils'
import 'scss/activity/inte-eval.component.scss'

export default class Steptwo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentWillMount () {
    document.title = '智能评测'
    Toast.loading('加载中...', 0)
    const tag = this.props.location.query.tag
    get(`http://credit.xianjincard.com/activity/intelligence-testing/my-detail?tag=${tag}`).then(data => data.data).then(data => {
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

  forward (url, status) {
    if (status) {
      redirect.push('/activity/evaluation/result')
      return
    }
    location.href = `${url}?callbackUrl=${encodeURIComponent(resolveUrl('http://h.xianjincard.com/activity/evaluation/result'))}`
  }

  render () {
    const { data } = this.state

    const content = <div className='job'>
      <h2 className='head'>02/<b>02</b></h2>
      <div className='content'>
        <ul>
          {data ? data.map((v, i) => <li key={i} onClick={() => this.forward(v.h5_link, v.status)} className={`${v.status ? 'complete' : ''} ${data.length === 1 ? 'single' : ''}`}>
            <img src={v.img} alt={v.name} />
            <h3>{v.name}</h3>
            <h4>{v.status ? '您已完成此项测评' : `完成此项测评将获得${v.gold_score}金币`}</h4>
          </li>
                ) : null}
        </ul>
      </div>
    </div>

    return (
      <div className='transition-group'>
        <div className='eval-two'>
          {content}
        </div>
      </div>
    )
  }
}
