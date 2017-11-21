import React from 'react'
import Toast from '../../../components/Toast'
import { get, goHome, redirect } from 'utils'
import 'scss/activity/overlord-order.component.scss'

let timer = null

export default class Result extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      countdownText: '5秒'
    }
  }

  componentDidMount () {
    document.title = '霸王令支付'
    this.countdown()
  }

  countdown () {
    let count = 5
    timer = setInterval(() => {
      this.setState({
        countdownText: `${--count}秒`
      })
      if (!count) {
        timer && clearInterval(timer)
        this.setState({loaded: 0})
        this.fetch()
      }
    }, 1000)
  }

  fetch () {
    const { id } = this.props.location.query
    Toast.loading('')
    get(`http://credit.xianjincard.com/activity/vip-act/pay-result?id=${id}`).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        throw data
      }
      Toast.info('购买成功，正在为你跳转首页', 2)
      setTimeout(() => {
        goHome()
      }, 1600)
    }).catch(data => {
      Toast.hide()
      Toast.info(`${data.message}`, 5)
      if (data.code === 300 || data.code === '300') {
        window.sessionStorage.setItem('overlord_payId', id)
        setTimeout(() => {
          this.countdown()
        }, 5000)
      } else {
        setTimeout(() => {
          redirect.goBack()
        }, 5000)
      }
      return
    })
  }

  render () {
    const { countdownText } = this.state

    return (
      <div className='result'>
        <div className={'wrapper-mobile-transfer'}>
          <div className='main'>
            <div>
              <div className='title'>正在等待处理结果...</div>
              <div className='loading'>
                <div className='countdown'>{countdownText}</div>
                <div className='loader' />
              </div>
            </div>
          </div>
          <div className='tips'>温馨提示：结果返回前，请勿重复支付</div>
        </div>
      </div>
    )
  }
}
