import React, {Component} from 'react'
import { RefreshControl, ListView, List, Tag, Icon, Modal, Toast } from 'antd-mobile'
import { StickyContainer, Sticky } from 'react-sticky'
import classnames from 'classnames'
import request from 'common/request'
import {platform, login, statistics} from 'utils'
import Back2Top from 'react-back2top'
import 'scss/misc/jianghu-emergency.component.scss'
import defaultIcon from '../../../../assets/img/misc/flow/default.png'

const Item = List.Item
const Brief = Item.Brief
const config = {
  index: '来源首页',
  find: '来源发现',
  orderdetail: '来源订单页'
}

export default class JianghuEmergency extends Component {
  state = {
    page: 1,
    size: 10,
    loading: false,
    empty: false,
    overlay: false,
    filters: [],
    tags: [],
    params: {},
    modal: {
      visible: false
    }
  }
  constructor (props) {
    super(props)
    request.interceptors.response.use(response => {
      let { code } = response
      if (code != 0) {
        return Promise.reject(response)
      }
      return Promise.resolve(response)
    }, error => {
      return Promise.reject(error)
    })
    let data = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
    this.data = []
    this.state.dataSource = data.cloneWithRows([])
    try{
      let params = window.sessionStorage.getItem('JianghuEmergency:params')
      this.state.params = JSON.parse(params) || {}
    }catch(e){}
  }
  componentWillMount () {
  }
  componentDidMount () {
    let {from: source} = this.props.location.query
    let {find} = this.props
    statistics({
      type: 'flow',
      tag: find ? '发现频道访问' : `导流页访问-${(config[source] || source || '直接访问')}`
    })
    this.query(1, true)
  }
  query (page = 1, first) {
    let { params, dataSource, size, loading } = this.state
    ;(page == 1 && !first) && Toast.loading(undefined, 0)
    request.post('notice/discover-list', {
      ...params,
      page
    }).then(response => {
      Toast.hide()
      let {filters, tags, items, page: Page} = response.data
      // 获取筛选项重新设置 scrollTop
      if (JianghuEmergency.offsetTop <= document.body.scrollTop && page == 1) {
        document.body.scrollTop = JianghuEmergency.offsetTop || 0
      }
      if(first){
        try{
          filters.map(filter => {
            let {key} = filter
            if(params && params[key]){
              let data = filter.data
              for(let i in data){
                if(data[i].id == params[key]){
                  filter.selected = data[i]
                  break
                }
              }
            }
          })
          if (params.tags && params.tags != '') {
            let active = params.tags.split(',')
            tags.map(tag => {
              let {id} = tag
              active.indexOf(id.toString()) >= 0 && (tag.active = true)
            })
          }
        }catch(e){}
      }
      if (page == 1 && !items.length) {
          this.setState({
              empty: true,
              lock: true
          })
          return
      }
      items.length < size ? (loading = false) : (loading = true)
      Page.total <= 10 && (loading = false)
      this.data = page == 1 ? [...items] : [...this.data, ...items]
      this.setState({
        ...(first ? {filters, tags} : false),
        page,
        loading,
        dataSource: dataSource.cloneWithRows(this.data),
        empty: false,
        lock: true
      })
      try{
        delete params.page
        window.sessionStorage.setItem('JianghuEmergency:params', JSON.stringify(params))
      }catch(e){}
    }).catch(response => {
      let {code, message} = response
      this.setState({
        lock: true
      })
      Toast.offline(message)
    })
  }
  filter (id, data) {
    let {params, filters} = this.state
    filters.map(filter => {
      let {key, selected = {}} = filter
      if(selected.id == data.id){
        filter.selected = undefined
        params[key] = undefined
        return
      }
      if(filter.key == id){
        filter.selected = data
        params[key] = data.id
      }
    })
    setTimeout(() => {
      this.setState({
        filters,
        params,
        overlay: false
      })
      this.query()
    })
  }
  tag (id) {
    let {tags, params = {}} = this.state
    let active = []
    tags.map(tag => {
      if (tag.id == id) {
        if(tag.active){
          tag.active = false
        }else{
          tag.active = true
        }
      }
      tag.active && active.push(tag.id)
    })
    params.tags = active.join(',')
    setTimeout(() => {
      this.setState({
        tags,
        params
      })
      this.query()
    })
  }
  showFilter (i) {
    let {filters} = this.state
    filters.map((filter, index) => {
      if (i === index && !filter.visible) {
        filter.visible = 1
      } else {
        filter.visible = 0
      }
    })
    this.setState({filters, overlay: true})
  }
  closeFilter () {
    let {filters} = this.state
    filters.map((filter, index) => {
      filter.visible = 0
    })
    this.setState({filters, overlay: false})
  }
  close () {
    let {modal} = this.state
    modal.visible = false
    this.setState({modal})
  }
  onEndReached () {
    let {lock, loading, page} = this.state
    if(lock && loading){
      this.setState({lock: false})
      this.query(page + 1)
    }
  }
  onScroll () {
    let scrollTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop)
    let scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
    let windowHeight = (document.compatMode == 'CSS1Compat') ? document.documentElement.clientHeight : document.body.clientHeight
    if(scrollTop + windowHeight >= (scrollHeight - 500)){
      this.onEndReached()
    }
  }
  union_login (value) {
    Toast.loading(undefined, 0)
    function cb(response){
        let {code, message, data} = response
        Toast.hide()
        if(code == 0){
            data.url && (window.location.href = data.url)
            return
        }
        if(code == -2){
            Modal.alert('提示', message, [{
                text: '立即登录',
                onPress: () => {
                    login()
                }
            }])
        }
    }
    request.post('notice/union-login', {union_login_platform: value}).then(cb.bind(this)).catch(cb.bind(this))
  }
  goto (data) {
    let {name, link, union_login_platform} = data
    let {lock, modal} = this.state
    let {find} = this.props
    let {from: source} = this.props.location.query
    let sources = config[source] || source
        sources = sources ? `${sources}-` : ''
    statistics({
      type: 'flow',
      tag: `${(find ? `发现频道-${sources}点击` : `导流页-${sources}点击`)}${name}`
    })
    request({
      url: 'credit-web/user-click-count',
      params: {
        title: name
      }
    })
    if (union_login_platform) {
      this.union_login(union_login_platform)
    } else {
      if (name && platform.isAndroid) {
        modal.name = name
        modal.link = link
        this.setState({
            modal
        })
        setTimeout(() => {
            modal.visible = 1
            this.setState({
                modal
            })
        }, 100)
      } else {
        window.location.href = link
      }
    }
  }
  render () {
    let {filters, tags, dataSource, overlay, modal, loading, empty} = this.state
    let filter = (item, index) => {
      let {key, name, selected = {}, data, visible} = item
      return (
        <div key={index} onClick={this.showFilter.bind(this, index)} className={classnames({
          filter: true,
          active: visible
        })}>
          <div className='label'>{selected.name || name}</div>
          {(data && Array.isArray(data) && data.length) ?
            <ul className={classnames({
              option: true,
              visible
            })}>
              {data.map((data, i) => (
                <li key={i} onClick={this.filter.bind(this, key, data)} className={classnames({
                  active: (selected.id == data.id)
                })}><a>{data.name}</a></li>
              ))}
            </ul>
          : false}
        </div>
      )
    }
    let tag = (data, index) => {
      let {id, name, active} = data
      return (
        <a key={index} onClick={this.tag.bind(this, id)} className={classnames({active})}>{name}</a>
      )
    }
    let row = data => {
      let {name, image, operation_tag, max_amount, interest, interest_type, description} = data
      let error = event => {
        let element = event.target
        if(!element) return
        element.src = defaultIcon
      }
      return (
        <List onClick={this.goto.bind(this, data)}>
          <Item>
            <div className='title'>
              <img src={image || defaultIcon} onError={error}/>
              {name}
              {operation_tag ? <div className='tag'>{operation_tag}</div> : false}
            </div>
          </Item>
          <Item arrow='horizontal' wrap multipleLine>
            <div className='description'>
              <div className='amount'>
                <p>最高额度(元)</p>
                <p className='money'>{max_amount.replace('元', '')}</p>
              </div>
              <div className='details'>
                <p>
                  参考
                  {interest_type == 1 ? '年' : interest_type == 2 ? '月' : interest_type == 3 ? '日' : '日'}
                  利率: <span className='interest'>{interest}</span>
                  </p>
                <p>{description}</p>
              </div>
            </div>
          </Item>
        </List>
      )
    }
    return (
      <StickyContainer>
        <div ref='JianghuEmergency' className='JianghuEmergency'>
          <Sticky className='main'>
            {(filters && Array.isArray(filters) && filters.length) ?
              <div className='filters'>
                {filters.map(filter)}
              </div>
            : false}
            {(tags && Array.isArray(tags) && tags.length) ?
              <div className='tags'>
                <div className='tags-inner'>
                  {tags.map(tag)}
                </div>
              </div>
            : false}
          </Sticky>
          <div className='content'>
            {!empty ? <ListView
            useBodyScroll
            initialListSize={0}
            dataSource={dataSource}
            renderFooter={() => <div style={{padding: 30, textAlign: 'center'}}>{loading ? <Icon type='loading' /> : '没有了'}</div>}
            renderRow={row}
            pageSize={10}
            scrollRenderAheadDistance={0}
            scrollEventThrottle={20}
            onScroll={this.onScroll.bind(this)}
            onEndReachedThreshold={10}
            />
            : <div className='empty'>暂无数据</div>}
          </div>
          {overlay ? <div className='overlay' onClick={this.closeFilter.bind(this)}/> : null}
        </div>
        <Back2Top />
        <Modal
        className='JianghuEmergency-modal-goto'
        title={`即将进入"${modal.name}"页面`}
        visible={modal.visible}
        onClose={this.close.bind(this)}
        maskClosable={true}
        transparent>
            <p>注册完成后请至各大应用市场下载"{modal.name}"APP</p>
            <a href={modal.link || 'javascript:;'} className='button'>前往</a>
        </Modal>
      </StickyContainer>
    )
  }
}