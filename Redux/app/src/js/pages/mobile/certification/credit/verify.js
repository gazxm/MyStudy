/* eslint-disable */
import React, {Component, createClass} from 'react';
import {List, InputItem, Checkbox, Button, Picker, Toast, Icon} from 'antd-mobile';
import {createForm} from 'rc-form';
import classnames from 'classnames';
import 'scss/mobile/certification-layout.component.scss';
import 'scss/mobile/credit.component.scss';
import request from 'common/request';
import {resolveUrl as url, redirect, hrefNative as native, platform, qc} from 'utils';


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
        request.post('credit-card/get-is-qq-login').then(response => {
            let {isQqLogin} = response.data;
            this.setState({isQqLogin, loaded: true});
        }).catch(() => {
            this.setState({loaded: true});
        });
        window.tmail = success => this.tmallCallback(success)
    }
    tmallCallback(success){
        if(success == 1){
            redirect.replace('/mobile/certification/credit/importing?type=email')
        }else if(success == 0){
            redirect.replace('/mobile/certification/credit/import?fail');
        }
    }
    tmail(){
        let {lock} = this.state;
        if(lock){
            this.setState({lock: 0});
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
                this.setState({lock: 1});
                Toast.hide();
            }).catch(response => {
                let {code, message} = response;
                Toast.fail(message, 3, () => {
                    this.setState({lock: 1});
                });
            });
        }
    }
    render(){
        let {isQqLogin, loaded} = this.state;
        return (
            <div className={classnames({tips: true, loaded})}>
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
                        {(isQqLogin == 1) ? <List.Item
                        thumb={iconEmail}
                        arrow='horizontal'
                        onClick={this.tmail.bind(this)}
                        >QQ邮箱导入</List.Item>
                        : ''}
                        <List.Item
                        thumb={iconEmail}
                        arrow='horizontal'
                        onClick={() => redirect.push('/mobile/certification/credit/import/email')}
                        >其他邮箱导入</List.Item>
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