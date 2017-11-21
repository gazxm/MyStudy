import React from 'react'
import Popup from '../../activity/components/Popup'
import Toast from '../../../components/Toast'
import 'scss/mobile/customer.component.scss'
import { createCount, get, share } from 'utils'

export default class Customer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentWillMount () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/default/wy-qyu-info').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0 && data.code !== -1001) {
        Popup.alert(`<p>服务器繁忙，请稍后再试</p>`, 'popup')
        return
      }
      createCount('//qiyukf.com/script/15eaaef1a70ec89d50a46cab682fbb34.js', function () {
        window.ysf.config({
          uid: data.data.uid ? data.data.uid : '',
          name: data.data.name ? data.data.name : '',
          email: '',
          mobile: data.data.mobile ? data.data.mobile : ''
        })
        setTimeout(() => {
          location.replace(window.ysf.url())
        }, 100)
      })
    })
  }

  componentDidMount () {
    share('customer', {corner: 0})
  }

  render () {
    return (
      <div />
    )
  }
}
