import React from 'react'
import Content from './Content'
import Effect from './Effect'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, share, login, platform, resolveUrl } from 'utils'
import 'scss/activity/tanabata.component.scss'

export default class Friend extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
  }

  componentDidMount () {
    document.title = '我的心里“指”有你'
  }

  // 跳转至录指纹页
  goto () {
    const { query } = this.props.location
    location.href = resolveUrl(`http://h.xianjincard.com/activity/tanabata/FriTanabata?sign=${query.sign}`)
  }

  render () {
    return (
      <div className='transition-group'>
        <div className='tanabata '>
          <span className='tit' />
          <div className='recipient'>
            <p className='tips'>快录入你的指纹测测我们亲密指数</p>
            <div className='finger'>
              <span className='img4' />
            </div>
            <button className='share-btn' onClick={() => { this.goto() }}>开始录入</button>
            <p className='meta'>关注微信公众号“xianjinbaika"<br />即可实时查看指数结果</p>
          </div>
        </div>
      </div>
    )
  }
}
