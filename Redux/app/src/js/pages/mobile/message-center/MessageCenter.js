import React from 'react'
import { List, Badge, RefreshControl, ListView } from 'antd-mobile'
import { redirect, get } from 'utils'
import Toast from 'components/Toast'
import 'scss/mobile/message-center/message-center.component.scss'

const Item = List.Item

export default class MessageCenter extends React.Component {
  constructor (props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
    this.state = {
      dataSource: dataSource.cloneWithRows([]),
      refreshing: true
    }
  }

  componentDidMount () {
    document.title = '消息中心'
  }

  fetchData () {
    get('http://credit.xianjincard.com/message/get-all-notice').then(result => {
      if (result.data.code !== 0) {
        Toast.info(result.data.message, 2)
        return
      }
      return result.data.data
    }).then(data => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(data),
        refreshing: false
      })
    })
  }

  onRefresh () {
    this.setState({
      refreshing: true
    })
    this.fetchData()
  }

  createFooter () {
  }

  forWard (type) {
    if (type === 'system') {
      redirect.push('/mobile/message-center/system-message')
      return
    }
    if (type === 'loan') {
      redirect.push('/mobile/message-center/loan-message')
      return
    }
    if (type === 'bro') {
      redirect.push('/mobile/message-center/broadcast')
      return
    }
    if (type === 'toast') {
      redirect.push('/mobile/message-center/coupon-toast')
    }
  }

  render () {
    const row = (rowData, sectionID, rowID) => {
      return (
        <div className={`list ${rowData.type}`} onClick={() => this.forWard(rowData.type)}>
          {rowData.is_new ? rowData.number > 0 ? <Badge text={rowData.number} /> : <Badge text='新' /> : null}
          <Item>
            <h1>{rowData.type && rowData.type === 'system' ? '系统通知' : rowData.type === 'loan' ? '借款消息' : rowData.type === 'bro' ? '福利广播' : rowData.type === 'toast' ? '卡券通知' : null}</h1>
            <h2>{rowData.title ? rowData.title : '暂无消息'}</h2>
            <h3>{rowData.time}</h3>
          </Item>
        </div>
      )
    }

    return (
      <div className='transition-group'>
        <div className='message-center'>
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
      </div>
    )
  }
}
