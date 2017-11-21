import React, {Component} from 'react';
import Draggable from 'react-draggable';
import {Modal, Carousel, List, Button, Toast, Icon} from 'antd-mobile';
import classnames from 'classnames';
import request from 'common/request';
import {login, redirect, hrefNative as native, platform, share} from 'utils';
import moment from 'moment';
import 'scss/integral/eggs.component.scss';

let title = '欢乐砸金蛋';
let Item = List.Item;
let Brief = Item.Brief;
let eggs = ['yellow', 'pink', 'blue', 'purple', 'green', 'orange'];

function disabledTouch(event){
    event.preventDefault();
};


Element.prototype.addClass = function(classname){
    let match = new RegExp(`${classname}`);
    !match.test(this.className) && (this.className += ` ${classname}`);
};
Element.prototype.removeClass = function(classname){
    let match = new RegExp(`${classname}`);
    this.className = this.className.replace(match, '').replace(/(^\s+)|(\s+$)/g, '');
};

export default class Tasks extends Component{
    state = {
        egg: undefined,
        lock: 1,
        loaded: 0,
        guide: {
            visible: 0
        }
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        document.title = title;
        let {middleware} = this.props;
        let {stage} = this.refs;
        stage.addEventListener('touchstart', disabledTouch);
        request('activity/hit-egg-act/index').then(response => {
            let {is_login, times: remaining, list: records = []} = response.data;
            this.setState({
                is_login,
                records,
                remaining,
                loaded: 1
            });
        }).catch(middleware.bind(this));
        share('goldegg');
    }
    start(index, event, target){
    }
    move(index, event, target){
        let {egg} = this.state;
        let {egg: wrapper, stage} = this.refs;
        let {offsetTop, offsetLeft} = wrapper;
        let {node: element} = target;
        let parent = element.parentNode;
        let x = parent.offsetLeft + target.lastX + element.clientWidth / 2;
        let y = parent.offsetTop + target.lastY + element.clientHeight / 2;
        if(egg >= 0){
            let li = stage.querySelectorAll('li')[egg];
            if(li){
                li.removeClass('active');
                this.setState({
                    [`egg${egg}`]: {x: 0, y: 0}
                });
                wrapper.removeClass('disabled');
            }
        }
        if(offsetLeft < x && offsetLeft + wrapper.clientWidth > x &&  offsetTop < y && offsetTop + wrapper.clientHeight > y){
            wrapper.addClass('active');
            if(egg >= 0){
                let li = stage.querySelectorAll('li')[egg];
                if(li){
                    li.removeClass('active');
                    this.setState({
                        [`egg${egg}`]: {x: 0, y: 0}
                    });
                }
            }
        }else{
            wrapper.removeClass('active');
        }
    }
    end(index, event, target){
        let {egg, is_login, remaining} = this.state;
        let {egg: wrapper, stage} = this.refs;
        let {offsetTop, offsetLeft} = wrapper;
        let {node: element} = target;
        let parent = element.parentNode;
        let x = parent.offsetLeft + target.lastX + element.clientWidth / 2;
        let y = parent.offsetTop + target.lastY + element.clientHeight / 2;
        if(egg >= 0){
            let li = stage.querySelectorAll('li')[egg];
            if(li){
                li.removeClass('active');
                this.setState({
                    [`egg${egg}`]: {x: 0, y: 0}
                });
            }
        }
        if(offsetLeft < x && offsetLeft + wrapper.clientWidth > x &&  offsetTop < y && offsetTop + wrapper.clientHeight > y){
            if(!is_login){
                Modal.alert(undefined, '登录态失效');
                this.setState({
                    [`egg${index}`]: {x: 0, y: 0}
                });
                return;
            }
            if(remaining <= 0){
                Modal.alert(undefined, '今天的砸蛋次数已经用完了~');
                this.setState({
                    [`egg${index}`]: {x: 0, y: 0}
                });
                return;
            }
            wrapper.addClass('disabled');
            parent.addClass('active');
            this.setState({
                egg: index,
                [`egg${index}`]: {x: -parent.offsetLeft + offsetLeft, y: -parent.offsetTop + offsetTop}
            });
        }else{
            wrapper.removeClass('disabled');
            parent.removeClass('active');
            this.setState({
                egg: undefined,
                [`egg${index}`]: {x: 0, y: 0}
            });
        }
    }
    crack(){
        let {middleware} = this.props;
        let {egg, guide, remaining, records, lock} = this.state;
        let {egg: wrapper, stage, hammer} = this.refs;
        let li = stage.querySelectorAll('li')[egg];
        if(egg >= 0 && lock){
            Modal.alert(undefined, <div className='crack-checkout'><p>本次砸蛋将消耗100金币</p><p>确定下锤吗?</p></div>, [{
                text: '容朕想想'
            }, {
                text: '我要砸',
                onPress: () => {
                    this.setState({lock: 0});
                    request('activity/hit-egg-act/hit-egg?id=1').then(response => {
                        let {score: money, diversion: config} = response.data;
                        setTimeout(() => {
                            hammer.addClass('active');
                            guide.money = money;
                            guide.content = config.content;
                            guide.image = config.img;
                            guide.links = config.url;
                            guide.style = guide.image ? {backgroundImage: `url(${guide.image})`} : {};
                            records.unshift({
                                time: moment().format('MM-DD hh:mm'),
                                gold: `+${guide.money}`
                            });
                            this.setState({
                                guide,
                                remaining: remaining - 1 || 0,
                                records
                            });
                            
                        }, 500);
                        setTimeout(() => {
                            li && li.addClass('crack');
                            hammer.addClass('disabled');
                        }, 1350);
                        setTimeout(() => {
                            guide.visible = 1;
                            this.setState({
                                guide
                            });
                        }, 1800);
                    }).catch(response => {
                        let {code, message} = response;
                        if(code == -2031){
                            Modal.alert(undefined, '金币不足', [{
                                text: '取消'
                            }, {
                                text: '赚金币',
                                onPress: () => redirect.push('/integral/tasks')
                            }]);
                            this.setState && this.setState({lock: 1, loaded: 1, loading: 0});
                        }else{
                            middleware.bind(this, response)();
                        }
                    });
                }
            }]);
        }
    }
    reset(){
        let {egg, guide} = this.state;
        let {egg: wrapper, stage, hammer} = this.refs;
        let li = stage.querySelectorAll('li')[egg];
            wrapper.removeClass('active disabled');
        setTimeout(() => {
            li.removeClass('active crack');
            guide.visible = 0;
            this.setState({
                lock: 1,
                guide,
                egg: undefined,
                [`egg${egg}`]: {x: 0, y: 0}
            });
        }, 300);
        setTimeout(() => {
            hammer.removeClass('active disabled');
        }, 650);
    }
    render(){
        let {record, instruction, records, is_login, remaining = 0, egg, lock, loaded, guide} = this.state;
        let item = (egg, index) => {
            return (
                <li key={index}>
                    <Draggable
                    disabled={!!!lock}
                    position={this.state[`egg${index}`]}
                    onStart={this.start.bind(this, index)}
                    onDrag={this.move.bind(this, index)}
                    onStop={this.end.bind(this, index)}>
                        <div className={classnames({
                            egg: true,
                            [`egg-${index}`]: true
                        })}>
                            <div className='body'>
                                <div className={classnames({hat: true, [egg]: egg})}/>
                                <div className='emoji'/>
                            </div>
                        </div>
                    </Draggable>
                    <div className='shadow'/>
                </li>
            );
        };
        return (
            <div ref='wrapper' className={classnames({'wrapper wrapper-integral-eggs': true, loaded})}>
                <div ref='egg' className='egg-wrapper'>
                    <div className='handle' onClick={this.crack.bind(this)}/>
                    <div className='shadow'/>
                    <div ref='hammer' className='hammer' onClick={this.crack.bind(this)}/>
                    <div className='hammer-shadow'/>
                </div>
                <div className='stage'>
                    <ul ref='stage'>
                        {eggs.map(item)}
                    </ul>
                    <div className='topbar'>
                        <div className='record' onClick={() => this.setState({record: 1})}>中奖记录</div>
                        <div className='remaining' onClick={!is_login ? login : false}>
                            {is_login ? `今日还可砸 ${remaining} 次` : '登录后查看'}
                        </div>
                        <div className='instruction' onClick={() => this.setState({instruction: 1})}>查看规则</div>
                    </div>
                </div>
                <Modal
                className='integral-eggs-modal-record'
                title='中奖记录'
                transparent
                maskClosable={true}
                visible={record}
                onClose={() => this.setState({record: 0})}>
                    <div className='table'>
                        <ul className='thead'>
                            <li>消耗金币</li>
                            <li>砸蛋时间</li>
                            <li>赢得金币</li>
                        </ul>
                        <ul className='tbody'>
                            {(records && records.length) ? records.map((data, index) => (
                                <li key={index}>
                                    <div>-100</div>
                                    <div>{data.time.replace('2017-', '')}</div>
                                    <div>{data.gold}</div>
                                </li>
                            )) : <div className='empty'>暂无数据</div>}
                        </ul>
                    </div>
                </Modal>
                <Modal
                className='integral-eggs-modal-instruction'
                title='活动规则'
                transparent
                maskClosable={true}
                visible={instruction}
                onClose={() => this.setState({instruction: 0})}>
                    <ul>
                        <li>奖池里有2000金币及神秘大礼，随机分布在6个金蛋里；</li>
                        <li>每次砸金蛋需要消耗100金币，每人每天最多砸3次；</li>
                        <li>本活动最终解释权归现金卡所有，与apple.inc无关。</li>
                    </ul>
                </Modal>
                <Modal
                className='integral-eggs-modal-guide'
                transparent
                maskClosable={false}
                visible={guide.visible}
                onClose={this.reset.bind(this)}>
                    <div className='title'>
                        <p>恭喜你</p>
                        获得{guide.money}金币
                    </div>
                    <div className='picture' style={guide.style}/>
                    <a class='links' href={`${guide.links ? guide.links : 'javascript:;'}`}>参加活动赚金币</a>
                </Modal>
            </div>
        );
    }
};