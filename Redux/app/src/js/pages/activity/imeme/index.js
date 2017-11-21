import React, {Component} from 'react'
import compareVersions from 'compare-versions'
import {platform} from 'utils'

import 'scss/activity/imeme.component.scss'

export default class index extends Component {
  state = {
    url: 'http://m.2339.com/pay'
  }
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    document.title = '么么直播'
    let isMeme = navigator.userAgent.replace('. (Android)', '').indexOf('MeMeBrowserNative') !== -1
    let {url} = this.state
    if (isMeme) {
      url = 'mmshow-cashpay://?money=500'
      if (platform.isAndroid && compareVersions(platform.version.replace('. (Android)', ''), '5.16.0') == -1) {
        url = 'mmshow-pay://com.sds.android.ttshow'
      }
    }
    this.setState({url})
  }
  render () {
    let {url} = this.state
    return (
      <div className='wrapper wrapper-activity-imeme-instruction loaded'>
        <div className='title' />
        <div className='picture picture-1' />
        <div className='picture picture-2' />
        <div className='picture picture-3' />
        <div className='picture picture-4' />
        <div className='picture picture-5' />
        <a className='button' href={url}>立即充值</a>
      </div>
    )
  }
};
