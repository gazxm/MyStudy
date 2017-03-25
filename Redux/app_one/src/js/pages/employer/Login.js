import React from 'react'
import { InputItem, Button } from 'antd-mobile'
import { createForm } from 'rc-form'

import {redirect} from 'utils'
import 'scss/components/employer.component.scss'

class Login extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      errorMessage: ''
    }
  }

  submit = () => {
    this.props.form.validateFields((error, value) => {
      if (!error) {
        setTimeout(() => {
          this.setState({errorMessage: '请输入正确的用户名'})
        }, 100)
        redirect.push('/employer/list')
      }
    })
  }

  render () {
    let errors
    const { getFieldProps, getFieldError } = this.props.form
    return (
      <div className="transition-group fund-security-certification login-body">
        <div className='login'>
          <InputItem {...getFieldProps('userId', {onChange () {}, rules: [{required: true, message: '请输入用户名'}]})} placeholder='请输入用户名'>用户名：</InputItem>
          <InputItem className="input-password" {...getFieldProps('password', {onChange () {}, rules: [{required: true, message: '请输入密码'}]})} placeholder='请输入密码' type='password'>密码：</InputItem>
          <div className='error'>{(errors = getFieldError('userId') || getFieldError('password')) ? errors.join(',') : null}{this.state.errorMessage}</div>
          <Button className='btn login-btn' onClick={this.submit}>登录</Button>
        </div>
      </div>
    )
  }
}

export default createForm()(Login)
