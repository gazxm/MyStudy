/* eslint-disable */
import qs from 'qs';
import React, {Component} from 'react';
import {createForm} from 'rc-form';
import {List, InputItem, Toast, Button} from 'antd-mobile';
import classnames from 'classnames';
import {resolveUrl as url, redirect, statistics} from 'utils';
import Register from 'components/register';
import request from 'common/request';

import 'scss/activity/imeme.component.scss';

let timer;
const title = '么么直播';
const VERIFY_INIT_TEXT = '获取验证码';
const VERIFY_WAITING_TEXT = '%s秒重新获取';
const VERIFY_RETRY_TEXT = '重新获取';
const RETRY_TEXT = '系统繁忙，请稍后重试';

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

class iMeme extends Component{
    state = {
        verify: {
            text: VERIFY_INIT_TEXT,
            lock: 1
        },
        graphic: {
            lock: 1
        },
        lock: 1,
        loaded: 1,
        loading: 0
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        document.title = title;
        statistics({
            type: '么么直播',
            tag: '落地页访问'
        })
        let {phone} = this.props.location.query;
        let {setFieldsValue} = this.props.form;
        if(phone && phone.length == 11){
            setFieldsValue({
                username: phone
            });
            this.setState({
                phone
            });
        }
    }
    middleware(response){
        let {code, message = RETRY_TEXT} = response;
        Toast.hide();
        Toast.fail(message, 3, () => {
            this.setState && this.setState({lock: 1, loaded: 1, loading: 0});
        });
    }
    submit(){
        let {location: {query}, form: {setFieldsValue, getFieldInstance, getFieldsValue, validateFields}} = this.props;
        validateFields((errors, values) => {
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
                let {username, code} = getFieldsValue();
                if(lock){
                    let start = Date.now();
                    this.setState({lock: 0, loading: 1});
                    request.post('http://api.xianjincard.com/interface-loan/momolive/register', {
                        phone: username.trims(),
                        code,
                        ...query
                    }).then(response => {
                        let {code, message} = response;
                        let end = Date.now();
                        let timeout = 0;
                        if(end - start < 1000) timeout = 1000;
                        if(end - start > 1000) timeout = 0;
                        setTimeout(() => {
                            this.setState({lock: 1, loading: 0});
                            if(code == 0){
                                Toast.success(message, 3, () => {
                                    // redirect.push({
                                    //     pathname: '/mobile/channel',
                                    //     search: `?${qs.stringify(query)}`
                                    // });
                                    window.location.href = url(`http://h.xianjincard.com/mobile/channel?${qs.stringify(query)}`)
                                });
                            }else{
                                Toast.fail(message);
                            }
                        }, timeout);
                    }).catch(response => {
                        let {message} = response;
                        Toast.fail(message);
                        this.setState({lock: 1, loading: 0});
                    });
                }
            }
        });
    }
    verify(){
        let {verify} = this.state;
        let {setFieldsValue, getFieldInstance, getFieldsValue, validateFields} = this.props.form;
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
                let {query} = this.props.location;
                let {refs: {input: username}} = getFieldInstance('username');
                let {username: phone} = getFieldsValue();
                if(verify.lock){
                    verify.lock = 0;
                    verify.loading = 1;
                    this.setState({verify});
                    request.post('http://api.xianjincard.com/interface-loan/momolive/reg-get-code', {
                        phone: phone.trims(),
                        ...query
                    }).then(response => {
                        this.countdown();
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
        let {getFieldProps} = this.props.form;
        let {verify, phone, lock, loaded, loading} = this.state;
        return (
            <div className={classnames({
                'wrapper wrapper-activity-imeme': true,
                loaded
            })}>
                <div className={classnames({register: true})}>
                    <List>
                        <InputItem
                        clear
                        autoFocus
                        editable={!phone}
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
                    className='login'
                    disabled={!lock}
                    loading={loading}
                    onClick={this.submit.bind(this)}>立即登录</Button>
                </div>
            </div>
        )
    }
};

export default createForm()(iMeme);