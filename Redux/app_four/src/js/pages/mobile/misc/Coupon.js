import React from 'react'
import {Link} from 'react-router'
import {Icon, RefreshControl, ListView} from 'antd-mobile'
import {get, redirect} from 'utils'
import Toast from 'components/Toast'
import 'scss/mobile/coupon.component.scss'
import classNames from 'classnames'
// function testable (param) {
//   return function (clazz) {
//     clazz.defaultProps = Object.assign({}, clazz.defaultProps || {}, param)
//     return clazz
//   }
// }

// is_check_loan 1, 2, 3
const message = ['未完成基础认证', '你有处于审核状态下的借款，无法申请新的借款', '你有未还款的借款，请先还完才能继续申请借款']

export default class Coupon extends React.Component {
  constructor (props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
//    console.log(this.props)
    this.isNotData = false
    this.state = {
      dataSource: dataSource.cloneWithRows([]),
      refreshing: true
    }
  }
  componentDidMount () {
    document.title = '现金券'
    // this.setState({refreshing: true})
  }
  fetchData () {
    get('http://credit.xianjincard.com/v2/coupon/get-my-coupon').then((result) => {
      if (result.data.code !== 0) {
        Toast.info(result.data.message, 2)
        return
      }
      return result.data.data
    }).then((data) => {
      const item = data.item.length > 0 ? data.item : [{isNotData: true}]
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(item),
        refreshing: false
      })
    }).catch((error) => { console.log(error) })
  }
  onRefresh () {
    this.setState({ refreshing: true })
    this.fetchData()
  }
  onClick (rowData) {
    if (parseInt(rowData.status) === 2) {
      return
    }
    if (parseInt(rowData.use_type) === 3) {
      if (rowData.is_check_loan > 5) {
        Toast.info(message[rowData.is_check_loan - 1], 2)
        return
      }
      redirect.push(`/mobile/loan/${1}/${rowData.up_term}/${rowData.up_amount}/${rowData.coupon_id}`)
    }
  }
  createFooter () {
    return <Link to="/misc/instruction/coupon">使用说明</Link>
  }
  createEmpty () {
    if (this.state.isNotData) {
      return (
        <div class="result">
          <img src="/assets/img/mobile/misc/icon-1.png"/>
          <p>你没有任何抵扣券记录哦~</p>
          {this.createFooter()}
        </div>
      )
    }
  }
  render () {
    // status 2 已过期 1 已使用
    const row = (rowData, sectionID, rowID) => {
      if (rowData.isNotData) {
        return (
          <div class="result">
            <img src="/assets/img/mobile/misc/icon-1.png"/>
            <p>你没有任何抵扣券记录哦~</p>
          </div>
        )
      }
      const title = parseInt(rowData.use_type) === 2 ? <h3>{rowData.title}</h3> : <h4><i>￥</i>{rowData.amount}</h4>
      const itemClass = classNames({'coupon-item': true, 'expired': (parseInt(rowData.status) === 2), 'used': (parseInt(rowData.status) === 1)})
      return (
        <div className={itemClass} key={rowID} onClick={this.onClick.bind(this, rowData)}>
          <span>{title}</span>
          <span class="active">
            <div>
              <h3>{rowData.coupon_name}</h3>
              <p>{rowData.loan_amount}</p>
              <p>{rowData.loan_term}</p>
              <p>{rowData.time}</p>
              <div>{parseInt(rowData.status) !== 2 && parseInt(rowData.use_type) === 3 && <i>点击使用</i>}</div>
            </div>
          </span>
        </div>
      )
    }

    return (
      <div class="coupon xjk-refresh">
      <ListView
        dataSource={this.state.dataSource}
        renderRow={row}
        initialListSize={5}
        pageSize={5}
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
                icon={[
                  <div key="0" className="am-refresh-control-pull">
                        <Icon type="arrow-down"/><span>科技让金融更简单</span>
                      </div>,
                  <div key="1" className="am-refresh-control-release">
                    <Icon type="arrow-up"/><span>科技让金融更简单</span>
                  </div>
                ]}
                  distanceToRefresh={40 * window.lib.flexible.dpr}
                  onRefresh={this.onRefresh.bind(this)}/>
            }/>
      </div>
    )
  }
}
