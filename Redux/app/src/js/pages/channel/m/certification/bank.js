/* eslint-disable */
import React, {Component, createClass} from 'react';
import PropTypes from 'prop-types';
import {List, InputItem, Button, Picker, Toast, NoticeBar} from 'antd-mobile';
import {createForm} from 'rc-form';
import classnames from 'classnames';
import 'scss/channel/m/certification/certification-layout.component.scss';
import 'scss/channel/m/certification/bank.component.scss'
import request from 'common/request';
import {resolveUrl as url, redirect, hrefNative as native, platform} from 'utils';

const title = '银行卡';

const VERIFY_INIT_TEXT = '获取验证码';
const VERIFY_WAITING_TEXT = '%s秒重新获取';
const VERIFY_RETRY_TEXT = '重新获取';

let timer;
function countdown(number){
    let {verify} = this.state;
    verify.text = VERIFY_WAITING_TEXT.replace(/\%s/, number);
    this.setState({verify});
}

function verifyCode(){
    let {lock, verify} = this.state;
    return (
        <Button
        type='primary'
        loading={verify.loading}
        disabled={!lock || !verify.lock}
        onClick={this.sendVerifyCode.bind(this)}>{verify.text}</Button>
    );
}

class Bank extends Component{
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    state = {
        lock: true,
        // 数据加载完毕
        loaded: false,
        // request loading
        loading: false,
        verify: {
            lock: true,
            loading: false,
            text: VERIFY_INIT_TEXT
        },
        // 按钮文案
        buttonText: this.props.READY_TEXT
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
      document.title = title
        let {step, loaded, formatPickerData, middleware, hideSteps, getButtonText, route} = this.props;
        let {buttonText} = this.state;
        let {router} = this.context;
        let {type} = this.props.location.query;
        hideSteps()
        request('credit-card/get-bank-card').then(response => {
            let {name, item, list: banks, real_verify_status: disabled, verify_loan_pass} = response.data;
            banks && banks.map(formatPickerData);
            buttonText = getButtonText(route);
            type == 'add' && (item[0] = {});
            this.setState({
                name,
                bank: item[0],
                banks,
                disabled,
                buttonText,
                loaded: 1
            });
        }).catch(middleware.bind(this));
    }
    submit(){
        let {COMPLETED_TEXT, showSteps, nextStepLink, route, middleware} = this.props;
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
                let {lock, bank, status, disabled, buttonText} = this.state;
                let {bank_id, bank_card_number: card_no, phone, code} = getFieldsValue();
                let {type} = this.props.location.query;
                if(lock){
                    this.setState({lock: 0, loaded: 0, loading: 1});
                    let api = (bank && disabled) ? 'http://m.xianjincard.com/loan/do-bind-card' : 'credit-card/add-bank-card';
                    type == 'add' && (api = 'http://m.xianjincard.com/loan/do-add-card');
                    let start = Date.now();
                    request.post(api, {
                        card_no,
                        bank_id: bank_id[0],
                        phone,
                        code
                    }).then(response => {
                        let end = Date.now();
                        let timeout = 0;
                        if(end - start < 1000) timeout = 1000;
                        if(end - start > 1000) timeout = 0;
                        let {message} = response;
                        setTimeout(() => {
                            Toast.success(message, 3, () => {
                                buttonText = COMPLETED_TEXT;
                                if(type == 'add'){
                                    redirect.goBack();
                                    return;
                                }
                                // 查询运营商状态
                                this.query().then(response => {
                                    let {data: status, message} = response;
                                    if(status == 6){
                                        if(platform.isApp){
                                            native(12);
                                        }else{
                                            setTimeout(nextStepLink(route));
                                        }
                                    }else{
                                        showSteps()
                                        redirect.replace({
                                            pathname: '/channel/m/certification/operator',
                                            search: '?type=home'
                                        })
                                    }
                                }).catch(response => {
                                    if(platform.isApp){
                                        native(12);
                                    }else{
                                        setTimeout(nextStepLink(route));
                                    }
                                })
                            });
                            this.setState({lock: 1, loaded: 1, loading: 0, disabled: 1, buttonText});
                        }, timeout);
                    }).catch(middleware.bind(this));
                    
                }
                
            }
        });
    }
    query(){
        return request('credit-info/get-jxl-status')
    }
    sendVerifyCode(){
        let count = 60;
        let {verify, bank = {}} = this.state;
        let {middleware} = this.props;
        let {getFieldValue, getFieldInstance, getFieldError, isFieldTouched} = this.props.form;

        let phone = getFieldValue('phone');
        let field = getFieldError('phone');
        if((!field && !isFieldTouched('phone') && !phone) || (field && field.length)){
            Toast.offline(field ? field.join('') : '银行预留手机号不能为空', 3, () => {
                let {refs: element} = getFieldInstance('phone');
                if(element && element.input){
                    element.input.focus();
                }
            });
            return;
        }
        verify.lock = false;
        verify.loading = true;
        this.setState({verify});

        let start = Date.now();
        request.post('credit-card/get-code', {
            phone
        }).then(response => {
            let end = Date.now();
            let timeout = 0;
            if(end - start < 1000) timeout = 1000;
            if(end - start > 1000) timeout = 0;
            setTimeout(() => {
                verify.loading = false;
                this.setState({verify});

                countdown.apply(this, [count]);
                timer = setInterval(() => {
                    countdown.apply(this, [--count]);
                    if(!!!count){
                        timer && clearInterval(timer);
                        verify.lock = 1;
                        verify.text = VERIFY_RETRY_TEXT;
                        this.setState({verify});
                    }
                }, 1000);
            }, timeout);
        }).catch(response => {
            verify.lock = true;
            verify.loading = false;
            this.setState({verify});
            middleware.bind(this)(response);
        });
    }
    render(){
        let {form: {getFieldProps}, label} = this.props;
        let {
            lock,
            loaded,
            loading,
            disabled,
            name,
            bank = {},
            banks,
            buttonText,
            verify
        } = this.state;
        let editable = !loading && loaded && lock;
        let {bankLast} = this.props.location.query;
        return (
            <div className='bank'>
                <NoticeBar>恭喜您完成认证信息填写，绑定银行卡即可申请借款</NoticeBar>
                <List renderHeader={() => '请填写银行卡信息'}>
                    <InputItem value={name} editable={false}>{label('持卡人')}</InputItem>
                    <Picker
                    cols={1}
                    disabled={!editable}
                    data={banks}
                    {...getFieldProps('bank_id', {
                        initialValue: (bank.bank_id ? [+bank.bank_id] : null),
                        rules: [{
                            required: true,
                            message: '请选择银行'
                        }]
                    })}>
                        <List.Item arrow='horizontal'>{label('选择银行')}</List.Item>
                    </Picker>
                    <InputItem
                    type='number'
                    editable={editable}
                    placeholder='请输入银行卡号'
                    {...getFieldProps('bank_card_number', {
                        initialValue: bank.card_no,
                        rules: [{
                            required: true,
                            message: '银行卡号不能为空'
                        }, {
                            pattern: /^(\d{16}|\d{19})$/,
                            message: '银行卡号只能16或19位数字'
                        }]
                    })}>{label('银行卡号')}</InputItem>
                    <InputItem
                    type='number'
                    editable={editable && verify.lock}
                    placeholder='请输入银行预留手机号'
                    {...getFieldProps('phone', {
                        initialValue: bank.phone,
                        rules: [{
                            required: true,
                            message: '银行预留手机号不能为空'
                        }, {
                            len: 11,
                            message: '请输入正确的银行预留手机号'
                        }]
                    })}>{label('手机号')}</InputItem>
                    <InputItem
                    className='verify_code'
                    extra={verifyCode.apply(this)}
                    editable={editable}
                    placeholder='请输入验证码'
                    {...getFieldProps('code', {
                        rules: [{
                            required: true,
                            message: '验证码不能为空'
                        }]
                    })}>{label('验证码')}</InputItem>
                </List>
                {bankLast !== undefined ? <div className='bankLast'>还剩最后一步，资料完成后下次使用现金卡信用付就无须再次填写！</div> : ''}
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
        )
    }
};

export default createForm()(Bank);
