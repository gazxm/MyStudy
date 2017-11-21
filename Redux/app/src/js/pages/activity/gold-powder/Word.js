import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import BarrageContent from './BarrageContent'
import { get, post, login } from 'utils'

export default class Word extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      inputData: '',
      batch: '1',
      words: [],
      isLogin: 0,
      code: 0
    }
    this.showFlag = 1
    this.time = 10
    this.timeInterval = null
  }

  componentWillMount () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/golden-powder-care-act/barrage-index').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0 && data.code !== -2012 && data.code !== -2013) {
        throw data
      }
      this.setState({
        batch: data.data.batch,
        words: data.data.words,
        code: data.code,
        isLogin: data.data.is_login
      })
    }).catch(data => {
      this.errorPopup(data.code)
    })
  }

  showInput () {
    const { code, isLogin } = this.state
    if (!isLogin) {
      Popup.alert(Content.showHtml(-1001), 'popup')
      Popup.click('a.click', login)
      return
    }
    if (code === -2012 || code === -2013) {
      Popup.alert(Content.showHtml(code), 'popup')
      Popup.click('a.click')
      return
    }
    if (!this.showFlag) {
      Toast.info(`请稍等${this.time}秒后在发言哦~`, 2)
      return
    }
    this.showFlag = 0
    this.time = 10
    clearInterval(this.timeInterval)
    setTimeout(() => {
      this.showFlag = 1
    }, 10000)
    this.timeInterval = setInterval(() => {
      this.time--
    }, 1000)
    Popup.alert(Content.showInput('word'), 'popup')
    Popup.clickAndClose('a.click', (close) => {
      const comment = Popup.dom.querySelector('textarea').value
      if (comment === '') {
        Toast.info('请填写您的想法哦', 2)
        return
      }
      this.setState({
        inputData: comment
      })
      close()
      Toast.loading('')
      post('http://credit.xianjincard.com/activity/golden-powder-care-act/barrage-submit', {content: comment}).then(data => data.data).then(data => {
        Toast.hide()
        if (data.code !== 0) {
          throw data
        }
        Toast.info('发送成功', 2)
      }).catch(data => {
        setTimeout(() => {
          this.errorPopup(data.code)
        }, 500)
      })
    })
  }

  errorPopup (code) {
    Popup.alert(Content.showHtml(code), 'popup')
    if (code === -1001) {
      Popup.click('a.click', login)
      return
    }
    Popup.click('a.click')
  }

  render () {
    const { inputData, batch, words } = this.state
    return (
      <div className='word'>
        <h1>金粉态度<br />第{batch}期</h1>
        <BarrageContent data={words} inputData={inputData} />
        <a className='speak' onClick={this.showInput.bind(this)}>有好的想法请表达</a>
      </div>
    )
  }
}
