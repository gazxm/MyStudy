/* eslint-disable */
import React, {Component} from 'react';
import {Modal, Toast} from 'antd-mobile';
import request from 'common/request';
import {share, platform, login, hrefNative, resolveUrl, forwardApp as download} from 'utils';
import Download from '../components/DownloadPopup';

import classnames from 'classnames';
import 'scss/components/reboot.component.scss';
import 'scss/activity/thursday-freeinterest.component.scss';

let title = '周四免息';
let lock = true;

export default class Welcome extends Component{
    constructor(props){
        super(props);
        this.state = {
            time: '2017年3月23日00:00-3月23日24:00',
            rules: 0,
            visible: 0,
            loaded: 0,
            message: '',
        };
        request.interceptors.response.use(response => {
            let {code, data, message} = response;
            if([0, 1000].indexOf(code) < 0){
                return Promise.reject(response);
            }
            return Promise.resolve(response);
        });
    }
    componentDidMount(){
        document.title = title;
        // share('thursday-freeinterest');
        Toast.loading(undefined, 0);
        request('activity/interest-free-act/index').then(response => {
            let {time} = response.data;
            this.setState({
                time,
                loaded: 1
            });
            Toast.hide();
        });
    }
    middleware(response){
        let {code, message, visible = 1} = response;
        if(code == -2024){
            visible = 3;
            message = '亲，免息奖励与你插肩而过，下个时间段可以继续领哦！';
        }else if(code == -2025){
            visible = 3;
            message = '亲，您已获得免息券一张请至"我的"-"优惠券"中查看，券有效期一天，请立即使用';
        }else if(code == -1001){
            visible = 2;
            message = '登陆态失效';
        }else if(code == 0){
            visible = 3;
            message = '亲，恭喜你获得免息券一张请至"我的"-"优惠券"中查看，券有效期一天，请立即使用';
        }else if(code == -2012){
            visible = 1;
            message = '活动未开始';
        }else{
            visible = 1;
            message = '系统繁忙';
        }
        this.setState({
            message
        });
        setTimeout(() => {
            this.setState({
                visible
            });
        });
        lock = true;
    }
    rules(){
        this.setState({
            rules: 1
        });
    }
    close(){
        this.setState({
            rules: 0,
            visible: 0
        });
    }
    apply(){
        if(lock){
            lock = !lock;
            request('activity/interest-free-act/interest?tag=h5-20170405-interestFree_act').then(response => {
                let {code, message} = response;
                code == 0 && (response.message = '亲，恭喜你获得免息券一张请至"我的"-"优惠券"中查看');
                this.middleware.apply(this, [response]);
                lock = true;
            }).catch(this.middleware.bind(this));
        }
    }
    login(){
        login();
    }
    loan(){
        if(platform.isApp){
            hrefNative(4);
        }else{
            window.location.href = resolveUrl('http://h5.xianjincard.com/mobile');
        }
    }
    render(){
        let {time, rules, visible, loaded, message} = this.state;
        return (
            <div className={classnames({wrapper: true, 'wrapper-thursday-freeinterest': true, loaded})}>
                <div className='tips'>给你免息借，一起嗨起来</div>
                <div className='button-receive' onClick={this.apply.bind(this)}>领取免息加油券</div>
                <div className='rule'>
                    <span onClick={this.rules.bind(this)}>查看规则</span>
                </div>
                <Modal visible={visible == 3} onClose={this.close.bind(this)} maskClosable={true} transparent>
                    <p className='message'>{message}</p>
                    <div class='button' onClick={this.close.bind(this)}>朕知道了</div>
                </Modal>
                <Modal visible={visible == 2} onClose={this.close.bind(this)} maskClosable={true} transparent>
                    <p className='message'>{message}</p>
                    <div class='button' onClick={this.login.bind(this)}>马上登录</div>
                </Modal>
                <Modal visible={visible == 1} onClose={this.close.bind(this)} maskClosable={true} transparent>
                    <p className='message'>{message}</p>
                    <div class='button' onClick={this.close.bind(this)}>朕知道了</div>
                </Modal>
                <Modal className='rules' visible={rules} onClose={this.close.bind(this)} maskClosable={true} transparent>
                    <h5>活动规则</h5>
                    <p>活动时间：{time}</p>
                    <p>活动对象：平台注册用户</p>
                    <p>活动奖励：点击“领取免息加油券”按钮，即有机会获得免息券。本活动共有1000个名额，0:00-8:00发放200个名额，8:00-16:00发放500个名额，16:00-24:00发放300个名额，随机发放</p>
                    <p>免息券有效期自发放之日起1天内有效</p>
                    <p>本活动最终解释权归现金卡所有，与Apple.Inc无关</p>
                </Modal>
                <Download/>
            </div>
        );
    }
};