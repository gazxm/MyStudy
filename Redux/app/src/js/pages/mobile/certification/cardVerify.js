/* eslint-disable */
import React, {Component} from 'react'
import {createForm} from 'rc-form'
import classnames from 'classnames'
import {List, Toast, Button, Checkbox, Picker, InputItem, Modal} from 'antd-mobile'
import request from 'common/request';
import 'scss/mobile/cardVerify.component.scss'
import {resolveUrl as url, redirect, goCertification} from 'utils'

let title = '工资卡认证'
let Item = List.Item
const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;

class cardVerify extends Component {
  state = {
    form: 0,
    lock: 1,
    loaded: 0,
    visible: 0,
    status: 0,
    index: null,
    value: null,
    value1: null,
    openid: null,
    checked: 1
  }
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    document.title = title;

    request.post('/credit-certification/get-payroll-card-list').then(response => {
    let {data} = response;
    data.map((item, index) => {
      item.value = index;
      item.label = item.bank_name;
    });
    this.setState({
      loaded: 1,
      data,
    })
    }).catch(response => {
     let {code, message} = response;
     setTimeout(() => {
       Toast.fail(message);
     })
    })
  }

  change(value){
    let{data} = this.state;
    data.map((item, index) => {
      if (value == index) {
        this.setState({
          selectedBankData: item
        })
        item.login_types.map((item, index) =>{
          item.value = index;
          item.label = item.title;
        })
        this.setState({
          valueArray: item.login_types,
          value: value,
        })
      }
    })
  }

  changeType(value){
    let{valueArray} = this.state;
    console.log(valueArray)
    valueArray.map((item, index) => {
        this.setState({
          value1: value
        })
        if (value == index) {
          this.setState({
            inputs: item.inputs,
            selectId: item.entry_id
          })
          console.log(item.inputs)
        }
    })
  }
  commitClick() {
    let {selectedBankData, selectId, lock, checked} = this.state;
    let {getFieldInstance, getFieldsValue, validateFields} = this.props.form;
    console.log(checked)
    if (!checked) {
      Toast.fail('请同意并阅读《授权书》')
      return;
    }
    if (!(selectedBankData && selectedBankData.bank_name) ) {
      Toast.fail('请选择信息')
      return;
    }
    if (!selectId) {
      Toast.fail('请选择帐号类型')
      return;
    }
    validateFields((errors, values) => {
        if(errors){
            for(let i in errors){
                let input = errors[i];
                input.errors && input.errors.map(error => {
                    Toast.offline(error.message, 3, () => {
                        let element = getFieldInstance(error.field);
                        if(element && element.refs && element.refs.input){
                            let {input} = element.refs;
                            setTimeout(input.focus());
                        }
                    });
                });
                break;
            }
        }else{
          if (lock) {
            this.setState({lock: false, loading: true});
            let params = getFieldsValue();
                params.bank_name =  selectedBankData.bank_name;
                params.entry_id = selectId;
                params.bank_code = selectedBankData.bank_code;
            request.post('/credit-certification/check-oline-login',params).then(response => {
              let {data} = response;
              this.setState({lock: true, loading: false, openid: data.open_id});
              Toast.loading('正在认证中，请稍候', 0);
              this.loop(data.open_id)
            }).catch(response => {
              let {code, message} = response;
              setTimeout(() => {
                Toast.fail(message)
              })
              this.setState({lock: true, loading: false});
            })
          }
        }
      })
  }

  loop (value) {
    let {lock} = this.state;
    if (lock) {
      this.setState({lock: false, loading: true});
      request.post('/credit-certification/get-online-bank-login-state',{open_id: value}).then(response => {
        let {data, message} = response;
        Toast.hide()
        alert('资料提交成功！正在认证中，请耐心等待！', {
          text: '确定', onPress:()=>{
            if(callbackUrl){
                window.location.href = callbackUrl;
              }else{
                setTimeout(() => {
                  goCertification();
                })
          }
        }})
        this.setState({lock: true, loading: false});
      }).catch(response => {
            let {code, message, data: {pic_captcha: captcha}} = response;
            if(code == 1){
              this.setState({lock: true, loading: false});
                this.loop(value);
            }else if([2, 3, 4].indexOf(code) >= 0){
              Toast.hide()
                this.setState({
                    lock: 1,
                    loaded: 1,
                    loading: 0,
                    status: code,
                    captcha
                });
                setTimeout(() => {
                    this.setState({
                        visible: 1
                    });
                });
            }else if(code == 5){
                Toast.success(message, 3, () => {
                    setTimeout(redirect.replace('/mobile/certification/credit/import?fail'));
                });
            }else{
                let {code, message} = response;
                setTimeout(() => {
                  Toast.fail(message)
                })
                this.setState({lock: true, loading: false});
            }
      })
    }
  }

  // 提交验证码   
  captcha(){
      let {lock, openid} = this.state;
      console.log(openid);
      if(lock){
          let {getFieldValue} = this.props.form
          let verify_code = getFieldValue('verify_code');
          if(!verify_code){
              Toast.fail('验证码不能为空');
              return;
          }
          Toast.loading(undefined, 0);
          this.setState({lock: 0});
          request.post('credit-certification/online-bank-login-captcha', {verify_code, open_id: openid}).then(response => {
              Toast.hide();
              this.setState({visible: 0, lock: 1});
              redirect.push('/mobile/certification/credit/importing?type=bank');
          }).catch(response => {
              let {code, message} = response;
              if(code == 1){
                  this.loop(openid)
              }else{
                  let {code, message} = response;
                  setTimeout(() => {
                    Toast.fail(message)
                  })
                  this.setState({lock: true, loading: false});
              }
          });
      }
  }
  // 刷新验证码
  refreshCaptcha(){
      let {lock, openid} = this.state;
      if(lock){
          Toast.loading(undefined, 0);
          this.setState({lock: 0});
          request.post('credit-certification/online-bank-login-resend-captcha',{open_id: openid}).then(response => {
              let {pic_captcha: captcha} = response.data;
              Toast.hide();
              this.setState({captcha, lock: 1});
          }).catch(response => {
            let {code, message} = response;
            setTimeout(() => {
              Toast.fail(message)
            })
            this.setState({lock: true, loading: false});
          })
        }
  }

  checked(){
    let {checked} = this.state
    this.setState({checked: !checked})
  }



