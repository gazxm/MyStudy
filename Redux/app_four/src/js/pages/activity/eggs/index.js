import React, {Component} from 'react';
import {Modal, Slider, Icon, Switch, Toast, Flex} from 'antd-mobile';
import {login, share} from 'utils';
import request from './request';
import 'scss/activity/eggs.component.scss';

let title = '欢乐砸金蛋';
let lock = true;

export default class Eggs extends Component{
    constructor(props){
        super(props);
        let eggs = [];
        for(let i = 0;i < 16;i++) eggs.push({});
        this.state = {
            eggs,
            count: 0,
            completed: 0,
            guide: {
                visible: 0
            },
            checkout: {
                visible: 0
            },
            empty: 0,
            loaded: 0
        };
    }
    componentDidMount(){
        document.title = title;
        request('credit-info/get-last-hit-number').then(response => {
            let {message: count} = response;
            this.setState({
                count: +count,
                loaded: 1
            });
        }).catch(this.middleware.bind(this));
    }
    middleware(response){
        let {code, message} = response;
        let type = 'info';
        if([-1, -2].indexOf(code) >= 0){
            Toast[type](message || '未知错误', 1.5);
        }else if(code == -5){
            login();
        }else if(code == 2001){
            this.setState({
                empty: 1
            });
        }else if(code == 3){
            this.setState({
                empty: 2
            });
        }
        this.setState({
            loaded: 1
        });
        setTimeout(() => {
            lock = true;
        }, 1500);
    }
    checkout(i){
        let {count, completed, checkout} = this.state;
        if(!lock) return;
        if(count){
            checkout.index = i;
            checkout.visible = 1;
            this.setState({
                checkout
            });
        }else{
            this.setState({
                empty: 2
            });
        }
    }
    close(){
        let {checkout} = this.state;
        checkout.visible = 0;
        this.setState({
            checkout
        });
    }
    start(i){
        let {eggs, count, completed, checkout, guide} = this.state;
        if(typeof i === 'number' && lock){
            lock = !lock;
            new Promise(resolve => {
                this.close.apply(this);
                setTimeout(resolve, 500);
            }).then(() => {
                request(`credit-info/get-hit-gold?postion=${i}`).then(response => {
                    let {gold_egg_info: items, pop_info: config} = response.data;
                    eggs.map((egg, index) => {
                        egg.value = items[index];
                        if(i === index){
                            egg.active = 1;
                            guide.money = items[i];
                            setTimeout(() => {
                                egg.actived = 1;
                                this.setState({
                                    eggs
                                });
                            }, 500);
                        }else{
                            egg.complete = 1;
                        }
                    });
                    guide.content = config.content;
                    guide.image = config.img;
                    guide.links = config.url;
                    guide.style = guide.image ? {backgroundImage: `url(${guide.image})`} : {};

                    this.setState({
                        guide,
                        eggs,
                        count: --count
                    });
                    setTimeout(() => {
                        completed = 1;
                        guide.visible = 1;
                        this.setState({
                            guide,
                            completed
                        });
                    }, 3000);
                }).catch(this.middleware.bind(this));
            });
        }
    }
    reset(){
        let {eggs, completed} = this.state;
        if(completed){
            eggs.map((egg, index) => {
                egg.active = egg.actived = egg.complete = 0;
            });
            this.setState({
                eggs,
                completed: 0
            });
            lock = !lock;
        }
    }
    guide(){
        let {guide} = this.state;
        guide.visible = 0;
        this.setState({
            guide
        })
    }
    empty(){
        this.setState({
            empty: 0
        });
    }
    signin(){
        window.location.href = '/signin';
    }
    desc(){
        this.setState({
            empty: 3
        });
    }
    render(){
        let {eggs, count, guide, checkout, empty, loaded, completed} = this.state;
        return (
            <div className={`wrapper wrapper-activity-eggs ${loaded ? 'loaded' : ''}`}>
                <div className='logo'/>
                <div className='desc'>
                    <span onClick={this.desc.bind(this)}>查看活动规则</span>
                </div>
                <div className='satin'>
                    <ul>
                        {
                            eggs.map((egg, index) => (
                                <li key={index} onClick={this.checkout.bind(this, index)} className={`${egg.active ? 'active' : ''}${egg.complete ? 'complete' : ''}${egg.actived ? ' actived' : ''}`}>
                                    <div className='egg'/>
                                    <div className='egg-crack'/>
                                    <div className='money'>{egg.value}</div>
                                </li>
                            ))
                        }
                    </ul>
                    <div className='tips'>
                        今日还剩 <span>{count}次</span>砸蛋机会
                    </div>
                    <div class={`button button-reset ${completed ? '' : 'disabled'}`} onClick={this.reset.bind(this)}>重新开始</div>
                </div>
                <Modal className='guide' visible={guide.visible} onClose={this.guide.bind(this)} maskClosable={true} transparent>
                    <div className='title'>
                        {guide.money > 0 ? (
                            <p>恭喜你！获得{guide.money}金币</p>
                        ) : (
                            <p>本次没有获得金币！</p>
                        )}
                        <p>参加活动获得更多金币</p>
                    </div>
                    <div className='picture' style={guide.style}/>
                    <div className='description' dangerouslySetInnerHTML={{__html: guide.content}}></div>
                    <a class='links' href={`${guide.links ? guide.links : 'javascript:;'}`}>点击查看</a>
                </Modal>
                <Modal className='checkout' visible={checkout.visible} onClose={this.close.bind(this)} maskClosable={true} transparent>
                    <p>本次砸蛋将消耗100金币</p>
                    <p>确定下锤吗?</p>
                    <div class='button-group'>
                        <div class='button button-violet' onClick={this.start.bind(this, checkout.index)}>我要砸</div>
                        <div class='button button-cancel' onClick={this.close.bind(this)}>容朕想想</div>
                    </div>
                </Modal>
                <Modal className='checkout' visible={empty === 1} onClose={this.empty.bind(this)} maskClosable={true} transparent>
                    <p>对不起，您的金币不足！</p>
                    <div class='button-group'>
                        <div class='button button-violet' onClick={this.signin}>赚金币去</div>
                    </div>
                </Modal>
                <Modal className='checkout' visible={empty === 2} onClose={this.empty.bind(this)} maskClosable={true} transparent>
                    <p>今日砸蛋次数已用完</p>
                    <div class='button-group'>
                        <div class='button button-cancel' onClick={this.empty.bind(this)}>知道了</div>
                    </div>
                </Modal>
                <Modal title='活动规则' className='checkout checkout-desc' visible={empty === 3} onClose={this.empty.bind(this)} maskClosable={true} transparent>
                    <ul>
                        <li>奖池里共有2000金币，随机分布在16个金蛋里；</li>
                        <li>每次砸蛋需要消耗100积分，每人每天最多可砸5次；</li>
                        <li>本活动最终解释权归现金卡所有，与Apple.Inc无关。</li>
                    </ul>
                </Modal>
            </div>
        )
    }
};