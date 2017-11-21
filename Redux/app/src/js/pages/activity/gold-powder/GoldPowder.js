import React from 'react'
import Tv from './Tv'
import Choose from './Choose'
import Ihelp from './Ihelp'
import Word from './Word'
import { Tabs } from 'antd-mobile'
import { share, resolveUrl, statistics } from 'utils'

import 'scss/activity/gold-powder.component.scss'

const TabPane = Tabs.TabPane

export default class GoldPowder extends React.Component {
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
    share('GoldPowder')
  }

  tabChange (key) {
    this.showTitle(key)
  }

  showTitle (key) {
    if (key === '1') {
      document.title = '金粉剧场'
      statistics({
        type: 'goldPowder',
        tag: '金粉剧场'
      })
      history.replaceState(null, document.title, resolveUrl('http://h.xianjincard.com/activity/gold-powder?key=1'))
    }
    if (key === '2') {
      document.title = '金粉优选'
      statistics({
        type: 'goldPowder',
        tag: '金粉优选'
      })
      history.replaceState(null, document.title, resolveUrl('http://h.xianjincard.com/activity/gold-powder?key=2'))
    }
    if (key === '3') {
      document.title = '金粉i帮'
      statistics({
        type: 'goldPowder',
        tag: '金粉i帮'
      })
      history.replaceState(null, document.title, resolveUrl('http://h.xianjincard.com/activity/gold-powder?key=3'))
    }
    if (key === '4') {
      document.title = '金粉态度'
      statistics({
        type: 'goldPowder',
        tag: '金粉态度'
      })
      history.replaceState(null, document.title, resolveUrl('http://h.xianjincard.com/activity/gold-powder?key=4'))
    }
  }

  render () {
    const { key } = this.state

    return (
      <div className='transition-group'>
        <div className='powder'>
          <Tabs defaultActiveKey={key} swipeable={false} destroyInactiveTabPane onChange={this.tabChange.bind(this)}>
            <TabPane tab='' key='1'>
              <Tv />
            </TabPane>
            <TabPane tab='' key='2'>
              <Choose />
            </TabPane>
            <TabPane tab='' key='3'>
              <Ihelp />
            </TabPane>
            <TabPane tab='' key='4'>
              <Word />
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}
