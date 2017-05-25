/* eslint-disable */
import React, {Component} from 'react';
import {Toast} from 'antd-mobile';
import classnames from 'classnames';
import 'scss/mobile/wechat.component.scss';

import {redirect, hrefNative as native, platform, copy} from 'utils';

const title = '现金白卡';

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
    copy(){
        copy('xianjinbaika');
    }
    save(){
        // if(!platform.isApp){
        //     Toast.fail('请在APP内操作', 1.5);
        //     return;
        // }
        setTimeout(native(14));
    }
    render(){
        let {loaded} = this.state;
        return (
            <div className={classnames({'wrapper wrapper-mobile wrapper-mobile-wechat': true, loaded})}>
                <div className='main'>
                    <div className='title'/>
                    <div className='qrcode'/>
                    <div className='slogen'/>
                    <div className='wave'/>
                </div>
                <div className='footer'>
                    <div className='copy' onClick={this.copy.bind(this)}/>
                    <div className='save' onClick={this.save.bind(this)}/>
                    <div className='tips'>(保存图片,打开微信扫一扫，从相册选取二维码)</div>
                    <div className='logo'/>
                </div>
            </div>
        )
    }
};
