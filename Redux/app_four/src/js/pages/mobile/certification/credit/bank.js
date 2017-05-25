/* eslint-disable */
import React, {Component, createClass} from 'react';
import {Modal, List, InputItem, Checkbox, Button, Picker, Toast, Icon} from 'antd-mobile';
import {createForm} from 'rc-form';
import classnames from 'classnames';
import 'scss/mobile/credit.component.scss';
import request from 'common/request';
import {resolveUrl as url, redirect, hrefNative as native, platform} from 'utils';

let title = '信用卡账单导入';

const AgreeItem = Checkbox.AgreeItem;
const COMPLETED_TEXT = '导入账单';

class Bank extends Component{
    state = {
        visible: 0,
        status: 0,
        agree: 1,
        lock: 1,
        loaded: 0,
        loading: 0,
        buttonText: this.props.READY_TEXT
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        document.title = title;
        let {buttonText} = this.state;
        request.post('credit-card/bill-verification-bank-list').then(response => {
            let {login: items} = response.data;
            buttonText = COMPLETED_TEXT;
            if(!(items && items.inputs && items.inputs.length)){
                Toast.fail('服务器繁忙，请稍后重试', () => {
                    setTimeout(redirect.goBack);
                });
                return;
            }
            this.setState({
                buttonText,
                items,
                loaded: 1
            });
        }).catch(this.middleware.bind(this));
    }
    middleware(response){
        let {code, message} = response;
        let {middleware} = this.props;
        if(code == -5){
            this.setState({buttonText: COMPLETED_TEXT});
            Toast.fail(message, () => {
                setTimeout(redirect.push('/mobile/certification/credit'));
            });
        }else{
            middleware.bind(this, response)();
        }
    }
    submit(){
        let {middleware} = this.props;
        let {getFieldInstance, getFieldsValue, validateFields} = this.props.form;
        let {items: {inputs = undefined} = {}} = this.state;
        let field = [];
        inputs && inputs.map(input => {
            field.push(input.name);
        });
        validateFields([...field, 'agree'], (errors, values) => {
            if(errors){
                for(let i in errors){
                    let input = errors[i];
                    input.errors && input.errors.map(error => {
                        Toast.offline(error.message, () => {
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
                let {lock, items = {}} = this.state;
                let data = getFieldsValue();
                    data.entry_id = items.entry_id;
                if(lock){
                    this.setState({lock: 0, loading: 1});
                    request.post('credit-card/online-banking-login', data).then(response => {
                        let {message} = response;
                        this.query.bind(this)();
                    }).catch(this.middleware.bind(this));
                }
            }
        });
    }
    // 提交验证码   
    captcha(){
        let {lock} = this.state;
        if(lock){
            let {getFieldValue} = this.props.form
            let verify_code = getFieldValue('verify_code');
            if(!verify_code){
                Toast.fail('验证码不能为空');
                return;
            }
            Toast.loading(undefined, 0);
            this.setState({lock: 0});
            request.post('credit-card/online-banking-login-captcha', {verify_code}).then(response => {
                Toast.hide();
                this.setState({visible: 0, lock: 1});
                redirect.push('/mobile/certification/credit/importing?type=bank');
            }).catch(response => {
                let {code, message} = response;
                if(code == 1){
                    this.query.bind(this)();
                }else{
                    this.middleware.bind(this, response)();
                }
            });
        }
    }
    // 刷新验证码
    refreshCaptcha(){
        let {lock} = this.state;
        if(lock){
            Toast.loading(undefined, 0);
            this.setState({lock: 0});
            request.post('credit-card/online-banking-login-resend-captcha').then(response => {
                let {pic_captcha: captcha} = response.data;
                Toast.hide();
                this.setState({captcha, lock: 1});
            }).catch(this.middleware.bind(this));
        }
    }
    // 授权协议
    agreement(){
        let {agree} = this.state;
        let {setFieldsValue, getFieldValue} = this.props.form;
        setTimeout(() => {
            agree = !agree;
            setFieldsValue({
                agree: agree ? 1 : undefined
            });
            this.setState({agree});
        });
    }
    // 提交查询
    query(){
        request.post('/credit-card/get-online-banking-login-state').then(response => {
            let {code, message} = response;
            this.setState({lock: 1, loaded: 1, loading: 0});
            Toast.success(message, () => {
                setTimeout(redirect.replace('/mobile/certification/credit/importing?type=bank'));
            });
        }).catch(response => {
            let {code, message, data: {pic_captcha: captcha}} = response;
            if(code == 1){
                this.query.bind(this)();
            }else if([2, 3, 4].indexOf(code) >= 0){
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
                Toast.success(message, () => {
                    setTimeout(redirect.replace('/mobile/certification/credit/import?fail'));
                });
            }else{
                this.middleware.bind(this, response)();
            }
        });
    }
    render(){
        let {getFieldProps} = this.props.form;
        let {visible, captcha, status, items = {}, lock, loaded, loading, agree, buttonText} = this.state;
        let {inputs} = items;
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
                labelNumber={5}
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
            <div className='import'>
                {(inputs && inputs.length) ?
                    <div className='bank'>
                        <div>
                            <List>
                                {(inputs && inputs.length) && inputs.map(input)}
                                <AgreeItem
                                onClick={this.agreement.bind(this)}
                                checked={agree}
                                {...getFieldProps('agree', {
                                    initialValue: 1,
                                    rules: [{
                                        required: true,
                                        message: `请同意用户授权协议`
                                    }]
                                })}>
                                    我已阅读并同意<a onClick={() => {}}>《用户授权服务协议》</a>
                                </AgreeItem>
                            </List>
                            <Button
                            type='primary'
                            // disabled={!lock || disabled || loading}
                            loading={loading}
                            className={classnames({
                                'button-submit': true,
                                'button-round': true,
                                'button-loading': !lock,
                                // 'button-disabled': disabled
                            })}
                            onClick={this.submit.bind(this)}>{buttonText}</Button>
                            <div className='security'>银行级数据加密防护</div>
                        </div>
                    </div>
                : ''}
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
        );
    }
};
export default createForm()(Bank);