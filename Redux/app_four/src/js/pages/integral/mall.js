/* eslint-disable */
import React, {Component} from 'react';
import {Link} from 'react-router';
import {Modal, List, Carousel} from 'antd-mobile';
import Slick from 'react-slick';
import classnames from 'classnames';
import request from 'common/request';
import {login, redirect} from 'utils';

import 'scss/integral/mall.component.scss';
import 'slick-carousel/slick/slick.css';

let title = '金币商城';
let Item = List.Item;

function hex2rgb(hex){
    let color = hex.toLowerCase();
    if(color && /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(color)){
        if(color.length === 4){
            let newColor = '#';
            for(let i = 1; i < 4; i += 1){
                newColor += color.slice(i, i + 1).concat(color.slice(i, i + 1));
            }
            color = newColor;
        }
        var rgb = [];
        for(var i = 1; i < 7; i += 2){
            rgb.push(parseInt('0x' + color.slice(i, i + 2)));
        }
        return rgb.join(',');  
    }else{
        return color;
    }
}

export default class Mall extends Component{
    state = {
        visible: 0,
        loaded: 0
    }
    componentDidMount(){
        document.title = title;
        let {middleware} = this.props;
        request('credit-gold/shop-index').then(response => {
            let {is_login, score: money, module: modules} = response.data;
            this.setState({
                is_login,
                money,
                modules,
                loaded: 1
            })
        }).catch(middleware.bind(this));
    }
    render(){
        let {is_login, money, modules, loaded, visible, initialHeight} = this.state;
        let gallery = data => {
            let {items} = data;
            return (
                <div>
                    <Carousel infinite dots={items.length > 1} autoplay={items.length > 1} variableWidth>
                        {(items && items.length) && items.map((item, index) => (
                            <a key={index} className='slider-slide-link' href={item.link}>
                                <img src={item.img}/>
                            </a>
                        ))}
                    </Carousel>
                    <div className='main'>
                        {is_login ?
                            <div className='money'>
                                可用金币
                                <Link to='/signin/detailed'>{money}</Link>
                            </div>
                        : <a className='login' onClick={login}>登陆查看金币数</a>}
                        <a className='instruction' onClick={() => this.setState({visible: 1})}>金币是什么?</a>
                    </div>
                </div>
            )
        };
        let guides = data => {
            let {items} = data;
            // let creteBackgroundColor = (color, index) => {
            //     let opacity = .75;
            //     let style = document.createElement('style');
            //         style.type = 'text/css';
            //         style.innerHTML = `
            //             .guides-background-color-${index}{
            //                 background-image: linear-gradient(to bottom, rgba(${hex2rgb(color)}, ${opacity}) 0%, ${color} 100%);
            //                 background-image: -o-linear-gradient(to bottom, rgba(${hex2rgb(color)}, ${opacity}) 0%, ${color} 100%);
            //                 background-image: -moz-linear-gradient(to bottom, rgba(${hex2rgb(color)}, ${opacity}) 0%, ${color} 100%);
            //                 background-image: -webkit-linear-gradient(top, rgba(${hex2rgb(color)}, ${opacity}) 0%, ${color} 100%);
            //             }
            //         `;
            //     document.head.appendChild(style);
            // }
            return (
                <div className='guides'>
                    <Slick arrows={false} infinite={false} slidesToShow={3} slidesToScroll={3} variableWidth>
                        {(items && items.length) && items.map((item, index) => (
                            <div key={index}>
                                {
                                    // creteBackgroundColor(item.color, index)
                                }
                                <a href={item.link} style={item.img ? {backgroundImage: `url(${item.img})`} : ''}>{item.text}</a>
                            </div>
                        ))}
                    </Slick>
                </div>
            )
        };
        let goods = data => {
            let {items} = data;
            return (
                <div className='goods'>
                    <List renderHeader={() => (
                        <div className='header'>
                            <div className='title' style={data.color ? {color: data.color} : {}}>
                                {data.icon ? <i className='icon' style={{backgroundImage: `url(${data.icon})`}}/> : ''}
                                {data.name}
                            </div>
                            <a href={data.link} className='more'>更多</a>
                        </div>
                    )}>
                        {(items && items.length) ?
                            <ul className={classnames({
                                'body': data.model == 1,
                                'body-grid': data.model == 2
                            })}>
                                {items.map((item, index) => (
                                    <li key={index} onClick={() => redirect.push(`/integral-mall/details?id=${item.id}`)}>
                                        <div><div className='picture' style={item.default_img ? {backgroundImage: `url(${item.default_img})`} : {}}/></div>
                                        <div className='description'>
                                            <div className='title'>
                                                <span>{item.name}</span>
                                                {data.model == 1 ?
                                                    <span className={classnames({
                                                        stock: true,
                                                        active: (item.stock > 0 || item.status)
                                                    })}>
                                                        {(item.stock > 0) ? `剩余${item.stock}份` : (item.status ? '抢购中' : '已抢完')}
                                                    </span>
                                                : ''}
                                            </div>
                                            <div className='details'>
                                                {(data.model == 1) ?
                                                    <div className='subtitle'>{item.sub_title || ''}</div>
                                                : ''}
                                                <div className='money'>
                                                    <span>{item.disc_price > 0 ? item.disc_price : item.price}</span>金币
                                                </div>
                                                {data.model == 1 ?
                                                    <div className={classnames({'exchange': true, 'disabled': (item.status == 0 && item.stock <= 0)})} onClick={() => redirect.push(`/integral-mall/details?id=${item.id}`)}>
                                                        {(item.status == 0 && item.stock <= 0) ? '已售罄' : '立即兑换'}
                                                    </div>
                                                : ''}
                                                {data.model == 2 ? <div className={classnames({'status': true, active: item.status == 0})}>
                                                    {item.status ? '抢购中' : '已抢完'}
                                                </div> : ''}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        : <div className='empty'>暂无数据</div>}
                    </List>
                </div>
            )
        };
        return (
            <div className={classnames({'wrapper wrapper-integral-mall': true, loaded})}>
                {(modules && modules.map((module, index) => (
                    <div className='module' key={index}>
                        {module.type == 'gold_shop_page_banner' && gallery(module, index)}
                        {(module.type == 'gold_shop_page_icon' && (module.items && module.items.length)) && guides(module, index)}
                        {module.type == 'gold_shop_page_goods' && goods(module, index)}
                    </div>
                )))}
                <Modal className='integral-mall-modal-instruction' title='金币说明' visible={visible} onClose={() => this.setState({visible: 0})} maskClosable={true} transparent>
                    <div>
                        <h6>金币的定义：</h6>
                        <p>金币是现金卡的一种虚拟货币，注册用户可通过签到、完成任务、参与活动、玩游戏等渠道获得，可用于兑换相应的优惠，更多金币玩法正在开发中。</p>
                        <h6>金币的清算规：</h6>
                        <p>每年1月1日和7月1日，将对半年前的金币进行清算，到期未用完的金币清算后将失效，所以要抓紧时间兑换哦！</p>
                        <p>例：2017年1月1日~7月1日期间获得5万金币，2017年7月1日~12月31日获得5万金币，花费3万金币，则2018年1月1日进行清算后，2017年1月1日~7月1日未用完的2万金币将失效，清算后账户金币总数为5万金币，以此类推。</p>
                        <span>金币的最终解释权归现金卡所有</span>
                    </div>
                </Modal>
            </div>
        );
    }
};