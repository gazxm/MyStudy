import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, post, login, redirect, resolveUrl, statistics, partake, platform } from 'utils'
import { Modal, Carousel, Button, WhiteSpace, WingBlank } from 'antd-mobile'

export default class Choose extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      myGoods: [],
      goodsList: [],
      batch: '1',
      myTimes: 0,
      isLogin: 0,
      code: 0,
      broadCast: [],
      broadCastClass: 'hide',
      broadCastDefault: Content.broadCastDefault()
    }
  }

  componentWillMount () {
    this.fetchData()
  }

  fetchData () {
    Toast.loading('')

    get('http://credit.xianjincard.com/activity/golden-powder-care-act/shop-index').then(data => data.data).then(data => {
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code, 'choose'), 'popup')
        this.setState({
          code: data.code
        })
        if (data.code === -2037) {
          this.setState({
            myGoods: data.data.my_goods,
            goodsList: data.data.goods_list,
            batch: data.data.batch,
            myTimes: data.data.my_times,
            isLogin: data.data.is_login
          })
        }
        Popup.click('a.click')
        return
      }
      this.setState({
        myGoods: data.data.my_goods,
        goodsList: data.data.goods_list,
        batch: data.data.batch,
        myTimes: data.data.my_times,
        isLogin: data.data.is_login,
        startTime: data.data.start_time
      })
    })
    get('http://credit.xianjincard.com/activity/golden-powder-care-act/broadcast').then(data => data.data).then(response => {
      Toast.hide()
      this.setState({
        type: response.data.type,
        broadCast: response.data.list,
        broadCastClass: response.code !== -2012 ? 'show' : 'hide'
      })
    })
  }

  beforeButton () {
    const { code, isLogin } = this.state
    if (isLogin === 0) {
      Popup.alert(Content.showHtml(-1001, 'choose'), 'popup')
      Popup.click('a.click', login)
      return false
    }
    if (code !== 0) {
      Popup.alert(Content.showHtml(code, 'choose'), 'popup')
      Popup.click('a.click')
      return false
    }
    return true
  }

  showChoose () {
    if (!this.beforeButton()) {
      return
    }
    const { myGoods } = this.state
    if (myGoods.length === 0) {
      Popup.alert(Content.showHtml('-1'), 'popup')
      Popup.click('a.click')
      return false
    }
    Popup.alert(Content.showHtml(myGoods[0].status, myGoods[0].goods_name), 'popup')
    if (myGoods[0].status === '0') {
      Popup.click('a.click', () => {
        location.href = resolveUrl(`http://h.xianjincard.com/activity/gold-powder/shop?id=${myGoods[0].id}`)
      })
      return
    }
    if (myGoods[0].status === '1') {
      Popup.click('a.click', () => this.receiving(myGoods[0].oid, myGoods[0].addr))
      return
    }
    Popup.click('a.click')
  }

  receiving (oid, addr) {
    Popup.alert(Content.showReceving(addr), 'popup-receving')
    Popup.clickAndClose('a.click', (close) => {
      const reg = /^1(3|4|5|7|8)\d{9}$/
      const name = Popup.dom.querySelector('input.name-input').value
      const phone = Popup.dom.querySelector('input.phone-input').value
      const address = addr ? Popup.dom.querySelector('input.address-input').value : '不需要填写收货地址'
      if (name === '') {
        Toast.info('请填写收货人姓名哦~')
        return
      }
      if (phone !== '' && !reg.test(phone)) {
        Toast.info('请填写正确的手机号哦~')
        return
      }
      if (address === '') {
        Toast.info('请填写收货地址哦~')
      }
      close()
      Toast.loading('')
      setTimeout(() => {
        post('http://credit.xianjincard.com/activity/golden-powder-care-act/shop-address', {oid: oid, name: name, phone: phone, address: address}).then(data => data.data).then(data => {
          Toast.hide()
          if (data.code !== 0) {
            if (data.code === -1001) {
              Popup.alert(Content.showHtml(data.code, 'choose'), 'popup')
              Popup.click('a.click', login)
              return
            }
            if (data.code === -1004 || data.code === -2001) {
              Popup.alert(Content.showHtml(-1004), 'popup')
              Popup.click('a.click')
              return
            }
            Popup.alert(Content.showHtml(data.code), 'popup')
            Popup.click('a.click')
            return
          }
          Toast.info('耐心等待收货哦~')
          this.fetchData()
        })
      }, 2000)
    })
  }
  consume (status, id, name) {
    if (status !== '1') {
      return
    }
    if (!this.beforeButton()) {
      return
    }
    statistics({
      type: 'goldPowderTwo',
      tag: `消耗次数-${name}`
    })
    const { myTimes } = this.state
    Toast.loading('')
    get(`http://credit.xianjincard.com/activity/golden-powder-care-act/shop-consume?id=${id}`).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        // console.log(this.state.startTime)
        // 活动未开始  添加还款日历提醒
        // if (data.code === -2013 && platform.isApp) {
        //   (window.nativeMethod && window.nativeMethod.addCalendarRemind) && window.nativeMethod.addCalendarRemind(JSON.stringify({date: this.state.startTime}))
        //   return
        // }
        Popup.alert(Content.showHtml(data.code, 'choose', myTimes), 'popup')

        if (data.code === -1001) {
          Popup.click('a.click', login)
          return
        }
        if (data.code === -2038) {
          Popup.click('a.click', () => {
            location.href = resolveUrl(`http://h.xianjincard.com/activity/gold-powder-two/shop?id=${id}`)
          })
        }
        if (data.code === -2000) {
          this.fetchData()
        }
        Popup.click('a.click')
        return
      }
      console.log(`点击兑换成功,更新还款次数${myTimes}`)
      this.fetchData()
      Popup.alert(Content.showHtml(-2038), 'popup')
      Popup.click('a.click', () => {
        location.href = resolveUrl(`http://h.xianjincard.com/activity/gold-powder-two/shop?id=${id}`)
      })
    })
  }

  goShop (id, name) {
    statistics({
      type: 'goldPowderTwo',
      tag: `商品图片-${name}`
    })
    location.href = resolveUrl(`http://h.xianjincard.com/activity/gold-powder-two/shop?id=${id}`)
  }

  render () {
    const { goodsList, batch, myTimes, type, broadCastDefault, broadCast, broadCastClass} = this.state
    console.log(`重新渲染还款次数${myTimes}`)
    const goodsDiv = goodsList.length > 0 ? goodsList.map((v, i) => <div key={i} className='shop'>
      <img src={v.default_img} alt={v.goods_name} onClick={() => this.goShop(v.id, v.goods_name)} />
      <h2>{v.goods_name}</h2>
      <h3>{v.gold}金币<b>({v.rmb}元)</b></h3>
      <a className={`${v.status !== '1' ? 'gray' : ''}`} onClick={() => this.consume(v.status, v.id, v.goods_name)}>消耗{v.consume}次{v.consume_text}抢</a>
    </div>) : null

    const broadCastDate = type == 2 ? (broadCast.map((v, i) => <span key={i}>恭喜{v.name}&emsp;成功兑换{v.goods_name}</span>)) : (broadCastDefault.map((v, i) => <span key={i}>{v}</span>))

    return (
      <div className='choose'>
        <a className='hui' onClick={this.showChoose.bind(this)} />
        <div className='shop-content'>
          <h4>我的累计可用还款次数：{myTimes}次</h4>
          <div className={`broadCast ${broadCastClass}`}>
            <Carousel className='my-carousel'
              vertical
              dots={false}
              dragging={false}
              swiping={false}
              autoplay
              infinite
            >
              {broadCastDate}
            </Carousel>
          </div>
          <div className='shop-list' > {goodsDiv}</div>
        </div>
        <a className='link' onClick={() => {
          statistics({
            type: 'goldPowderTwo',
            tag: `用金币直接换`
          })
          redirect.push('http://h.xian jincard.com/signin')
        }}>用金币直接换</a>
      </div>
    )
  }
}
