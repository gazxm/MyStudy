import React, {Component} from 'react'
import {Modal, List, Flex, Toast} from 'antd-mobile'
import request from 'common/request'
import {redirect, platform, statistics, login, resolveUrl, hrefNative} from 'utils'
import Slick from 'react-slick'
import JianghuEmergency from 'pages/misc/flow/JianghuEmergency'
import 'slick-carousel/slick/slick.css'
import 'scss/mobile/find.component.scss'

const title = '发现'

function Guides (props) {
  let {data, query} = props
  let Item = Flex.Item
  let row = (data, index) => {
    let {button: title, type, visible, url, img, api_query_url} = data
    if(platform.isIos && visible == 2) return false;
    if(platform.isAndroid && visible == 1) return false;
    let click = () => {
      statistics({
          type: '发现频道-主菜单',
          tag: title, 
      }).then(() => {
        if(api_query_url){
            query(api_query_url)
            return
        }
        if(type != 0 && platform.isApp){
            hrefNative(type);
        }else{
            url && (window.location.href = url);
        }
      })
    };
    return (
      <Item key={index} className='guide' onClick={click}>
        <div>
          <div className='icon' style={{backgroundImage: img ? `url(${img})` : false}}/>
          <p>{title}</p>
        </div>
      </Item>
    )
  }
  if(!(data && Array.isArray(data) && data.length)) return false
  return (
    <Flex className='guides'>
      {data.map(row)}
    </Flex>
  )
}

function Articles (props){
  let {data} = props
  let Item = List.Item
  let Brief = Item.Brief
  let row = (data, index) => {
    let {id, title, img_url, see} = data
    return (
      <Item key={index} thumb={img_url} onClick={() => {
          redirect.push(`/mobile/find/article/${id}`)
          // location.href = `/mobile/find/article/${id}`
      }}>
          <h6>{title}</h6>
          <Brief>
              <div className='preview'>+{see}</div>
          </Brief>
      </Item>
    )
  }
  if(!(data && Array.isArray(data) && data.length)) return false
  return (
    <List className='articles'>
        {data.map(row)}
    </List>
  )
}

function Subject (props){
  let {title, subtitle, extra = '更多', link} = props
  let click = () => {
      typeof link === 'function' && link();
      /^(https?|\/\/)/.test(link) && (window.location.href = link);
  };
  let Item = List.Item
  return (
    <List className='subject'>
        <Item extra={extra} arrow='horizontal' onClick={click}>
            {title}
            {subtitle ? <span>{subtitle}</span> : false}
        </Item>
    </List>
  )
}

export default class find extends Component {
  state = {
    item: [],
    carousel: [],
    article: []
  }
  constructor (props) {
    super(props)
    // 读取缓存数据
    {
      let guides = window.sessionStorage.getItem('find:guides')
      let carousel = window.sessionStorage.getItem('find:carousel')
      let article = window.sessionStorage.getItem('find:article')
      try{
        this.state.item = JSON.parse(guides)
        this.state.carousel = JSON.parse(carousel)
        this.state.article = JSON.parse(article)
      }catch(e){}
    }
  }
  componentWillMount () {
    document.title = title
    request('notice/discovery-channel').then(response => {
      if (!(response.data instanceof Object)) {
        Toast.fail('获取数据失败，请稍后重试', 3, redirect.goBack)
        return
      }
      let {item, carousel, article, is_login_and_verify} = response.data
      statistics({
        type: `发现频道`,
        tag: `发现频道HIT${is_login_and_verify ? '-' + is_login_and_verify : ''}`,
      })
      // set cache
      {
        try{
          window.sessionStorage.setItem('find:guides', JSON.stringify(item))
          window.sessionStorage.setItem('find:carousel', JSON.stringify(carousel))
          window.sessionStorage.setItem('find:article', JSON.stringify(article))
        }catch(e){}
      }
      this.setState({
        ...response.data
      })
    })
  }
  query(url){
      if(url){
          Toast.loading(undefined, 0);
          function cb(response){
              let {code, message, data} = response;
              Toast.hide();
              if(code == 0){
                  data.url && (window.location.href = data.url)
                  return
              }
              if(code == -1){
                  Modal.alert('提示', message, [{
                      text: '立即认证',
                      onPress: () => {
                          if(platform.isApp){
                              hrefNative(3)
                          }else{
                              redirect.push('/mobile/certification')
                          }
                      }
                  }])
              }else if(code == -2){
                  Modal.alert('提示', message, [{
                      text: '立即登录',
                      onPress: login
                  }])
              }
          }
          request(url).then(cb.bind(this)).catch(cb.bind(this))
      }
  }
  banner(data, index){
    let {id, action_url: url} = data;
    statistics({
        type: '发现频道-Banner',
        tag: `第${index + 1}个Banner-ID${id}`, 
    }).then(() => {
        window.location.href = url;
    });
  }
  render () {
    let {item, carousel, article, is_login_and_verify} = this.state
    return (
      <div className='wrapper-mobile-find' style={{
        minHeight: document.documentElement.clientHeight
      }}>
        <Guides data={item} query={this.query}/>
        {(carousel && Array.isArray(carousel) && carousel.length) ?
          <div className='activitys'>
            <Slick arrows={false} dots={true}>
              {carousel.map((data, index) => (
                <div key={index}>
                  <a onClick={this.banner.bind(this, data, index)}><img src={data.img_url}/></a>
                </div>
              ))}
            </Slick>
          </div>
        : false}
        {is_login_and_verify == 0 ? <Articles data={article} /> : false}
        {is_login_and_verify > 0 ?
          <div>
            <Subject
            title='极速 贷款'
            subtitle='高额度，下款快'
            link={resolveUrl(`http://h.xianjincard.com/misc/flow?from=find&hit=${is_login_and_verify}`)}/>
            <JianghuEmergency location={this.props.location} find/>
          </div>
        : false}
      </div>
    )
  }
}
