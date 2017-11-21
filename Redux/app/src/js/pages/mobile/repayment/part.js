/* eslint-disable */
import React, {Component, createClass} from 'react';
import PropTypes from 'prop-types';
import {Popup, Modal, NoticeBar, InputItem, List, Stepper, Button, Toast, Icon} from 'antd-mobile';
import {createForm} from 'rc-form';
import classnames from 'classnames';
import 'scss/mobile/repayment/part.component.scss';
import request from 'common/request';
import {resolveUrl as url, redirect, hrefNative as native, platform, login} from 'utils';
import Password from 'components/Password';

const title = '部分还款';
const Item = List.Item;
const Brief = Item.Brief;
const RETRY_TEXT = '系统繁忙，请稍后重试';

let timer;

class Part extends Component{
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    state = {
        fee: 0,
        money: 0,
        value: 0,
        // LOCK
        lock: 1,
        // 数据加载完毕
        loaded: 0,
        // request loading
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
        document.title = title;
        let {id} = this.props.location.query;
        if(!id){
            Toast.fail('订单号为空', 3, () => {
                redirect.goBack();
            })
            return;
        }
        request(`credit-pay/loan-partial?id=${id}`).then(response => {
            let {item: {my_cards: cards, title, late_fee, remian_time, repayment_amount, repayment_date, last_amount, remain_amount: setps, remain_service: service, remain_tip: tips}} = response.data;
            this.setState({
                cards,
                title,
                remian_time,
                late_fee,
                repayment_amount,
                repayment_date,
                last_amount,
                setps,
                service,
                tips,
                fee: service[0],
                value: (setps[0] - 0),
                money: (setps[0] - 0) + (service[0] - 0) + parseFloat(late_fee, 10),
                loaded: 1
            });
        }).catch(this.middleware.bind(this));
    }
    middleware(response){
        let {setFieldsValue} = this.props.form;
        let {code, message = RETRY_TEXT} = response;
        Toast.hide();
        if(code == -2){
            let modal = document.querySelector('.am-modal');
            if(!modal){
                Modal.alert('提 示', message, [{
                    text: '确 定',
                    onPress: login
                }])
            }
        }else{
            Toast.fail(message, 3, () => {
                this.setState && this.setState({lock: 1, loaded: 1});
                redirect.goBack();
            });
            this.setState({loading: 0});
        }
    }
    submit(){
        let {id} = this.props.location.query;
        let {fee, value, money, setps, remian_time} = this.state;
        if(remian_time || (value == setps[setps.length - 1])){
            window.location.href = url(`http://m.xianjincard.com/loan/loan-repayment-type?id=${id}`);
            return;
        }
        Popup.show(this.chooseBank(), {
            animationType: 'slide-up'
        });
    }
    repayment(card_id){
        let {id} = this.props.location.query;
        let {fee, value, money, setps, remian_time} = this.state;
        Password.show(password => {
            request.post(`credit-pay/partial-apply?id=${id}`, {
                // 服务费
                service_fee: fee,
                //  所选金额
                principal: value,
                // 合计金额
                total_money: money,
                // 交易密码
                password,
                card_id
            }).then(response => {
                let {message} = response;
                Toast.success(message || '操作成功', 3, () => {
                    redirect.push(`/mobile/repayment/result/${id}`);
                });
            }).catch(response => {
                let {code, message} = response;
                if(code == -3){
                    Toast.hide();
                    this.submit();
                    Password.error(message);
                }else{
                    this.middleware(response);
                }
            });
            Toast.loading(undefined, 0);
            Password.remove();
        });
    }
    onChange(value){
        let {setps, service, late_fee} = this.state;
        let index = setps.indexOf(value + '');
        this.setState({value});
        if(index >= 0){
            this.setState({
                fee: service[index] || 0,
                money: value + (service[index] - 0) + parseFloat(late_fee, 10)
            });
        }
    }
    chooseBank(){
        let {cards} = this.state;
        let visibleCards =[];
        let disabledCards = [];
            cards.map((card, index) => {
                if(card.bank_maintaining && card.bank_maintaining == 1){
                    disabledCards.push(card);
                }else{
                    visibleCards.push(card);
                }
            });

        let card = (data, index) => {
            let {card_id, bank_name, card_no_end, bank_maintaining: disabled, bank_maintaining_info} = data;
            return (
                <Item key={index} className={classnames({
                    disabled
                })} onClick={() => {
                    Popup.hide();
                    this.repayment.bind(this, card_id)();
                    // let password = document.querySelector('.popup-password input');
                    // if(password){
                    //     setTimeout(() => {
                    //         password.focus();
                    //     }, 1000)
                    // }
                }}>
                    {bank_name}({card_no_end})
                    {(disabled && bank_maintaining_info) ? <Brief>{bank_maintaining_info}</Brief> : ''}
                </Item>
            );
        };

        return (
            <List className='repayment-part-popup-choose-bank' renderHeader={() => <div>
                <div className='title'>选择银行卡</div>
                <div className='close' onClick={() => Popup.hide()}><Icon type='cross'/></div>
            </div>}>
                {(visibleCards && visibleCards.length) ? visibleCards.map(card) : ''}
                <Item
                className='addBank'
                thumb={<Icon type='plus'/>}
                arrow='horizontal'
                onClick={() => {
                    Popup.hide();
                    redirect.push(`/mobile/certification/bank?type=add`)
                }}>添加银行卡</Item>
                {(disabledCards && disabledCards.length) ? disabledCards.map(card) : ''}
            </List>
        );
    }
    render(){
        let {fee, money, tips, late_fee, remian_time, repayment_amount, repayment_date, last_amount, title, setps, value, visible, lock, loaded, loading} = this.state;
        return (
            <div className={classnames({'wrapper wrapper-mobile wrapper-repayment-part': true, loaded})}>
                {
                    // title && <NoticeBar className='notice'>{title}</NoticeBar>
                }
                {(remian_time == 0) ? 
                    <List>
                        <Item extra={setps ? <Stepper defaultValue={setps[0] - 0} min={setps[0] - 0} max={setps[setps.length - 1] - 0} step={100} onChange={this.onChange.bind(this)} showNumber/> : ''}>
                            首次还款
                        </Item>
                        <Item extra={`${late_fee}元`}>逾期费</Item>
                        <Item extra={`${fee}元`}>手续费</Item>
                        <Item extra={<div className='money'>{money}元</div>}>总金额</Item>
                    </List>
                : 
                    <List>
                        <Item extra={repayment_date}>首次还款日</Item>
                        <Item extra={`${repayment_amount}元`}>已还款金额</Item>
                        <Item extra={<div className='money'>{last_amount}元</div>}>剩余待还款</Item>
                    </List>
                }
                {
                    // (tips && !remian_time) && <div className='tips-repayment' dangerouslySetInnerHTML={{__html: `<div>${tips}</div>`}}/>
                }
                
                <div className='tips'>
                    温馨提示：部分还款仅<span>支持银行卡还款，不支持支付宝还款</span>。
                </div>
                <div className='footer'>
                    <Button
                    type='primary'
                    disabled={!lock || loading}
                    loading={loading}
                    className={classnames({
                        'button-submit': true,
                        'button-round': true,
                        'button-loading': !loaded,
                        // 'button-disabled': disabled
                    })}
                    onClick={this.submit.bind(this)}>立即还款</Button>
                    <div className='instruction'>
                        <span onClick={() => this.setState({visible: 1})}>查看规则说明</span>
                    </div>
                </div>
                <Modal className='repayment-part-modal-instruction' title='部分还款规则说明' onClose={() => this.setState({visible: 0})} visible={visible} transparent>
                    <dl>
                        <dt>1、规则说明</dt>
                        <dd>部分还款，可以分2次完成还款，首次还款金额不低于应还款金额的30%。</dd>
                    </dl>
                    <dl>
                        <dt>2、相关费用</dt>
                        <dd>申请部分还款，需要收取一定的手续费。首次还款成功后，已还款金额将不再收逾期管理费，平台会对剩余未还金额收取1%/天的逾期管理费。部分还款仅支持银行卡还款，不支持支付宝还款。</dd>
                    </dl>
                </Modal>
            </div>
        )
    }
}

export default createForm()(Part);