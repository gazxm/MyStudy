import React from 'react'
import { InputItem, Button } from 'antd-mobile'
import { createForm } from 'rc-form'

import {redirect, post} from 'utils'
import Toast from '../../components/Toast'
import 'scss/components/employer.component.scss'

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      errorMessage: ''
    }
  }

  componentDidMount () {
    document.title = '资金方查询'
  }

  submit = () => {
    this.props.form.validateFields((error, value) => {
      if (!error) {
        Toast.loading('')
        post('http://credit.xianjincard.com/credit-fund/login', value).then(data => data.data).then(data => {
          Toast.hide()
          if (data.code === -2) {
            this.setState({errorMessage: data.message})
            return
          }
          if (data.code === -1) {
            redirect.push('/employer/list')
            return
          }
          this.setState({errorMessage: '服务器繁忙，请稍候再试'})
        })
      }
    })
  }

  onChange () {
    this.setState({
      errorMessage: ''
    })
  }

  render () {
    let errors
    const { getFieldProps, getFieldError } = this.props.form
    return (
      <div className="transition-group fund-security-certification login-body">
        <div className='login'>
          <InputItem {...getFieldProps('user_name', {onChange: this.onChange.bind(this), rules: [{required: true, message: '用户名不能为空'}]})} placeholder='请输入用户名'>用户名：</InputItem>
          <InputItem className="input-password" {...getFieldProps('pass_word', {onChange: this.onChange.bind(this), rules: [{required: true, message: '密码不能为空'}]})} placeholder='请输入密码' type='password'>密码：</InputItem>
          <div className='error'>{(errors = getFieldError('user_name') || getFieldError('pass_word')) ? errors.join(',') : null}{this.state.errorMessage}</div>
          <Button className='btn login-btn' onClick={this.submit}>登录</Button>
        </div>
      </div>
    )
  }
}

export default createForm()(Login)
