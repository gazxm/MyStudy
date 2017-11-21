/* eslint-disable */
import React, {Component} from 'react';
import {Toast, ActivityIndicator} from 'antd-mobile';
import classnames from 'classnames';
import 'scss/mobile/wechat.component.scss';

import {redirect, hrefNative as native, platform, copy, goHome} from 'utils';

const title = '现金白卡';
let timer;

export default class Wechat extends Component {
    state = {
        text: '5秒',
        loaded: 1
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        document.title = title;
        this.countdown();
    }
    countdown(){
        let count = 5;
        let {url} = this.props.location.query;
        timer = setInterval(() => {
            this.setState({
                text: `${--count}秒`
            });
            if(!!!count){
                timer && clearInterval(timer);
                url ? (window.location.href = url) : goHome();
            }
        }, 1000);
    }
    render(){
        let {text, loaded} = this.state;
        return (
            <div className={classnames({'wrapper wrapper-mobile wrapper-mobile-transfer': true, loaded})}>
                <div className='main'>
                    <div>
                        <div className='title'>正在等待处理结果...</div>
                        <div className='loading'>
                            <div className='countdown'>{text}</div>
                            <div className='loader'/>
                        </div>
                    </div>
                </div>
                <div className='tips'>温馨提示：结果返回前，请勿重复还款</div>
            </div>
        )
    }
};
