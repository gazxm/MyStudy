/* eslint-disable */
import qs from 'qs';
import React, {Component} from 'react';
import {List, Button} from 'antd-mobile';
import classnames from 'classnames';
import 'scss/mobile/wechat.component.scss';
import {redirect, hrefNative as native, platform, copy, statistics} from 'utils';
const title = '微信公众号支付';
const Item = List.Item;

export default class Wechat extends Component {
    state = {
        loaded: 1
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        document.title = title;
        statistics({
            type: '微信支付引导页',
            tag: '访问页面'
        })
    }
    copy(){
        copy('xjbk88');
        statistics({
            type: '微信支付引导页',
            tag: '复制微信号'
        });
    }
    save(){
        setTimeout(native(14));
        statistics({
            type: '微信支付引导页',
            tag: '下载二维码'
        });
    }
    render(){
        let {loaded} = this.state;
        return (
            <div className={classnames({'wrapper wrapper-mobile wrapper-mobile-wechat-repayment': true, loaded})}>
                <List renderHeader={() => '请根据以下步骤进行微信公众号支付'}>
                    <Item thumb={<span>1</span>}>
                        关注现金白卡服务号。打开微信APP，点击【添加朋友】-【公众号】，输入微信号“<span style={{color: '#fd9979'}}>xjbk88</span>”进行搜索并关注；或扫描下方二维码进行关注，您可先将二维码图片保存，再通过“微信扫一扫”进行扫码关注
                        <div className='handles'>
                            <div className='qrcode'/>
                            <div className='handle'>
                                <div className='button' onClick={this.copy.bind(this)}>复制微信号</div>
                                <div className='button' onClick={this.save.bind(this)}>保存二维码</div>
                            </div>
                        </div>
                    </Item>
                    <Item thumb={<span>2</span>}>
                        关注成功后，进入现金白卡微信服务号，点击【马上借钱】-【我要还款】，登录后打开还款页面
                    </Item>
                    <Item thumb={<span>3</span>}>
                        点击【立即还款】，选择【微信支付】，输入微信支付密码即可完成还款
                    </Item>
                </List>
            </div>
        )
    }
};
