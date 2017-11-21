import React from 'react'
import { login, back } from 'utils'
import 'scss/activity/novice.component.scss'

export default class Forward extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    document.title = '新手活动'
    login()
    back()
  }

  render () {
    return (
      <div className='transition-group'>
        <div className='novice'>
          <p>页面跳转中...</p>
        </div>
      </div>
    )
  }
}
