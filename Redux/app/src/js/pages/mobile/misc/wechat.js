/* eslint-disable */
import React, {Component} from 'react';
import {Toast} from 'antd-mobile';
import classnames from 'classnames';
import {statistics} from 'utils';
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
        statistics({
            type: 'wechat',
            tag: '浏览量'
        })
    }
    copy(){
        copy('xjbk88');
        statistics({
            type: 'wechat',
            tag: '拷贝微信公众账号'
        })
    }
    save(){
        setTimeout(native(14));
        statistics({
            type: 'wechat',
            tag: '保存截图'
        })
    }
    render(){
        let {loaded} = this.state;
        let {type = 1} = this.props.location.query;
        let wrapper = `wrapper wrapper-mobile wrapper-mobile-wechat-${type}`;
        return (
            <div className={classnames({
                [wrapper]: true,
                loaded
            })}>
                {type == 1 ?
                    <div>
                        <div className='main'>
                            <div className='title'/>
                            <div className='qrcode'/>
                            <div className='slogen'/>
                            <div className='wave'/>
                        </div>
                        <div className='footer'>
                            <a className='copy' onClick={this.copy.bind(this)}/>
                            <a className='save' onClick={this.save.bind(this)}/>
                            <div className='tips'>(保存图片,打开微信扫一扫，从相册选取二维码)</div>
                            <div className='logo'/>
                        </div>
                    </div>
                : null}
                {type == 2 ?
                    <div>
                        <div className='notice'>
                            <p>注意啦！注意啦！注意啦！</p>
                            <p>【现金白卡】服务号福利来袭！</p>
                        </div>
                        <div className='body'>
                            <div className='handle'>
                                <a className='button copy' onClick={this.copy.bind(this)}>复制公众号</a>
                                <a className='button save' onClick={this.save.bind(this)}>保存图片</a>
                            </div>
                            <div className='copyright'>
                                <p>关注现金白卡微信公众号</p>
                                <p>xjbk88</p>
                            </div>
                        </div>
                    </div>
                : null}
                {type == 3 ?
                    <div>
                        <div className='title'/>
                        <div className='text'>
                            <p>1.微信端借款， 1分钟极速到账</p>
                            <p>2.微信推送审核、下款即时动态</p>
                            <p>3.关注即有机会领取7天返现券</p>
                        </div>
                        <div className='name'>
                            <p>关注现金白卡微信公众号</p>
                            <p>xjbk88</p>
                        </div>
                        <div className='picture'/>
                        <div className='body'>
                            <div className='handle'>
                                <a className='button copy' onClick={this.copy.bind(this)}>复制公众号</a>
                                <a className='button save' onClick={this.save.bind(this)}>保存图片</a>
                            </div>
                        </div>
                    </div>
                : null}
                {type == 4 ?
                    <div>
                        <div className='picture'/>
                        <div className='text'/>
                        <div className='body'>
                            <div className='handle'>
                                <a className='button copy' onClick={this.copy.bind(this)}>复制公众号</a>
                                <a className='button save' onClick={this.save.bind(this)}>保存图片</a>
                            </div>
                            <div className='copyright'>
                                <p>关注现金白卡微信公众号</p>
                                <p>xjbk88</p>
                            </div>
                        </div>
                    </div>
                : null}
                {type == 5 ?
                    <div>
                        <div className='body'>
                            <div className='handle'>
                                <a className='button copy' onClick={this.copy.bind(this)}/>
                                <a className='button save' onClick={this.save.bind(this)}/>
                            </div>
                        </div>
                    </div>
                : null}
                {type == 6 ?
                    <div>
                        <div className='title'>获取<span>下一单半价</span>优惠机会</div>
                        <div className='text'>
                            <p>还在犹豫什么呢？赶快绑定微信号</p>
                            <p>抢占借款半价名额</p>
                        </div>
                        <div className='picture'/>
                        <div className='main'>
                            <div className='qrcode'/>
                            <div className='copyright'>
                                <p>关注现金白卡微信公众号</p>
                                <p>xjbk88</p>
                            </div>
                        </div>
                        <div className='body'>
                            <div className='handle'>
                                <a className='button copy' onClick={this.copy.bind(this)}>复制公众号</a>
                                <a className='button save' onClick={this.save.bind(this)}>保存图片</a>
                            </div>
                        </div>
                    </div>
                : null}
                {type == 7 ?
                    <div>
                        <div className='body'>
                            <div className='handle'>
                                <a className='button copy' onClick={this.copy.bind(this)}>复制公众号</a>
                                <a className='button save' onClick={this.save.bind(this)}>保存图片</a>
                            </div>
                        </div>
                    </div>
                : null}
            </div>
        )
    }
};
