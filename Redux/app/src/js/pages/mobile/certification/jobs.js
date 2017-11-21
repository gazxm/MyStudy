/* eslint-disable */
import React, {Component, createClass} from 'react';
import PropTypes from 'prop-types';
import {List, InputItem, Button, Picker, Toast, Checkbox} from 'antd-mobile';
import {createForm} from 'rc-form';
import classnames from 'classnames';
import 'scss/mobile/certification-layout.component.scss';
import 'scss/mobile/jobs.component.scss';
import request from 'common/request';
import {resolveUrl as url, redirect, hrefNative as native, platform} from 'utils';

import areas from './data';

const title = '工作信息';

class Jobs extends Component{
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    state = {
        lock: true,
        // 数据加载完毕
        loaded: false,
        // request loading
        loading: false,
        // 按钮文案
        buttonText: this.props.READY_TEXT
    }
    constructor(props){
        super(props);
        let {COMPLETED_TEXT, loaded, formatPickerData, getButtonText, route, middleware} = this.props;
        let {buttonText} = this.state;
        request('credit-card/get-work-info').then(response => {
            let {item: {
                company_name: name,
                company_address: address,
                company_address_distinct: street,
                company_worktype: worktype,
                company_worktype_list: worktypes}
            } = response.data;
            loaded();
            worktypes && worktypes.map(formatPickerData);
            buttonText = COMPLETED_TEXT;
            if(address){
                let temp = [];
                let area = address.split(' ');
                areas.map(data => {
                    if(data.label == area[0]){
                        temp.push(data.value);
                        let childrens = data.children;
                        childrens && childrens.map(children => {
                            if(children.label == area[1]){
                                temp.push(children.value);
                                let childrens = children.children;
                                childrens && childrens.map(children => {
                                    if(children.label == area[2]){
                                        temp.push(children.value);
                                    }
                                })
                            }
                        })
                    }
                });
                address = temp;
            }
            this.setState({
                name,
                address,
                street,
                worktype: worktype ? [+worktype]: null,
                worktypes,
                buttonText,
                loaded: 1
            })
        }).catch(middleware);
    }
    componentDidMount(){
        document.title = title;
    }
    submit(){
        let {callbackUrl} = this.props.location.query;
        let {COMPLETED_TEXT, nextStepLink, route, middleware, getButtonText} = this.props;
        let {getFieldInstance, getFieldsValue, validateFields} = this.props.form;
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
                let {lock, buttonText} = this.state;
                let {name, worktype, address, street} = getFieldsValue();
                if(lock){
                    this.setState({lock: 0, loaded: 0, loading: 1});

                    let start = Date.now();
                    if(address && address.length){
                        let temp = [];
                        areas.map(data => {
                            if(data.value == address[0]){
                                temp.push(data.label);
                                let childrens = data.children;
                                childrens && childrens.map(children => {
                                    if(children.value == address[1]){
                                        temp.push(children.label);
                                        let childrens = children.children;
                                        childrens && childrens.map(children => {
                                            if(children.value == address[2]){
                                                temp.push(children.label);
                                            }
                                        })
                                    }
                                })
                            }
                        });
                        address = temp.join(' ');
                    }
                    request.post('credit-card/save-work-info', {
                        company_name: name,
                        company_worktype: worktype[0],
                        company_address: address,
                        company_address_distinct: street,
                    }).then(response => {
                        let end = Date.now();
                        let timeout = 0;
                        if(end - start < 1000) timeout = 1000;
                        if(end - start > 1000) timeout = 0;
                        let {message} = response;
                        setTimeout(() => {
                            Toast.success(message, 3, () => {
                                buttonText = COMPLETED_TEXT;
                                if(callbackUrl){
                                    window.location.href = callbackUrl;
                                }else{
                                    setTimeout(nextStepLink(route));
                                }
                            });
                            this.setState({lock: 1, loaded: 1, loading: 0, buttonText});
                        }, timeout);
                    }).catch(middleware.bind(this));
                }
            }
        });
    }
    render(){
        let {form: {getFieldProps, getFieldValue}, label} = this.props;
        let {lock,
            loaded,
            loading,
            disabled,
            name,
            worktype,
            worktypes,
            address,
            street,
            buttonText
        } = this.state;
        let editable = !loading && loaded && lock;
        let worktypeValue = getFieldValue('worktype') || worktype;
        return (
            <div className='jobs'>
                <List renderHeader={() => '为保证借款申请顺利通过，请务必填写真实信息'}>
                    <Picker
                    cols={1}
                    disabled={!editable}
                    data={worktypes}
                    {...getFieldProps('worktype', {
                        initialValue: worktype,
                        rules: [{
                            required: true,
                            message: '请选择工作类型'
                        }]
                    })}>
                        <List.Item arrow='horizontal'>{label('工作类型')}</List.Item>
                    </Picker>
                    {(worktypeValue && worktypeValue[0] === 1) ? 
                        <div>
                        <InputItem
                        editable={editable}
                        placeholder='请输入单位名称'
                        {...getFieldProps('name', {
                            initialValue: name,
                            rules: [{
                                required: true,
                                message: '单位名称不能为空'
                            }]
                        })}>{label('单位名称')}</InputItem>
                        <Picker
                        disabled={!editable}
                        data={areas}
                        format={values => values.join(' ')}
                        {...getFieldProps('address', {
                            initialValue: address,
                            rules: [{
                                required: true,
                                message: '请选择单位所在地'
                            }]
                        })}>
                            <List.Item arrow='horizontal'>{label('单位地址')}</List.Item>
                        </Picker>
                        <InputItem
                        editable={editable}
                        className='street'
                        placeholder='填写具体街道门牌号'
                        {...getFieldProps('street', {
                            initialValue: street,
                            rules: [{
                                required: true,
                                message: '街道门牌号不能为空'
                            }]
                        })}/>
                    </div> : ''}
                </List>
                <Button
                type='primary'
                // disabled={!lock || disabled || loading}
                loading={loading}
                className={classnames({
                    'button-submit': true,
                    'button-round': true,
                    'button-loading': !loaded,
                    // 'button-disabled': disabled
                })}
                onClick={this.submit.bind(this)}>{buttonText}</Button>
                <div className='security'>银行级数据加密防护</div>
            </div>
        );
    }
}

export default createForm()(Jobs);