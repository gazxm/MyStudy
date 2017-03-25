import 'scss/signin/signin.component.scss';
import React, {Component} from 'react';
import {Modal, Slider, Icon, Switch, Toast, Flex} from 'antd-mobile';
import {login, share} from 'utils';

import request from './request';
import Tasks from './Tasks';

let title = '金币签到';
let lock = false;

export default class Signin extends Component{
    constructor(props){
        super(props);
        this.state = {
            // 金币总数
            money: 0,
            // 签到天数
            days: 0,
            daysSlider: 0,
            // 订阅状态
            subscribe: 0,
            // 任务列表
            tasks: [],
            // 事件列表
            events: [],
            // 卡片
            cards: [{id: 1}, {id: 2}, {id: 3}],
            guide: {
                visible: 0
            },
            loaded: 0
        };
    }
    componentDidMount(){
        document.title = title;
        let {cards, daysSlider} = this.state;
        request('/credit-gold/index').then(response => {
            let {score: money = 0, click: signin, flop = {}, total_check_num: days, auto_reminder: subscribe, verify: tasks} = response.data;
            if(flop && signin){
                cards.map(card => {
                    let data = flop[card.id];
                    if(data){
                        card.money = data;
                        card.size = this.size(data);
                        if(card.id === signin){
                            card.active = 1;
                        }else{
                            card.disabled = 1;
                        }
                    }
                });
            }
            daysSlider = days;
            (days > 50) && (daysSlider -= 50);
            (daysSlider > 0 && daysSlider < 3) && (daysSlider = daysSlider + 2.5);
            this.setState({
                money,
                days,
                daysSlider,
                subscribe,
                tasks,
                signin: !!signin,
                loaded: 1
            });
            lock = !lock;
        }).catch(this.middleware.bind(this));
    }
    middleware(response){
        let {show, hide} = this.loading();
        let {code, message} = response;
        let type = 'info';

        hide();
        if([-1000, -1004].indexOf(code) >= 0){
            type = 'fail';
        }else if([-1003].indexOf(code) >= 0){
            type = 'offline';
        }else if(-1001 === code){
            login();
            return;
        }
        this.setState({
            loaded: 1
        });
        Toast[type](message, 1.5);
        setTimeout(() => {
            lock = !lock;
        }, 1500);
    }
    // 查看明细
    detailed(){
        window.location.href = 'signin/detailed'
    }
    // 订阅
    subscribe(){
        let {show, hide} = this.loading();
        if(lock){
            lock = !lock;
            show();
            request('credit-gold/set-reminder').then(response => {
                hide();
                let {message, result: {is_auto_reminder: subscribe}} = response;
                this.setState({
                    subscribe
                });
                Toast.success(message, 1.5, () => {
                    lock = !lock;
                });
            }).catch(this.middleware.bind(this));;
        }
    }
    // 领取金币
    receive(money = 0){
        if(!money) return;
        this.setState({
            money: this.state.money + money
        })
    }
    loading(){
        return {
            show(){
                Toast.loading(undefined, 0);
            },
            hide(){
                Toast.hide();
            }
        }
        
    }
    signin(e){
        console.log(e)
    }
    size(money){
        let length = (money + '').length;
        return length === 3 ? 'small' : (length === 2 ? 'mid' : '');
    }
    cards(card, index){
        let {money, cards, guide, days, daysSlider} = this.state;
        if(lock && !card.active && !card.disabled){
            lock = !lock;
            request(`credit-gold/check?check=${card.id}`).then(response => {
                let {amount, flop, diversion_config: config} = response.data;
                cards[index].size = this.size(money);
                cards[index].money = money;
                cards[index].active = 1;

                guide.money = amount;
                guide.content = config.content;
                guide.image = config.img;
                guide.links = config.url;
                guide.style = guide.image ? {backgroundImage: `url(${guide.image})`} : {};

                this.setState({
                    cards,
                    guide
                });
                cards.map(data => {
                    let id = data.id;
                    if(flop && flop[id]){
                        let money = flop[id] || 0;
                        data.size = this.size(money);
                        data.money = money;
                        if(data.id === card.id){
                            data.active = 1
                            this.setState({
                                cards
                            });
                        }else if(data.id !== card.id){
                            setTimeout(() => {
                                data.disabled = 1;
                                this.setState({
                                    cards
                                });
                            }, 500);
                        }
                    }
                });
                setTimeout(() => {
                    guide.visible = 1;
                    this.setState({
                        money: money + amount,
                        days: ++days,
                        daysSlider: ++days,
                        guide
                    });
                    lock = !lock;
                }, 1000);
            }).catch(this.middleware.bind(this));
        }
    }
    guide(){
        let {guide} = this.state;
        guide.visible = 0;
        this.setState({
            guide
        })
    }
    render(){
        let {money, days, daysSlider, subscribe, tasks, signin, events, cards, guide, loaded} = this.state;
        return (
            <div className={`wrapper ${loaded ? 'loaded' : 0}`}>
                <div className='floater'>
                    <i className='money'/>
                    <i className='money-small'/>
                    <i className='confetti-green'/>
                    <i className='coloured-ribbon'/>
                    <i className='confetti-left'/>
                    <i className='confetti-right'/>
                </div>
                <div className='main'>
                    <div>
                        金币数
                        <span className='money'>{money}</span>
                        <span className='detailed' onClick={this.detailed.bind(this)}>查看明细</span>
                    </div>
                    <div onClick={this.subscribe.bind(this)}>
                        签到提醒
                        <Switch checked={subscribe} />
                    </div>
                </div>
                <div className='subject'/>
                <ul className={`cards ${signin ? 'disabled' : ''}`}>
                    {cards.map((card, index) => (
                        <li key={index} className={`${card.active ? 'active' : ''} ${card.disabled ? 'disabled' : ''}`} onClick={this.cards.bind(this, card, index)}>
                            <div className='front'>
                                {card.active && (
                                    <p>
                                        <span>恭喜你</span>
                                        <span className={card.size}>获得{card.money}金币</span>
                                    </p>
                                )}
                                {card.disabled && (
                                    <p>
                                        <span className={card.size}>金币+{card.money}</span>
                                    </p>
                                )}
                            </div>
                            <div className='back'></div>
                        </li>
                    ))}
                </ul>
                <div className='signin'>
                    <div className='tips'>
                        累计签到
                        <span>50天</span>，可额外获得
                        <span>2000金币</span>
                    </div>
                    <Slider min={1} max={50} value={daysSlider} disabled={true} onAfterChange={this.signin.bind(this)}/>
                    <div className='anchor'/>
                    <div className='total'>已累计签到 {days} 天</div>
                </div>
                <Tasks loaded={loaded} data={tasks} receive={this.receive.bind(this)}/>
                <ul className='events'>
                    {
                        events.map((event, index) => (
                            <li key={index}>
                                <div className='icon' style={{backgroundImage: `url(${event.icon})`}}/>
                                <a className='link' href={event.link}>{event.name}</a>
                            </li>
                        ))
                    }
                </ul>
                <Modal className='guide' visible={guide.visible} onClose={this.guide.bind(this)} maskClosable={true} transparent>
                    <div className='title'>
                        <p>恭喜你！获得{guide.money}金币</p>
                        <p>参加活动获得更多金币</p>
                    </div>
                    <div className='picture' style={guide.style}/>
                    <div className='description'>
                        <p>参加活动获得</p>
                        <p>参加活动获得更多金币</p>
                    </div>
                    <a class='links' href={`${guide.links ? guide.links : 'javascript:;'}`}>点击查看</a>
                </Modal>
            </div>
        )
    }
};