/* eslint-disable */
import React, {Component} from 'react';
import {createForm} from 'rc-form';
import {Modal, List, InputItem, Checkbox, Button, Toast} from 'antd-mobile';
import request from 'common/request';
import classnames from 'classnames';
import {resolveUrl as url} from 'utils';
import 'scss/components/register.component.scss';

const VERIFY_INIT_TEXT = '获取验证码';
const VERIFY_WAITING_TEXT = '%s秒重新获取';
const VERIFY_RETRY_TEXT = '重新获取';
const RETRY_TEXT = '系统繁忙，请稍后重试';

const AgreeItem = Checkbox.AgreeItem;

let timer;

String.prototype.trims = function(){
    return this.replace(/\s+/g, '');
};

class Verify extends Component{
    render(){
        let props = {};
        let text = this.props.text;
        for(let i in this.props) props[i] = this.props[i];
        delete props.text;
        return (
            <Button {...props}>{text}</Button>
        );
    }
};

class Register extends Component{
    state = {
        verify: {
            text: VERIFY_INIT_TEXT,
            lock: 1
        },
        graphic: {
            lock: 1
        },
        lock: 1,
        loading: 0
    }
    constructor(props){
        super(props);
        request.interceptors.response.use(response => {
            let {code, message} = response;
            if(code != 0){
                return Promise.reject(response);
            }
            return Promise.resolve(response);
        }, error => {
            return Promise.reject(error);
        });
    }
    componentDidMount(){
        // this.countdown.bind(this)();
    }
    middleware(response){
        let {code, message = RETRY_TEXT} = response;
        Toast.hide();
        Toast.fail(message, 3, () => {
            this.setState && this.setState({lock: 1, loaded: 1});
        });
        this.setState && this.setState({loading: 0});
    }
    submit(){
        let {onSuccess, query, form: {setFieldsValue, getFieldInstance, getFieldsValue, validateFields}} = this.props;
        validateFields(['username', 'password', 'code'], (errors, values) => {
            if(errors){
                for(let i in errors){
                    let input = errors[i];
                    input.errors && input.errors.map(error => {
                        Toast.offline(error.message, 3, () => {
                            let element = getFieldInstance(error.field);
                            if(element && element.refs){
                                let {input, textarea} = element.refs;
                                input && setTimeout(input.focus());
                                textarea && setTimeout(textarea.focus());
                            }
                        });
                    });
                    break;
                }
            }else{
                let {lock} = this.state;
                let {username, password, code} = getFieldsValue();
                let params = {phone: username.trims(), password, code, ...query};
                if(lock){
                    let start = Date.now();
                    this.setState({lock: 0, loading: 1});
                    request.post('credit-user/register', params).then(response => {
                        let {code, message} = response;
                        let end = Date.now();
                        let timeout = 0;
                        if(end - start < 1000) timeout = 1000;
                        if(end - start > 1000) timeout = 0;
                        setTimeout(() => {
                            this.setState({lock: 1, loading: 0});
                            this.clearCountdown.bind(this)();
                            Toast.success(message, 3, () => {
                                setFieldsValue({
                                    username: '',
                                    password: '',
                                    code: ''
                                });
                                typeof onSuccess === 'function' && onSuccess(message);
                            });
                        }, timeout);
                    }).catch(response => {
                        this.middleware.bind(this, response)();
                        this.clearCountdown.bind(this)();
                    });
                }
            }
        });
    }
    verify(){
        let {verify, graphic} = this.state;
        let {form: {setFieldsValue, getFieldInstance, getFieldsValue, validateFields}} = this.props;
        validateFields(['username'], (errors, values) => {
            if(errors){
                for(let i in errors){
                    let input = errors[i];
                    input.errors && input.errors.map(error => {
                        Toast.offline(error.message, 3, () => {
                            let element = getFieldInstance(error.field);
                            if(element && element.refs){
                                let {input, textarea} = element.refs;
                                input && setTimeout(input.focus());
                                textarea && setTimeout(textarea.focus());
                            }
                        });
                    });
                    break;
                }
            }else{
                let {refs: {input: username}} = getFieldInstance('username');
                let {username: phone} = getFieldsValue();
                if(verify.lock){
                    verify.lock = 0;
                    verify.loading = 1;
                    this.setState({
                        verify
                    });
                    request.post('credit-user/reg-get-code', {
                        phone: phone.trims()
                    }).then(response => {
                        let {item} = response.data;
                        if(typeof item === 'string'){
                            setFieldsValue({
                                graphic: ''
                            });
                            verify.lock = 0;
                            verify.loading = 0;
                            graphic.message = '';
                            graphic.style = {backgroundImage: `url(${item})`};
                            graphic.visible = 1;
                            this.setState({
                                graphic
                            });
                        }else{
                            setTimeout(() => {
                                this.countdown.bind(this)();
                            });
                        }
                    }).catch(response => {
                        let {code, message} = response;
                        if(code === 1000){
                            Toast.fail('手机号已存在', 3, () => {
                                setFieldsValue({
                                    username: '',
                                });
                                setTimeout(username.focus());
                            });
                        }else{
                            this.middleware.bind(this, response)();
                        }
                        verify.lock = 1;
                        verify.loading = 0;
                        this.setState({verify});
                    });
                }
            }
        });
    }
    graphic(){
        let {graphic} = this.state;
        let {form: {setFieldsValue, getFieldInstance, getFieldsValue, validateFields}} = this.props;
        let {username, graphic: captcha} = getFieldsValue();
        validateFields(['graphic'], (errors, values) => {
            if(errors){
                for(let i in errors){
                    let input = errors[i];
                    input.errors && input.errors.map(error => {
                        graphic.message = error.message;
                        this.setState({
                            graphic
                        });
                        let element = getFieldInstance(error.field);
                        if(element && element.refs){
                            let {input, textarea} = element.refs;
                            input && setTimeout(input.focus());
                            textarea && setTimeout(textarea.focus());
                        }
                    });
                    break;
                }
            }else{
                if(graphic.lock){
                    graphic.lock = 0;
                    this.setState({
                        graphic
                    });
                    request.post('credit-user/check-get-captcha', {
                        phone: username.trims(),
                        captcha
                    }).then(response => {
                        graphic.lock = 1;
                        graphic.message = '';
                        graphic.visible = 0;
                        this.setState({
                            graphic
                        });
                        setTimeout(() => {
                            this.countdown.bind(this)();
                        });
                    }).catch(response => {
                        let {code, message} = response;
                        graphic.lock = 1;
                        graphic.message = message;
                        this.setState({
                            graphic
                        });
                    });
                }
            }
        });
        
    }
    refreshGraphic(){
        let {graphic} = this.state;
        if(graphic.lock){
            graphic.lock = 0;
            graphic.refresh = 1;
            this.setState({
                graphic
            });
            request('credit-user/refresh-captcha?type=1').then(response => {
                let {item} = response.data;
                graphic.lock = 1;
                graphic.style = {backgroundImage: `url(${item})`};
                graphic.refresh = 0;
                this.setState({
                    graphic
                });
            }).catch(this.middleware.bind(this));
        }
    }
    closeGraphic(){
        let {verify, graphic} = this.state;
        verify.lock = 1;
        graphic.visible = 0;
        this.setState({
            verify,
            graphic
        });
    }
    countdown(){
        let count = 60;
        let {verify} = this.state;
        verify.lock = 0;
        verify.loading = 0;
        verify.disabled = 1;
        verify.text = VERIFY_WAITING_TEXT.replace(/\%s/, count);
        this.setState({verify});
        timer = setInterval(() => {
            verify.text = VERIFY_WAITING_TEXT.replace(/\%s/, --count);
            this.setState({verify});
            if(!!!count){
                timer && clearInterval(timer);
                verify.lock = 1;
                verify.text = VERIFY_RETRY_TEXT;
                verify.disabled = 0;
                this.setState({verify});
            }
        }, 1000);
    }
    clearCountdown(){
        let {verify} = this.state;
        verify.lock = 1;
        verify.loading = 0;
        verify.disabled = 0;
        verify.text = VERIFY_INIT_TEXT;
        this.setState({verify});
        timer && clearInterval(timer);
    }
    render(){
        let {className, form: {getFieldProps}} = this.props;
        let {verify, graphic, lock, loading} = this.state;
        return (
            <div className={classnames({register: true, [className]: !!className})}>
                <List>
                    <InputItem
                    clear
                    autoFocus
                    type='phone'
                    className='username'
                    placeholder={'请输入手机号码'}
                    {...getFieldProps('username', {
                        type: 'phone',
                        rules: [{
                            required: true,
                            message: '手机号不能为空'
                        }, {
                            len: 11,
                            message: '手机号长度错误',
                            transform(value){
                                return value && value.trims();
                            }
                        }]
                    })}/>
                    <InputItem
                    clear
                    type='password'
                    className='password'
                    placeholder={'请设置登录密码'}
                    {...getFieldProps('password', {
                        type: 'password',
                        rules: [{
                            required: true,
                            message: '登录密码不能为空'
                        }, {
                            whitespace: true,
                            message: '密码不能包含空格'
                        }]
                    })}/>
                    <InputItem
                    extra={
                        <Verify
                        text={verify.text}
                        loading={verify.loading}
                        disabled={verify.disabled}
                        onClick={this.verify.bind(this)}/>
                    }
                    className='verify'
                    placeholder={'请输入验证码'}
                    {...getFieldProps('code', {
                        rules: [{
                            required: true,
                            message: '验证码不能为空'
                        }]
                    })}/>
                </List>
                <Button
                type='primary'
                disabled={!lock}
                loading={loading}
                onClick={this.submit.bind(this)}>立即注册</Button>
                <Modal
                title='图形验证码'
                className='register-modal-graphic'
                visible={graphic.visible}
                onClose={this.closeGraphic.bind(this)}
                maskClosable={false}
                transparent>
                    <InputItem
                    extra={
                        <div
                        className={classnames({
                            'graphic-image': true,
                            loading: graphic.refresh
                        })}
                        onClick={this.refreshGraphic.bind(this)} style={graphic.style}/>
                    }
                    placeholder={'请输入验证码'}
                    {...getFieldProps('graphic', {
                        rules: [{
                            required: true,
                            message: '验证码不能为空'
                        }]
                    })}/>
                    <div className='tips'>{graphic.message}</div>
                    <Button
                    type='primary'
                    loading={graphic.loading}
                    onClick={this.graphic.bind(this)}>获取短信验证码</Button>
                </Modal>
            </div>
        )
    }
};

export default createForm()(Register);