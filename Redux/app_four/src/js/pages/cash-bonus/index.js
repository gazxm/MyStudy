/* eslint-disable */
import React, {Component} from 'react';
import {List, SegmentedControl, Modal} from 'antd-mobile';
import {resolveUrl, login, share} from 'utils';
import moment from 'moment';
import request from './request';
import 'scss/cash-bonus/index.component.scss';

let title = '现金红包';
let Item = List.Item;
let Brief = Item.Brief;
let defaultIcon = require('../../../assets/img/cash-bonus/icon.png');
let alert = Modal.alert;

export default class CashBonus extends Component{
    constructor(props){
        super(props);
        this.state = {
            money: 0,
            total: 0,
            segments: ['当前奖金', '提现历史'],
            segmentIndex: 0,
            items: [],
            cashs: [],
            loaded: 0
        };
    }
    componentDidMount(){
        document.title = title;
        request('user-account/index').then(response => {
            let {balance: money, total, logs: items, cash: cashs, is_card, is_pwd, is_date_limit, is_overdue} = response.data;
            this.setState({
                money: +money,
                total,
                items,
                cashs,
                is_card,
                is_pwd,
                loaded: 1
            });
        }).catch(this.middleware.bind(this));
    }
    middleware(response){
        let {code, message} = response;
        this.setState({
            loaded: 1
        });
        if(-1001 === code){
            login();
            return;
        }else{
            Toast.fail(message, 1.5);
        }
    }
    segment(value){
        let {segments} = this.state;
        let index = segments.indexOf(value);
        if(index >= 0){
            this.setState({
                segmentIndex: index
            });
        }
    }
    isActive(index){
        let {segmentIndex} = this.state;
        return index === segmentIndex ? 'active' : '';
    }
    withdrawal(){
        let {money, is_card, is_pwd, is_date_limit, is_overdue} = this.state;
        let message = (message) => {
            return (
                <p className='tips' dangerouslySetInnerHTML={{__html: message}}></p>
            )
        };
        if(is_card == 0){
            alert(undefined, message('请先绑定银行卡再提现'), [{
                text: '取消'
            }, {
                text: '去绑定',
                onPress(){
                    // todo 跳转到原生绑定银行卡
                    window.location = resolveUrl('http://m.xianjincard.com/loan/card-list');
                }
            }]);
            return;
        }else if(is_pwd == 0){
            alert(undefined, message('请先设置交易密码再提现'), [{
                text: '取消'
            }, {
                text: '去设置',
                onPress(){
                    // todo 跳转到原生设置交易密码
                    window.location = resolveUrl('http://h5.xianjincard.com/mobile/#/my/paypassword?state=' + encodeURIComponent(window.location.href));
                }
            }]);
            return;
        }else if(is_date_limit == 0){
            alert(undefined, message('本周一次提现机会已经用完咯<br/>您下周再来吧'), [{
                text: '确定'
            }]);
            return;
        }else if(is_overdue == 0){
            alert(undefined, message('您目前有订单处于预期中，请先还款后再提现'), [{
                text: '确定'
            }]);
            return;
        }else if(money < 30){
            alert(undefined, message('您的提现额度不足30元<br/>不能提现'), [{
                text: '确定'
            }]);
            return;
        }else{
            window.location.href = `cash-bonus/withdrawal?money=${money}`;
        }
    }
    render(){
        let {money, total, segments, segmentIndex, items, cashs, loaded} = this.state;
        let source = (data, index) => {
            let {title, type, amount: money, icon = defaultIcon, created_at} = data;
            let date = moment.unix(created_at).format('YYYY-MM-DD HH:mm:ss');
            return (
                <Item
                key={index}
                multipleLine
                extra={`+${money}`}
                thumb={icon}>
                    {title}
                    <Brief>{date}</Brief>
                </Item>
            )
        };
        let history = (data, index) => {
            let {title, type, amount: money, created_at} = data;
            let date = moment.unix(created_at).format('YYYY-MM-DD HH:mm:ss');
            return (
                <Item
                key={index}
                multipleLine
                extra={`+${money}`}>
                    {title}
                    <Brief>{date}</Brief>
                </Item>
            );
        };
        return (
            <div className={`wrapper wrapper-cash-bonus ${loaded ? 'loaded' : ''}`}>
                <SegmentedControl
                className='segment'
                onValueChange={this.segment.bind(this)}
                selectedIndex={segmentIndex}
                values={segments}/>
                <div className='segment-content'>
                    <div className={`home ${this.isActive.bind(this, 0)()}`}>
                        <div className='main'>
                            <div>
                                当前可提现金额(元)
                                <div className='money'>{money}</div>
                                <div className='withdrawal' onClick={this.withdrawal.bind(this)}>立即提现</div>
                                <div className='total'>历史获得金额：{total}元</div>
                                <div className='help' onClick={() => {
                                    window.location.href = '/cash-bonus/instruction';
                                }}>什么是现金红包？</div>
                            </div>
                        </div>
                        <List renderHeader={() => '奖励来源'}>
                            <div className='content'>
                            {
                                items.length ? (
                                    items.map((item, index) => source(item, index))
                                ) : (
                                    <div className='empty'>暂无数据</div>
                                )
                            }
                            </div>
                        </List>
                        <List renderHeader={() => '提现说明'}>
                            <ul className='description'>
                                <li>每个周可申请一次现金提现；</li>
                                <li>累计满30元才可以提现，且只能全额提取；</li>
                                <li>处于逾期状态中的用户需先还款才可以提现</li>
                                <li>申请成功后，奖金将在3个工作日内发放到您绑定的银行卡上;</li>
                                <li>如遇法定节假日，提现进度顺延；</li>
                                <li>如有问题请拨打客服热线<span>400－681－2016</span></li>
                            </ul>
                        </List>
                    </div>
                    <div className={`history ${this.isActive.bind(this, 1)()}`}>
                        <List>
                            <div className='content'>
                            {
                                cashs.length ? (
                                    cashs.map((cash, index) => history(cash, index))
                                ) : (
                                    <div className='empty'>暂无数据</div>
                                )
                            }
                            </div>
                        </List>
                    </div>
                </div>
            </div>
        );
    }
};