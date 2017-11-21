import React from 'react'
import { Tabs, Badge } from 'antd-mobile'
import 'scss/tree-hole/tree-hole.component.scss'
import Topic from './Topic'
import My from './My'
import Tree from './Tree'

const TabPane = Tabs.TabPane

export default class index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount () {
    document.title = '树洞'
  }

  render () {
    return (
      <div className='tree-hole'>
        <Tabs defaultActiveKey='1' swipeable={false}>
          <TabPane tab='树洞' key='1'>
            <Tree />
          </TabPane>
          <TabPane tab='话题' key='2'>
            <Topic />
          </TabPane>
          <TabPane tab={<Badge text={'5'}>我的</Badge>} key='3'>
            <My />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
