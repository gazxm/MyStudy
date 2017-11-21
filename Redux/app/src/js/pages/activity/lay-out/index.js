import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, share, login, post, goHome, statistics } from 'utils'
import { ListView } from 'antd-mobile'
import 'scss/activity/lay-out.component.scss'

const totalLength = 6
let fetchFlag = true
let page = 1
let order = 0  // 默认用点赞数排序

export default class Lay extends React.Component {
  constructor (props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
    this.state = {
      total: this.formatTotal('0'),
      data: [],
      dataSource: dataSource.cloneWithRows([]),
      code: 0,
      loginFlag: 0
    }
  }

  componentDidMount () {
    document.title = '6180怎么花'
    share('Lay')
    this.fetchData(order, page, 2)
  }

  componentDidUpdate () {
    const { data } = this.state
    let pAll = document.querySelectorAll('p.p-middle')
    let height = document.querySelector('h3.h3') ? parseInt(document.querySelector('h3.h3').offsetHeight) : null
    for (let i = 0; i < pAll.length; i++) {
      if (pAll[i].offsetHeight === height * 2 || pAll[i].offsetHeight === height) {
        document.querySelector(`div.open-${data[i].id}`).style.display = 'none'
      } else {
        document.querySelector(`div.open-${data[i].id}`).style.display = 'block'
      }
    }
  }

  beforeButton () {
    const { code, loginFlag } = this.state
    if (!loginFlag) {
      Popup.alert(Content.showHtml(-1001), 'popup')
      Popup.click('a.click', login)
      return false
    }
    if (code === -2012 || code === -2013) {
      Popup.alert(Content.showHtml(code), 'popup')
      Popup.click('a.click')
      return false
    }
    return true
  }

  showDetail () {
    Popup.alert(Content.showDetail(), 'popup-detail')
    Popup.click('i.service', () => {
      location.href = 'http://h.xianjincard.com/mobile/wechat'
    })
    Popup.click('a.click')
  }

  showTalk () {
    if (!this.beforeButton()) {
      return
    }
    statistics({
      type: '6180',
      tag: '我也要说'
    })
    Popup.alert(Content.showTalk(), 'popup-talk')
    Popup.clickAndClose('a.sumbit', (close) => {
      const { total } = this.state
      let str = ''
      const comment = Popup.dom.querySelector('textarea').value
      if (comment === '') {
        Toast.info('请填写评论内容哦', 2)
        return
      }
      if (comment.indexOf('垃圾') >= 0) {
        Toast.info('请使用文明用语', 2)
        return
      }
      close()
      Toast.loading('')
      post('http://credit.xianjincard.com/activity/thumbs-up-act/comment', {comment: comment}).then(data => data.data).then(data => {
        Toast.hide()
        if (data.code !== 0) {
          Popup.alert(Content.showHtml(data.code), 'popup')
          if (data.code === -1001) {
            Popup.click('a.click', login)
            return
          }
          Popup.click('a.click')
          return
        }
        Toast.info('评论成功', 2)
      })
      for (let i of total) {
        str = str + i
      }
      this.setState({
        total: this.formatTotal((parseInt(str) + 1) + '')
      })
      setTimeout(() => {
        this.sortByTime()
      }, 300)
    })
  }

  formatTotal (total) {
    let numL = total.length
    if (numL < totalLength) {
      for (let i = 0; i < totalLength - numL; i++) {
        total = '0' + total
      }
    }
    return [...total]
  }

  open (id) {
    if (document.querySelector(`p.p-${id}`).getAttribute('class').indexOf('p-middle-hide') > 0) {
      document.querySelector(`p.p-${id}`).setAttribute('class', `p-middle p-${id}`)
      document.querySelector(`i.i-${id}`).setAttribute('class', `i-rotate i-${id}`)
      document.querySelector(`a.a-${id}`).innerText = '收起'
      return
    }
    document.querySelector(`p.p-${id}`).setAttribute('class', `p-middle p-middle-hide p-${id}`)
    document.querySelector(`i.i-${id}`).setAttribute('class', `i-${id}`)
    document.querySelector(`a.a-${id}`).innerText = '展开'
  }

