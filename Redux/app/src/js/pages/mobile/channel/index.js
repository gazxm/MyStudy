/* eslint-disable */
import qs from 'qs';
import React, {Component} from 'react';
import {createForm} from 'rc-form';
import Draggable from 'react-draggable';
import {Steps, Checkbox, List, Button, Toast, Icon, NoticeBar, Grid, Badge} from 'antd-mobile';
import classnames from 'classnames';
import request from 'common/request';
import {login, redirect, hrefNative as native, platform, resolveUrl, forwardApp as download, statistics} from 'utils';
import 'scss/mobile/channel/index.component.scss';
import Password from 'components/Password';


let title = '现金卡信用付';

const Item = List.Item;
const Brief = Item.Brief;
const Step = Steps.Step;
const AgreeItem = Checkbox.AgreeItem;

class Checkout extends Component{
    state = {
        agree: 1,
        lock: 1,
        loaded: 0
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        document.title = title;
        let {middleware} = this.props;
        let {query} = this.props.location;
        let search = `?callbackUrl=${encodeURIComponent(window.location.href)}`;
        for(let i in query){
            query[i] = decodeURI(query[i]);
        }
        request.post('http://api.xianjincard.com/interface-loan/momolive/get-user-info', query).then(response => {
            let {agreement, pwd_status, order_status, status_list: steps, amount, loan_day, text, items, status, url, phone} = response.data;
            if(status == 'LOGIN'){
                phone && (query.phone = phone);
                redirect.replace({
                    pathname: '/activity/imeme/login',
                    search: `?${qs.stringify(query)}`
                })
            }
            if(status == 'REGISTER'){
                redirect.replace({
                    pathname: '/activity/imeme/login',
                    search: `?${qs.stringify(query)}`
                })
            }
            if(status == 'ORDER_DETAILS'){
                statistics({
                    type: '么么直播',
                    tag: '订单详情页'
                });
            }else if(status == 'OLD_USER_LOAN'){
                statistics({
                    type: '么么直播',
                    tag: '订单确认页'
                })
            }
            this.setState({
                pwd_status,
                agreement,
                order_status,
                steps,
                search,
                amount,
                loan_day,
                text,
                items, 
                status,
                url,
                loaded: 1
            });
        }).catch(middleware.bind(this));
    }
    setPayPassword(){
        let {middleware} = this.props;
        let {lock} = this.state;
        Password.show(password => {
            Password.show(confirm_password => {
                if(password !== confirm_password){
                    Password.error('两次输入交易密码不同');
                    return;
                }
                if(lock){
                    this.setState({lock: 0});
                    Toast.loading(undefined, 0);
                    Password.remove();
                    setTimeout(() => {
                        request.post('credit-user/set-paypassword', {password}).then(response => {
                            let {message} = response;
                            this.setState({lock: 1});
                            Toast.success(message, 3, () => {
                                setTimeout(this.apply());
                            });
                        }).catch(response => {
                            Toast.hide();
                            this.setPayPassword();
                            this.setState({lock: 1});
                        });
                    })
                }
            }, '请确认交易密码');
        }, '请设置交易密码');
    }
    apply(){
        let {middleware, location} = this.props;
        let {amount, loan_day, lock} = this.state;
        Password.show(password => {
            if(lock){
                this.setState({lock: 0});
                Toast.loading(undefined, 0);
                Password.remove();
                setTimeout(() => {
                    request.post('credit-loan/apply-loan', {
                        money: amount,
                        period: loan_day,
                        pay_password: password,
                        ...location.query
                    }).then(response => {
                        let {message} = response;
                        this.setState({lock: 1});
                        Toast.success(message, 3, () => {
                            statistics({
                                type: '么么直播',
                                tag: '提交订单'
                            }).then(() => {
                                window.location.reload();
                            });
                        });
                    }).catch(response => {
                        let {message} = response;
                        this.setState({lock: 1});
                        Toast.hide();
                        this.apply();
                        Password.error(message);
                    });
                })
            }
        });
    }
    submit(){
        let {pwd_status, agree, lock} = this.state;
        if(!agree){
            Toast.fail('请同意用户授权协议');
            return;
        }
        pwd_status == 1 ? this.apply() : this.setPayPassword();
    }
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
    reset(){
        let {pathname, query} = this.props.location;
        let {href} = window.location;
        query.is_relend = 1;
        statistics({
            type: '么么直播',
            tag: '再来一笔'
        }).then(() => {
            window.location.href = href + `&is_relend=1`;
        })
        // redirect.push({
        //     pathname,
        //     search: `?${qs.stringify(query)}`
        // });
    }
    render(){
        let {order_status, agreement, steps, agree, search, items, amount, loan_day, text, status, url, loaded} = this.state;
        let {getFieldProps} = this.props.form;
        return (
            <div className={classnames({
                wrapper: true,
                'wrapper-channel-order': ['NEW_USER_LOAN', 'OLD_USER_LOAN'].indexOf(status) >= 0,
                'wrapper-channel-details': ['ORDER_DETAILS', 'CANCEL'].indexOf(status) >= 0,
                loaded
            })}>
                {status == 'NEW_USER_LOAN' ?
                    <div>
                        <div className='main'>
                            <div>
                                <p>您向现金卡信用付</p>
                                <p className='money'>￥{amount}</p>
                                <p className='detailed'>兑换价值: {text}</p>
                            </div>
                        </div>
                        {(items && items.length) ?
                            <List>
                                {items.map((item, index) => (
                                    <Item key={index} extra={item.value}>{item.name}</Item>
                                ))}
                            </List>
                        : ''}
                        <div className='footer'>
                            <Button type='primary' onClick={() => redirect.push({
                                pathname: '/mobile/channel/certification',
                                search
                            })}>确认充值</Button>
                        </div>
                    </div>
                : ''}
                {status == 'OLD_USER_LOAN' ?
                    <div>
                        <div className='main'>
                            <div>
                                <p>您向现金卡信用付</p>
                                <p className='money'>￥{amount}</p>
                                <p className='detailed'>兑换价值: {text}</p>
                            </div>
                        </div>
                        {(items && items.length) ?
                            <List>
                                {items.map((item, index) => (
                                    <Item key={index} extra={item.value}>{item.name}</Item>
                                ))}
                            </List>
                        : ''}
                        <div className='tips'>
                            您需要<span>{loan_day}天</span>后,还款<span>{amount}元</span>.
                        </div>
                        <div className='footer'>
                            <Button type='primary' onClick={this.submit.bind(this)}>确认申请</Button>
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
                                我已阅读并同意
                                <div>
                                    {agreement.map((argee, index) => (
                                        <span dangerouslySetInnerHTML={{__html: argee}}/>
                                    ))}
                                </div>
                            </AgreeItem>
                        </div>
                    </div>
                : ''}
                {(status == 'ORDER_DETAILS' || status == 'CANCEL') ?
                    <div>
                        <div className='title'>订单详情</div>
                        {(steps && steps.length) ?
                            <Steps>
                                {steps.map((step, index) => (
                                    <Step key={index} title={step.key} description={step.value}/>
                                ))}
                            </Steps>
                        : ''}
                        {order_status == 4 ? <div className='progressing'>请耐心等待，审核结果同时也会以短信形式通知，请留意</div> : ''}
                        <List>
                            {(items && items.length) ? items.map((item, index) => (
                                <Item key={index} extra={item.value}>{item.name}</Item>
                            )) : ''}
                            {(agreement && agreement.length) ?
                                <Item className='agreement' extra={
                                    agreement.map((data, index) => (
                                        <div key={index} dangerouslySetInnerHTML={{__html: data}}/>
                                    ))
                                }>协议说明</Item>
                            : ''}
                            <div className='contact-tel'>客服联系电话：400-681-2016</div>
                        </List>
                        {order_status == 2 ?
                            <div className='toolbar'>
                                <div className='money'>
                                    待还款<span>￥{amount}</span>
                                </div>
                                <div className='repayment'>
                                    <a href={url || 'javascript:;'}>立即还款</a>
                                </div>
                            </div>
                        : ''}
                        {status == 'CANCEL' ?
                            <div className='toolbar download'>
                                <div className='repayment'>
                                    <a onClick={this.reset.bind(this)}>再来一笔</a>
                                </div>
                            </div>
                        : ''}
                    </div>
                : ''}
            </div>
        )
    }
};
export default createForm()(Checkout);