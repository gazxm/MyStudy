import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, post, login, resolveUrl, statistics } from 'utils'

import 'scss/activity/gold-powder-two.component.scss'

export default class Shop extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      myGoods: [],
      goodsInfo: {},
      myGold: 0,
      desc: [],
      isLogin: 0,
      myTimes: 0
    }
    this.id = 0
  }

  componentWillMount () {
    this.fetchData()
  }

  fetchData () {
    this.id = this.props.location.query.id
    if (!this.id) {
      Popup.alert(Content.showHtml(-2001), 'popup')
      Popup.click('a.click', () => {
        location.href = resolveUrl('http://h.xianjincard.com/activity/gold-powder-two?key=1')
      })
      return
    }
    Toast.loading('')
    get(`http://credit.xianjincard.com/activity/golden-powder-care-act/shop-detail?id=${this.id}`).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup')
        if (data.code === -1001) {
          Popup.click('a.click', login)
          return
        }
        if (data.code === -2001) {
          Popup.click('a.click', () => {
            location.href = resolveUrl('http://h.xianjincard.com/activity/gold-powder-two?key=1')
          })
        }
        Popup.click('a.click')
        return
      }
      this.setState({
        goodsInfo: data.data.goods_info,
        myGold: data.data.my_gold,
        desc: data.data.goods_info.desc[0].desc,
        myGoods: data.data.my_goods,
        isLogin: data.data.goods_info.is_login,
        myTimes: data.data.my_times
      })
    })
  }

  componentDidMount () {
    document.title = '商品详情'
  }

  beforeButton () {
    const { isLogin } = this.state
    if (!isLogin) {
      Popup.alert(Content.showHtml(-1001, 'choose'), 'popup')
      Popup.click('a.click', login)
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
      Popup.click('a.click', () => {
        location.href = resolveUrl('http://h.xianjincard.com/activity/gold-powder-two?key=1')
      })
      return
    }
    Popup.alert(Content.showHtml(myGoods[0].status, myGoods[0].goods_name), 'popup')
    if (myGoods[0].status === '0') {
      Popup.click('a.click', () => this.exchange())
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

  exPopup () {
    if (!this.beforeButton()) {
      return
    }
    statistics({
      type: 'goldPowderTwo',
      tag: '使用金币兑换'
    })
    const { myGoods, goodsInfo, myTimes, myGold } = this.state
    if (myGoods.length === 0) {
      Popup.alert(Content.showHtml(-3000, goodsInfo.consume, myTimes), 'popup')
      Popup.click('a.click', () => {
        this.consume(goodsInfo.id)
      })
      return
    }
    if (myGoods[0].status === '1') {
      Popup.alert(Content.showHtml(myGoods[0].status, myGoods[0].goods_name), 'popup')
      Popup.click('a.click', () => this.receiving(myGoods[0].oid))
      return
    }
    if (myGoods[0].status === '2') {
      Popup.alert(Content.showHtml(myGoods[0].status, myGoods[0].goods_name), 'popup')
      Popup.click('a.click')
      return
    }
    Popup.alert(Content.showHtml(-2038, 'shop', myGold), 'popup')
    Popup.click('a.click', this.exchange.bind(this))
  }

  consume (id) {
    const { myTimes, myGold } = this.state
    Toast.loading('')
    get(`http://credit.xianjincard.com/activity/golden-powder-care-act/shop-consume?id=${id}`).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code, 'choose', myTimes), 'popup')
        if (data.code === -1001) {
          Popup.click('a.click', login)
          return
        }
        if (data.code === -2000 || data.code === -2003) {
          Popup.click('a.click', () => {
            location.href = resolveUrl('http://h.xianjincard.com/activity/gold-powder-two?key=1')
          })
          this.fetchData()
          return
        }
        Popup.click('a.click')
        return
      }
      this.fetchData()
      Popup.alert(Content.showHtml(-2038, 'shop', myGold), 'popup')
      Popup.click('a.click', () => {
        this.exchange()
      })
    })
  }

  exchange () {
    const { myGold } = this.state
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/golden-powder-care-act/shop-exchange').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code, myGold), 'popup')
        if (data.code === -1001) {
          Popup.click('a.click', login)
          return
        }
        if (data.code === -2031) {
          Popup.click('a.one-click', () => {
            location.href = resolveUrl('http://h.xianjincard.com/activity/gold-powder-two?key=1')
          })
          Popup.click('a.two-click', () => {
            location.href = resolveUrl('http://h.xianjincard.com/signin')
          })
          return
        }
        if (data.code === -2039 || data.code === -2101 || data.code === -2104) {
          Popup.click('a.click', () => {
            location.href = resolveUrl('http://h.xianjincard.com/activity/gold-powder-two?key=1')
          })
          return
        }
      }
      this.fetchData()
      this.receiving(data.data.order_id, data.data.addr)
    })
  }

  render () {
    const { goodsInfo, myGold, desc } = this.state

    return (
      <div className='transition-group'>
        <div className='shop-view'>
          <a className='hui' onClick={this.showChoose.bind(this)} />
          <img className='head' src={goodsInfo.default_img} alt='' />
          <div className='content'>
            <h1>{goodsInfo.goods_name}</h1>
            <div className='clearfix list'>
              <p className='left gold'><b>{goodsInfo.gold}个金币</b><span>(价值{goodsInfo.rmb}元)</span></p>
              <p className='right'>库存 {parseInt(goodsInfo.stock) >= 0 ? goodsInfo.stock : 0}件</p>
            </div>
            <div className='clearfix list'>
              <p className='left show'>消耗{goodsInfo.consume}次{goodsInfo.consume_text}即有机会抢</p>
              <p className='right'>{goodsInfo.order}人已购买</p>
            </div>
          </div>
          <h2>—兑换流程—</h2>
          <div className='rule'>
            <p>1.消耗相应还款次数抢“{goodsInfo.gold}金币兑换商品”资格；</p>
            <p>2.取得资格5分钟内，点击“使用{goodsInfo.gold}金币兑换”进行兑换，超过5分钟取消资格；</p>
            <p>3.每人只能兑换一件商品，所有商品免邮费；</p>
            <p>4.可在“我的优选”中查看兑换情况；</p>
            <p>5.兑换成功后，除话费外其余宝贝需在24小时内填写收货信息，如不填写，视为自动放弃。宝贝将于7个工作日内寄出；</p>
            <p>6.所有商品一经兑换金币不会退还；</p>
            <p>7.如有问题，请联系客服，客服热线：4006812016</p>
          </div>
          <h2>—商品详情—</h2>
          <div className='details' dangerouslySetInnerHTML={{__html: desc}} />
          {goodsInfo.stock !== '0' ? <div className='button' onClick={this.exPopup.bind(this)}>
            <h3>使用{goodsInfo.gold}金币兑换</h3>
            <h4>您当前共有{myGold}金币可以使用</h4>
          </div> : <div className='button gray'><h5>宝贝正在和你相遇的路上</h5></div>}
        </div>
      </div>
    )
  }
}
