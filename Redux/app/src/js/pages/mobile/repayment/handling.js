/* eslint-disable */
import React, {Component} from 'react';
import {Toast, ActivityIndicator} from 'antd-mobile';
import classnames from 'classnames';
import 'scss/mobile/wechat.component.scss';

import {redirect, hrefNative as native, platform, copy, goHome} from 'utils';

const title = '还款结果';
let timer;

export default class Wechat extends Component {
    state = {
        loaded: 1
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        document.title = title;
    }
    render(){
        let {text, loaded} = this.state;
        return (
            <div className={classnames({'wrapper wrapper-mobile wrapper-mobile-handling': true, loaded})}>
                  <i></i>
                  <h1>还款处理中</h1>
                  <p>亲，正在处理您的还款，在结果返回前请勿重复还款。稍后会更新订单状态，请耐心等待。</p>
                  <a className="btn" href=''>知道了</a>
            </div>
        )
    }
};
