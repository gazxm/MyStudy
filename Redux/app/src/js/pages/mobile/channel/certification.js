/* eslint-disable */
import React, {Component} from 'react';
import Draggable from 'react-draggable';
import {List, Button, Toast, Icon, NoticeBar, Grid, Badge} from 'antd-mobile';
import classnames from 'classnames';
import request from 'common/request';
import {login, redirect, hrefNative as native, platform, resolveUrl as url, statistics} from 'utils';
import basics from '../certification/basics';
import 'scss/mobile/channel/home.component.scss';


let title = '现金卡信用付';
let Item = List.Item;
let Brief = Item.Brief;

export default class Tasks extends Component{
    state = {
        verify: [],
        lock: 1,
        loaded: 0
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        document.title = title;
        statistics({
            type: '么么直播',
            tag: '认证中心'
        })
        let {middleware, location} = this.props;
        let {query: {callbackUrl}} = location;
        let search = `?callbackUrl=${encodeURIComponent(callbackUrl)}&bankLast`;
        request('v2/credit-card/get-verification-info').then(response => {
            let {item: {list: lists, is_basics_verify}} = response.data;
            let verifys = [];
            lists.map(list => {
                let {tag} = list;
                (!list.url && list.first_url) && (list.url = list.first_url);
                basics.map(basic => {
                    if(basic.id == list.tag){
                        list.url = basic.link;
                    }
                });
                if(list.tag == 4 && list.status && is_basics_verify){
                    list.url = list.first_url;
                }
                [1, 3, 4, 5].indexOf(tag) >= 0 && verifys.push(list);
            });
            this.setState({
                callbackUrl,
                search,
                verifys,
                loaded: 1
            });
        }).catch(middleware.bind(this));
    }
    submit(){
        let {callbackUrl, search, verifys} = this.state;
        let url;
        for(let i in verifys){
            let {tag: id, url: link, status} = verifys[i];
            if(!!!status && link){
                url = link;
                break;
            }
        }
        if(url){
            redirect.push({
                pathname: url,
                search
            });
        }else{
            statistics({
                type: '么么直播',
                tag: '认证完成'
            })
            window.location.href = callbackUrl;
        }
    }
    render(){
        let {callbackUrl, search, verifys, loaded} = this.state;
        let item = (data, index) => {
            let {logo: icon, title: text, status, url: link} = data;
            let style = icon ? {backgroundImage: `url(${icon})`} : {};
            let statusText = '';
            switch(status){
                case 0:
                    statusText = '未认证';
                    break;
                case 1:
                    statusText = '验证成功';
                    break;
                case 2:
                    statusText = '验证中';
                    break;
                case 3:
                    statusText = '验证失败';
                    break;
            }
            let click = () => {
                if(!!!link) return;
                if(/^(https?|\/\/)/.test(link)){
                    window.location.href = link;
                }else{
                    redirect.push({
                        pathname: link,
                        search
                    });
                }
            };
            return (
                <div onClick={click}>
                    <div className='icon' style={style}/>
                    <div className='title'>{text}</div>
                    <Badge className={classnames({
                        success: status == 1,
                        verify: status == 2,
                        fail: status == 3 || status == 0,
                    })} size='small' text={statusText}/>
                </div>
            );
        };
        return (
            <div className={classnames({'wrapper wrapper-channel': true, loaded})}>
                <NoticeBar>开通现金卡信用付需进行以下信息确认</NoticeBar>
                <Grid data={verifys} hasLine={true} columnNum={4} renderItem={item}/>
                <div className='footer'>
                    <Button type='primary' onClick={this.submit.bind(this)}>立即填写</Button>
                </div>
            </div>
        );
    }
};