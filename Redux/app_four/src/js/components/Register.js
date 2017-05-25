/* eslint-disable */
import axios from 'axios';
import React, {Component} from 'react';
import {Checkbox, InputItem, Button, Toast, Icon} from 'antd-mobile';
import classnames from 'classnames';
import {resolveUrl as url} from 'utils';
import 'scss/components/register.component.scss'

const VERIFY_INIT_TEXT = '获取验证码';
const VERIFY_WAITING_TEXT = '%s秒重新获取';
const VERIFY_RETRY_TEXT = '重新获取';

// childrens components
const AgreeItem = Checkbox.AgreeItem;

let lock = true;
let timer;

function countdown(number){
    this.setState({
        verifyText: VERIFY_WAITING_TEXT.replace(/\%s/, number),
    });
}

export default class Register extends Component{
    constructor(props){
        super(props);
        this.state = {
            agree: 1,
            verify: 1,
            verifyText: VERIFY_INIT_TEXT,
            verifyLoading: 0,
            loading: 0
        };

        // interceptors
        axios.interceptors.request.use(config => {
            config.responseType = 'json';
            config.url = url(`http://credit.xianjincard.com/${config.url.replace(/^\//, '')}`);
            if(config.method && config.method.toUpperCase() === 'POST'){
                config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
                if(config.data && config.data.toString() === '[object Object]'){
                    let data = new FormData();
                    for(let i in config.data){
                        data.append(i, config.data[i]);
                    }
                    config.data = data;
                }
            }
            return config;
        }, error => {
            return Promise.reject(error);
        });
        axios.interceptors.response.use(response => {
            return Promise.resolve(response.data || {});
        }, error => {
            return Promise.reject(error);
        });
        axios.interceptors.response.use(response => {
            response.code = 1000;
            let {code, data, message} = response;
            if(code != 0){
                return Promise.reject(response);
            }
            return Promise.resolve(response);
        });
    }
    middleware(response){
        let {onError} = this.props;
        let {verify} = this.state;
        let {code, message} = response;

        code == 1000 && (message = '注册用户已存在');
        Toast.hide();
        Toast.offline(message, 1.5);
        typeof onError === 'function' && onError(code, message);

        setTimeout(() => {
            if(code == -1){
                let {code: {refs: {input: code}}} = this.refs;
                code.value = '';
                code.focus();
            }else if(code == 1000){
                let {code: {refs: {input: code}}} = this.refs;
                for(let ref in this.refs){
                    let element = this.refs[ref].refs.input;
                    element.value = '';
                    ref == 'phone' && (element.focus());
                }

            }
            this.setState({
                verify: 1,
                verifyLoading: 0,
                loading: 0
            });
            lock = true;
        }, 300);
    }
    verify(){
        let count = 60;
        let {verify, verifyLoading} = this.state;
        let phone = this.refs.phone.refs.input;
        if(verify){
            if(!!!phone.value.length){
                Toast.fail('请输入手机号', 1.5, () => {
                    phone.focus();
                });
                return;
            }else if(!/^[0-9]{11}$/.test(phone.value)){
                Toast.offline('请输入正确的手机号', 1.5, () => {
                    phone.focus();
                });
                return;
            }
            // locking
            this.setState({
                verifyLoading: 1
            });

            let start = Date.now();
            axios.post('credit-user/reg-get-code', {
                phone: phone.value
            }).then(response => {
                let end = Date.now();
                let timeout = 0;
                if(end - start < 1000) timeout = 1000;
                if(end - start > 1000) timeout = 0;
                setTimeout(() => {
                    this.setState({
                        verify: 0,
                        verifyLoading: 0
                    });
                    // initialize
                    countdown.apply(this, [count]);
                    timer = setInterval(() => {
                        countdown.apply(this, [--count]);
                        if(!!!count){
                            timer && clearInterval(timer);
                            this.setState({
                                verify: 1,
                                verifyText: VERIFY_RETRY_TEXT
                            });
                        }
                    }, 1000);
                }, timeout);
            }).catch(this.middleware.bind(this));
        }
    }
    submit(){
        let {query, onSuccess, onError} = this.props;
        let {agree} = this.state;
        let {phone: {refs: {input: phone}}, password: {refs: {input: password}}, code: {refs: {input: code}}} = this.refs;
        if(lock){
            if(!!!phone.value.length){
                error('请输入手机号', () => {
                    phone.focus();
                });
                return;
            }else if(!/^[0-9]{11}$/.test(phone.value)){
                error('请输入正确的手机号', () => {
                    phone.focus();
                });
                return;
            }else if(!!!password.value){
                error('请输入登陆密码', () => {
                    password.focus();
                });
                return;
            }else if(!!!code.value){
                error('请输入验证码', () => {
                    code.focus();
                });
                return;
            }else if(!!!agree){
                error('请同意注册协议');
                return;
            }
            // locking
            this.setState({
                loading: 1
            });

            let start = Date.now();
            axios.post('credit-user/register', Object.assign(query, {
                phone: phone.value,
                password: password.value,
                code: code.value
            })).then(response => {
                let end = Date.now();
                let timeout = 0;
                if(end - start < 1000) timeout = 1000;
                if(end - start > 1000) timeout = 0;
                setTimeout(() => {
                    this.setState({
                        loading: 0
                    });
                    typeof onSuccess === 'function' && onSuccess(0, message);
                    if(!onSuccess){
                        Toast.success(response.message, 1.5);
                    }
                    lock = !lock;
                }, timeout);
            }).catch(this.middleware.bind(this));
            function error(message, cb){
                typeof onError === 'function' && onError(-10, message);
                if(!onError){
                    Toast.fail(message, 1.5, cb || undefined);
                }
            }
        }
    }
    agreement(event){
        let {agree} = this.state;
        setTimeout(() => {
            this.setState({
                agree: !agree
            });
        });
    }
    render(){
        let {className, buttonText = '立即注册', agreement = true, footer} = this.props;
        let {agree, verify, verifyText, verifyLoading, loading} = this.state;
        return (
            <div className={classnames({register: true, [className]: !!className})}>
                <div className='form-group'>
                    <InputItem type='phone' ref='phone' placeholder='请输入手机号' editable={verify} autoFocus clear/>
                </div>
                <div className='form-group'>
                    <InputItem type='password' ref='password' placeholder='请设置登陆密码' clear/>
                </div>
                <div className='form-group'>
                    <InputItem ref='code' placeholder='请输入验证码' clear/>
                    <Button className={classnames({'button-verify': true, loading: verifyLoading, disabled: !verify})} onClick={this.verify.bind(this)}>
                        {verifyText}
                        {verifyLoading ? (<Icon type='loading'/>) : ''}
                    </Button>
                </div>
                <div className='form-group'>
                    <Button className={classnames({'button-submit': true, loading})} onClick={this.submit.bind(this)}>
                        {buttonText}
                        {loading ? (<Icon type='loading'/>) : ''}
                    </Button>
                </div>
                <div className='register-footer'>
                    {agreement && (
                        <AgreeItem onChange={this.agreement.bind(this)} checked={agree}>
                            <div className='agreement'>
                                同意<a href={agreement.url ? agreement.url : '//api.xianjincard.com/act/protocol'}>《{agreement.name ? agreement.name : '现金白卡使用协议'}》</a>
                            </div>
                        </AgreeItem>
                    )}
                    {footer}
                </div>
            </div>
        )
    }
};