  up (id) {
    if (!this.beforeButton()) {
      return
    }
    Toast.loading('')
    post('http://credit.xianjincard.com/activity/thumbs-up-act/thumbs-up', {id: id}).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup')
        if (data.code === -1001) {
          Popup.click('a.click', login)
          return
        }
        Popup.click('a.click')
      }
    })
    let text = parseInt(document.querySelector(`span.span-${id}`).innerText)
    if (document.querySelector(`p.up-${id}`).getAttribute('class').indexOf('no-up') > 0) {
      document.querySelector(`p.up-${id}`).setAttribute('class', `up clearfix up-${id}`)
      document.querySelector(`span.span-${id}`).innerText = text + 1
      Toast.info('点赞成功')
      return
    }
    document.querySelector(`p.up-${id}`).setAttribute('class', `up clearfix up-${id} no-up`)
    document.querySelector(`span.span-${id}`).innerText = text - 1
    Toast.info('取消点赞')
  }

  sortByUp () {
    const { data } = this.state
    order = 0
    page = 1
    this.fetchData(order, page)
    data.length > 0 ? this.refs.lvOne.refs.listview.scrollTo(0, 0) : null
  }

  sortByTime () {
    const { data } = this.state
    order = 1
    page = 1
    this.fetchData(order, page)
    data.length > 0 ? this.refs.lvOne.refs.listview.scrollTo(0, 0) : null
  }

  onEndReached () {
    if (!fetchFlag) {
      return
    }
    fetchFlag = false
    page++
    this.fetchData(order, page, 1)
  }

  fetchData (order, page, type = 0) {
    Toast.loading('')
    get(`http://credit.xianjincard.com/activity/thumbs-up-act/index?order=${order}&page=${page}`).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0 && data.code !== -2012 && data.code !== -2013) {
        Popup.alert(Content.showHtml(data.code), 'popup')
        Popup.click('a.click')
        return
      }
      if (data.data.list.length === 15) {
        fetchFlag = true
      } else {
        fetchFlag = false
        if (type === 2) {
          Toast.info('已经全部加载了哦')
        }
      }
      if (type === 1) {
        let arr = []
        arr = [...this.state.data, ...data.data.list]
        this.setState({
          total: this.formatTotal(data.data.count),
          data: arr,
          dataSource: this.state.dataSource.cloneWithRows(arr),
          code: data.code,
          loginFlag: data.data.login
        })
        return
      }
      if (type === 2) {
        Popup.alert(Content.showPop(), 'popup-pop')
        Popup.click('a.click')
      }
      this.setState({
        total: this.formatTotal(data.data.count),
        data: data.data.list,
        dataSource: this.state.dataSource.cloneWithRows(data.data.list),
        code: data.code,
        loginFlag: data.data.login
      })
      return
    })
  }

  makeMoney () {
    if (!this.beforeButton()) {
      return
    }
    statistics({
      type: '6180',
      tag: '赚钱之道'
    })
    get('http://credit.xianjincard.com/activity/default/act-flag-user?key=thumbsUp_act').then(data => data.data).then(data => {
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup')
        if (data.code === -1001) {
          Popup.click('a.click', login)
          return
        }
        Popup.click('a.click')
        return
      }
      goHome()
    })
  }

  render () {
    const { total, dataSource, data } = this.state
    const totalDom = total.map((v, i) => <span key={i}>{v}</span>)
    const row = (rowData, sectionID, rowID) => {
      return (
        <div className='content-1' key={rowID}>
          <h3 className='h3'>{rowData.user_name}</h3>
          <p className={`p-middle p-middle-hide p-${rowData.id}`}>{rowData.comment}</p>
          <div className='p-bottom clearfix'><div className={`open clearfix open-${rowData.id}`} onClick={() => this.open(rowData.id)}><a className={`a-${rowData.id}`}>展开</a><i className={`i-${rowData.id}`} /></div><p className={rowData.user_up ? `up clearfix up-${rowData.id}` : `up clearfix up-${rowData.id} no-up`} onClick={() => this.up(rowData.id)}><i /><span className={`span-${rowData.id}`}>{rowData.zan_num}</span></p></div>
        </div>
      )
    }
    const listview = data.length > 0 ? <ListView
      ref='lvOne'
      dataSource={dataSource}
      renderRow={row}
      initialListSize={15}
      pageSize={15}
      scrollerOptions={{ scrollbars: true }}
      scrollRenderAheadDistance={200}
      onEndReachedThreshold={10}
      onEndReached={this.onEndReached.bind(this)}
      className='listview'
      scrollEventThrottle={20}
            /> : <p className='no-data'>暂无数据</p>

    return (
      <div className='transition-group'>
        <div className='lay'>
          <div className='money'>
            {totalDom}
          </div>
          <div className='btn'>
            <button className='btn1' onClick={() => this.sortByUp()}>脑洞</button>
            <button className='btn2' onClick={() => this.sortByTime()}>最新</button>
          </div>
          <div className='content'>
            {listview}
          </div>
          <div className='bottom'>
            <button className='btn1' onClick={() => this.showDetail()}>活动详情</button>
            <button className='btn2' onClick={() => this.showTalk()}>我也要说</button>
            <button className='btn3' onClick={() => this.makeMoney()}>赚钱之道</button>
          </div>
        </div>
      </div>
    )
  }
}
