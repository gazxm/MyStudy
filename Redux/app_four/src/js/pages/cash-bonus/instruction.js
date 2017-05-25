/* eslint-disable */
import React, {Component} from 'react';
import {List, Modal, SegmentedControl, Toast} from 'antd-mobile';
import {login, share, navLeftButton} from 'utils';
import 'scss/misc/instructions.component.scss';

let title = '现金红包说明';
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
                        1、什么是现金红包？
                        <Brief>
                        现金红包是由现金卡根据活动要求进行发放现金奖励
                        </Brief>
                    </Item>
                    <Item>
                        2、如何获得现金红包？
                        <Brief>
                        多参与平台举办的活动；多邀请好友
                        </Brief>
                    </Item>
                    <Item>
                        3、现金红包如何提现？
                        <Brief>
                            <p>• 现金红包账户累计满30元才可以提现，且必须全额提取</p>
                            <p>• 每周可申请一次现金提现</p>
                            <p>• 申请成功后，现金将在3个工作日内发放到您绑定的银行卡上</p>
                            <p>• 如遇法定节假日，提现进度顺延</p>
                            <p>• 如有问题拨打客服热线 400-681-2016</p>
                        </Brief>
                    </Item>
                </List>
            </div>
        )
    }
}
