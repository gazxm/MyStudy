import React from 'react'
import { share } from 'utils'
import 'scss/activity/make-money.component.scss'
export default class Money extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    document.title = '场景优化'
    share('Money')
  }

  handle () {
    location.href = 'http://h.xianjincard.com/activity/invite'
  }

  render () {
    return (
      <div className='transition-group'>
        <div className='money'>
          <button className='btn1' onClick={() => this.handle()}>赚外快补贴家用</button>
          <button className='btn2' onClick={() => this.handle()}>赚外快出去浪</button>
          <button className='btn3' onClick={() => this.handle()}>赚外快当大厨</button>
        </div>
      </div>
    )
  }
}