render () {
  let {getFieldProps} = this.props.form;
  let {data, loaded, index, value, value1, valueArray, inputs, form, visible, status, captcha} = this.state;
  let input = (data, index) => {
            let {name, label, desc, valid} = data;
            let props = {};
            let rule = {};
            if(valid){
                rule.pattern = new RegExp(valid);
                rule.message = `${label}不正确`
            }
            name == 'password' && (props.type = 'password');
            return (
                <InputItem
                key={index}
                placeholder={desc}
                {...props}
                {...getFieldProps(name, {
                    rules: [{
                        required: true,
                        message: `${label}不能为空`
                    }, rule]
                })}>{label}</InputItem>
            );
        };
  return (
    <div className={classnames({'wrapper wrapper-mobile-cardVerify': true, loaded})}>
      <div>
        <List>
          <Picker
              data={data}
              title="选择银行"
              extra="请选择"
              cols={1}
              value={value}
              onChange={this.change.bind(this)}
            >
              <Item arrow="horizontal">所属银行：</Item>
          </Picker>
          <Item extra='储蓄卡'>卡类型：</Item>
          <Picker
              disabled={!(value && value.length)}
              data={valueArray}
              title="选择帐号"
              extra="请选择"
              cols={1}
              value={value1}
              onChange={this.changeType.bind(this)}
            >
              <Item arrow="horizontal">帐号类型：</Item>
          </Picker>
        </List>

        {(inputs && inputs.length) ? inputs.map(input) : ''}
         <div  className='commit'>
          <Button onClick={this.commitClick.bind(this)}>下一步</Button>
         </div>
        <AgreeItem data-seed="logId" defaultChecked={true} onClick= {this.checked.bind(this)} >
                    我已同意并阅读 <a onClick={(e) => { e.preventDefault(); {window.location.href = url('http://credit.xianjincard.com/payroll-card/authority')}  }}>《授权书》</a>
                  </AgreeItem>
      </div>
      <Modal
      className='am-modal-captcha'
      title='提示'
      onClose={() => setTimeout(this.setState({visible: 0}))}
      visible={visible}
      transparent
      footer={[{
          text: '确定',
          onPress: this.captcha.bind(this)
      }]}>
          {status == 2 ?
              <InputItem
              labelNumber={4}
              placeholder='请输入动态口令'
              {...getFieldProps('verify_code', {
                  rules: [{
                      required: true,
                      message: `动态口令不能为空`
                  }]
              })}>动态口令</InputItem>
          : ''}
          {status == 3 ?
              <InputItem
              labelNumber={3}
              placeholder='请输入验证码'
              extra={captcha ? <div className='captcha' style={{backgroundImage: `url(data:image/jpeg;base64,${captcha})`}} onClick={this.refreshCaptcha.bind(this)}/> : ''}
              {...getFieldProps('verify_code', {
                  rules: [{
                      required: true,
                      message: `验证码不能为空`
                  }]
              })}>验证码</InputItem>
          : ''}
          {status == 4 ?
              <InputItem
              labelNumber={5}
              placeholder='请输入短信验证码'
              {...getFieldProps('verify_code', {
                  rules: [{
                      required: true,
                      message: `短信验证码不能为空`
                  }]
              })}>短信验证码</InputItem>
          : ''}
      </Modal>
    </div>
  )
}
}

export default createForm()(cardVerify)