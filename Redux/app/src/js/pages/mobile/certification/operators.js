/* eslint-disable */
import React, {Component} from 'react';
import {Checkbox, List, InputItem, Button, Toast, Icon} from 'antd-mobile';
import {createForm} from 'rc-form';
import classnames from 'classnames';
import {resolveUrl as url, platform, hrefNative as native, redirect} from 'utils';
import request from 'common/request';
import 'scss/mobile/certification-layout.component.scss';
import 'scss/mobile/operators.component.scss';

const title = '手机运营商';
const AgreeItem = Checkbox.AgreeItem;
const CHECKOUT_TEXT = '确认';

const VERIFY_INIT_TEXT = '获取验证码';
const VERIFY_WAITING_TEXT = '%s秒重新获取';
const VERIFY_RETRY_TEXT = '重新获取';
const RETRY_TEXT = '系统繁忙，请稍后重试';

let timer;
let start;
let queryTimer;

class operators extends Component{
    state = {
        verify: {
            text: VERIFY_INIT_TEXT,
            lock: 1,
            loading: 0
        },
        isSkip: false,
        agree: true,
        lock: true,
        loaded: false,
        buttonText: CHECKOUT_TEXT
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        let {getButtonText, route} = this.props;
        let {buttonText} = this.state;
        document.title = title;
        request('credit-card/get-jxk-verify-info').then(response => {
            let {phone, status, is_expire} = response.data;
            status == 8 && this.query();
            status == 3 && this.countdown()
            buttonText = getButtonText(route);
            this.setState({
                phone,
                status,
                buttonText,
                is_expire,
                loaded: true
            });
        });
    }
    query(){
        let {middleware} = this.props;
        request('credit-info/get-jxl-status').then(response => {
            let {data: status, message} = response;
            let timestamp = new Date().getTime();
            if([2, 4, 8, 11].indexOf(status) >= 0){
                queryTimer = setTimeout(() => this.query(), 1000);
                if(status === 8){
                    if(start){
                        if(start + 15000 < timestamp){
                            this.setState({
                                isSkip: true
                            });
                            
                            queryTimer && clearTimeout(queryTimer);
                        }
                    }else{
                        start = timestamp;
                    }
                }
            }else if([-4, -3, -2, -1].indexOf(status) >= 0){
                Toast.fail(message);
                this.setState({lock: 1, loading: 0});
            }else if(status == 3){
                status == 3 && this.countdown()
                this.setState({lock: 1, loading: 0});
            }else{
                this.setState({lock: 1, loading: 0});
            }
            this.setState({
                status
            });
        }).catch(middleware.bind(this));
    }
    submit(){
        let {nextStepLink, route, middleware} = this.props;
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
                let {lock, status} = this.state;
                let {service_password, captha_password, query_password} = getFieldsValue();
                let password = service_password;
                if(lock){
                    this.setState({lock: 0, loading: 1});
                    let api = 'credit-info/post-service-code';
                    if([-4, 3, 4, 5, 14].indexOf(status) >= 0){
                        api = 'credit-info/post-phone-captcha';
                        password = captha_password;
                    }else if([10, 11].indexOf(status) >= 0){
                        api = 'credit-info/post-phone-query-pwd';
                        password = query_password;
                    }
                    request.post(api, {
                        p: password
                    }).then(response => {
                        let {message} = response;
                        this.query();
                    }).catch(middleware.bind(this));
                }
            }
        });
    }
    skip(){
        let {nextStepLink, route, middleware} = this.props;
        if(platform.isApp){
            native(12);
        }else{
            setTimeout(nextStepLink(route));
        }
    }
    verify(){
        let {middleware} = this.props;
        let {verify} = this.state;
        if(verify.lock){
            verify.lock = false;
            verify.loading = true;
            this.setState({verify});
            request('credit-info/resend-phone-captcha').then(response => {
                this.countdown();
            }).catch(response => {
                verify.lock = true;
                verify.loading = false;
                this.setState({verify});
                middleware.bind(this)(response);
            });
        }
    }
    countdown(){
        let count = 60;
        let {verify} = this.state;
        verify.lock = 0;
        verify.loading = 0;
        verify.disabled = 1;
        verify.text = VERIFY_WAITING_TEXT.replace(/\%s/, count);
        this.setState({verify});
        timer && clearInterval(timer);
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
        let {phone, agree, lock, status, loading, loaded, buttonText, isSkip, verify, is_expire} = this.state;
        let {success} = this.props.location.query;
        return (
            <div className={classnames({
                operator: true,
                loaded
            })}>
                {[6, 8].indexOf(status) == -1 ?
                <div>
                    <List>
                        <InputItem value={phone} editable={false}></InputItem>
                        {([-2, -1, 0, 1, 2].indexOf(status) >= 0) ?
                            <InputItem
                            type='password'
                            extra={<div className='forget' onClick={() => window.location.href = url('http://credit.xianjincard.com/credit-web/reset-pwd')}>忘记密码?</div>}
                            placeholder='请输入手机服务密码'
                            {...getFieldProps('service_password', {
                                rules: [{
                                    required: true,
                                    message: '手机服务密码不能为空'
                                }]
                            })}/>
                        : ''}
                        {([-4, 3, 4, 5, 14].indexOf(status) >= 0) ?
                            <InputItem
                            type='password'
                            extra={
                                <Button
                                loading={verify.loading}
                                disabled={!verify.lock}
                                className={classnames({
                                    verify: true
                                })} onClick={this.verify.bind(this)}>{verify.text}</Button>
                            }
                            placeholder='请输入短信校验码'
                            {...getFieldProps('captha_password', {
                                rules: [{
                                    required: true,
                                    message: '短信校验码不能为空'
                                }]
                            })}/>
                        : ''}
                        {([10, 11].indexOf(status) >= 0) ?
                            <InputItem
                            type='password'
                            placeholder='请输入查询密码'
                            {...getFieldProps('query_password', {
                                rules: [{
                                    required: true,
                                    message: '查询密码不能为空'
                                }]
                            })}/>
                        : ''}
                    </List>
                    {([-2, -1, 0, 1, 2].indexOf(status) >= 0) ?
                        <div className='tips'>
                            <p>温馨提示：</p>
                            <p>1.请输入正确的运营商（移动、联通、电信）服务密码，如若忘记可通过拨打运营商服务电话或者登陆网上营业厅找回密码； </p>
                            <p>2.运营商认证需要2~3分钟，请耐心等待；</p>
                        </div>
                    : ''}
                    <Button
                    type='primary'
                    disabled={!lock}
                    loading={loading}
                    className={classnames({
                        'button-submit button-round': true
                    })}
                    onClick={this.submit.bind(this)}>{buttonText}</Button>
                    
                    <AgreeItem defaultChecked={agree} {...getFieldProps('agree', {
                        initialValue: agree,
                        rules: [{
                            validator(rule, value, callback){
                              value ? callback() : callback(rule.message)
                            },
                            message: '请同意运营商授权协议'
                        }]
                    })}>我已阅读并同意<a href={url('http://credit.xianjincard.com/credit-web/operator')}>《运营商授权协议》</a></AgreeItem>
                </div>
                :
                <div>
                    <div className='status'>
                        {status == 8 ?
                            <div className='waiting'>
                                <p>运营商认证中</p>
                                <Icon type='loading'/>
                                <div className={classnames({
                                    skip: true,
                                    active: isSkip
                                })}><span onClick={this.skip.bind(this)}>跳过，先进行下一步</span></div>
                            </div>
                        : ''}
                        {status == 6 ?
                            <div>
                                <div className={classnames({
                                    success: !is_expire,
                                    waiting: is_expire == true
                                })}>
                                    {!(is_expire == true) ? <div className='icon-success'/> : false}
                                    {is_expire == true ? '运营商认证已过期'  : '运营商认证成功'}
                                </div>
                                {(success !== undefined && is_expire == true) ? <Button type='primary' size='small' onClick={() => redirect.push('/channel/app/operator')}>重新认证</Button> : false}
                                {!(success !== undefined) ? <div className='skip active'><span onClick={this.skip.bind(this)}>确定，进入下一步</span></div> : false}
                            </div>
                        : ''}
                    </div>
                </div>
                }
                <div className='security'>银行级数据加密防护</div>
            </div>
        );
    }
};

export default createForm()(operators);