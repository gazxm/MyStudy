/* eslint-disable */
import React, {Component} from 'react';
import {Modal, List, Toast} from 'antd-mobile';
import {redirect, login, share} from 'utils';
import request from './request';
import 'scss/integral-mall/index.component.scss';

let title = '金币商城';
let Item = List.Item;
let Brief = Item.Brief;
let lock = true;

export default class Details extends Component{
    constructor(props){
        super(props);
        this.state = {
            name: '',
            image: '',
            price: 0,
            loaded: 0,
            description: []
        };
    }
    componentDidMount(){
        document.title = title;
        let {query: params} = this.props.location;
        request(`credit-gold/goods-detail?id=${params.id}`).then(response => {
            let {id, name, price, disc_price, default_img: image, desc_img, description, out_link, status} = response.data;
            this.setState({
                id,
                name,
                image,
                desc_img,
                price,
                disc_price,
                loaded: 1,
                description,
                out_link,
                status
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
        Toast[type](message);
    }
    submit(){
        let {out_link} = this.state;
        if(out_link != ''){
            window.location.href = out_link;
            return;
        }
        Modal.alert(undefined, '确认兑换？', [{
            text: '取消'
        }, {
            text: '兑换',
            onPress: () => {
                let {id, status} = this.state;
                if(lock && status){
                    lock = !lock;
                    let params = new FormData();
                        params.append('id', id);
                    Toast.loading(undefined, 0);
                    request({
                        url: 'credit-gold/exchange',
                        data: params,
                        method: 'post'
                    }).then(response => {
                        Toast.success('兑换成功', 3, () => {
                            lock = !lock;
                        });
                    }).catch(response => {
                        let {code, message} = response;
                        if(code == -2102){
                            Toast.fail(message, 3, () => redirect.push('/signin'));
                        }else{
                            this.middleware.bind(this, response)();
                        }
                    });
                }
            }
        }])
    }
    middleware(response){
        let {code, message} = response;
        let type = 'info';
        if([-1015, -1016].indexOf(code) >= 0){
            type = 'offline';
        }else if(-1001 === code){
            login();
            return;
        }else{
            type = 'fail';
        }
        Toast[type](message, 1.5);
        setTimeout(() => {
            lock = true;
        }, 1500);
    }
    render(){
        let {name, image, desc_img, price, disc_price, loaded, description, status} = this.state;
        let content = (data, index) => {
            return (
                <li key={index}>
                    <h5>{data.title}</h5>
                    <div className='details' dangerouslySetInnerHTML={{__html: data.desc}}></div>
                </li>
            );
        };
        let priceElement = (origin, sale) => {
            return (
                <div className='price'>
                    {(!!sale && sale < price) && (<p className='sale'><span>{price}</span></p>)}
                    <p className='origin'><span>{(!!sale && sale < price) ? sale : price}</span></p>
                </div>
            );
        }
        return (
            <div className={`wrapper wrapper-integral-mall-old toolbar-through ${loaded ? 'loaded' : ''}`}>
                <div className='carousel'>
                    <a className='slider-link' href='javascript:;'>
                        <img src={desc_img}/>
                    </a>
                </div>
                <List className='main'>
                    <Item
                    multipleLine
                    extra={priceElement(price, disc_price)}>
                        {name}
                        <Brief>
                            <span className={`${status ? '' : 'disabled'}`}>
                                {status ? '抢购中' : '已抢完'}
                            </span>
                        </Brief>
                    </Item>
                </List>
                {description.length && (
                    <ul className='description'>
                        {description.map((desc, index) => content(desc, index))}
                    </ul>
                )}
                <div className='toolbar'>
                    <div className={`button ${status ? '' : 'disabled'}`} onClick={this.submit.bind(this)}>
                        {status ? '马上兑换' : '抢光啦'}
                    </div>
                </div>
            </div>
        );
    }
};