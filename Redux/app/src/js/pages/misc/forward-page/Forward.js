import React from 'react'
import { callBrowser } from 'utils'

export default class Forward extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () {
    document.title = '跳转下载'
    callBrowser('http://res.xianjincard.com/download/app/xianjinka.apk')
  }

  render () {
    return (
      <div />
    )
  }
}
