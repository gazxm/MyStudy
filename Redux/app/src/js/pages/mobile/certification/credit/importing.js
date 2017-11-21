/* eslint-disable */
import React, {Component, createClass} from 'react';
import {List, InputItem, Checkbox, Button, Picker, Toast, Icon} from 'antd-mobile';
import {createForm} from 'rc-form';
import classnames from 'classnames';
import 'scss/mobile/certification-layout.component.scss';
import 'scss/mobile/credit.component.scss';
import request from 'common/request';
import {resolveUrl as url, redirect, hrefNative as native, platform} from 'utils';

let title = '信用卡账单导入';

class Importing extends Component{
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
        let {type} = this.props.location.query;
        let url;
        if(type == 'bank'){
            url = 'credit-card/get-online-banking-result';
        }else if(type == 'email'){
            url = 'credit-card/get-mail-verification-result';
        }else{
            Toast.fail('缺少参数，请确认后再尝试', 3, () => {
                setTimeout(redirect.goBack);
            });
            return;
        }
        this.query.bind(this)(url);
    }
    query(url){
        let {middleware} = this.props;
        let {type} = this.props.location.query;
        Toast.loading(undefined, 0);
        request(url).then(response => {
            let {code, message} = response;
            Toast.success(message, 3, () => {
                setTimeout(redirect.replace('/mobile/certification/credit/import?success'));
            });
        }).catch(response => {
            let {code, message} = response;
            Toast.hide();
            if([1, 3].indexOf(code) >= 0){
                Toast.fail(message, 3, () => {
                    let route;
                    if(code == 1){
                        route = '/mobile/certification/credit/import?fail';
                    }else if(code == 3){
                        route = `/mobile/certification/credit/import/${type}`;
                    }
                    setTimeout(() => {
                        redirect.replace(route);
                    });
                });
            }else if(code == 2){
                setTimeout(() => {
                    this.query.bind(this)(url)
                }, 1500);
            }else{
                Toast.fail('服务器繁忙，请稍后重试', 3, () => {
                    setTimeout(redirect.goBack);
                });
            }
        });
    }
    render(){
        return (
            <div className='importing'>
                <div className='header'>
                    <div>
                        <div className='loading'/>
                        <div className='title'>信用卡账单导入中...</div>
                    </div>
                </div>
                <div className='footer'>
                    <div className='security'>银行级数据加密防护</div>
                </div>
            </div>
        );
    }
};

export default createForm()(Importing);