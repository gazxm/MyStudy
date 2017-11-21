/* eslint-disable */
import React, {Component, createClass} from 'react';
import {Link} from 'react-router';
import {Grid, Carousel, Modal, Switch, List, Toast} from 'antd-mobile';
import {createForm} from 'rc-form';
import Slick from 'react-slick';
import classnames from 'classnames';
import 'scss/integral/signin.component.scss';
import 'slick-carousel/slick/slick.css';
import request from 'common/request';
import {login, resolveUrl as url, redirect, hrefNative as native, platform} from 'utils';
import {TimelineMax} from './tween-max';

let title = '金币签到';
let Item = List.Item;
let Brief = Item.Brief;

Element.prototype.css = function(key){
    return document.defaultView.getComputedStyle(this, null)[key];
};

class Integral extends Component{
    state = {
        lock: 1,
        signin: 0,
        visible: 0,
        guide: {},
        loaded: 0
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        document.title = title;
        let {middleware} = this.props;
        request('credit-gold/gold-index').then(response => {
            let {score: money, check_score, is_checked, total_check_num: days, auto_reminder: subscribe, module: modules} = response.data;
            this.setState({
                money,
                check_score,
                is_checked,
                modules,
                days,
                subscribe,
                loaded: 1
            });
        }).catch(middleware.bind(this));;
    }
    // 签到订阅
    subscribe(checked){
        let {middleware} = this.props;
        let {lock} = this.state;
        if(lock){
            Toast.loading(undefined, 0);
            this.setState({lock: 0});
            request('credit-gold/set-reminder').then(response => {
                let {message, result: {is_auto_reminder: subscribe}} = response;
                this.setState({
                    subscribe
                });
                Toast.success(message, 3, () => {
                    this.setState({lock: 1});
                });
            }).catch(response => {
                let {code, message} = response;
                if(code == -1001){
                    Toast.hide();
                    Modal.alert('提 示', message, [{
                        text: '取消'
                    }, {
                        text: '去登录',
                        onPress: login
                    }])
                    this.setState({lock: 1});
                }else{
                    middleware.bind(this, response)();
                }
            });
        }
    }
    // 签到
    signin(){
        let {
            gold,
            gold1,
            gold2,
            gold3,
            shadow,
            shadow1,
            shadow2,
            money1,
            money2,
            money3,
            ribbon1,
            ribbon2,
            ribbon3,
            ribbon4,
            ribbon5
        } = this.refs;
        let options = {
            repeatDelay: 1.2,
            repeat: 0,
            yoyo: false
        };
        let timeline = new TimelineMax(options);
        let {middleware} = this.props;
        let {lock, money, days, guide} = this.state;
        if(lock){
            Toast.loading(undefined, 0);
            this.setState({lock: 0});
            request(`credit-gold/check?check=1`).then(response => {
                let {amount: check_score, flop, diversion_config: config} = response.data;
                Toast.hide();

                guide.money = check_score;
                guide.content = config.content;
                guide.image = config.img;
                guide.links = config.url;
                guide.style = guide.image ? {backgroundImage: `url(${guide.image})`} : {};

                this.setState({
                    check_score,
                    money: money + check_score,
                    guide
                });
                setTimeout(() => {
                    this.setState({
                        days: ++days,
                        lock: 1
                    });
                    timeline
                    .to(gold, .15, {x: '-50%', perspective: 1000, width: gold1.css('width'), height: gold1.css('height'), onStart: () => {
                        gold.className += ' disabled';
                    }}, 0)
                    .to(gold, .3, {rotationX: -360, y: gold1.css('top'), width: gold.css('width'), height: gold.css('height'), onStart: () => {
                        this.setState({visible: 1});
                    }}, .15)
                    .to(shadow, .1, {width: shadow1.css('width')}, .15)
                    .to(gold, .3, {rotationX: -720, y: gold2.css('top'), onStart: () => {
                        gold.className += ' active';
                    }}, .35)
                    .to(shadow, .3, {opacity: 1}, .35)
                    .to(shadow, .1, {width: shadow2.css('width')}, .55)
                    .to(gold, .1, {y: gold3.css('top'), width: gold2.css('width'), height: gold2.css('height')}, .55)
                    // // elements
                    .to(money1, .15, {x: 0, y: 0, scale: 1, opacity: 1}, .6)
                    .to(money2, .15, {x: 0, y: 0, scale: 1, opacity: 1}, .6)
                    .to(money3, .15, {x: 0, y: 0, scale: 1, opacity: 1}, .6)
                    .to(ribbon1, .15, {x: 0, y: 0, scale: 1, opacity: 1}, .6)
                    .to(ribbon2, .15, {x: 0, y: 0, scale: 1, opacity: 1}, .6)
                    .to(ribbon3, .15, {x: 0, y: 0, scale: 1, opacity: 1}, .6)
                    .to(ribbon4, .15, {x: 0, y: 0, scale: 1, opacity: 1}, .6)
                    .to(ribbon5, .15, {x: 0, y: 0, scale: 1, opacity: 1}, .6)
                    .to(shadow, .1, {width: shadow.css('width')}, .75)
                    .to(gold, .15, {perspective: 0, width: gold.css('width'), height: gold.css('height')}, .75);
                }, 300);
                // todo
                _hmt && _hmt.push(['_trackEvent', '金币签到', 'click', '金币签到']);
            }).catch(middleware.bind(this));
        }
    }
    render(){
        let {getFieldProps} = this.props.form;
        let {money, check_score, modules, is_checked, days, subscribe, lock, signin, guide = {}, visible, loaded} = this.state;
        let notices = (data, index) => {
            let {items} = data;
            return (
                <Carousel
                className='notices'
                dots={false}
                dragging={false}
                swiping={false}
                autoplay
                infinite
                vertical>
                    {items.map((item, index) => (
                        <a key={index} onClick={() => setTimeout(window.location.href = item.link)} className='notice'>{item.text}</a>
                    ))}
                </Carousel>
            );
        };
        let guides = data => {
            let {items} = data;
            return (
                <div className='guides'>
                    {(items.length) >= 4 ? 
                        <Grid data={items} columnNum={items.length} hasLine={false} renderItem={item => (
                            <div className='guide' onClick={() => setTimeout(window.location.href = item.link)}>
                                <div>
                                    <i className='icon' style={item.img ? {backgroundImage: `url(${item.img})`} : {}}/>
                                    {item.text}
                                </div>
                            </div>
                        )}/>
                    : 
                        <Slick arrows={false} infinite={false} slidesToShow={4} slidesToScroll={4} variableWidth>
                            {(items && items.length) && items.map((item, index) => (
                                <div key={index} className='guide' onClick={() => setTimeout(window.location.href = item.link)}>
                                    <div>
                                        <i className='icon' style={item.img ? {backgroundImage: `url(${item.img})`} : {}}/>
                                        {item.text}
                                    </div>
                                </div>
                            ))}
                        </Slick>
                    }
                </div>
            )
        };
        let gallery = data => {
            let {items} = data;
            return (
                <List className='gallery' renderHeader={() => data.name}>
                    <Carousel infinite dots={items.length > 1} autoplay={items.length > 1} variableWidth>
                        {(items && items.length) && items.map((item, index) => (
                            <a key={index} href={item.link}>
                                <img src={item.img}/>
                            </a>
                        ))}
                    </Carousel>
                </List>
            )
        };
        let tasks = data => {
            let {items} = data;
            return (
                <List
                className='tasks'
                renderHeader={() => data.name}
                renderFooter={(items.length ? () => <div className='more' onClick={() => setTimeout(redirect.push('/integral/tasks'))}>查看更多</div> : false)}>
                    {(items && items.length) ? items.map((item, index) => (
                        <Item
                        key={index}
                        thumb={<i style={item.img ? {backgroundImage: `url(${item.img})`} : {}}/>}
                        multipleLine
                        extra='一键领取'
                        onClick={() => setTimeout(redirect.push('/integral/tasks'))}>
                            <div className='title'>{item.name}</div>
                            <Brief>+{item.gold_score}金币</Brief>
                        </Item>
                    )) : <div className='empty'>暂无数据</div>}
                </List>
            )
        };
        let games = data => {
            let {items} = data;
            return (
                <List className='games' renderHeader={() => (
                    <div className='header' onClick={data.link ? () => setTimeout(window.location.href = data.link) : false}>
                        <span>{data.name}</span>
                        {data.link ? <div className='more'>更多</div> : ''}
                    </div>
                )}>
                    <Slick arrows={false} infinite={false} slidesToShow={2} slidesToScroll={2} variableWidth>
                        {(items && items.length) && items.map((item, index) => (
                            <div
                            key={index}
                            className='game'
                            onClick={() => setTimeout(window.location.href = item.link)}
                            style={item.img ? {backgroundImage: `url(${item.img})`} : {}}/>
                        ))}
                    </Slick>
                </List>
            )
        };
        return (
            <div className={classnames({'wrapper wrapper-integral-signin': true, loaded})} style={visible ? {
                overflow: 'hidden',
                bottom: 0
            } : {}}>
                <div className='main'>
                    <div className='topbar'>
                        <div>金币数量<Link to='/signin/detailed'>{money}</Link></div>
                        <div onClick={this.subscribe.bind(this)}>
                            签到提醒
                            <Switch
                            checked={subscribe}
                            className={classnames({'am-switch-disabled': !lock})}/>
                        </div>
                    </div>
                    <div className={classnames({
                        signin: true,
                        active: is_checked == 2,
                        disabled: is_checked == 1
                    })}>
                        <div ref='gold1' className='gold-frond-stage-1'/>
                        <div ref='gold2' className='gold-frond-stage-2'/>
                        <div ref='gold3' className='gold-frond-stage-3'/>
                        <div ref='gold' onClick={this.signin.bind(this)} className={classnames({'gold-frond': true})}>
                            <div>
                                点击<br/>签到
                            </div>
                        </div>
                        <div className='gold-back'>
                            <div>
                                <span>+{check_score}</span><br/>金币
                            </div>
                        </div>
                    </div>
                    <div className='series'>已累计签到{days}天</div>
                    <div className='tips'>累计签到50天，可额外获得2000金币</div>
                </div>
                <div>
                {(modules && modules.map((module, index) => (
                    <div className='module' key={index}>
                        {(module.type == 'gold_checked_page_radio' && (module.items && module.items.length)) && notices(module, index)}
                        {(module.type == 'gold_checked_page_icon' && (module.items && module.items.length)) && guides(module, index)}
                        {(module.type == 'gold_checked_page_banner' && (module.items && module.items.length)) && gallery(module, index)}
                        {(module.type == 'gold_checked_page_task') && tasks(module, index)}
                        {(module.type == 'gold_checked_page_games') && games(module, index)}
                    </div>
                )))}
                </div>
                <div className={classnames({
                    gold: true,
                    active: visible
                })}>
                    <div ref='shadow' className='shadow'/>
                    <div ref='shadow1' className='shadow-stage-1'/>
                    <div ref='shadow2' className='shadow-stage-2'/>
                    <div ref='money1' className='money-1'/>
                    <div ref='money2' className='money-2'/>
                    <div ref='money3' className='money-3'/>
                    <div ref='ribbon1' className='ribbon-1'/>
                    <div ref='ribbon2' className='ribbon-2'/>
                    <div ref='ribbon3' className='ribbon-3'/>
                    <div ref='ribbon4' className='ribbon-4'/>
                    <div ref='ribbon5' className='ribbon-5'/>
                </div>
                
                <Modal className='integral-signin-modal-guide' visible={visible} onClose={() => this.setState({visible: 0, is_checked: 2})} maskClosable={false} transparent>
                    <div className='title'>
                        <p>恭喜你！获得{guide.money}金币</p>
                        参加活动获得更多金币
                    </div>
                    <div className='picture' style={guide.style}/>
                    <div className='description' dangerouslySetInnerHTML={{__html: guide.content}}></div>
                    <a className='link' href={`${guide.links ? guide.links : 'javascript:void(0)'}`}>点击查看</a>
                </Modal>
            </div>
        );
    }
};
export default createForm()(Integral);