import React from 'react'
import { RefreshControl, ListView } from 'antd-mobile'
import { post, resolveUrl } from 'utils'
import Toast from 'components/Toast'
import 'scss/mobile/message-center/coupon-toast.component.scss'
import 'img/mobile/message-center/center-10.png'

let dataSourceList = []
let locked = 0

export default class CouponToast extends React.Component {
  constructor (props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
    this.id = ''
    this.state = {
      dataSource: dataSource.cloneWithRows([]),
      refreshing: true
    }
  }

  componentDidMount () {
    document.title = '卡券通知'
  }

  fetchData () {
    let params = {}
    if (this.id) {
      params = {max_id: this.id}
    }
    post(`http://credit.xianjincard.com/message/get-card-coupon-list`, params).then(result => {
      if (result.data.code !== 0) {
        Toast.info(result.data.message, 2)
        return
      }
      return result.data.data
    }).then(data => {
      if (this.id === '') {
        data.item = data.item && data.item.length > 0 ? data.item : [{isNotData: true}]
      }
      dataSourceList = [...dataSourceList, ...data.item]
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(dataSourceList),
        refreshing: false
      })
      if (data.item.length === 10) {
        this.id = (typeof data.item[9].id !== 'undefined') ? data.item[9].id : ''
        locked = 1
      }
    })
  }

  createFooter () {
  }

  onEndReached () {
    if (locked) {
      locked = 0
      this.fetchData()
    }
  }

  onRefresh () {
    this.id = ''
    this.setState({
      refreshing: true
    })
    dataSourceList = []
    this.fetchData()
  }

  forward (jump) {
    location.href = resolveUrl(jump.h5)
  }

  render () {
    const row = (rowData, sectionID, rowID) => {
      if (rowData.isNotData) {
        return (
          <div className='div-content'>
            <img src='../../assets/img/mobile/message-center/center-10.png' />
            <h5>暂时没有卡券通知哦~</h5>
          </div>
        )
      }
      let classname = 'list dedu'
      if (rowData.coupon_type === '2') {
        classname = 'list back'
      } else if (rowData.coupon_type === '3') {
        classname = 'list amount'
      } else if (rowData.coupon_type === '5') {
        classname = 'list rene'
      }
      return (
        <div className={classname} onClick={() => this.forward(rowData.jump)}>
          <div className='time'>
            <h1>{rowData.updated_at}</h1>
          </div>
          <div className='content'>
            <h2>{rowData.title}</h2>
            <h3>{rowData.message}</h3>
          </div>
        </div>
      )
    }

    return (
      <div className='transition-group'>
        <div className={dataSourceList[0] && !dataSourceList[0].isNotData ? 'coupon-toast' : 'coupon-toast no-data'}>
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
            onEndReached={this.onEndReached.bind(this)}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                distanceToRefresh={40 * window.lib.flexible.dpr}
                onRefresh={this.onRefresh.bind(this)} />
            } />
        </div>
      </div>
    )
  }
}
