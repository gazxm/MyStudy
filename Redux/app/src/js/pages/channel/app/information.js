import React, {Component} from 'react'
import {createForm} from 'rc-form'
import classnames from 'classnames'
import {Modal, List, InputItem, Picker, Button, Toast} from 'antd-mobile'
import area from 'common/area'
import request from 'common/request'
import {redirect} from 'utils'
import 'scss/channel/app/information.component.scss'

const title = '个人信息'
const Item = List.Item

area.map(province => {
  province.value = province.label
  province.children && province.children.map(city => {
    city.value = city.label
    city.children && city.children.map(data => {
      data.value = data.label
    })
  })
})

class information extends Component {
  state = {
    attrs: {},
    fields: {},
    lock: true,
    loaded: false,
    loading: false
  }
  constructor (props) {
    super(props)
  }
  componentDidMount () {
    document.title = title
    let {middleware} = this.props
    let {attrs, fields} = this.state
    let {query} = this.props.location
    Toast.loading(undefined, 0)
    request.post('http://api-hj.xianjincard.com/edebit-app/apply-info', query).then(response => {
      let {more} = response.data
      Toast.hide()
      if(more && Array.isArray(more)){
        more.map(data => {
          let {id, value_change, value_type, children, default_value} = data
          let attrName = `${id}-attr`
          if(
            value_change == 'attr' && 
            value_type == 'select' && 
            default_value && 
            children && 
            Array.isArray(children)
          ){
            attrs[attrName] = default_value
            fields[attrName] = children.find(data => data.attr_value == default_value)
          }
        })
      }
      this.setState({
        ...response.data,
        attrs,
        fields,
        loaded: true
      })
    }).catch(middleware.bind(this))
  }
  submit () {
    let {getFieldInstance, getFieldsValue, validateFields} = this.props.form;
    validateFields((errors, values) => {
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
        let {query} = this.props.location
        let {lock} = this.state
        let params = getFieldsValue()
        for(let i in params){
          Array.isArray(params[i]) && (params[i] = params[i].join())
        }
        if(lock){
          this.setState({lock: false, loading: true})
          request.post('http://api-hj.xianjincard.com/edebit-app/save-apply-info', {
            data: JSON.stringify(params),
            ...query
          }).then(response => {
            let {message} = response
            this.setState({lock: true, loading: false})
            Toast.success('信息保存成功', 3, () => {
              try{
                window.postMessage(JSON.stringify({type: 'VERIFY_SUCCESS', data: null}))
              }catch(e){}
              setTimeout(() => redirect.goBack())
            })
            
          })
          .catch(middleware.bind(this))
        }
      }
    })
  }
  translatePickerData(children = []){
    let temp = []
    children.map(data => {
      temp.push({
        value: data.attr_value,
        label: data.title
      })
    })
    return temp
  }
  render () {
    let {getFieldProps} = this.props.form
    let {attrs, fields, basic, more, loaded, loading} = this.state
    let row = (data, index) => {
      let {id, title, default_value, value_type, value_text, value_change, value_additional, table_name, table_field, field_name, children} = data
      if(value_type == 'string'){
        if(/areas/.test(value_additional)){
          return (
            <List key={index}>
              <Picker
              key={index}
              data={area}
              {...getFieldProps(field_name, {
                initialValue: (default_value ? default_value.split(',') : undefined),
              })}>
                <Item arrow='horizontal'>{title}</Item>
              </Picker>
            </List>
          )
        }else{
          return (
            <List key={index}>
              <InputItem
                key={index}
                labelNumber={false}
                placeholder={`请输入${title}`}
                {...getFieldProps(field_name, {
                  initialValue: default_value,
                })}>
                  {title}
              </InputItem>
            </List>
          )
        }
      }else if((value_type == 'select' || value_type == 'radio') && value_change == 'value'){
        return (
          <List key={index}>
            <Picker
            key={index}
            data={Array.isArray(value_text) ? value_text : []} cols={1}
            {...getFieldProps(field_name, {
              initialValue: (default_value ? [default_value] : undefined),
            })}>
              <Item arrow='horizontal'>{title}</Item>
            </Picker>
          </List>
        )
      }else if(value_type == 'select' && value_change == 'attr'){
        let attrName = `${id}-attr`
        // if(default_value){
        //   attrs[attrName] = [default_value]
        //   fields[attrName] = children.find(data => data.attr_value == default_value)
        // }
        let change = value => {
          attrs[attrName] = value
          fields[attrName] = children.find(data => data.attr_value == value.join())
          this.setState({attrs, fields})
        }
        return (
          <div key={index}>
            <List>
              <Picker
              value={attrs[attrName]}
              {...getFieldProps(field_name, {
                onChange: change,
                initialValue: (default_value ? [default_value] : undefined),
              })}
              data={this.translatePickerData(children) || []} cols={1}>
                <Item arrow='horizontal'>{title}</Item>
              </Picker>
            </List>
            {fields[attrName] && Array.isArray(fields[attrName].children) ? fields[attrName].children.map(row) : false}
          </div>
        )
      }else if(value_change == 'attr'){
        return (
          children && Array.isArray(children) ?
            <div key={index}>
              <List renderHeader={() => title}/>
              {children.map(row)}
              <List renderHeader={() => ''}/>
            </div>
          : false
        )
      }
    }
    if(!loaded) return false
    return (
      <div className='wrapper-channel-information' style={{
        minHeight: document.documentElement.clientHeight
      }}>
        <List renderHeader={() => '基础信息'}>
          <InputItem value={basic.name} editable={false}>姓名</InputItem>
          <InputItem value={basic.id_number} editable={false}>身份证号</InputItem>
          <InputItem value={basic.phone} editable={false}>手机号</InputItem>
          {
            // <InputItem {...getFieldProps('name', {
            //   initialValue: basic.name,
            //   rules: [{
            //     required: true,
            //     message: '姓名不能为空'
            //   }]
            // })}>姓名</InputItem>
            // <InputItem {...getFieldProps('id_number', {
            //   initialValue: basic.id_number,
            //   rules: [{
            //     required: true,
            //     message: '身份证号不能为空'
            //   }]
            // })}>身份证号</InputItem>
            // <InputItem {...getFieldProps('phone', {
            //   initialValue: basic.phone,
            //   rules: [{
            //     required: true,
            //     message: '身份证号手机号'
            //   }]
            // })}>手机号</InputItem>
          }
        </List>
        {more && Array.isArray(more) && more.length ? more.map(row) : false}
        <Button type='primary' loading={loading} onClick={this.submit.bind(this)} >保存</Button>
      </div>
    )
  }
};
export default createForm()(information)
