/* eslint-disable */
import qs from 'qs';
import React, {Component} from 'react';
import {createForm} from 'rc-form';
import Draggable from 'react-draggable';
import {Modal, Steps, Checkbox, List, Button, Toast, Icon, NoticeBar, Grid, Badge} from 'antd-mobile';
import classnames from 'classnames';
import request from 'common/request';
import {login, redirect, hrefNative as native, platform, resolveUrl, forwardApp as download} from 'utils';
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
        let {key} = this.props.location.query;
        request.post('http://api.xianjincard.com/interface-loan/momolive/confirm-loan', {
            key
        }).then(response => {
            let {agreement, order_status, status_list: steps, amount, loan_day, text, items, status, url, phone} = response.data;
            this.setState({
                agreement,
                order_status,
                steps,
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
    apply(){
        let {key} = this.props.location.query;
        let {middleware, location} = this.props;
        let {amount, loan_day, lock} = this.state;
        if(lock){
            this.setState({lock: 0});
            Toast.loading(undefined, 0);
            request.post('http://api.xianjincard.com/interface-loan/momolive/confirm-loan', {
                confirm_ret: 1,
                key
            }).then(response => {
                let {message} = response;
                Toast.hide();
                this.setState({lock: 1});
                Modal.alert(undefined,
                    <div>
                        <p>恭喜！您的订单已经审核通过</p>
                        <p>您的充值柠檬币很快到账</p>
                        <p>请注意查看</p>
                    </div>, [{
                    text: '确定'
                }]);
            }).catch(response => {
                let {message} = response;
                this.setState({lock: 1});
                Toast.fail(message);
            });
        }
    }
    submit(){
        let {agree, lock} = this.state;
        if(!agree){
            Toast.fail('请同意用户授权协议');
            return;
        }
        this.apply();
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
    render(){
        let {order_status, agreement, steps, agree, items, amount, loan_day, text, status, url, loaded} = this.state;
        let {getFieldProps} = this.props.form;
        return (
            <div className={classnames({
                'wrapper wrapper-channel-order': true,
                loaded
            })}>
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
                        {
                            // <AgreeItem
                            // onClick={this.agreement.bind(this)}
                            // checked={agree}
                            // {...getFieldProps('agree', {
                            //     initialValue: 1,
                            //     rules: [{
                            //         required: true,
                            //         message: `请同意用户授权协议`
                            //     }]
                            // })}>
                            //     我已阅读并同意<a onClick={() => window.location = resolveUrl('http://credit.xianjincard.com/credit-web/loan-grant-auth')}>《借款协议》</a>
                            // </AgreeItem>
                        }
                    </div>
                </div>
            </div>
        )
    }
};
export default createForm()(Checkout);