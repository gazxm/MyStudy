import React, {Component} from 'react';
import FreeScrollBar from 'react-free-scrollbar';
import {Modal} from 'antd-mobile';
import { login, get, share, post, redirect, hrefNative,platform } from 'utils'

import classnames from 'classnames';
import 'scss/components/reboot.component.scss';
import 'scss/activity/interest-free.component.scss';

let title = '免息狂欢日';
let lock = true;
let config = {
    count: 592607,
    phone: 6106,
    exponent: 1961.06
};

export default class InterestFree extends Component{
    constructor(props){
        super(props);
        this.state = {
            loaded: 1,
            visible: 0
        };
    }
    componentDidMount(){
        document.title = title;
        share('khr')
    }
    open(){
        this.setState({
            visible: 1
        });
    }
    close(){
        this.setState({
            visible: 0
        });
    }
    signin(){
        if(platform.isApp){
            hrefNative(4)
        }else{
            window.location.href = '//h5.xianjincard.com/mobile';
        }
    }
    submit(){
        get('http://credit.xianjincard.com/act/flag-user').then(response => response.data).then(response => {
            let {code} = response;
            if(code === 0){
                Modal.alert('申请成功', undefined, [{
                    text: '确定',
                    onPress: () => {
                        this.signin();
                    }
                }]);
            }else if(code === -2){
                login();
            }else{
                this.signin();
            }
        });
        
    }
    render(){
        let {loaded, visible} = this.state;
        return (
            <div className={classnames({wrapper: true, loaded})}>
                <div className='total'>
                    <p>获得7天免息券人数：</p>
                    <p><span>{config.count}</span>人</p>
                </div>
                <ul className='results'>
                    <li>
                        <p className='tips'>(创业板指数)</p>
                        <p className='title'>3月21日收盘价</p>
                        <p className='result'>{config.exponent}</p>
                    </li>
                    <li>
                        <p className='title'>获奖手机尾号</p>
                        <p className='result'>{config.phone}</p>
                    </li>
                </ul>
                <div className='cards'>
                    <div className='title'>14天免息名单</div>
                    <div className='table'>
                        <ul className='thead'>
                            <li>获奖时间</li>
                            <li>获奖用户</li>
                            <li>手机号</li>
                        </ul>
                        <div className={classnames({tbody: true, disabled: false})}>
                            <FreeScrollBar>
                                <ul>
                                    <li>03.21 13:31</li>
                                    <li>王骜远</li>
                                    <li>153****6106</li>
                                </ul>
                                <ul>
                                    <li>03.21 11:01</li>
                                    <li>刘文</li>
                                    <li>159****6106</li>
                                </ul>
                                <ul>
                                    <li>03.20 16:43</li>
                                    <li>张佳</li>
                                    <li>135****6106</li>
                                </ul>
                                <ul>
                                    <li>03.20 17:01</li>
                                    <li>李永安</li>
                                    <li>186****6106</li>
                                </ul>
                                <ul>
                                    <li>03.21 11:23</li>
                                    <li>王增</li>
                                    <li>135****6106</li>
                                </ul>
                                <ul>
                                    <li>03.20 17:45</li>
                                    <li>侯旭</li>
                                    <li>132****6106</li>
                                </ul>
                                <ul>
                                    <li>03.20 20:16</li>
                                    <li>项锋</li>
                                    <li>136****6106</li>
                                </ul>
                                <ul>
                                    <li>03.20 18:21</li>
                                    <li>刘孟庚</li>
                                    <li>186****6106</li>
                                </ul>
                                <ul>
                                    <li>03.21 12:40</li>
                                    <li>黄志能</li>
                                    <li>158****6106</li>
                                </ul>
                            </FreeScrollBar>
                        </div>
                    </div>
                </div>
                <div className='toolbar'>
                    <div class='button' onClick={this.open.bind(this)}>
                        <div>
                            <p>查看</p>
                            <p>规则</p>
                        </div>
                    </div>
                    <div class='button' onClick={this.submit.bind(this)}>立刻申请</div>
                </div>
                <Modal title='活动规则' className='description' visible={visible} onClose={this.close.bind(this)} maskClosable={true} transparent>
                    <ul>
                        <li>活动时间：2017年3月20日10:00~3月21日15:00</li>
                        <li>参与对象：平台注册用户</li>
                        <li>活动期间通过本活动页申请成功的用户，均送免息券1张（免息7天）；</li>
                        <li>活动期间非通过本活动页面申请成功用户，手机尾号和活动结束当天创业板收盘指数末四位数字相同（含小数点后两位），均送免息券1张（免息14天）；</li>
                        <li>如何领取奖励：免息券会在活动结束后次日上午12点之前发放至我的-优惠券中；</li>
                        <li>现金卡官方将于活动结束后，活动页面公布获奖名单，节假日顺延；</li>
                        <li>免息券有效期：自发放之日起20天内有效；</li>
                        <li>本活动最终解释权归现金卡平台所有。</li>
                    </ul>
                </Modal>
            </div>
        );
    }
};