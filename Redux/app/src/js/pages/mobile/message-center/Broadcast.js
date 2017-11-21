import React from 'react'
import { RefreshControl, ListView } from 'antd-mobile'
import { post, resolveUrl } from 'utils'
import Toast from 'components/Toast'
import 'scss/mobile/message-center/broadcast.component.scss'
import 'img/mobile/message-center/center-09.jpg'

let dataSourceList = []
let locked = 0

export default class Broadcast extends React.Component {
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
    document.title = '福利广播'
  }

  fetchData () {
    let params = {type: 3}
    if (this.id) {
      Object.assign(params, {max_id: this.id})
    }
    post(`http://credit.xianjincard.com/message/get-orter-notice-list`, params).then(result => {
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

  forward (link) {
    if (link) {
      location.href = link
    }
  }

  forwardAc () {
    location.href = resolveUrl('http://credit.xianjincard.com/credit-web/result-message?clientType=wap')
  }

  render () {
    const row = (rowData, sectionID, rowID) => {
      if (rowData.isNotData) {
        return (
          <div className='div-content'>
            <img src='../../assets/img/mobile/message-center/center-09.jpg' />
            <h5>还没有内容哦~</h5>
            <a onClick={this.forwardAc.bind(this)}>去看看活动</a>
          </div>
        )
      }
      const view = rowData.link ? <div><div className='line' />
        <h4>查看详情</h4></div> : null
      return (
        <div className='bro-content' onClick={() => this.forward(rowData.link)}>
          <div className='time'>
            <h1>{rowData.updated_at}</h1>
          </div>
          <div className='content'>
            <img src={rowData.banner} />
            <h2>{rowData.title}</h2>
            <h3>活动时间：<b>{rowData.start_time}-{rowData.end_time}</b></h3>
            {view}
          </div>
        </div>
      )
    }

    return (
      <div className='transition-group'>
        <div className={dataSourceList[0] && !dataSourceList[0].isNotData ? 'broadcast' : 'broadcast no-data'}>
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
