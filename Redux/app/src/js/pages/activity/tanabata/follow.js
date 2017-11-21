import React from 'react'
import { hrefNative as native, copy } from 'utils'
import 'scss/activity/tanabata.component.scss'

export default class Follow extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    document.title = '我的心里“指”有你'
  }

  copy () {
    copy('xianjinbaika')
  }

  save () {
    setTimeout(native(14))
  }
  render () {
    return (
      <div className='transition-group'>
        <div className='follow'>
          <button onClick={this.copy.bind(this)}>复制文字</button>
          <button onClick={this.save.bind(this)}>保存图片</button>
        </div>
      </div>
    )
  }
}
