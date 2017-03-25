import React from 'react'
import { DatePicker, ListView, RefreshControl, Tabs, WhiteSpace } from 'antd-mobile'

import 'scss/components/employer.component.scss'

const data = {data: [
  {
    date: '16-01-12',
    total: '1232132',
    surplus: '13213213',
    service: '15232.00',
    number: 1234
  },
  {
    date: '16-01-13',
    total: '100000300',
    surplus: '200020000',
    service: '1523122.00',
    number: 510000
  },
  {
    date: '16-01-14',
    total: '100000600',
    surplus: '200060000',
    service: '15231212.00',
    number: 150000
  }
]}

const dataThree = [
  {
    date: '16-01-13',
    total: '100000300',
    surplus: '200020000',
    service: '15232.00',
    number: 50000
  },
  {
    date: '16-01-14',
    total: '100000600',
    surplus: '200060000',
    service: '15231212.00',
    number: 150000
  },
  {
    date: '16-01-13',
    total: '100000300',
    surplus: '200020000',
    service: '15232.00',
    number: 50000
  },
  {
    date: '16-01-14',
    total: '100000600',
    surplus: '200060000',
    service: '15231212.00',
    number: 150000
  },
  {
    date: '16-01-13',
    total: '100000300',
    surplus: '200020000',
    service: '15232.00',
    number: 50000
  },
  {
    date: '16-01-14',
    total: '100000600',
    surplus: '200060000',
    service: '15231212.00',
    number: 150000
  },
  {
    date: '16-01-13',
    total: '100000300',
    surplus: '200020000',
    service: '15232.00',
    number: 50000
  },
  {
    date: '16-01-14',
    total: '100000600',
    surplus: '200060000',
    service: '15231212.00',
    number: 150000
  },
  {
    date: '16-01-13',
    total: '100000300',
    surplus: '200020000',
    service: '15232.00',
    number: 50000
  },
  {
    date: '16-01-14',
    total: '100000600',
    surplus: '200060000',
    service: '15231212.00',
    number: 150000
  },
  {
    date: '16-01-13',
    total: '100000300',
    surplus: '200020000',
    service: '15232.00',
    number: 50000
  },
  {
    date: '16-01-14',
    total: '100000600',
    surplus: '200060000',
    service: '15231212.00',
    number: 150000
  },
  {
    date: '16-01-13',
    total: '100000300',
    surplus: '200020000',
    service: '15232.00',
    number: 50000
  },
  {
    date: '16-01-14',
    total: '100000600',
    surplus: '200060000',
    service: '15231212.00',
    number: 150000
  },
  {
    date: '16-01-13',
    total: '100000300',
    surplus: '200020000',
    service: '15232.00',
    number: 50000
  },
  {
    date: '16-01-14',
    total: '100000600',
    surplus: '200060000',
    service: '15231212.00',
    number: 150000
  },
  {
    date: '16-01-13',
    total: '100000300',
    surplus: '200020000',
    service: '15232.00',
    number: 50000
  },
  {
    date: '16-01-14',
    total: '100000600',
    surplus: '200060000',
    service: '15231212.00',
    number: 150000
  },
  {
    date: '16-01-13',
    total: '100000300',
    surplus: '200020000',
    service: '15232.00',
    number: 50000
  },
  {
    date: '16-01-14',
    total: '100000600',
    surplus: '200060000',
    service: '15231212.00',
    number: 150000
  }
]

const dataTwo = [
  {
    date: '16-01-12',
    tel: '158****1234',
    loan: '2000.00',
    day: '14',
    service: 20.00
  },
  {
    date: '16-01-12',
    tel: '158****1234',
    loan: '2000.00',
    day: '14',
    service: 20.00
  }
]

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

    this.state = {
      startDate: '',
      endDate: '',
      startDateTwo: '',
      endDateTwo: '',
      dataSource: dataSource.cloneWithRows(data.data),
      dataSourceTwo: dataSource.cloneWithRows(dataTwo),
      refreshing: false,
      refreshingTwo: false
    }
  }

  onRefresh () {
    console.log(111)
    this.setState({refreshing: true})
    setTimeout(() => {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(dataThree),
        refreshing: false
      })
    }, 1000)
  }

  onRefreshTwo () {
    console.log(222)
    this.setState({refreshingTwo: true})
    setTimeout(() => {
      this.setState({
        dataSourceTwo: this.state.dataSourceTwo.cloneWithRows(dataTwo),
        refreshingTwo: false
      })
    }, 1000)
  }

  onScroll () {

  }

  onTabs () {
    console.log('tags')
  }

  onStartChange (date) {
    console.log(date.format('YYYY-MM-DD'))
    this.setState({startDate: date})
  }

  onEndChange (date) {
    console.log(date.format('YYYY-MM-DD'))
    this.setState({endDate: date})
  }

  onStartChangeTwo (date) {
    console.log(date.format('YYYY-MM-DD'))
    this.setState({startDateTwo: date})
  }

  onEndChangeTwo (date) {
    console.log(date.format('YYYY-MM-DD'))
    this.setState({endDateTwo: date})
  }

  formatNumber (str) {
    if (/\./.test(str)) {
      return str.replace(/\d(?=(\d{3})+\.)/g, '$&,').replace(/\d{3}(?![,.]|$)/g, '$&,')
    } else {
      return str.replace(/\d(?=(\d{3})+$)/g, '$&,')
    }
  }

  render () {
    const separator = (sectionID, rowID) => (
      <div class='line' key={rowID} />
    )
    const html = `<p>abc</p>`
    const row = (rowData, sectionID, rowID) => {
      const obj = rowData
      return (
        <div key={rowID} className='content'>
          <span className='one'>{obj.date}</span>
          <span className='two'>{this.formatNumber(obj.total)}</span>
          <span className='three'>{this.formatNumber(obj.surplus)}</span>
          <span className='four'>{this.formatNumber(obj.service)}</span>
          <span className='five'>{obj.number}</span>
        </div>
      )
    }
    const rowTwo = (rowData, sectionID, rowID) => {
      const obj = rowData
      return (
        <div key={rowID} className='content'>
          <span className='one'>{obj.date}</span>
          <span className='tel'>{obj.tel}</span>
          <span className='loan'>{obj.loan}</span>
          <span className='loan-day'>{obj.day}天</span>
          <span className='service-pay'>{obj.service.toFixed(2)}</span>
        </div>
      )
    }
    return (
      <div className='transition-group fund-security-certification list-body'>
        <Tabs defaultActiveKey='1' swipeable={false} onChange={this.onTabs}>
          <TabPane tab='放款统计' key='1'>
            <div>
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
                dataSource={this.state.dataSource}
                renderRow={row}
                renderSeparator={separator}
                initialListSize={20}
                pageSize={20}
                scrollRenderAheadDistance={200}
                scrollEventThrottle={20}
                className='listview'
                scrollerOptions={{ scrollbars: true }}
                refreshControl={<RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this.onRefresh.bind(this)}
                  distanceToRefresh={40 / 2 * (window.devicePixelRatio || 2)}
                />}
              />
            </div>
          </TabPane>
          <TabPane tab='订单总计' key='2'>
            <div>
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
                <span>手机号</span>
                <span className='loan'>借款金额</span>
                <span>借款天数</span>
                <span>资方服务费</span>
              </div>
              <ListView
                dataSource={this.state.dataSourceTwo}
                renderRow={rowTwo}
                renderSeparator={separator}
                initialListSize={20}
                pageSize={20}
                scrollRenderAheadDistance={200}
                scrollEventThrottle={20}
                className='listview'
                scrollerOptions={{ scrollbars: true }}
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
