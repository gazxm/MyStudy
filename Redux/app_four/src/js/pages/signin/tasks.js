/* eslint-disable */
import React, {Component} from 'react';
import {Modal, Slider, Icon, Switch, Toast, Flex} from 'antd-mobile';
import request from './request';
import {hrefNative, forwardApp as download} from 'utils';

const INSTRUCTION = {
    title: '金币说明',
    body: (
        <div>
            <h6>金币的定义：</h6>
            <p>金币是现金卡的一种虚拟货币，注册用户可通过签到、完成任务、参与活动、玩游戏等渠道获得，可用于兑换相应的优惠，更多金币玩法正在开发中。</p>
            <h6>金币的清算规：</h6>
            <p>每年1月1日和7月1日，将对半年前的金币进行清算，到期未用完的金币清算后将失效，所以要抓紧时间兑换哦！</p>
            <p>例：2017年1月1日~7月1日期间获得5万金币，2017年7月1日~12月31日获得5万金币，花费3万金币，则2018年1月1日进行清算后，2017年1月1日~7月1日未用完的2万金币将失效，清算后账户金币总数为5万金币，以此类推。</p>
            <span>金币的最终解释权归现金卡所有</span>
        </div>
    )
};

let lock = true;
let timer;

export default class Tasks extends Component{
    constructor(props){
        super(props);
        let {data, loaded} = this.props;
        this.state = {
            data,
            loaded,
            more: 0,
            instruction: {
                visible: 0
            },
            received: {
                money: 0,
                visible: 0,
                style: {}
            }
        }
    }
    componentDidMount(){}
    componentWillReceiveProps(props){
        this.setState(props);
    }
    // 领取金币
    receive(task, index){
        let {data: tasks, received} = this.state;
        let {middleware} = this.props;
        Toast.fail('该功能正在维护，请稍后再试！');
        return;
        if(lock && task.status === 1){
            lock = !lock;

            // prepend
            task.loading = 1;
            tasks[index] = task;
            received.money = task.score;
            this.setState({
                data: tasks,
                received
            });
            let start = Date.now();
            request(`credit-gold/get-gold?id=${task.id}`).then(response => {
                let end = Date.now();
                let timeout = 0;
                if(end - start < 1000) timeout = 1000;
                if(end - start > 1000) timeout = 0;
                setTimeout(() => {
                    task.received = 1;
                    task.status = 2;
                    task.loading = 0;
                    tasks[index] = task;
                    received.visible = 1;
                    this.setState({
                        data: tasks,
                        received
                    });
                    this.props.receive(task.score);
                    timer && clearTimeout(timer);
                    timer = setTimeout(() => {
                        this.receiveClose.bind(this)();
                    }, 2000);
                    lock = !lock;
                }, timeout);
            }).catch(middleware.bind(this));
        }
    }
    receiveClose(){
        let {received} = this.state;
        timer && clearTimeout(timer);
        received.visible = 0;
        this.setState({
            received
        });
    }
    // 活动说明
    instruction(){
        return {
            show(instruction = {}){
                instruction.visible = 1;
                this.setState({
                    instruction
                })
            },
            hide(){
                let {instruction} = this.state;
                instruction.visible = 0;
                this.setState({
                    instruction
                })
            }
        }
    }
    // 更多任务
    more(){
        let {more} = this.state;
        this.setState({
            more: !more,
        });
    }
    reward(options = {}){
        let {type, link} = options;
        if(type === 0){
            return;
        }else if(type === 1){
            if(window.nativeMethod){
                hrefNative(link);
            }else{
                Modal.alert('下载App', '下载app后可完善高级认证，完善后可借更高的额度', [{
                    text: '取消'         
                }, {
                    text: '下载app',
                    onPress(){
                        download();
                    }
                }]);
            }
            return;
        }else if(type === 2){
            window.location.href = link;
            return;
        }
    }
    format(task, index){
        let {instruction} = this.state;
        let {score: money, title, content: description, url, status, loading} = task;
        return (
            <li key={index}>
                <div className='title' onClick={this.instruction().show.bind(this, {
                    title: title,
                    body: (
                        <div>
                            <p>{description}</p>
                            <span className='reward'>任务奖励: 金币+{money}</span>
                        </div>
                    )
                })}>
                    {title}
                </div>
                <div>
                    {status === 0 ? (
                        <a className='reward' onClick={this.reward.bind(this, url)}>{money}金币</a>
                    ) : (
                        <div className={`receive ${status === 2 ? 'received' : ''} ${loading ? 'loading' : ''}`} onClick={this.receive.bind(this, task, index)}><Icon type='loading'/></div>
                    )}
                </div>
            </li>
        );
    }
    render(){
        let {data, loaded, height, receive, more, instruction, received} = this.state;
        return (
            <div>
                <div className='tasks'>
                    <div class='tasks-content'>
                        <div class='tasks-header'>
                            <div className='title'>赚取更多金币</div>
                            <div className='helper' onClick={this.instruction().show.bind(this, INSTRUCTION)}>金币说明</div>
                        </div>
                        <div class='tasks-body'>
                            <ul className={`
                                ${more ? ' active' : ''}
                                ${loaded ? ' loaded' : ''}
                                ${data === false ? ' empty' : ''}
                            `} style={{height: height}}>
                                <Icon type='loading'/>
                                {data && data.map(this.format.bind(this))}
                            </ul>
                        </div>
                    </div>
                </div>
                {
                    (data && data.length > 3) ? (<div className={`more ${more ? 'active' : ''}`} onClick={this.more.bind(this)}/>) : ''
                }
                <Modal className='instruction' title={instruction.title} visible={instruction.visible} onClose={this.instruction().hide.bind(this)} maskClosable={true} transparent>
                    <i className='notice'/>
                    {instruction.body}
                </Modal>
                <div className={`tasks-popover ${received.visible ? 'visible' : ''}`} style={received.style}>领取成功<br/>金币+{received.money}</div>
                <div className={`tasks-popover-mask ${received.visible ? 'visible' : ''}`} onClick={this.receiveClose.bind(this)}/>
            </div>
        );
    }
};