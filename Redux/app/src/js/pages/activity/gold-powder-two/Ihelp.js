import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { ListView } from 'antd-mobile'
import { get, post, login, statistics } from 'utils'

export default class Ihelp extends React.Component {
  constructor (props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
    this.state = {
      dataSource: dataSource.cloneWithRows([]),
      phone: '',
      wishFlag: '0',
      code: 0,
      inputFlag: 0,
      myWish: {},
      isLogin: 0,
      batch: '1'
    }
    this.dataAll = []
    this.limit = 10
    this.page = 1
    this.fetchFlag = true
  }

  componentWillMount () {
    this.fetch(this.page)
  }

  componentDidUpdate () {
    this.offsetOpen()
  }

  offsetOpen () {
    const pAll = document.querySelectorAll('p.show')
    const height = document.querySelectorAll('h3.h3') ? document.querySelector('h3.h3').offsetHeight : null
    for (let i of pAll) {
      if (i.offsetHeight !== height) {
        if (i.parentNode.className.indexOf('hidden') > 0) {
          continue
        }
        i.parentNode.className = i.parentNode.className + ' hidden'
      }
    }
  }

  fetch (page) {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/golden-powder-care-act/wish-index', {page: page, limit: this.limit}).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0 && data.code !== -2012 && data.code !== -2013) {
        throw data
      }
      if (data.data.wishes.length === this.limit) {
        this.fetchFlag = true
      } else {
        this.fetchFlag = false
      }
      this.dataAll = [...this.dataAll, ...data.data.wishes]
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(this.dataAll),
        wishFlag: data.data.show_wished,
        code: data.code,
        phone: data.data.my_phone,
        inputFlag: data.data.my_wish.length > 0 ? 1 : 0,
        myWish: data.data.my_wish[0],
        isLogin: data.data.is_login,
        batch: data.data.batch
      })
    }).catch(data => {
      this.errorPopup(data.code)
    })
  }

  errorPopup (code) {
    Popup.alert(Content.showHtml(code), 'popup')
    if (code === -1001) {
      this.setState({
        code: code
      })
      Popup.click('a.click', login)
      return
    }
    Popup.click('a.click')
  }

  showRule () {
    Popup.alert(Content.showRule(), 'popup-rule')
  }

  beforeButton () {
    const { isLogin, code } = this.state
    if (isLogin === 0) {
      Popup.alert(Content.showHtml(-1001), 'popup')
      Popup.click('a.click', login)
      return false
    }
    if (code !== 0) {
      Popup.alert(Content.showHtml(code), 'popup')
      Popup.click('a.click')
      return false
    }
    return true
  }

  showInput () {
    if (!this.beforeButton()) {
      return
    }
    const { code, inputFlag, phone, wishFlag } = this.state
    if (code === -2012 || code === -2013) {
      Popup.alert(Content.showHtml(code), 'popup')
      Popup.click('a.click')
      return
    }
    if (wishFlag === '1') {
      Popup.alert(Content.showHtml(-3002), 'popup')
      Popup.click('a.click')
      return
    }
    if (inputFlag) {
      Popup.alert(Content.showHtml(-2025), 'popup')
      Popup.click('a.click')
      return
    }
    Popup.alert(Content.showInput('ihelp'), 'popup')
    Popup.clickAndClose('a.click', (close) => {
      const comment = Popup.dom.querySelector('textarea').value
      if (comment === '') {
        Toast.info('请填写您的想法哦', 2)
        return
      }
      close()
      Toast.loading('')
      post('http://credit.xianjincard.com/activity/golden-powder-care-act/wish-submit', {content: comment}).then(data => data.data).then(data => {
        Toast.hide()
        if (data.code !== 0) {
          throw data
        }
        let arr = [{phone: phone, wish: comment}]
        let myWish = {status: '1', wish: comment}
        this.dataAll = [...arr, ...this.dataAll]
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(this.dataAll),
          myWish: myWish,
          inputFlag: 1
        })
        statistics({
          type: 'goldPowderTwo',
          tag: '说出心愿'
        })
        Toast.info('许愿成功', 2)
      }).catch(data => {
        setTimeout(() => {
          this.errorPopup(data.code)
        }, 500)
      })
    })
  }

  my () {
    if (!this.beforeButton()) {
      return
    }
    const { myWish } = this.state
    Popup.alert(Content.showWish(myWish), 'popup')
    Popup.click('a.click')
  }

  openList (id) {
    const div = document.querySelector(`div.list-${id}`)
    if (div.className.indexOf('hidden') > 0) {
      div.className = `list list-${id} open`
      div.lastChild.innerText = '收起'
      return
    }
    if (div.className.indexOf('open') > 0) {
      div.className = `list list-${id} hidden`
      div.lastChild.innerText = '展开'
    }
  }

  onEndReached () {
    if (!this.fetchFlag) {
      return
    }
    this.fetchFlag = false
    this.page++
    this.fetch(this.page)
  }

  render () {
    const { dataSource, wishFlag, batch } = this.state

    const row = (rowData, sectionID, rowID) => {
      return (
        <div className={`list list-${rowID}`} key={rowID}>
          <p className={`show color-${rowID % 3}`}>#{rowData.phone}#{rowData.wish}</p>
          <span onClick={() => this.openList(rowID)}>展开</span>
        </div>
      )
    }

    return (
      <div className='ihelp'>
        <a className='rule' onClick={this.showRule.bind(this)} />
        <div className='pool'>
          {wishFlag === '0' ? <h3 className='h3'><div class='span'>许愿池</div></h3> : <h3 className='h3'><div class='span'>入选名单</div></h3>}
          <ListView
            ref='lvOne'
            dataSource={dataSource}
            renderRow={row}
            initialListSize={20}
            pageSize={10}
            scrollerOptions={{ scrollbars: true }}
            scrollRenderAheadDistance={400}
            onEndReachedThreshold={20}
            onEndReached={this.onEndReached.bind(this)}
            className='listview'
            scrollEventThrottle={10}
            />
        </div>
        <a className='speak' onClick={this.showInput.bind(this)}>说出心愿</a>
        <a className='my' onClick={this.my.bind(this)}>我的心愿</a>
      </div>
    )
  }
}
