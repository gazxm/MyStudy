/* eslint-disable */
import React, {Component, createClass} from 'react';
import {List, InputItem, Checkbox, Button, Picker, Toast, Icon} from 'antd-mobile';
import {createForm} from 'rc-form';
import classnames from 'classnames';
import 'scss/mobile/credit.component.scss';
import request from 'common/request';
import {resolveUrl as url, redirect, hrefNative as native, platform} from 'utils';

let title = '信用卡认证';
let iconEmail = require('../../../../../assets/img/mobile/certification/icon-email.png');
let iconCrad = require('../../../../../assets/img/mobile/certification/icon-card.png');

export default class Verify extends Component{
    state = {
        lock: 1,
        loaded: 0
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        document.title = title;
    }
    render(){
        let {loaded} = this.state;
        return (
            <div className='tips'>
                <div className='success'>
                    <div className='result'>
                        <div className='icon success'>
                            <Icon type='check'/>
                        </div>
                        <div className='details'>
                            <p>信用卡认证成功</p>
                            <span>前往导入信用卡账单，有助获得更高分期卡额度</span>
                        </div>
                    </div>
                    <List>
                        <List.Item
                        thumb={iconEmail}
                        arrow='horizontal'
                        onClick={() => redirect.push('/mobile/certification/credit/import/email')}
                        >邮箱导入</List.Item>
                        <List.Item
                        thumb={iconCrad}
                        arrow='horizontal'
                        onClick={() => redirect.push('/mobile/certification/credit/import/bank')}
                        >网银导入</List.Item>
                    </List>
                    <div className='security'>银行级数据加密防护</div>
                </div>
            </div>
        );
    }
};