import React from 'react'
import { Modal, List, Button, Picker, InputItem } from 'antd-mobile'
import { createForm } from 'rc-form'
const Item = List.Item
const alert = Modal.alert

import {redirect, login} from 'utils'
import { connect } from 'react-redux'
import * as security from '../../actions/securityFundActions'

import Toast from '../../components/Toast'

@connect((store) => {
  const verify = store.securityFund.verify
  return {
    user: verify.user,
    sorts: verify.sorts,
    sort: verify.sort,
    tabs: verify.tabs,
    fields: verify.fields,
    fetched: verify.fetched,
    fetching: verify.fetching,
    code: verify.code,
    message: verify.message
  }
})
class SecurityCertification extends React.Component {
  constructor (props) {
    super(props)
    this.loadingText = '加载中...'
  }
  componentDidMount () {
    document.title = '社保认证'
    Toast.hide()
    this.props.dispatch(security.fetchSecurityUser())
  }
  componentWillUpdate (nextProps, nextState) {
    const {fetching} = nextProps
    fetching ? Toast.loading(this.loadingText, 0) : Toast.hide()
  }
  componentDidUpdate (prevProps, prevState) {
    const {fetched, code, message} = this.props
    if (fetched) this.loadingText = '加载中...'
    // 认证成功
    if (fetched && code === 1) {
      Toast.info(message, 2, () => {
        redirect.push('/security')
      })
    }
    // 认证失败
    if (fetched && code === -1) {
      alert('认证失败', message, [
        { text: '确 定' }
      ])
      this.props.dispatch(security.verifySecurityReset())
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
      Toast.info(message, 3)
      this.props.dispatch(security.verifySecurityReset())
    }
  }
  submit = () => {
    this.props.form.validateFields((error, value) => {
      if (!error) {
        // fix bug password input
        for (let i = 0; i < 20; i++) {
          if (value['password' + i] !== undefined) {
            value.password = value['password' + i]
            delete value['password' + i]
            continue
          }
        }

        const i = this.props.sort.tabs.length === 1 ? 0 : value.tab[0]
        value.sort = this.props.sort.tabs[i].sort
        value.website = this.props.sort.website
        value.title = this.props.sort.name
        delete value.city
        delete value.tab
        this.props.dispatch(security.verifySecurity(value))
        this.loadingText = '认证中，请耐心等待...'
      }
    })
  }

  onChange = (v) => {
    const code = v[1]
    var params = new FormData()
    params.append('city_code', code)

    this.props.form.resetFields(['tab'])
    this.props.form.resetFields(['sort'])
    this.props.dispatch(security.fetchSecurityForm(code))
  }

  onSelected = (i = 0) => {
    const {tabs} = this.props
    this.props.dispatch(security.changeSecurityFields(tabs[i].field))
  }

  onSelectedSort (i = 0) {
    const {sorts} = this.props
    this.props.form.resetFields(['tab'])
    this.props.dispatch(security.changeSecuritySorts(sorts[i]))
  }

  createFields (fields) {
    this.list = [{parameter_code: 'city'}, {parameter_code: 'tab'}, {parameter_code: 'sort'}]
    if (!fields) return
    const { getFieldProps } = this.props.form
    return fields.map((field, i) => {
      let name = field.parameter_code
      if (field.parameter_code === 'password') {
        name = field.parameter_code + i
      }
      this.list.push({parameter_code: name})
      return <InputItem type={field.parameter_type} key={i} {...getFieldProps(name, {rules: [{required: true, message: field.parameter_message}]})} clear placeholder={field.parameter_message} >{field.parameter_name}</InputItem>
    })
  }

  createPicker (tabs) {
    const { getFieldProps } = this.props.form
    return tabs && (
      <Picker extra="请选择" cols={1} data={tabs} { ...getFieldProps('tab', {onChange: this.onSelected.bind(this), rules: [{required: true, message: '请选择查询方式'}]})} title="请选择">
        <Item arrow="horizontal"> 查询方式 </Item>
      </Picker>
    )
  }

  createPickerSort (sorts) {
    const { getFieldProps } = this.props.form
    return sorts && (
        <Picker extra="请选择" cols={1} data={sorts} { ...getFieldProps('sort', {onChange: this.onSelectedSort.bind(this), rules: [{required: true, message: '请选择查询类型'}]})} title="请选择">
        <Item arrow="horizontal"> 查询类型 </Item>
        </Picker>
    )
  }

  createError (fields) {
    // let list = [{parameter_code: 'city'}, {parameter_code: 'tab'}, {parameter_code: 'sort'}]
    // if (fields) {
    //   fields.map((field, i) => {
    //     list.push(field)
    //   })
    // }
    const {getFieldError} = this.props.form
    for (let field of this.list) {
      if (getFieldError(field.parameter_code)) {
        return <div class="error" >{getFieldError(field.parameter_code)}</div>
      }
    }
  }
  render () {
    const { getFieldProps } = this.props.form
    const { user, fields, tabs, sorts } = this.props
    return (
      <div class="transition-group fund-security-certification">
        <List class="custom-list">
          <Item extra={user.name}> 姓名 </Item>
          <Item extra={user.id_card && user.id_card.replace(/^(\d{3})\d+(\d{4})$/, '$1***********$2')}> 身份证号 </Item>
          <Picker extra="请选择" cols={2} data={user.city} {...getFieldProps('city', {onChange: this.onChange.bind(this), rules: [{required: true, message: '请选择城市'}]})} title="选择地区">
            <Item arrow="horizontal"> 所在城市 </Item>
          </Picker>
          {this.createPickerSort(sorts)}
          {this.createPicker(tabs)}
          {this.createFields(fields)}
        </List>
        {this.createError(fields)}
        <p>建议您先登录社保查询网站，确认社保登录名、密码等所需登录信息是正确的。</p>
        <div class="custom-button">
          <Button className="btn" disabled={false} type="primary" onClick={this.submit}>提交</Button>
        </div>
      </div>
    )
  }
}
export default createForm()(SecurityCertification)
