import React from 'react'
import { Modal, List, Button, Picker, InputItem, Toast, NoticeBar } from 'antd-mobile'
import { createForm } from 'rc-form'
import Timer from 'components/Timer'
import {redirect, post} from 'utils'

const Item = List.Item
const alert = Modal.alert

import 'scss/mobile/credit-tied.component.scss'

class TiedCard extends React.Component {
  constructor (props) {
    super(props)
    document.title = '认证信用卡'
    this.state = {
      disabled: true,
      phone: false,
      data: {
        name: '',
        list: []
      }
    }
  }
  componentDidMount () {
    this.fetchData()
  }
  fetchData () {
    Toast.loading('加载中...', 0)
    post('https://credit.xianjincard.com/credit-card/get-credit-card-list').then(response => {
      Toast.hide()
      const {code, message, data} = response.data
      if (code !== 0) {
        Toast.info(message, 2)
        return
      }
      // 已绑定过信用卡
      if (data.item && data.item.length > 0) {
        redirect.replace('/mobile/certification/credit/verify')
        return
      }
      this.setState({data: data})
    }).catch(response => {
      Toast.hide()
    })
  }
  sendCode () {
    post('https://credit.xianjincard.com/credit-card/get-code', {phone: this.state.phone}).then((response) => {
      // console.log(response)
      if (response.data.code !== 0) {
        Toast.info(response.data.message, 2)
      }
    }).catch(response => response)
  }
  submit () {
    this.props.form.validateFields((error, value) => {
      if (!error) {
        value.bank_id = value.bank_id[0]
        value.phone = value.phone.replace(/\s/g, '')
        value.card_no = value.card_no.replace(/\s/g, '')
        Toast.loading(undefined, 0)
        post('https://credit.xianjincard.com/credit-card/add-credit-card', value).then(response => {
          const {code, message} = response.data
          if (code !== 0) {
            Toast.info(message, 3)
            return
          }
          Toast.success(message, 3, () => {
            redirect.replace('/mobile/certification/credit/verify')
          })
        })
      } else {
        let {getFieldInstance} = this.props.form
        for (let i in error) {
          let input = error[i]
          input.errors && input.errors.map(error => {
            Toast.offline(error.message, 3, () => {
              let element = getFieldInstance(error.field)
              if (element && element.refs && element.refs.input) {
                let {input} = element.refs
                setTimeout(input.focus())
              }
            })
          })
          break
        }
      }
    })
  }
  onChange (val) {
    this.props.form.validateFields((error, value) => {
      this.setState({disabled: error})

      if (error) {
        const keys = Object.keys(error)
        if (keys.length === 1 && keys[0] === 'bank_id' && Array.isArray(val)) {
          this.setState({disabled: false})
        }
      }
    })

    if (!val) {
      this.setState({disabled: !val})
    }
  }
  onChangePhone (val) {
    this.setState({phone: /^1[34578]\d{9}$/.test(val) && val})
  }
  render () {
    const {getFieldProps} = this.props.form
    const {name, list} = this.state.data
    return (
      <div>

        {(this.props.location.query.notice !== undefined) && <NoticeBar>请您绑定本人信用卡</NoticeBar>}
        <div class='transition-group credit-tied-card'>
          <List class='custom-list'>
            <InputItem value={name} editable={false} >姓名</InputItem>
            <Picker extra='请选择银行' cols={1} data={list} {...getFieldProps('bank_id', {onChange: this.onChange.bind(this), rules: [{required: true, message: '请选择银行'}]})} title='请选择银行'>
              <Item arrow='horizontal'> 请选择银行 </Item>
            </Picker>
            <InputItem placeholder='请输入信用卡卡号' type='tel' {...getFieldProps('card_no', {onChange: this.onChange.bind(this), rules: [{required: true, message: '请输入信用卡卡号'}]})}>银行卡号</InputItem>
            <InputItem placeholder='请输入银行预留手机号' maxLength={11} type='tel' {...getFieldProps('phone', {onChange: this.onChangePhone.bind(this), rules: [{required: true, pattern: /^1[34578]\d{9}$/, message: '请输入正确手机号'}]})}>手机号</InputItem>
            <InputItem placeholder='请输入验证码' type='tel' {...getFieldProps('code', {validateFirst: true, onChange: this.onChange.bind(this), rules: [{required: true, message: '请输入验证码'}]})}>验证码 <Timer disabled={!this.state.phone} class='timer' onSend={this.sendCode.bind(this)} /></InputItem>
          </List>

          <div class='custom-button'>
            <Button className='btn' type='primary' onClick={this.submit.bind(this)}>确认绑卡</Button>
          </div>
          <div class='security-info'>银行级数据加密保护</div>
        </div>
      </div>
    )
  }
}

export default createForm()(TiedCard)
