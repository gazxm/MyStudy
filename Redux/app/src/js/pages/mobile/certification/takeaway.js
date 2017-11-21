import React, {Component} from 'react'
import {createForm} from 'rc-form'
import classnames from 'classnames'
import {Button, Toast, InputItem} from 'antd-mobile'
import 'scss/mobile/certification-layout.component.scss'
import 'scss/mobile/takeaway.scss'
import request from 'common/request';
import {resolveUrl as url, redirect, goCertification} from 'utils';

let title = '外卖认证'
const VERIFY_INIT_TEXT = '获取验证码';
const VERIFY_WAITING_TEXT = '%s秒重新获取';
const VERIFY_RETRY_TEXT = '重新获取';
const RETRY_TEXT = '系统繁忙，请稍后重试';
let timer;

class takeaway extends Component {
  state = {
    lock: 1,
    loaded: 1,
    loading: 0,
    verify: {
        text: VERIFY_INIT_TEXT,
        lock: 1
    },
    finish:0,
    verifying: 0
  }
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    document.title = title
    let {type = 1} = this.props.location.query;
    let {loaded} = this.props;
    request.post('/credit-certification/init-user-info', {
      platform_id: type
    }).then(response => {
      let{phone, platform_id}=response.data
      this.setState ({
        phone,
        platform_id,
        loaded:1,
        finish:0
      })
      loaded();
      }).catch(response => {
        loaded();
        let{code, message} = response
          if (code == 1) {
            this.setState({
              finish:1,
              loaded:1
            })
          }
      })
  }
  countdown(){
      let count = 60;
      let {verify} = this.state;
      verify.lock = 0;
      verify.loading = 0;
      verify.disabled = 1;
      verify.text = VERIFY_WAITING_TEXT.replace(/\%s/, count);
      this.setState({verify});
      timer = setInterval(() => {
          verify.text = VERIFY_WAITING_TEXT.replace(/\%s/, --count);
          this.setState({verify});
          if(!!!count){
              timer && clearInterval(timer);
              verify.lock = 1;
              verify.text = VERIFY_RETRY_TEXT;
              verify.disabled = 0;
              this.setState({verify});
          }
      }, 1000);
  }
  clearCountdown(){
      let {verify} = this.state;
      verify.lock = 1;
      verify.loading = 0;
      verify.disabled = 0;
      verify.text = VERIFY_INIT_TEXT;
      this.setState({verify});
      timer && clearInterval(timer);
  }
  verifyClick(value){
    let {verify} = this.state;
    if(verify.lock){
      verify.lock = false;
      verify.loading = true;
      this.setState({verify});
     request.post('/credit-certification/get-validate-code',{
      platform_id: value
     }).then(response => {
      let{open_id}=response.data;
      window.localStorage && window.localStorage.setItem('open_id', open_id);
      verify.lock = true;
      verify.loading = false;
      this.setState({
         open_id:open_id,
         verify
      })
      this.countdown()
     }).catch(response => {
      let {code, message} = response;
      setTimeout(() => {
        Toast.fail(message);
      })
      verify.lock = true;
      verify.loading = false;
      this.setState({verify})
     })
    }
     
  }

  loop (value, phone) {
    console.log(phone)
    let {callbackUrl} = this.props.location.query;
    request.post('/credit-certification/get-satus',{
            open_id: value,
            validate_code: phone
          }).then(response => {
            let {code, message} = response;
            Toast.success(message, 3, () => {
              console.log('success')
              if(callbackUrl){
                window.location.href = callbackUrl;
              }else{
                setTimeout(() => {
                  goCertification();
                })
              }
            })
          }).catch(response => {
          let {code, message} = response;
          if (code === 1) {
            this.loop(value, phone)
          }
          else {
            Toast.fail(message);
          }
        })
  }

  commitClick(value){
    let {lock, codeStatus} = this.state;
    let {getFieldsValue} = this.props.form;
    let {phone} = getFieldsValue();
    if(!value && window.localStorage && window.localStorage.getItem('open_id')){
      value = window.localStorage.getItem('open_id');
    }else if(!value && !window.localStorage.getItem('open_id')){
      Toast.fail('请重新获取验证码');
      return;
    }
    if (phone) {
      if (lock) {
        this.setState({lock: false, loading: true});
        Toast.loading('正在认证中，请稍候', 0);
        request.post('/credit-certification/check-validate-code',{
          open_id: value,
          validate_code: phone
        }).then(response => {
          let {message} = response;
          this.setState({lock: true, loading: false});
          this.loop(value, phone)
        }).catch(response => {
          let {code, message} = response;
          setTimeout(() => {
            Toast.fail(message)
          })
          this.setState({lock: 1, loading: 0})
        })
      }
    }
    else{
      Toast.fail('请输入有效的验证码')
    }
  }
render () {
let {loaded, loading, phone, platform_id, open_id, verify, finish} = this.state
let {type = 1} = this.props.location.query;
let {getFieldProps} = this.props.form;
  return (
    <div className='wrapper-mobile-takeaway'>
    {finish ? 
    <div className='finish'>您已经完成认证</div>
   :
   <div>
      <div className={`logo logo-${type}`}>
      </div>
    <InputItem
      value={phone}
      editable={false}
      ref='phone'
      type='phone'
      className={classnames({phone: true})}
      maxLength={11}>
    </InputItem>
        <InputItem
          className={classnames({phone: true})}
          extra={<Button className='verify' type='primary' 
                         loading={verify.loading}
                         disabled={verify.disabled} 
                         onClick={this.verifyClick.bind(this, type)}>{verify.text}</Button>}
          placeholder='请输入短信校验码'
          {...getFieldProps('phone', {})}>
        </InputItem>
        <div  className='commit'>
          <Button type='primary' onClick={this.commitClick.bind(this, open_id)}>确认提交</Button>
        </div>
        </div>}
     </div>
  )
}
}

export default createForm()(takeaway)