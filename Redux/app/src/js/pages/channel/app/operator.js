import React, {Component} from 'react';
import {Checkbox, List, InputItem, Button, Toast, Icon} from 'antd-mobile';
import {createForm} from 'rc-form';
import classnames from 'classnames';
import {redirect, resolveUrl as url, platform, hrefNative as native} from 'utils';
import request from 'common/request';
import 'scss/channel/app/operator.component.scss';

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
        let {middleware} = this.props;
        let {buttonText} = this.state;
        document.title = title;
        Toast.loading(undefined, 0)
        request('pool/operator/init-operator').then(response => {
            let {phone, state: status = 0} = response.data;
            Toast.hide()
            status == 41 && this.result();
            status == 21 && this.countdown()
            this.setState({
                phone,
                status,
                buttonText,
                loaded: true
            });
        }).catch(middleware.bind(this));
    }
    query(){
        let {middleware} = this.props;
        request.post('pool/operator/get-status').then(response => {
            let {state: status, message} = response.data
            let timestamp = new Date().getTime();
            if([11, 22, 32, 41].indexOf(status) >= 0){
                queryTimer = setTimeout(() => this.query(), 1000);
                if(status === 41){
                    queryTimer && clearTimeout(queryTimer);
                    this.result()
                    // if(start){
                    //     if(start + 15000 < timestamp){
                    //         this.setState({
                    //             isSkip: true
                    //         });
                    //         queryTimer && clearTimeout(queryTimer);
                    //     }
                    // }else{
                    //     start = timestamp;
                    // }
                }
            }else if([0, 1, 21, 31, 33, 42].indexOf(status) >= 0){
                Toast.fail(message);
                this.setState({lock: 1, loading: 0});
                status == 21 && this.countdown()
            }else{
                this.setState({lock: 1, loading: 0});
            }
            this.setState({
                status
            });
        }).catch(middleware.bind(this));
    }
    result(){
        let {middleware} = this.props
        request.post('pool/operator/query-report-data').then(response => {
            this.setState({status: 43})
        }).catch(response => {
            this.setState({status: 0})
            middleware.bind(this)(response)
        })
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
                let params = getFieldsValue();
                if(lock){
                    this.setState({lock: 0, loading: 1});
                    let api = 'pool/operator/submit-service-password';
                    if([21, 22, 23, 24].indexOf(status) >= 0){
                        api = 'pool/operator/submit-captcha';
                    }else if([31, 32, 33].indexOf(status) >= 0){
                        api = 'pool/operator/submit-query-password';
                    }
                    request.post(api, {
                        ...params
                    }).then(response => {
                        let {message} = response;
                        this.query();
                    }).catch(middleware.bind(this));
                }
            }
        });
    }
    skip(){
        try{
            window.postMessage(JSON.stringify({type: 'VERIFY_SUCCESS', data: null}))
        }catch(e){}
        setTimeout(() => redirect.goBack())
    }
    verify(){
        let {middleware} = this.props;
        let {verify} = this.state;
        if(verify.lock){
            verify.lock = false;
            verify.loading = true;
            this.setState({verify});
            request('pool/operator/resend-captcha').then(response => {
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
        let {phone, agree, lock, status, loading, loaded, buttonText, isSkip, verify} = this.state;
        let {success} = this.props.location.query;
        if(!loaded) return false;
        return (
            <div className='wrapper-channel-operator' style={{
            height: document.documentElement.clientHeight
          }}>
                {[41, 43].indexOf(status) == -1 ?
                <div>
                    <List>
                        <InputItem value={phone} editable={false}></InputItem>
                        {([0, 1, 11, 42].indexOf(status) >= 0) ?
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
                        {([21, 22, 23, 24].indexOf(status) >= 0) ?
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
                            {...getFieldProps('captcha', {
                                rules: [{
                                    required: true,
                                    message: '短信校验码不能为空'
                                }]
                            })}/>
                        : ''}
                        {([31, 32, 33].indexOf(status) >= 0) ?
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
                    {([0, 1, 11].indexOf(status) >= 0) ?
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
                        {status == 41 ?
                            <div className='waiting'>
                                <p>运营商认证中</p>
                                <Icon type='loading' size='lg'/>
                                <div className={classnames({
                                    skip: true,
                                    active: isSkip
                                })}><span onClick={this.skip.bind(this)}>跳过，先进行下一步</span></div>
                            </div>
                        : ''}
                        {status == 43 ?
                            <div>
                                <div className='success'>
                                    <div className='icon-success'/>
                                    运营商认证成功
                                </div>
                                {!(success !== undefined) ? <div className='skip active'><span onClick={this.skip.bind(this)}>确定，进入下一步</span></div> : ''}
                            </div>
                        : ''}
                    </div>
                </div>
                }
            </div>
        );
    }
};

export default createForm()(operators);