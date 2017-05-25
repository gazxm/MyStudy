/* eslint-disable */
import React, {Component, createClass} from 'react';
import {List, InputItem, Checkbox, Button, Picker, Toast, Icon} from 'antd-mobile';
import {createForm} from 'rc-form';
import classnames from 'classnames';
import 'scss/mobile/credit.component.scss';
import request from 'common/request';
import {resolveUrl as url, redirect, hrefNative as native, platform, goHome} from 'utils';

let title = '信用卡账单导入';
let iconEmail = require('../../../../../assets/img/mobile/certification/icon-email.png');
let iconCrad = require('../../../../../assets/img/mobile/certification/icon-card.png');

const AgreeItem = Checkbox.AgreeItem;

class Import extends Component{
    state = {
        lock: 1,
        loaded: 0,
        loading: 0
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        document.title = title;
        let {success, fail} = this.props.location.query;

        this.setState({
            success,
            fail,
            loaded: 1
        });
    }
    submit(){

    }
    render(){
        let {lock, loaded, loading, success, fail} = this.state;
        return (
            <div className='tips'>
                {success !== undefined ?
                    <div className='success'>
                        <div className='result'>
                            <div className='icon success'>
                                <Icon type='check'/>
                            </div>
                            <div className='details'>
                                <p>信用卡账单导入成功</p>
                                <span>恭喜您，你可以前往申请分期卡借款了！</span>
                            </div>
                        </div>
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
                        onClick={goHome}>立即申请</Button>
                        <div className='security'>银行级数据加密防护</div>
                    </div>
                : ''}
                {fail !== undefined ?
                    <div className='fail'>
                        <div className='result'>
                            <div className='icon fail'>
                                <Icon type='cross'/>
                            </div>
                            <div className='details'>
                                <p>信用卡账单导入失败</p>
                                <span>您可以通过网银导入或者重新通过邮箱导入</span>
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
                : ''}
            </div>
        );
    }
};

export default createForm()(Import);