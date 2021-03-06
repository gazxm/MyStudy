/* eslint-disable */
import React, {Component, createClass} from 'react';
import {NoticeBar, Modal, List, InputItem, Checkbox, Button, Picker, Toast, Icon, SegmentedControl} from 'antd-mobile';
import {createForm} from 'rc-form';
import classnames from 'classnames';
import 'scss/mobile/certification-layout.component.scss';
import 'scss/mobile/credit.component.scss';
import request from 'common/request';
import {resolveUrl as url, redirect, hrefNative as native, platform, qc} from 'utils';

let title = '信用卡账单导入';

const COMPLETED_TEXT = '导入账单';

class Import extends Component{
    state = {
        visible: 0,
        lock: 1,
        tmailLock: 1,
        loaded: 0,
        loading: 0,
        buttonText: this.props.READY_TEXT
    }
    constructor(props){
        super(props);
    }
    tmallCallback(success){
        if(success == 1){
            redirect.replace('/mobile/certification/credit/importing?type=email')
        }else if(success == 0){
            redirect.replace('/mobile/certification/credit/import?fail');
        }
    }
    componentDidMount(){
        document.title = title;
        let {middleware, getButtonText, route} = this.props;
        request('credit-card/get-credit-user-name').then(response => {
            let {name, isQqLogin, whetherBindingCredit} = response.data;
            if(!whetherBindingCredit){
                Toast.fail('您还末绑定信用卡', 3, () => {
                    setTimeout(redirect.replace('/mobile/certification/credit'));
                });
            }
            this.setState({
                name,
                isQqLogin,
                buttonText: COMPLETED_TEXT,
                loaded: 1
            });
        }).catch(this.middleware.bind(this));
        window.tmail = success => this.tmallCallback(success)
    }
    middleware(response){
        let {code, message} = response;
        let {middleware} = this.props;
        if(code == -5){
            this.setState({visible: 0, buttonText: COMPLETED_TEXT});
            Toast.fail(message, 3, () => {
                setTimeout(redirect.push('/mobile/certification/credit'));
            });
        }else{
            middleware.bind(this, response)();
        }
    }
    submit(){
        let {middleware} = this.props;
        let {getFieldInstance, getFieldsValue, validateFields} = this.props.form;
        validateFields(['email', 'password'], (errors, values) => {
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
                let {lock} = this.state;
                let {email, password} = getFieldsValue();
                if(lock){
                    this.setState({lock: 0, loaded: 0, loading: 1});
                    request.post('credit-card/mail-authentication', {
                        login_name: email,
                        password
                    }).then(response => {
                        let {message} = response;
                        Toast.success(message, 3, () => {
                            setTimeout(redirect.replace('/mobile/certification/credit/importing?type=email'));
                        });
                        this.setState({lock: 1, loaded: 1, loading: 0});
                    }).catch(response => {
                        let {code, message, data: {pic_captcha: captcha}} = response;
                        this.setState({lock: 1, loaded: 1, loading: 0});
                        if(code == 1){
                            this.setState({
                                captcha
                            });
                            setTimeout(() => {
                                this.setState({
                                    visible: 1
                                });
                            });
                        }else if(code == 2){
                            Toast.success(message, 3, () => {
                                setTimeout(redirect.replace('/mobile/certification/credit/import?fail'));
                            });
                        }else{
                            this.middleware.bind(this, response)();
                        }
                    });
                }
            }
        });
    }
    // 提交验证码   
    captcha(){
        let {lock} = this.state;
        if(lock){
            let {getFieldValue, setFieldsValue} = this.props.form;
            let verify_code = getFieldValue('verify_code');
            if(!verify_code){
                Toast.fail('验证码不能为空');
                return;
            }
            Toast.loading(undefined, 0);
            this.setState({visible: 0, lock: 0});
            request.post('credit-card/mail-authentication-captcha', {verify_code}).then(response => {
                Toast.hide();
                this.setState({visible: 0, lock: 1});
                redirect.push('/mobile/certification/credit/importing?type=email');
            }).catch(response => {
                let {code, message, data: {pic_captcha: captcha}} = response;
                setFieldsValue({verify_code: ''});
                this.setState({lock: 1, loaded: 1, loading: 0});
                if(code == -1 && message == '验证码错误'){
                    setTimeout(() => {
                        this.refreshCaptcha.bind(this)();
                        this.setState({visible: 1});
                    }, 1500);
                }
                if(code == 1){
                    Toast.offline(message, 3, () => {
                        this.setState({
                            captcha,
                            visible: 1
                        });
                    });
                }else if(code == 2){
                    Toast.success(message, 3, () => {
                        setTimeout(redirect.replace('/mobile/certification/credit/import?fail'));
                    });
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
            request.post('credit-card/refresh-mail-authentication-captcha').then(response => {
                let {pic_captcha: captcha} = response.data;
                Toast.hide();
                this.setState({captcha, lock: 1});
            }).catch(this.middleware.bind(this));
        }
    }
    tmail(){
        let {tmailLock} = this.state;
        if(tmailLock){
            this.setState({tmailLock: 0});
            Toast.loading(undefined, 0);
            request.post('credit-card/mail-authentication', {
                login_way: 2
            }).then(response => {
                let {open_id} = response.data;
                if(open_id){
                    qc.track('Moxiecert', {openid: open_id, tasktype: 'email', type: 'qq.com'}).then(response => {
                        let {result} = response.data
                        this.tmallCallback(result)
                    })
                }else{
                    Toast.fail('系统繁忙，请稍后重试');
                }
                this.setState({tmailLock: 1});
                Toast.hide();
            }).catch(response => {
                let {code, message} = response;
                Toast.fail(message, 3, () => {
                    this.setState({tmailLock: 1});
                });
            });
        }
    }
    change(value){
        if(value == 'QQ邮箱导入'){
            this.tmail();
        }
    }
    render(){
        let {getFieldProps} = this.props.form;
        let {isQqLogin, visible, captcha, lock, loaded, loading, name, buttonText} = this.state;
        return (
            <div className={classnames({import: true, loaded})}>
                <div className='email'>
                    <NoticeBar>请您导入认证信用卡的账单</NoticeBar>
                    {(isQqLogin == 1) ? <SegmentedControl values={['其他邮箱导入', 'QQ邮箱导入']} onValueChange={this.change.bind(this)}/> : ''}
                    <List>
                        <InputItem editable={false} labelNumber={4} value={name}>持卡人</InputItem>
                        <InputItem
                        labelNumber={4}
                        placeholder='邮箱地址'
                        {...getFieldProps('email', {
                            rules: [{
                                required: true,
                                message: '邮箱地址不能为空'
                            }, {
                                type: 'email',
                                message: '邮箱格式不正确'
                            }]
                        })}>邮箱地址</InputItem>
                        <InputItem
                        type='password'
                        labelNumber={4}
                        placeholder='邮箱密码'
                        {...getFieldProps('password', {
                            rules: [{
                                required: true,
                                message: '邮箱密码不能为空'
                            }]
                        })}>邮箱密码</InputItem>
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
                </Modal>
            </div>
        );
    }
};

export default createForm()(Import);