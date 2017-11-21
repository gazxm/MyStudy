import React from 'react'
import { login, back } from 'utils'
import 'scss/activity/novice.component.scss'

export default class Novice extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    document.title = '免费借钱'
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
