import React from 'react'
import Choose from './Choose'
import Ihelp from './Ihelp'
import Dream from './Dream'
import { Tabs } from 'antd-mobile'
import { share, resolveUrl, statistics } from 'utils'

import 'scss/activity/gold-powder-two.component.scss'

const TabPane = Tabs.TabPane

export default class GoldPowderTwoTwo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      key: '1'
    }
  }

  componentWillMount () {
    const { key } = this.props.location.query
    let keySlice = key.slice(0, 1)
    this.showTitle(keySlice)
    if (keySlice) {
      this.setState({
        key: keySlice
      })
    }
  }

  componentDidMount () {
    document.title = '金粉关怀日'
    share('GoldPowderTwo')
  }

  tabChange (key) {
    this.showTitle(key)
  }

  showTitle (key) {
    if (key === '1') {
      statistics({
        type: 'goldPowderTwo',
        tag: '金粉优选'
      })
      history.replaceState(null, document.title, resolveUrl('http://h.xianjincard.com/activity/gold-powder-two?key=1'))
    }
    if (key === '2') {
      statistics({
        type: 'goldPowderTwo',
        tag: '金粉i帮'
      })
      history.replaceState(null, document.title, resolveUrl('http://h.xianjincard.com/activity/gold-powder-two?key=2'))
    }
    if (key === '3') {
      statistics({
        type: 'goldPowderTwo',
        tag: '成就梦想'
      })
      history.replaceState(null, document.title, resolveUrl('http://h.xianjincard.com/activity/gold-powder-two?key=3'))
    }
  }

  render () {
    const { key } = this.state

    return (
      <div className='transition-group'>
        <div className='powder'>
          <Tabs defaultActiveKey={key} swipeable={false} destroyInactiveTabPane onChange={this.tabChange.bind(this)}>
            <TabPane tab='' key='1'>
              <Choose />
            </TabPane>
            <TabPane tab='' key='2'>
              <Ihelp />
            </TabPane>
            <TabPane tab='' key='3'>
              <Dream />
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}
