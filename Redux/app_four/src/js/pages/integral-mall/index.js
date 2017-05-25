/* eslint-disable */
import React, {Component} from 'react';
import {Carousel, ListView, Toast} from 'antd-mobile';
import {login, share} from 'utils';
import request from './request';
import 'scss/integral-mall/index.component.scss';

let title = '金币商城';
let page = 1;
let size = 15;
let lock = true;

export default class CashBonus extends Component{
    constructor(props){
        super(props);
        this.data = {};
        this.state = {
            gallerys: [],
            coupon: [],
            goods: [],
            loaded: 0
        };
    }
    componentDidMount(){
        document.title = title;
        let {loaded} = this.state;
        Toast.loading(undefined, 0);
        request(`credit-gold/goods-list`).then(response => {
            Toast.hide();
            let {coupon, goods} = response.data;
            this.setState({
                gallerys: [{
                    image: require('../../../assets/img/integral-mall/upload/1.png'),
                    link: ''
                }],
                coupon,
                goods,
                loaded: 1
            });
        }).catch(this.middleware.bind(this));
    }
    middleware(response){
        let {code, message} = response;
        let type = 'info';

        Toast.hide();
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
    detailed(id = 0){
        // if(!id) return;
        window.location.href = `integral-mall/details?id=${id}`;
    }
    render(){
        let {gallerys, coupon, goods, loaded} = this.state;
        let row = (data, index) => {
            let {id, name, disc_price, price, default_img: image, status} = data;
            let style = image ? {
                backgroundImage: `url(${image})`
            } : {}
            return (
                <li key={index}>
                    <div className='card' onClick={this.detailed.bind(this, id)}>
                        <div className='cover' style={style}/>
                        <div className='details'>
                            <h5>{name}</h5>
                            <p>
                                <span className='active'>{disc_price || price}金币</span>
                                <span className={`${status ? 'active' : ''}`}>
                                    {status ? '抢购中' : '已抢完'}
                                </span>
                            </p>
                        </div>
                    </div>
                </li>
            );
        };
        return (
            <div className={`wrapper wrapper-integral-mall-old ${loaded ? 'loaded' : ''}`}>
                {
                    gallerys.length === 1 && (
                        <div className='carousel'>
                            {
                                gallerys.map((gallery, index) => (
                                    <a key={index} className='slider-link' href='javascript:;'>
                                        <img src={gallery.image}/>
                                    </a>
                                ))
                            }
                        </div>
                    )
                }
                {
                    gallerys.length > 1 && (
                        <Carousel
                        className='carousel'
                        autoplay={true}
                        infinite>
                            {
                                gallerys.map((gallery, index) => (
                                    <a key={index} className='slider-link' href='javascript:;'>
                                        <img src={gallery.image}/>
                                    </a>
                                ))
                            }
                        </Carousel>
                    )
                }
                <div className={`content ${loaded ? 'loaded': ''}`}>
                    {(coupon && coupon.length) ? 
                        <div>
                            <div className='title'>优惠券兑换</div>
                            <ul>
                                {coupon.map(row)}
                            </ul>
                        </div>
                    : ''}
                    {(goods && goods.length) ? 
                        <div>
                            <div className='title'>商品兑换</div>
                            <ul>
                                {goods.map(row)}
                            </ul>
                        </div>
                    : ''}
                </div>
            </div>
        );
    }
};