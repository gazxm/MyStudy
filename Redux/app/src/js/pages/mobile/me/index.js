import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import { Flex, List, ListView, RefreshControl, Icon, Modal, Button } from 'antd-mobile'
import {get, redirect, login} from 'utils'
import Toast from 'components/Toast'
import 'scss/mobile/me.component.scss'

const alert = Modal.alert
const Item = List.Item
const alter = (px) => {
  return px / 2 * window.devicePixelRatio
}

export default class Me extends React.Component {
  // static contextTypes = {
  //   router: PropTypes.object
  // }
  constructor (props) {
    super(props)
    this.al = 0
    this.progress = 0
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
    this.data = {
      item_list: [{group: 0}],
      phone: '',
      credit_info: {
        card_amount: 0,
        card_unused_amount: 0
      }
    }
    this.state = {
      dataSource: dataSource.cloneWithRows([this.data]),
      refreshing: true
    }
  }
  componentDidMount () {
    document.title = '个人中心'
    // console.log(this.context)
    // console.log(redirect)
    // this.setState({refreshing: true})

    const canvas = document.querySelector('canvas')
    canvas.width = window.lib.flexible.dpr === 1 ? window.innerWidth * window.devicePixelRatio : window.innerWidth
    canvas.height = alter(300)
    this.wave(canvas)
  }
  fetchData () {
    get('http://credit.xianjincard.com/v2/credit-user/get-info').then((result) => {
      if (result.data.code !== 0) {
        Toast.info(result.data.message, 2)
        return
      }
      this.data = result.data.data.item
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows([this.data]),
        refreshing: false
      })
      this.onLoad()
    }).catch((error) => { console.log(error) })
  }
  onRefresh () {
    this.setState({refreshing: true})
    this.fetchData()
  }
  onLoad () {
    let {card_locked_amount: total, card_unused_amount: unused} = this.data.credit_info
    this.progress = unused / total * 100
    this.al = 0
  }
  wave (canvas) {
    const ctx = canvas.getContext('2d')
    const cw = ctx.canvas.width
    const ch = ctx.canvas.height

    var offset = 0
    var count = alter(40)
    var force = Math.sin(count)
    var ly = ch - alter(20)

    var radius = alter(70)
    var x = cw / 2 - radius * 2
    var y = ch / 2

    var start = 4.72
    var diff = 0
    var interval = null

    if (interval !== null) {
      clearInterval(interval)
    }
    interval = setInterval(() => {
      diff = ((this.al / 100) * Math.PI * 2 * 10).toFixed(2)
      ctx.clearRect(0, 0, cw, ch)

      ctx.lineWidth = alter(25)
      ctx.strokeStyle = '#ddd'
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2, false)
      ctx.stroke()

      ctx.strokeStyle = '#ff8003'
      ctx.beginPath()
      ctx.arc(x, y, radius, start, diff / 10 + start, false)
      ctx.stroke()
      if (this.al < this.progress) {
        this.al += 2
      }

      force = Math.sin(count)
      count += 0.05

      ctx.fillStyle = 'rgba(0,0,0,0)'
      ctx.fillRect(0, ly, cw, ch)
      ctx.fillStyle = '#a7ddff'
      ctx.beginPath()
      ctx.moveTo(0, ly)
      ctx.quadraticCurveTo(cw / 4 + offset, ly + force * alter(40), cw / 2 + offset, ly)
      ctx.quadraticCurveTo(cw * 0.75 + offset, ly - force * alter(30), cw + offset, ly)
      ctx.lineTo(cw, ch)
      ctx.lineTo(0, ch)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = 'rgba(0, 0, 0, 0)'
      ctx.fillRect(0, ly, cw, ch)
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.moveTo(0, ly)
      ctx.quadraticCurveTo(cw / 4 + offset, ly - force * alter(30), cw / 2 + offset, ly)
      ctx.quadraticCurveTo(cw * 0.75 + offset, ly + force * alter(20), cw + offset, ly)
      ctx.lineTo(cw, ch)
      ctx.lineTo(0, ch)
      ctx.closePath()
      ctx.fill()

      offset += 3
      if (offset > alter(200)) {
        offset = 0
      }
    }, 50)
  }
  onClick (item) {
    if (item.tag === 1) {
      redirect.push('/mobile/order')
      return
    }

    if (item.tag === 2) {
      redirect.push('/mobile/certification')
      return
    }

    location.href = item.url
  }
  logout () {
    alert('确 定', '你确定退出登录', [
      {text: '取 消'},
      {text: '确 定', onPress: () => {
        get('http://credit.xianjincard.com/credit-user/logout').then(data => {
          login()
        })
      }}
    ])
  }
  listA (items) {
    return items.map((v, i) => {
      let subtitle = v.subtitle
      if (subtitle) {
        let m = subtitle.match(/<.+>(.+)<\/.+>/i)
        if (m !== null) {
          subtitle = m[1]
        }
      }

      if (v.group === 1) {
        return <Item key={i} thumb={v.logo} extra={subtitle} arrow='horizontal' onClick={this.onClick.bind(this, v)}>{v.title}</Item>
      }
    })
  }
  listB (items) {
    return items.map((v, i) => {
      if (v.group === 2 && v.url) {
        return <Item key={i} thumb={v.logo} extra={v.subtitle} arrow='horizontal' onClick={this.onClick.bind(this, v)}>{v.title}</Item>
      }
    })
  }
  render () {
    const row = (rowData, sectionID, rowID) => {
      return (
        <div class='me'>
          <div class='head'>
            <ul class='content'>
              <li>{rowData.phone} <a href={rowData.active_url}>提额攻略</a></li>
              <li>总额度: <i>{rowData.credit_info.card_amount / 100}元</i></li>
              <li>剩余可借: <i>{rowData.credit_info.card_unused_amount / 100}元</i></li>
            </ul>
            <canvas />
            <Flex class='tab'>
              <Flex.Item><a class='gold-tab' href='/signin'>金币</a></Flex.Item>
              <Flex.Item><a class='coupon-tab' href='/mobile/coupon'>优惠券</a></Flex.Item>
              <Flex.Item><a class='pack-tab' href='/cash-bonus'>现金红包</a></Flex.Item>
            </Flex>
          </div>
          <List>{this.listA(rowData.item_list)}</List>
          <List>{this.listB(rowData.item_list)}</List>
          <div class='btn'><Button type='button' class='am-button' onClick={this.logout.bind(this)}>退出登录</Button></div>
        </div>
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
            distanceToRefresh={40 * window.lib.flexible.dpr}
            onRefresh={this.onRefresh.bind(this)} />
        }/>
    )
  }
}
