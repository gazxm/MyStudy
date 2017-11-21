import React, {Component} from 'react'
import {List, Grid, Toast} from 'antd-mobile'
import classnames from 'classnames'
import request from 'common/request'
import basics from './basics'
import {redirect, login} from 'utils'
import 'scss/channel/m/certification/home.component.scss'

const title = '认证中心'

export default class index extends Component {
  state = {
    loaded: false
  }
  constructor(props){
      super(props);
      request.interceptors.response.use(response => {
          let {code, message} = response;
          if(code == -2){
              login();
              // let modal = document.querySelector('.am-modal');
              // if(!modal){
              //     Modal.alert('提 示', message, [{
              //         text: '确 定',
              //         onPress(){
              //             login();
              //         }
              //     }])
              // }
              return Promise.reject(response);
          }else if([0, -2].indexOf(code) == -1){
              return Promise.reject(response);
          }
          return Promise.resolve(response);
      }, error => {
          return Promise.reject(error);
      });

  }
  componentDidMount () {
    document.title = title
    Toast.loading(undefined, 0)
    request('v2/credit-card/get-verification-info').then(response => {
      let {item = {}} = response.data
      let {list = []} = item
      Toast.hide()
      let verifys = list.filter(data => {
        if(data.type == 1 && data.tag != 81){
          let basic = basics.find(basic => basic.id == data.tag)
          basic.link && (data.url = basic.link)
          return true
        }
      })
      let {search} = this.props.location
      if(verifys.find(data => data.status == 0)){
        for(let i in verifys){
          if(verifys[i] && verifys[i].status == 0){
            redirect.replace({
              pathname: verifys[i].url,
              search
            })
            break;
          }
        }
        return
      }
      this.setState({
        ...item,
        loaded: true
      })
    }).catch(this.middleware.bind(this))
  }
  middleware(response){
      let {code, message} = response;
      Toast.hide();
      if([0, -2].indexOf(code) == -1){
          Toast.fail(message);
      }
      setTimeout(() => {
          this.setState({lock: 1, loaded: 1, loading: 0});
      });
  }
  verifys(data){
    let {title} = data
    let {list} = this.state
    let verifys = list.filter(data => {
      if(data.type == 1 && data.tag != 81){
        let basic = basics.find(basic => basic.id == data.tag)
        basic.link && (data.url = basic.link)
        return true
      }
    })
    return (
      <List renderHeader={() => <div dangerouslySetInnerHTML={{__html: title}}/>}>
        <Grid data={verifys} renderItem={this.row.bind(this)}/>
      </List>
    )
  }
  row(data){
    let {title: text, data: value, logo: icon, url: link, status, type} = data;
    let style = {
        height: document.body.clientWidth / 4
    };
    let click = () => {
        if(!link) return;
        if(/^(https?|\/\/)/.test(link)){
            window.location.href = link;
        }else{
            redirect.push(link);
        }
    };
    return (
        <div className={classnames({
            'am-grid-item-inner-content': true,
            active: !!status
        })} style={style} onClick={click}>
            <div className='am-grid-icon' style={{backgroundImage: icon ? `url(${icon})` : false}}></div>
            <div className='am-grid-text'>{text}</div>
        </div>
    );
  }
  render () {
    let {list_name, header = {}, loaded} = this.state
    if(!loaded) return false
    return (
      <div className='wrapper-m-certification' style={{
        minHeight: document.documentElement.clientHeight
      }}>
        <div className='main'>
          <div>
            <div className='credit'>
              <div>
                <p>{header.status == 3 ? header.data : '认证中'}</p>
                <span>我的额度</span>
              </div>
            </div>
            <div className='tips'>{header.title}</div>
          </div>
        </div>
        {this.verifys(list_name[1])}
      </div>
    )
  }
};
