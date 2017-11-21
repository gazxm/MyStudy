import React from 'react'

import 'scss/activity/download-popup.component.scss'

import {platform} from 'utils'

export default class DownloadPopup extends React.Component {
  constructor (props) {
    super(props)
    this.state = {isNot: platform.isApp}
  }
  componentDidMount () {

  }
  download () {
    location.href = 'https://credit.xianjincard.com/download-app.html'
  }
  close (e) {
    e.stopPropagation()
    e.preventDefault()
    this.setState({isNot: true})
  }
  render () {
    const {isNot} = this.state
    if (isNot) return null
    return (
      <div onClick={this.download} class='download-popup'>
        <a href='' class='close' onClick={this.close.bind(this)} />
        <img alt='' src='//h5.xianjincard.com/credit/img/download-logo.png' />
        <div><p>下载即享极速借款<br />被拒最高赔偿<i>50元</i></p></div>
      </div>
    )
  }
}
