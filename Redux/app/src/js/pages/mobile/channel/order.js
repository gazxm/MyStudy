/* eslint-disable */
import qs from 'qs';
import React, {Component} from 'react';
import Draggable from 'react-draggable';
import {List, Button, Toast, Icon, NoticeBar, Grid, Badge} from 'antd-mobile';
import classnames from 'classnames';
import request from 'common/request';
import {login, redirect, hrefNative as native, platform} from 'utils';

let title = '现金卡预借支付';
let Item = List.Item;
let Brief = Item.Brief;

export default class Tasks extends Component{
    state = {
        lock: 1,
        loaded: 1
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        document.title = title;
        let {middleware} = this.props;
        let search = `?${qs.stringify(this.props.location.query)}`;
        this.setState({
            search,
            ...qs.parse(this.props.location.query)
        });
    }
    render(){
        let {search, amount, text, items, loaded} = this.state;
        return (
            <div className={classnames({'wrapper wrapper-channel-order': true, loaded})}>
                <div className='main'>
                    <div>
                        <p>您向现金卡预借支付</p>
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
                    })}>确认开通现金卡支付</Button>
                </div>
            </div>
        )
    }
}