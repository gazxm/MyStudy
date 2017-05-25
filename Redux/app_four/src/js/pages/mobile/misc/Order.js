import React from 'react'
import { List, ListView, RefreshControl, Icon } from 'antd-mobile'
import {get} from 'utils'
import Toast from 'components/Toast'
import 'scss/mobile/me.component.scss'

const Item = List.Item
const Brief = Item.Brief

export default class Me extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object
  }
  constructor (props) {
    super(props)
    this.al = 0
    this.progress = 0
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
    this.data = []
    this.state = {
      dataSource: dataSource.cloneWithRows([this.data]),
      refreshing: true
    }
  }
  componentDidMount () {
    document.title = '个人中心'
    // this.setState({refreshing: true})
  }
  fetchData () {
    get('http://credit.xianjincard.com/credit-loan/get-my-orders').then((result) => {
      // console.log(result)
      if (result.data.code !== 0) {
        Toast.info(result.data.message, 2)
        return
      }
      this.data = result.data.data.item
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows([this.data]),
        refreshing: false
      })
    }).catch((error) => { console.log(error) })
  }
  onRefresh () {
    this.setState({refreshing: true})
    this.fetchData()
  }
  onClick (item) {
    location.href = item.url
  }
  list (items) {
    if (items.length > 0) {
      return items.map((v, i) => <Item key={i} multipleLine extra={<div dangerouslySetInnerHTML={{__html: v.text.replace(/size="\d"/, '')}}/>} arrow="horizontal" onClick={this.onClick.bind(this, v)}>{v.title}<Brief>{v.time}</Brief></Item>)
    }
    if (items.length <= 0 && !this.state.refreshing) return <div class="order-nothing">你还没有借款记录哦~</div>
  }
  render () {
    const row = (rowData, sectionID, rowID) => {
      return (
        <List class='me'>{this.list(rowData)}</List>
      )
    }
    return (
      <ListView
        class='xjk-refresh'
        dataSource={this.state.dataSource}
        renderRow={row}
        initialListSize={5}
        pageSize={5}
        scrollRenderAheadDistance={200}
        scrollEventThrottle={20}
        style={{
          height: document.documentElement.clientHeight
        }}
        refreshControl={
            <RefreshControl
                refreshing={this.state.refreshing}
                icon={[
                  <div key="0" className="am-refresh-control-pull">
                        <Icon type="arrow-down"/><span>科技让金融更简单</span>
                      </div>,
                  <div key="1" className="am-refresh-control-release">
                    <Icon type="arrow-up"/><span>科技让金融更简单</span>
                  </div>
                ]}
                distanceToRefresh={80 / 2 * (window.devicePixelRatio || 2)}
                onRefresh={this.onRefresh.bind(this)}/>
            }/>
    )
  }
}
