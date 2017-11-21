import React from 'react'
import { RefreshControl, ListView } from 'antd-mobile'
import { post, platform, resolveUrl, goHome } from 'utils'
import qc from 'common/qiancheng'
import Toast from 'components/Toast'
import 'scss/mobile/message-center/loan-message.component.scss'
import 'img/mobile/message-center/center-05.jpg'

let dataSourceList = []
let locked = 0

export default class LoanMessage extends React.Component {
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

  fetchData () {
    let params = {}
    if (this.id) {
      params = {max_id: this.id}
    }
    post(`http://credit.xianjincard.com/message/get-order-notice-list`, params).then(result => {
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

  onRefresh () {
    this.id = ''
    this.setState({
      refreshing: true
    })
    dataSourceList = []
    this.fetchData()
  }

  onEndReached () {
    if (locked) {
      locked = 0
      this.fetchData()
    }
  }

  forward (locationType, cardType) {
    switch (locationType) {
      case '0':
        return
      case '1':
        return goHome()
      case '2':
        if (platform.isApp) {
          qc.track('jump', {url: `koudaikj://app.launch/me/loan_list?type=${cardType}`})
          return
        }
        location.href = resolveUrl('http://h.xianjincard.com/mobile/order')
        return
      default:
        return false
    }
  }

  render () {
    const row = (rowData, sectionID, rowID) => {
      if (rowData.isNotData) {
        return (
          <div className='div-content'>
            <img src='../../assets/img/mobile/message-center/center-05.jpg' />
            <h5>还没有借款哦~</h5>
            <a onClick={() => goHome()}>立即申请</a>
          </div>
        )
      }
      return (
        <div className='div-content' onClick={() => this.forward(rowData.location_type, rowData.card_type)}>
          <div className='time'>
            <h1>{rowData.updated_at}</h1>
          </div>
          <div className='content'>
            <h2>{rowData.title}</h2>
            <h3>{rowData.message}</h3>
            <div className='line' />
            <h4>查看详情</h4>
          </div>
        </div>
      )
    }

    return (
      <div className='transition-group'>
        <div className={dataSourceList[0] && !dataSourceList[0].isNotData ? 'loan-message' : 'loan-message no-data'}>
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
