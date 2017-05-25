import React, {Component} from 'react';
import {Modal, Toast} from 'antd-mobile';
import request from './request';
import {resolveUrl, platform, login, share, hrefNative} from 'utils';

import classnames from 'classnames';
import 'scss/components/reboot.component.scss';
import 'scss/activity/cash-gift.component.scss';

let title = '现金大礼包';
let lock = true;

export default class Welcome extends Component{
    constructor(props){
        super(props);
        this.state = {
            receive: 0,
            apply: 0,
            loaded: 0,
            visible: 0,
            prompt: 0
        };
        // interceptors for response
        request.interceptors.response.use(response => {
            let {code, data, message} = response;
            if(code !== 0){
                return Promise.reject(response);
            }
            return Promise.resolve(response);
        });
    }
    componentDidMount(){
        document.title = title;
        share('cash-gift');
        request('act/cash-grab-every-day').then(response => {
            let {code, data, message} = response;
            let {flag: receive, acted_flag: apply, cash, coupon: coupons} = response.data;
            if([0, -1001].indexOf(code) >= 0){
                this.setState({
                    // 是否点击申请
                    receive,
                    // 是否领取过奖励
                    apply,
                    coupons,
                    cash,
                    loaded: 1
                });
            }else{
                this.middleware.apply(this, response);
            }
        }).catch(this.m.bind(this));
    }
    m(response){
        let {code, data, message} = response;
        Toast.hide();
        this.setState({
            loaded: 1
        });
        if(code != -1001){
            Toast.fail(message, 1.5);
        }
        lock = true;
    }
    middleware(response){
        let {code, data, message} = response;
        Toast.hide();
        this.setState({
            loaded: 1
        });
        if(code === -1001){
            this.setState({
                prompt: 1
            });
        }else{
            Toast.fail(message, 1.5);
        }
        lock = true;
    }
    receive(){
        let {receive, apply, cash, coupons} = this.state;
        if(lock){
            lock = !lock;
            Toast.loading(undefined, 0);
            request('act/act-flag-user?key=cashGrabEveryDayAct_act&tag=h5-20170323-cashGrabEveryDayAct_act').then(() => {
                if(!!cash && !!coupons){
                    this.setState({
                        apply: 1
                    });
                    setTimeout(() => {
                        this.setState({
                            visible: 1
                        })
                        lock = !lock;
                        Toast.hide();
                    }, 1500);
                }else{
                    this.setState({
                        prompt: 2
                    });
                    lock = !lock;
                    Toast.hide();
                }
            }).catch(this.middleware.bind(this));
        }
    }
    check(){
        let {apply, cash, coupons} = this.state;
        if(!!apply && !!cash && !!coupons){
            this.setState({
                visible: 1
            });
        }else{
            this.setState({
                prompt: 2
            });
        }
    }
    close(){
        this.setState({
            visible: 0
        });
    }
    prompt(){
        this.setState({
            prompt: 0
        });
    }
    login(){
        let {tag} = this.props.location.query;
        if(tag){
            login(tag);
        }else{
            login();
        }
        
    }
    apply(){
        if(lock){
            lock = !lock;
            Toast.loading(undefined, 0);
            request('act/act-flag-user?key=cashGrabEveryDayAct_act&tag=h5-20170323-cashGrabEveryDayAct_act').then(response => {
                Toast.hide();
                if(platform.isApp){
                    hrefNative(4);
                }else{
                    window.location.href = resolveUrl('http://h5.xianjincard.com/mobile');
                }
            }).catch(this.middleware.bind(this));
            lock = !lock;
        }
    }
    render(){
        let {receive, apply, loaded, visible, prompt, coupons, cash} = this.state;
        return (
            <div className={classnames({wrapper: true, loaded})}>
                <div className='logo'/>
                <div className={classnames({'wooden-chests': true, open: apply})}>
                    <div className='wooden-chests-head'>
                        <span className='light blue'/>
                        <span className='light orange'/>
                        <span className='gold'/>
                    </div>
                    <div className='wooden-chests-body'>
                        <div className='money'/>
                    </div>
                </div>
                <div className='button-group'>
                    <div className='button button-receive' onClick={this.receive.bind(this)}></div>
                    <div className='button button-check' onClick={this.check.bind(this)}></div>
                </div>
                <div className='rules'>
                    <div className='rules-content'>
                        <p><span>1</span>活动时间：3月23日18:00—3月31日24:00</p>
                        <p><span>2</span>参与对象：平台注册用户</p>
                        <p><span>3</span>现金大礼包：礼包包含现金和1张借款免息券和一张抵扣券</p>
                        <p><span>4</span>领取条件：点击领取现金大礼包后进行申请借款方可领取，每人限领一次</p>
                        <p><span>5</span>奖品请至“我的”查看，券有效期20天</p>
                        <p><span>6</span>本活动最终解释权归现金卡所有，与Apple.lnc无关</p>
                    </div>
                </div>
                <Modal className='prize' visible={visible} onClose={this.close.bind(this)} maskClosable={true} transparent>
                    <ul>
                        {cash && (
                            <li>
                                <div className='primary'>
                                    <p>
                                        <span>{cash.value}</span>{cash.unit}
                                    </p>
                                </div>
                                <div className='details'>
                                    <div className='details-inner'>
                                        <h5>{cash.title}</h5>
                                        <p>请至”我的”查看领取</p>
                                    </div>
                                </div>
                            </li>
                        )}
                        {(coupons && coupons.length) && coupons.map((coupon, index) => (
                            <li key={index}>
                                <div className='primary'>
                                    <p>
                                        <span>{coupon.value}</span>{coupon.unit}
                                    </p>
                                </div>
                                <div className='details'>
                                    <div className='details-inner'>
                                        <h5>{coupon.title}</h5>
                                        <p>有效期:自{coupon.start} - {coupon.end}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className='button' onClick={this.close.bind(this)}>朕知道了</div>
                </Modal>
                <Modal className='prompt' visible={prompt === 1} onClose={this.prompt.bind(this)} maskClosable={true} transparent>
                    <p>主人，还没有登录哦~</p>
                    <div class='button' onClick={this.login.bind(this)}>立即登录</div>
                </Modal>
                <Modal className='prompt' visible={prompt === 2} onClose={this.prompt.bind(this)} maskClosable={true} transparent>
                    <p>主人，你的红包已发放,请申请后领取~</p>
                    <div class='button' onClick={this.apply.bind(this)}>马上申请</div>
                </Modal>
            </div>
        );
    }
};