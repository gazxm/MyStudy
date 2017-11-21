import React, {Component} from 'react'
import {List, Checkbox, Button, Toast} from 'antd-mobile'
import {createForm} from 'rc-form';
import classnames from 'classnames'
import request from 'common/request'
import Password from 'components/Password'
import {redirect} from 'utils'
import 'scss/channel/app/loan/checkout.component.scss'

const title = ''
const Item = List.Item
const AgreeItem = Checkbox.AgreeItem
const SET_PAYPASSWORD_TEXT = '请设置交易密码'
const CHECKOUT_PAYPASSWORD_TEXT = '请确认交易密码'

class checkout extends Component {
  state = {
    loan_info: {},
    loaded: false,
    lock: true
  }
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    document.title = title
    let {middleware} = this.props
    let {query} = this.props.location
    Toast.loading(undefined, 0)
    request.post('pool/order/loan-confirm', query).then(response => {
      let {title, order, button} = response.data
      Toast.hide()
      if(!order){
        Toast.fail('获取借款信息失败', 3, redirect.goBack)
        return
      }
      title && (document.title = title)
      if(order && Array.isArray(order.item) && Array.isArray(order.total)){
        order.item = order.item.concat(order.total)
      }
      this.setState({
        ...response.data,
        loaded: true
      })
    }).catch(middleware.bind(this))
  }
  submit () {
    let {getFieldInstance, getFieldValue, validateFields} = this.props.form;
    validateFields(['agree'], (errors, values) => {
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
        let {real_pay_pwd_status, lock} = this.state
        if(lock){
          real_pay_pwd_status ? this.payPassword() : this.setPayPassword()
        }
      }
    })
  }
  payPassword(){
    let {lock} = this.state
    let {middleware} = this.props
    let {query} = this.props.location
    Password.show(password => {
      if(lock){
        this.setState({lock: 0});
        Toast.loading(undefined, 0);
        Password.remove()
        setTimeout(() => {
          request.post(`pool/order/sub-order-confirm`, {
            ...query,
            pay_password: password
          }).then(response => {
            let {code, message, data} = response
            if(!data){
              this.setState({lock: true});
              Toast.fail('获取数据失败，请稍后重试')
              return
            }
            let {order_id} = response.data
            Toast.success('申请成功', 3, () => {
              redirect.replace({
                pathname: '/channel/app/loan/details',
                search: `?product_id=${query.product_id}&order_id=${order_id}`
              })
            })
          }).catch(middleware.bind(this))
        })
      }
    })
  }
  setPayPassword(){
    let {lock} = this.state
    let {middleware} = this.props
    Password.show(password => {
      Password.show(confirm_password => {
        if (password !== confirm_password) {
          Password.error('两次输入交易密码不同')
          return
        }
        if (lock) {
          Toast.loading(undefined, 0)
          this.setState({lock: false})
          Password.remove();
          setTimeout(() => {
            request.post(`credit-user/set-paypassword`, {password}).then(response => {
              let {message} = response
              this.setState({lock: true, real_pay_pwd_status: 1})
              Toast.success(message, 3, () => {
                this.payPassword()
              })
            }).catch(middleware.bind(this))
          })
        }
      }, CHECKOUT_PAYPASSWORD_TEXT)
    }, SET_PAYPASSWORD_TEXT)
  }
  render () {
    let {getFieldProps} = this.props.form
    let {order, repayment, protocol, button, loaded} = this.state
    if(!loaded) return false
    return (
      <div className='wrapper-channel-loan-checkout'>
        {order ?
          <List
          className='detailed_list'
          renderHeader={() => order.title || '借款信息'}
          >
            {(order.item && order.item.length) ? order.item.map((data, index) => (
                <Item key={index} extra={data.value}>{data.key}</Item>
              ))
            : false}
          </List>
        : false}
        {repayment ?
          <List renderHeader={() => '还款计划'} className='repayment_plan'>
            <table>
              {(repayment.header && Array.isArray(repayment.header)) ?
                <thead>
                  <tr>
                    {repayment.header.map((name, index) => (
                      <th key={index}>{name}</th>
                    ))}
                  </tr>
                </thead>
              : false}
              {(repayment.item && Array.isArray(repayment.item)) ?
                <tbody>
                  {repayment.item.map((data, index) => (
                    <tr key={index}>
                      <td>{data.rank}</td>
                      <td>{data.planned_at}</td>
                      <td>{data.amount}</td>
                    </tr>
                  ))}
                </tbody>
              : false}
            </table>
          </List>
        : false}
        {protocol ?
          <div className='am-list'>
            {Array.isArray(protocol.item) ?
              <List renderHeader={() => '交易协议'} className='agreement'>
                <AgreeItem defaultChecked={true} {...getFieldProps('agree', {
                  initialValue: true,
                  rules: [{
                    validator(rule, value, callback){
                      value ? callback() : callback(rule.message)
                    },
                    message: '请同意用户授权协议'
                  }]
                })}>
                  {protocol.item.map((data, index) => (
                    <a key={index} href={data.link}>《{data.name}》</a>
                  ))}
                </AgreeItem>
              </List>
            : false}
            {protocol.info ?
              <div className='notice'>{protocol.info}</div>
            : false}
          </div>
        : false}
        <Button type='primary' onClick={this.submit.bind(this)}>{button}</Button>
      </div>
    )
  }
}

export default createForm()(checkout)