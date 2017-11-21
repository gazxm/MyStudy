/* eslint-disable */
import React, {Component} from 'react';
import {List, Modal, SegmentedControl, Toast} from 'antd-mobile';
import 'scss/misc/instructions.component.scss';

let title = '优惠券说明';
let Item = List.Item;
let Brief = Item.Brief;
let lock = 1;

export default class CashBonus extends Component{
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
        let {loaded} = this.state;
        return (
            <div className={`wrapper wrapper-misc-instruction ${loaded ? 'loaded' : ''}`}>
                <List className='instruction'>
                    <Item>
                        什么是优惠券？
                        <Brief>
                            现金卡目前认可发放的主要有四种券：还款抵扣券，服务费抵扣券，续期费抵扣券，临时提额券，可在现金卡借款和续期的时候使用
                        </Brief>
                    </Item>
                    <Item>
                        如何获得优惠券？
                        <Brief>
                            <p>1、参与现金卡活动</p>
                            <p>2、邀请好友</p>
                            <p>3、分享借款红包</p>
                            <p>4、多参与借款，按时还款</p>
                        </Brief>
                    </Item>
                    <Item>
                        优惠券使用条件有哪些？
                        <Brief>
                            <p>1、还款抵扣券在申请借款过程中，选择有效抵扣券，使用后可在还款时抵扣部分本金</p>
                            <p>2、服务费抵扣券在申请借款过程中，选择有效抵扣券，使用后可抵扣部分综合服务费</p>
                            <p>3、续期费抵扣券在申请订单续期时，可抵扣部分续期费用，一次续期只能使用一张抵扣券</p>
                            <p>4、临时提额券在有效期内使用，用户总额度提升，进行借款操作时，增加相应额度，额度使用后，用户总额度恢复原有额度</p>
                        </Brief>
                    </Item>
                </List>
            </div>
        )
    }
}

