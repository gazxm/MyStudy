/* eslint-disable */
import React, {Component} from 'react';
import {List, Modal, SegmentedControl, Toast} from 'antd-mobile';
import {login, share} from 'utils';
import moment from 'moment';
import Password from 'components/Password';
import request from './request';
import 'scss/cash-bonus/index.component.scss';

let title = '余额提现';
let Item = List.Item;
let Brief = Item.Brief;
let lock = 1;

export default class CashBonus extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: {},
            loaded: 1
        };
    }
    componentDidMount(){
        document.title = title;
        let {query: params} = this.props.location;
        if(!!params.money === false){
            window.location.href = '/cash-bonus';
        }
        request('credit-card/get-bank-card').then(response => {
            let {item: data} = response.data;
            if(data.length && data[0].card_id && data[0].card_no_end){
                data[0].money = params.money || 0;
                this.setState({
                    data: data[0]
                });
            }
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
    withdrawal(){
        let {data} = this.state;
        let {query} = this.props.location;
        Password.show((password) => {
            if(lock){
                lock = !lock;
                let params = new FormData();
                    params.append('card_id', data.card_id);
                    params.append('pay_pwd', password);
                    params.append('amount', query.money);
                request({
                    url: 'user-account/draw-cash',
                    method: 'post',
                    data: params
                }).then(response => {
                    let {message} = response;
                    Password.close(window.event);
                    Toast.success(message, 1.5, () => {
                        window.location.href = '/cash-bonus';
                    });
                    lock = !lock;
                }).catch(this.middleware.bind(this));
            }
        });
    }
    middleware(response){
        let {code, message} = response;
        if(code !== -1008){
            Toast.fail(message, 1.5);
            Password.close(window.event);
        }else{
            setTimeout(() => {
                Password.error();
            });
        }
        setTimeout(() => {
            lock = !lock;
        }, 1500);
    }
    render(){
        let {data, loaded, visible} = this.state;
        return (
            <div className={`wrapper wrapper-cash-bonus ${loaded ? 'loaded' : ''}`}>
                <List className='banks'>
                    <Item
                    multipleLine
                    thumb={data.logo}>
                        <span>{data.bank_name}</span>
                        <span>尾号{data.card_no_end}</span>
                    </Item>
                    <Item
                    multipleLine>
                        <span>提现金额</span>
                        <span className='money'>{data.money}</span>
                    </Item>
                </List>
                <div className='button-withdrawal' onClick={this.withdrawal.bind(this)}>确认</div>
            </div>
        )
    }
}
