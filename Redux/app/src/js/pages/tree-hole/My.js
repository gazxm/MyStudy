import React from 'react'
import { Badge } from 'antd-mobile'
import 'scss/tree-hole/tree-hole.component.scss'

export default class My extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    document.title = '我的设置'
  }

  render () {
    return (
      <div className='my'>
        <div className='head boy clearfix'>
          <i className='i-head' />
          <div className='info left'>
            <h3>隔壁老王</h3>
            <div className='clearfix'>
              <span className='constellation'>双子座</span>
              <i className='line' />
              <span className='city'>上海市</span>
            </div>
          </div>
        </div>
        <div className='line' />
        <div className='content'>
          <div className='my-tree list'>
            <h3>我的树洞</h3>
          </div>
          <div className='my-message list'>
            <span>我的消息</span>
            <Badge text={'2'} />
          </div>
        </div>
      </div>
    )
  }
}
