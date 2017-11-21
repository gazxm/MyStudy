import React from 'react'
import { DatePicker, ListView, RefreshControl, Tabs, WhiteSpace } from 'antd-mobile'
import { post, redirect } from 'utils'
import Toast from '../../components/Toast'
import 'scss/components/employer.component.scss'

let dataSourceListOne = []
let dataSourceListTwo = []
let locked = 1
let lockedTwo = 1

const TabPane = Tabs.TabPane

const CustomChildren = (props) => (
  <div onClick={props.onClick} className='date-custom'>
    {props.children}
    <span className='date-span'>{props.extra}</span>
  </div>
)

export default class Thelist extends React.Component {
  constructor (props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
    this.ofset = 30
    this.pageNow = 1
    this.pageNowTwo = 1
    this.state = {
      startDate: '',
      endDate: '',
      startDateTwo: '',
      endDateTwo: '',
      dataSource: dataSource,
      dataSourceTwo: dataSource,
      refreshing: false,
      refreshingTwo: false
    }
  }

  componentDidMount () {
    document.title = '资金方查询'
    const params = {
      ofset: this.ofset
    }
    Toast.loading('')
    post('http://credit.xianjincard.com/credit-fund/fund-salculate', params).then(data => data.data).then(data => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows([]),
        dataSourceTwo: this.state.dataSourceTwo.cloneWithRows([])
      })
      if (data.code === 103) {
        Toast.hide()
        Toast.info('请先登录哦', 2)
        redirect.push('/employer/login')
        return
      }
      if (data.code !== 1) {
        Toast.hide()
        Toast.info(`${data.message}`, 2)
        return
      }
      post('http://credit.xianjincard.com/credit-fund/fund-order-list', params).then(data => data.data).then(data2 => {
        Toast.hide()
        if (data2.code === 103) {
          Toast.info('请先登录哦', 2)
          redirect.push('/employer/login')
          return
        }
        if (data2.code !== 1) {
          Toast.info(`${data2.message}`, 2)
          return
        }
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(data.data.res_list),
          dataSourceTwo: this.state.dataSourceTwo.cloneWithRows(data2.data.res_list)
        })
        dataSourceListOne = data.data.res_list
        dataSourceListTwo = data2.data.res_list
      })
    })
  }

  onRefresh () {
    this.setState({refreshing: true})
    let params = {
      ofset: this.ofset
    }
    if (this.state.startDate && this.state.endDate) {
      params = {
        ofset: this.ofset,
        begintime: this.state.startDate.format('YYYY-MM-DD'),
        endtime: this.state.endDate.format('YYYY-MM-DD')
      }
    }
    post('http://credit.xianjincard.com/credit-fund/fund-salculate', params).then(data => data.data).then(data => {
      if (data.code === 103) {
        Toast.info('请先登录哦', 2)
        redirect.push('/employer/login')
        return
      }
      if (data.code === -3) {
        this.setState({
          refreshing: false
        })
        Toast.info('选择的起始时间应小于结束时间哦', 2)
        return
      }
      if (data.code !== 1) {
        this.setState({
          refreshing: false
        })
        Toast.info(`${data.message}`, 2)
        return
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(data.data.res_list),
        refreshing: false
      })
      dataSourceListOne = data.data.res_list
      if (dataSourceListOne.length === 0) {
        Toast.info('没有数据', 2)
      }
      this.pageNow = 1
      locked = 1
    })
  }

  onRefreshTwo () {
    this.setState({refreshingTwo: true})
    let params = {
      ofset: this.ofset
    }
    if (this.state.startDateTwo && this.state.endDateTwo) {
      params = {
        ofset: this.ofset,
        begintime: this.state.startDateTwo.format('YYYY-MM-DD'),
        endtime: this.state.endDateTwo.format('YYYY-MM-DD')
      }
    }
    post('http://credit.xianjincard.com/credit-fund/fund-order-list', params).then(data => data.data).then(data => {
      if (data.code === 103) {
        Toast.info('请先登录哦', 2)
        redirect.push('/employer/login')
        return
      }
      if (data.code === -3) {
        this.setState({
          refreshing: false
        })
        Toast.info('选择的起始时间应小于结束时间哦', 2)
        return
      }
      if (data.code !== 1) {
        this.setState({
          refreshing: false
        })
        Toast.info(`${data.message}`, 2)
        return
      }
      this.setState({
        dataSourceTwo: this.state.dataSourceTwo.cloneWithRows(data.data.res_list),
        refreshingTwo: false
      })
      dataSourceListTwo = data.data.res_list
      if (dataSourceListTwo.length === 0) {
        Toast.info('没有数据', 2)
      }
      this.pageNowTwo = 1
      lockedTwo = 1
    })
  }

  onStartChange (date) {
    if (this.state.endDate) {
      const params = {
        ofset: this.ofset,
        begintime: date.format('YYYY-MM-DD'),
        endtime: this.state.endDate.format('YYYY-MM-DD')
      }
      Toast.loading('')
      post('http://credit.xianjincard.com/credit-fund/fund-salculate', params).then(data => data.data).then(data => {
        Toast.hide()
        if (data.code === 103) {
          Toast.info('请先登录哦', 2)
          redirect.push('/employer/login')
          return
        }
        if (data.code === -3) {
          Toast.info('选择的起始时间应小于结束时间哦', 2)
          return
        }
        if (data.code !== 1) {
          Toast.info(`${data.message}`, 2)
          return
        }
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(data.data.res_list)
        })
        dataSourceListOne = data.data.res_list
        if (dataSourceListOne.length === 0) {
          Toast.info('没有数据', 2)
        }
        this.pageNow = 1
        locked = 1
        setTimeout(() => {
          this.refs.lvOne.refs.listview.scrollTo(0, 0)
        })
      })
    }
    this.setState({startDate: date})
  }

  onEndChange (date) {
    if (this.state.startDate) {
      const params = {
        ofset: this.ofset,
        begintime: this.state.startDate.format('YYYY-MM-DD'),
        endtime: date.format('YYYY-MM-DD')
      }
      Toast.loading('')
      post('http://credit.xianjincard.com/credit-fund/fund-salculate', params).then(data => data.data).then(data => {
        Toast.hide()
        if (data.code === 103) {
          Toast.info('请先登录哦', 2)
          redirect.push('/employer/login')
          return
        }
        if (data.code === -3) {
          Toast.info('选择的起始时间应小于结束时间哦', 2)
          return
        }
        if (data.code !== 1) {
          Toast.info(`${data.message}`, 2)
          return
        }
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(data.data.res_list)
        })
        dataSourceListOne = data.data.res_list
        if (dataSourceListOne.length === 0) {
          Toast.info('没有数据', 2)
        }
        this.pageNow = 1
        locked = 1
        setTimeout(() => {
          this.refs.lvOne.refs.listview.scrollTo(0, 0)
        })
      })
    }
    this.setState({endDate: date})
  }

  onStartChangeTwo (date) {
    if (this.state.endDateTwo) {
      const params = {
        ofset: this.ofset,
        begintime: date.format('YYYY-MM-DD'),
        endtime: this.state.endDateTwo.format('YYYY-MM-DD')
      }
      Toast.loading('')
      post('http://credit.xianjincard.com/credit-fund/fund-order-list', params).then(data => data.data).then(data => {
        Toast.hide()
        if (data.code === 103) {
          Toast.info('请先登录哦', 2)
          redirect.push('/employer/login')
          return
        }
        if (data.code === -3) {
          Toast.info('选择的起始时间应小于结束时间哦', 2)
          return
        }
        if (data.code !== 1) {
          Toast.info(`${data.message}`, 2)
          return
        }
        this.setState({
          dataSourceTwo: this.state.dataSourceTwo.cloneWithRows(data.data.res_list)
        })
        dataSourceListTwo = data.data.res_list
        if (dataSourceListTwo.length === 0) {
          Toast.info('没有数据', 2)
        }
        this.pageNowTwo = 1
        lockedTwo = 1
        setTimeout(() => {
          this.refs.lvTwo.refs.listview.scrollTo(0, 0)
        })
      })
    }
    this.setState({startDateTwo: date})
  }

  onEndChangeTwo (date) {
    if (this.state.startDateTwo) {
      const params = {
        ofset: this.ofset,
        begintime: this.state.startDateTwo.format('YYYY-MM-DD'),
        endtime: date.format('YYYY-MM-DD')
      }
      Toast.loading('')
      post('http://credit.xianjincard.com/credit-fund/fund-order-list', params).then(data => data.data).then(data => {
        Toast.hide()
        if (data.code === 103) {
          Toast.info('请先登录哦', 2)
          redirect.push('/employer/login')
          return
        }
        if (data.code === -3) {
          Toast.info('选择的起始时间应小于结束时间哦', 2)
          return
        }
        if (data.code !== 1) {
          Toast.info(`${data.message}`, 2)
          return
        }
        this.setState({
          dataSourceTwo: this.state.dataSourceTwo.cloneWithRows(data.data.res_list)
        })
        dataSourceListTwo = data.data.res_list
        if (dataSourceListTwo.length === 0) {
          Toast.info('没有数据', 2)
        }
        this.pageNowTwo = 1
        lockedTwo = 1
        setTimeout(() => {
          this.refs.lvTwo.refs.listview.scrollTo(0, 0)
        })
      })
    }
    this.setState({endDateTwo: date})
  }

  formatNumber (str) {
    let strNum = str / 100
    return strNum.toFixed(2)
  }

  onEndReachedOne (e) {
    if (dataSourceListOne.length < 20) {
      return
    }
    if (locked) {
      locked = 0
      this.pageNow = this.pageNow + 1
      let params = {
        ofset: this.ofset,
        page: this.pageNow
      }
      if (this.state.startDate && this.state.endDate) {
        params = {
          ofset: this.ofset,
          page: this.pageNow,
          begintime: this.state.startDate.format('YYYY-MM-DD'),
          endtime: this.state.endDate.format('YYYY-MM-DD')
        }
      }
      post('http://credit.xianjincard.com/credit-fund/fund-salculate', params).then(data => data.data).then(data => {
        if (data.code === 103) {
          Toast.info('请先登录哦', 2)
          redirect.push('/employer/login')
          return
        }
        for (let i in data.data.res_list) {
          dataSourceListOne.push(data.data.res_list[i])
        }
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(dataSourceListOne)
        })
        if (dataSourceListOne.length === Number(data.data.count)) {
          Toast.info('已全部加载', 2)
          return
        }
        locked = 1
      })
    }
  }

  onEndReachedTwo (e) {
    if (dataSourceListTwo.length < 20) {
      return
    }
    if (lockedTwo) {
      lockedTwo = 0
      this.pageNowTwo = this.pageNowTwo + 1
      let params = {
        ofset: this.ofset,
        page: this.pageNowTwo
      }
      if (this.state.startDateTwo && this.state.endDateTwo) {
        params = {
          ofset: this.ofset,
          page: this.pageNowTwo,
          begintime: this.state.startDateTwo.format('YYYY-MM-DD'),
          endtime: this.state.endDateTwo.format('YYYY-MM-DD')
        }
      }
      post('http://credit.xianjincard.com/credit-fund/fund-order-list', params).then(data => data.data).then(data => {
        if (data.code === 103) {
          Toast.info('请先登录哦', 2)
          redirect.push('/employer/login')
          return
        }
        for (let i in data.data.res_list) {
          dataSourceListTwo.push(data.data.res_list[i])
        }
        this.setState({
          dataSourceTwo: this.state.dataSourceTwo.cloneWithRows(dataSourceListTwo)
        })
        if (dataSourceListTwo.length === Number(data.data.count)) {
          Toast.info('已全部加载', 2)
          return
        }
        lockedTwo = 1
      })
    }
  }

  render () {
    const separator = (sectionID, rowID) => (
      <div class='line' key={rowID} />
    )
    const row = (rowData, sectionID, rowID) => {
      const obj = rowData
      return (
        <div key={rowID} className='content'>
          <span className='one'>{obj.date.slice(2)}</span>
          <span className='two'>{this.formatNumber(obj.money_amount)}</span>
          <span className='three'>{this.formatNumber(obj.remaining_quota)}</span>
          <span className='four'>{this.formatNumber(obj.fund_service_fee)}</span>
          <span className='five'>{obj.count_nums}</span>
        </div>
      )
    }
    const rowTwo = (rowData, sectionID, rowID) => {
      const obj = rowData
      return (
        <div key={rowID} className='content'>
          <span className='one'>{obj.loan_time.slice(2, 10)}</span>
          <span className='tel'>{obj.phone}</span>
          <span className='loan'>{this.formatNumber(obj.money_amount)}</span>
          <span className='loan-day'>{obj.loan_term}天</span>
          <span className='service-pay'>{this.formatNumber(obj.fund_service_fee)}</span>
        </div>
      )
    }
    return (
      <div className='transition-group fund-security-certification list-body'>
        <Tabs defaultActiveKey='1' swipeable={false}>
          <TabPane tab='放款统计' key='1'>
            <div style={{background: '#fff'}}>
              <div className='date-div'>
                <div className='date-picker'>
                  <DatePicker mode='date' title='选择日期' extra='请选择开始日期(可选)' value={this.state.startDate} onChange={this.onStartChange.bind(this)}>
                    <CustomChildren />
                  </DatePicker>
                </div>
                <div className='date-separator'>—</div>
                <div className='date-picker'>
                  <DatePicker mode='date' title='选择日期' extra='请选择结束日期(可选)' value={this.state.endDate} onChange={this.onEndChange.bind(this)}>
                    <CustomChildren />
                  </DatePicker>
                </div>
              </div>
              <div className='head'>
                <span>日期</span>
                <span>放款金额</span>
                <span>剩余金额</span>
                <span>资方服务费</span>
                <span>放款笔数</span>
              </div>
              <ListView
                ref='lvOne'
                dataSource={this.state.dataSource}
                renderRow={row}
                renderSeparator={separator}
                initialListSize={20}
                pageSize={20}
                scrollRenderAheadDistance={200}
                scrollEventThrottle={20}
                className='listview'
                scrollerOptions={{ scrollbars: true }}
                onEndReached={this.onEndReachedOne.bind(this)}
                onEndReachedThreshold={10}
                refreshControl={<RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh.bind(this)}
                  distanceToRefresh={40 / 2 * (window.devicePixelRatio || 2)}
                />}
              />
            </div>
          </TabPane>
          <TabPane tab='订单总计' key='2'>
            <div style={{background: '#fff'}}>
              <div className='date-div'>
                <div className='date-picker'>
                  <DatePicker mode='date' title='选择日期' extra='请选择开始日期(可选)' value={this.state.startDateTwo} onChange={this.onStartChangeTwo.bind(this)}>
                    <CustomChildren />
                  </DatePicker>
                </div>
                <div className='date-separator'>—</div>
                <div className='date-picker'>
                  <DatePicker mode='date' title='选择日期' extra='请选择结束日期(可选)' value={this.state.endDateTwo} onChange={this.onEndChangeTwo.bind(this)}>
                    <CustomChildren />
                  </DatePicker>
                </div>
              </div>
              <div className='head'>
                <span>日期</span>
                <span class='tel'>手机号</span>
                <span class='loan'>借款金额</span>
                <span class='day'>借款天数</span>
                <span class='service'>资方服务费</span>
              </div>
              <ListView
                ref='lvTwo'
                dataSource={this.state.dataSourceTwo}
                renderRow={rowTwo}
                renderSeparator={separator}
                initialListSize={20}
                pageSize={20}
                scrollRenderAheadDistance={200}
                scrollEventThrottle={20}
                className='listview'
                scrollerOptions={{ scrollbars: true }}
                onEndReached={this.onEndReachedTwo.bind(this)}
                onEndReachedThreshold={10}
                refreshControl={<RefreshControl
                  refreshing={this.state.refreshingTwo}
                  onRefresh={this.onRefreshTwo.bind(this)}
                  distanceToRefresh={40 / 2 * (window.devicePixelRatio || 2)}
                />}
              />
            </div>
          </TabPane>
        </Tabs>
        <WhiteSpace />
      </div>
    )
  }
}
