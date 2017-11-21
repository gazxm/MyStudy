import React from 'react'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import Password from '../../../components/Password'
import { Modal } from 'antd-mobile'
import { get, login, resolveUrl, post, statistics, platform } from 'utils'
import 'scss/activity/overlord-order.component.scss'

const dataAg = [{name: '霸王令协议', href: 'service'}, {name: '借款协议', href: 'loan?period=14'}, {name: '授权委托书', href: 'auth'}, {name: '平台服务协议', href: 'platform?period=14'}]
const alert = Modal.alert

export default class Pay extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: {}
    }
  }

  componentWillMount () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/vip-act/buy-index').then(data => data.data).then(data => {
      Toast.hide()
      this.setState({
        data: data.data
      })
      if (data.code !== 0) {
        if (data.code === -1001) {
          Popup.alert(`<p>${data.message}</p><a class='click'>马上登录</a>`, 'popup')
          Popup.click('a.click', login)
          return
        }
        Popup.alert(`<p>${data.message}</p><a class='click'>朕知道了</a>`, 'popup')
        Popup.click('a.click')
      }
    })
  }

  componentDidMount () {
    document.title = '霸王令支付'
    for (let i of document.querySelectorAll('input')) {
      i.checked = true
    }
  }

  forward (url) {
    location.href = resolveUrl(`http://h.xianjincard.com/activity/overlord/${url}`)
  }

  pay () {
    if (window.sessionStorage && window.sessionStorage.getItem('overlord_payId')) {
      location.href = resolveUrl(`http://h.xianjincard.com/activity/overlord/result?id=${window.sessionStorage.getItem('overlord_payId')}`)
    }
    if (!document.getElementById('checkbox0').checked) {
      Toast.info('请阅读并同意《霸王令协议》哦~', 2)
      return
    }
    if (!document.getElementById('checkbox1').checked) {
      Toast.info('请阅读并同意《借款协议》哦~', 2)
      return
    }
    if (!document.getElementById('checkbox2').checked) {
      Toast.info('请阅读并同意《授权委托书》哦~', 2)
      return
    }
    if (!document.getElementById('checkbox3').checked) {
      Toast.info('请阅读并同意《平台服务协议》哦~', 2)
      return
    }
    statistics({
      type: 'vip',
      tag: '立即购买'
    })
    alert('请确认您的银行卡账户余额超过300元，不然可能会造成购买不成功', '', [
      { text: '再看看', onPress: () => {} },
      { text: '确定', onPress: () => {
        setTimeout(() => {
          Password.show((password) => {
            Toast.loading('')
            setTimeout(() => {
              post('http://credit.xianjincard.com/activity/vip-act/buy', {pwd: password}).then(data => data.data).then(data => {
                Toast.hide()
                if (data.code !== 0) {
                  if (data.code === -1008) {
                    Password.error()
                    return
                  }
                  Password.close()
                  Popup.alert(`<p>${data.message}</p><a class='click'>朕知道了</a>`, 'popup')
                  Popup.click('a.click')
                  return
                }
                Password.close()
                if (!data.data.id) {
                  if (platform.isIos) {
                    Popup.alert(`<p>购买失败</p><a class='click'>朕知道了</a>`, 'popup')
                    Popup.click('a.click')
                    return
                  }
                  Toast.hide('购买失败')
                  return
                }
                location.href = resolveUrl(`http://h.xianjincard.com/activity/overlord/result?id=${data.data.id}`)
              }).catch(() => {
                Toast.hide()
                Password.close()
                Popup.alert(`<p>服务器繁忙，请稍后再试</p><a class='click'>朕知道了</a>`, 'popup')
                Popup.click('a.click')
              })
            }, 100)
          })
        }, 300)
      }
      }
    ])
  }

  render () {
    const { data } = this.state

    const agreement = dataAg.map((v, i) => <p className='other clearfix' key={i}>
      <input id={`checkbox${i}`} type='checkbox' value='' style={{display: 'none'}} />
      <label for={`checkbox${i}`}><a onClick={() => this.forward(v.href)}>{v.name}</a><i /></label>
    </p>)

    return (
      <div className='transition-group'>
        <div className='pay-content'>
          <div className='header'>
            <h2>¥<span>{data.price ? data.price : 300}.00</span></h2>
            <h3>领取霸王令</h3>
          </div>
          <div className='content'>
            <p className='clearfix'><span className='left'>优惠内容</span><span className='right'>免息借款</span></p>
            <p className='clearfix'><span className='left'>优惠期限</span><span className='right'>{data.expire ? data.expire : 60}天</span></p>
            <p className='clearfix'><span className='left'>优惠次数</span><span className='right'>{data.times ? data.times : 4}次</span></p>
          </div>
          <div className='agreement-content'>
            {agreement}
          </div>
          <a className='a-pay' onClick={this.pay.bind()}>立即购买</a>
        </div>
      </div>
    )
  }
}
