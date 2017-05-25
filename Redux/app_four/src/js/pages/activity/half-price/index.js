/* eslint-disable */
import React, {Component} from 'react';
import {Modal, Toast} from 'antd-mobile';
import {goHome} from 'utils';

import classnames from 'classnames';
import 'scss/components/reboot.component.scss';
import 'scss/activity/half-price.component.scss';

export default class Welcome extends Component{
    constructor(props){
        super(props);
        this.state = {
            loaded: 0,
            visible: 0
        };
    }
    componentDidMount(){
        this.setState({
            loaded: 1
        });
    }
    loan(){
        goHome();
    }
    apply(){
        this.setState({
            visible: 1
        })
    }
    close(){
        this.setState({
            visible: 0
        })
    }
    render(){
        let {loaded, visible} = this.state;
        return (
            <div className={classnames({'wrapper wrapper-half-price': true, loaded})}>
                <div className='totals'>
                    <div className='corner-mark'>半价</div>
                    当前已有
                    <span>10000</span>
                    人享受半价
                </div>
                <ul className='rules'>
                    <li>
                        <span>一、</span>
                        <div>
                            <span>活动时间：</span>
                            即日起至4月30日24:00
                        </div>
                    </li>
                    <li>
                        <span>二、</span>
                        <div>
                            <span>活动对象：</span>
                            按时成功还款且再申请的用户
                        </div>
                    </li>
                    <li>
                        <span>三、</span>
                        <div>
                            <span>如何享受半价？</span>
                            <p>1、首次还款的用户还款当日24点之前申请借款，立
                            享综合服务费减半奖励</p>
                            <p>2、非首次还款的用户每月的第二笔申请借款，立享
                            综合服务费减半奖励</p>
                            <p>3、所有用户半价申请前的最近一次还款不能逾期</p>
                        </div>
                    </li>
                    <li>
                        <span>四、</span>
                        <div>减半奖励不可使用抵扣券、免息券，不与平台其它优惠活动同时享用</div>
                    </li>
                    <li>
                        <span>五、</span>
                        <div>
                            <p>本活动最终解释权归现金卡所有，</p>
                            与Apple.lnc无关
                        </div>
                    </li>
                </ul>
                <div className='apply'>
                    <div className='button' onClick={this.apply.bind(this)}></div>
                </div>
                <Modal visible={visible == 1} onClose={this.close.bind(this)} maskClosable={true} transparent>
                    <p>恭喜你！</p>
                    <p>获得了第二笔半价资格</p>
                    <div class='button' onClick={this.loan.bind(this)}>立即借款</div>
                </Modal>
            </div>
        );
    }
}