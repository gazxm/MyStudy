/* eslint-disable */
import React, {Component} from 'react';
import {Link} from 'react-router';
import {Modal, List, Carousel, Toast} from 'antd-mobile';
import classnames from 'classnames';
import request from 'common/request';
import {login, redirect} from 'utils';

import 'scss/integral/mall.component.scss';

let title = '金币商城';
let Item = List.Item;

export default class Mall extends Component{
    state = {
        visible: 0,
        loaded: 0
    }
    componentDidMount(){
        document.title = title;
        let {id} = this.props.params;
        Toast.loading(undefined, 0);
        request(`credit-gold/goods-module-list?id=${id}`).then(response => {
            let {name, items} = response.data;
            Toast.hide();
            name && (document.title = name);
            this.setState({
                items,
                loaded: 1
            });
        }).catch(response => {
            let {code, message} = response;
            Toast.fail(message, 3, () => {
                setTimeout(redirect.goBack);
            });
        });
    }
    render(){
        let {items, loaded} = this.state;
        return (
            <div className={classnames({'wrapper wrapper-integral-mall wrapper-integral-mall-category': true, loaded})}>
                <div className='goods'>
                    <List>
                        {(items && items.length) ?
                            <ul className='body-grid'>
                                {items.map((item, index) => (
                                    <li key={index} onClick={() => redirect.push(`/integral-mall/details?id=${item.id}`)}>
                                        <div><div className='picture' style={item.default_img ? {backgroundImage: `url(${item.default_img})`} : {}}/></div>
                                        <div className='description'>
                                            <div className='title'>
                                                <span>{item.name}</span>
                                            </div>
                                            <div className='details'>
                                                <div className='money'>
                                                    <span>{item.disc_price > 0 ? item.disc_price : item.price}</span>金币
                                                </div>
                                                <div className={classnames({'status': true, active: item.status == 0})}>
                                                    {item.status ? '抢购中' : '已抢完'}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        : <div className='empty'>暂无数据</div>}
                    </List>
                </div>
            </div>
        );
    }
};