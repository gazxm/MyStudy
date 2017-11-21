import React, {Component} from 'react'
import {createForm} from 'rc-form'
import {Modal, List, InputItem, Picker, Button, Toast} from 'antd-mobile'
import request from 'common/request'
import classnames from 'classnames'
import {redirect} from 'utils'
import 'scss/channel/app/bank.component.scss'

const title = '银行卡'
const Item = List.Item

class bank extends Component {
  state = {
    modal: {
      visible: false
    },
    lock: true,
    verifyLoading: false,
    loading: false,
    loaded: false
  }
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    document.title = title
    const { query } = this.props.location
    try{
      window.postMessage(JSON.stringify({type: 'CLOSE'}))
    }catch(e){}
    // request.post('http://api-hj.xianjincard.com/verification-app/bank-card-list', {product_id: query.product_id}).then(response => {
    request.post('pool/basic/get-bank-card-list', {product_id: query.product_id}).then(response => {
      let {cardList} = response.data
      cardList && cardList.map(data => {
        data.value = String(data.bank_code)
        data.label = data.bank_name
      })
      this.setState({
        ...response.data,
        loaded: true
      })
    })
  }
  verify(){
    let {getFieldInstance, getFieldsValue, validateFields} = this.props.form;
    validateFields(['verify_code'], (errors, values) => {
      if(errors){
        for(let i in errors){
          let input = errors[i];
          input.errors && input.errors.map(error => {
            Toast.offline(error.message, 3, () => {
              let element = getFieldInstance(error.field);
              if(element && element.refs && element.refs.input){
                let {input, textarea} = element.refs;
                input && setTimeout(input.focus());
                textarea && setTimeout(textarea.focus());
              }
            });
          });
          break;
        }
      }else{
        let {middleware} = this.props
        let {lock, modal, card_id} = this.state
        let {verify_code} = getFieldsValue()
        let {product_id} = this.props.location.query
        if(lock){
          modal.visible = false
          Toast.loading(undefined, 0)
          this.setState({lock: false, modal})
          request.post('http://api-hj.xianjincard.com/edebit-app/bank-card-confirm', {
            verify_code,
            card_id,
            product_id
          }).then(response => {
            let {message} = response
            Toast.success('绑卡成功', 3, () => {
              try{
                window.postMessage(JSON.stringify({type: 'VERIFY_SUCCESS', data: null}))
              }catch(e){}
              setTimeout(() => redirect.goBack())
            })
            modal.visible = false
            this.setState({lock: true, modal})
          }).catch(response => {
            let {code, message} = response
            if(code == -1){
              Toast.fail(message, 3, () => {
                this.onShow()
                this.setState({lock: true})
              })
            }else{
              middleware.bind(this)(response)
            }
          })
        }
      }
    })
  }
  submit () {
    let {getFieldInstance, getFieldsValue, validateFields} = this.props.form
    let {isBind} = this.state
    if(isBind == 1){
      this.rebind()
      return
    }
    validateFields(['bank_code', 'bank_card', 'bank_mobile'], (errors, values) => {
      if(errors){
        for(let i in errors){
          let input = errors[i];
          input.errors && input.errors.map(error => {
            Toast.offline(error.message, 3, () => {
              let element = getFieldInstance(error.field);
              if(element && element.refs && element.refs.input){
                let {input, textarea} = element.refs;
                input && setTimeout(input.focus());
                textarea && setTimeout(textarea.focus());
              }
            });
          });
          break;
        }
      }else{
        let {middleware} = this.props
        let {lock, modal} = this.state
        let {query} = this.props.location
        let params = getFieldsValue()
        for(let i in params){
          Array.isArray(params[i]) && (params[i] = params[i].join())
        }
        if(lock){
          this.setState({lock: false, loading: true})
          request.post('http://api-hj.xianjincard.com/edebit-app/bind-bank-card', {
            ...params,
            ...query
          }).then(response => {
            let {message} = response
            this.setState({lock: true, loading: false})
            Toast.success('绑卡成功', 3, () => {
              try{
                window.postMessage(JSON.stringify({type: 'VERIFY_SUCCESS', data: null}))
              }catch(e){}
              setTimeout(() => redirect.goBack())
            })
          }).catch(response => {
            let {code, message} = response
            let {card_id} = response.data
            this.setState({lock: true, loading: false})
            if(code == -100 || code == -101){
              this.setState({card_id})
              Toast.fail(message, 3, () => {
                this.onShow()
              })
            }else{
              middleware.bind(this)(response)
            }
          })
        }
      }
    })
  }
  rebind(){
    let {setFieldsValue} = this.props.form
    let {isBind, bindTarget} = this.state
    if(bindTarget && /^https?/.test(bindTarget)){
      window.location.href = bindTarget
    }else{
      this.setState({isBind: false})
      setFieldsValue({
        bank_code: null,
        bank_card: null,
        bank_mobile: null
      })
    }
  }
  onShow(){
    let {modal} = this.state
    let {setFieldsValue} = this.props.form
    setFieldsValue({verify_code: ''})
    modal.visible = true
    this.setState({modal})
  }
  onClose(){
    let {modal} = this.state
    modal.visible = false
    this.setState({modal})
  }
  render () {
    let {getFieldProps} = this.props.form
    let {isBind, modal, cardInfo, cardList, loaded, loading} = this.state
    if(!loaded) return false
    return (
      <div className='wrapper-channel-bank' style={{
        height: document.documentElement.clientHeight
      }}>
        <List renderHeader={() => '请填写银行卡信息'}>
          <InputItem editable={false} {...getFieldProps('name', {
            initialValue: cardInfo.name
          })}>持卡人</InputItem>
          <Picker
          cols={1}
          data={cardList || []}
          {...getFieldProps('bank_code', {
            initialValue: (cardInfo.card_code ? [String(cardInfo.card_code)] : undefined),
          })}><Item arrow='horizontal'>选择银行</Item></Picker>
          <InputItem
            type='number'
            placeholder='请输入银行卡号'
            {...getFieldProps('bank_card', {
              initialValue: cardInfo.card_no,
              rules: [{
                  required: true,
                  message: '银行卡号不能为空'
              }, {
                  pattern: /^(\d{16}|\d{19})$/,
                  message: '银行卡号只能16或19位数字'
              }]
            })}>银行卡号</InputItem>
          <InputItem
            type='number'
            placeholder='请输入银行预留手机号'
            {...getFieldProps('bank_mobile', {
              initialValue: cardInfo.phone,
              rules: [{
                  required: true,
                  message: '银行预留手机号不能为空'
              }, {
                  len: 11,
                  message: '请输入正确的银行预留手机号'
              }]
            })}>手机号</InputItem>
        </List>
        <Button type='primary' loading={loading} onClick={this.submit.bind(this)}>
          {isBind ? '重新绑卡' : '保存'}
        </Button>
        <Modal className='wrapper-channel-bank-modal' visible={modal.visible} title='输入验证码' onClose={this.onClose.bind(this)} maskClosable transparent>
          <List>
            <InputItem
              type='numbe'
              placeholder='请输入验证码'
              {...getFieldProps('verify_code', {
                required: true,
                message: '验证码不能为空'
              })}>验证码</InputItem>
          </List>
          <Button type='primary' onClick={this.verify.bind(this)} size='small'>提交</Button>
        </Modal>
      </div>
    )
  }
}
export default createForm()(bank)
