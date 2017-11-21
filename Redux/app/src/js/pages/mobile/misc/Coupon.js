import React from 'react'
import { Tabs, RefreshControl, ListView } from 'antd-mobile'
import { get, goHome, resolveUrl, redirect } from 'utils'
import Toast from 'components/Toast'
import qc from 'common/qiancheng'
import 'scss/mobile/coupon-two.component.scss'
import 'img/mobile/misc/coupon/coupon_01.png'

const TabPane = Tabs.TabPane
export default class Coupon extends React.Component {
  constructor (props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
    this.state = {
      dataSource: dataSource.cloneWithRows([]),
      dataSourceTwo: dataSource.cloneWithRows([]),
      dataSourceThree: dataSource.cloneWithRows([]),
      refreshing: true,
      refreshingTwo: true,
      refreshingThree: true,
      orderId: 0
    }
  }

  componentDidMount () {
    document.title = '优惠券'
    qc.track('setRightNavButton', {
      text: '使用说明',
      callback () {
        redirect.push('/mobile/instructions')
      }
    })
  }

  tabChange (key) {

  }

  fetchData () {
    get('http://credit.xianjincard.com/v2/coupon/get-mine-coupon').then((result) => {
      if (result.data.code !== 0) {
        Toast.info(result.data.message, 2)
        return
      }
      return result.data.data
    }).then((data) => {
      const item = data.item && data.item.length > 0 ? data.item : [{isNotData: true}]
      const itemExpire = data.item_expire && data.item_expire.length > 0 ? data.item_expire : [{isNotData: true}]
      const itemSuccess = data.item_success && data.item_success.length > 0 ? data.item_success : [{isNotData: true}]
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(item),
        dataSourceTwo: this.state.dataSource.cloneWithRows(itemSuccess),
        dataSourceThree: this.state.dataSource.cloneWithRows(itemExpire),
        orderId: data.order_id
      })
      this.setRefresh(false)
    }).catch((error) => { console.log(error) })
  }

  onRefresh () {
    this.setRefresh(true)
    this.fetchData()
  }

  setRefresh (type) {
    this.setState({
      refreshing: type,
      refreshingTwo: type,
      refreshingThree: type
    })
  }

  createFooter () {
  }

  forwardUrl (type, id, msg) {
    if (type === '5') {
      if (id) {
        location.href = resolveUrl(`http://m.xianjincard.com/loan/loan-detail?id=${id}`)
        return
      }
      Toast.info(msg, 2)
      return
    }
    if (id) {
      Toast.info(msg, 2)
      return
    }
    goHome()
  }

  render () {
    const row = (rowData, sectionID, rowID) => {
      if (rowData.isNotData) {
        return (
          <div className='no-data'>
            <img src={require('../../../../assets/img/mobile/misc/coupon/coupon_01.png')} />
            <h6>暂无可用的优惠券</h6>
          </div>
        )
      }
      const title = rowData.use_type && rowData.use_type === '2' ? <h1><b>{rowData.coupon_name.slice(0, 1)}</b>{rowData.coupon_name.slice(1)}</h1> : <h1>{rowData.coupon_name.slice(0, 1)}<b>{rowData.coupon_name.slice(1)}</b></h1>
      return (
        <div className='ticket' onClick={() => this.forwardUrl(rowData.use_type, this.state.orderId, rowData.item_msg)}>
          <img src={rowData.color} />
          <div className='content'>
            <div className='left'>
              {title}
              <h2>{rowData.use_type_txt}</h2>
            </div>
            <div className='middle'>
              <h3>{rowData.title}</h3>
              <p>使用条件：{rowData.condition && rowData.condition !== '' ? rowData.condition : '无限制'}<br />{rowData.time}</p>
            </div>
            <div className='right'>立即使用</div>
          </div>
        </div>
      )
    }

    const rowTwo = (rowData, sectionID, rowID) => {
      if (rowData.isNotData) {
        return (
          <div className='no-data'>
            <img src={require('../../../../assets/img/mobile/misc/coupon/coupon_01.png')} />
            <h6>暂无已使用的优惠券</h6>
          </div>
        )
      }
      const title = rowData.use_type && rowData.use_type === '2' ? <h1><b>{rowData.coupon_name.slice(0, 1)}</b>{rowData.coupon_name.slice(1)}</h1> : <h1>{rowData.coupon_name.slice(0, 1)}<b>{rowData.coupon_name.slice(1)}</b></h1>
      return (
        <div className='ticket' onClick={() => Toast.info('已使用', 2)}>
          <img src={rowData.color} />
          <div className='content'>
            <div className='left'>
              {title}
              <h2>{rowData.use_type_txt}</h2>
            </div>
            <div className='middle'>
              <h3>{rowData.title}</h3>
              <p>使用条件：{rowData.condition && rowData.condition !== '' ? rowData.condition : '无限制'}<br />{rowData.time}</p>
            </div>
            <div className='right'>已使用</div>
          </div>
        </div>
      )
    }

    const rowThree = (rowData, sectionID, rowID) => {
      if (rowData.isNotData) {
        return (
          <div className='no-data'>
            <img src={require('../../../../assets/img/mobile/misc/coupon/coupon_01.png')} />
            <h6>暂无已过期的优惠券</h6>
          </div>
        )
      }
      const title = rowData.use_type && rowData.use_type === '2' ? <h1><b>{rowData.coupon_name.slice(0, 1)}</b>{rowData.coupon_name.slice(1)}</h1> : <h1>{rowData.coupon_name.slice(0, 1)}<b>{rowData.coupon_name.slice(1)}</b></h1>
      return (
        <div className='ticket' onClick={() => Toast.info('已过期', 2)}>
          <img src={rowData.color} />
          <div className='content'>
            <div className='left'>
              {title}
              <h2>{rowData.use_type_txt}</h2>
            </div>
            <div className='middle'>
              <h3>{rowData.title}</h3>
              <p>使用条件：{rowData.condition && rowData.condition !== '' ? rowData.condition : '无限制'}<br />{rowData.time}</p>
            </div>
            <div className='right'>已过期</div>
          </div>
        </div>
      )
    }

    return (
      <div className='coupon xjk-refresh'>
        <Tabs defaultActiveKey='1' swipeable={false} destroyInactiveTabPane onChange={this.tabChange.bind(this)}>
          <TabPane tab='可使用' key='1'>
            <div className='use'>
              <ListView
                dataSource={this.state.dataSource}
                renderRow={row}
                initialListSize={10}
                pageSize={10}
                scrollRenderAheadDistance={200}
                scrollEventThrottle={20}
                style={{
                  height: document.documentElement.clientHeight,
                  margin: '0.1rem 0'
                }}
                scrollerOptions={{ scrollbars: true }}
                renderFooter={this.createFooter}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    distanceToRefresh={40 * window.lib.flexible.dpr}
                    onRefresh={this.onRefresh.bind(this)} />
                } />
            </div>
          </TabPane>
          <TabPane tab='已使用' key='2'>
            <div className='in-use'>
              <ListView
                dataSource={this.state.dataSourceTwo}
                renderRow={rowTwo}
                initialListSize={10}
                pageSize={10}
                scrollRenderAheadDistance={200}
                scrollEventThrottle={20}
                style={{
                  height: document.documentElement.clientHeight,
                  margin: '0.1rem 0'
                }}
                scrollerOptions={{ scrollbars: true }}
                renderFooter={this.createFooter}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshingTwo}
                    distanceToRefresh={40 * window.lib.flexible.dpr}
                    onRefresh={this.onRefresh.bind(this)} />
                } />
            </div>
          </TabPane>
          <TabPane tab='已过期' key='3'>
            <div className='past'>
              <ListView
                dataSource={this.state.dataSourceThree}
                renderRow={rowThree}
                initialListSize={10}
                pageSize={10}
                scrollRenderAheadDistance={200}
                scrollEventThrottle={20}
                style={{
                  height: document.documentElement.clientHeight,
                  margin: '0.1rem 0'
                }}
                scrollerOptions={{ scrollbars: true }}
                renderFooter={this.createFooter}
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshingThree}
                    distanceToRefresh={40 * window.lib.flexible.dpr}
                    onRefresh={this.onRefresh.bind(this)} />
                } />
            </div>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
