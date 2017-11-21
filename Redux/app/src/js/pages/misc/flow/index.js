/* eslint-disable */
import React, {Component} from 'react';
import {NoticeBar, Toast} from 'antd-mobile';
import classnames from 'classnames';
import './index.component.scss';
import request from './request';
import Slick from 'react-slick'
import 'slick-carousel/slick/slick.css'
import {login, share, platform, statistics} from 'utils';
import JianghuEmergency from 'pages/misc/flow/JianghuEmergency';

const title = '江湖救急';
let lock = true;

export default class Flow extends Component{
    constructor(props){
        super(props);
        this.state = {
            tips: '',
            gallerys: [],
            items: [],
            loaded: 0,
            modal: {
                visible: 0
            }
        };
    }
    componentWillMount(){
        document.title = title;
        Toast.loading(undefined, 0);
        request(`notice/get-flow-list`).then(response => {
            let {tips, gallerys} = response.data;
            this.setState({
                tips,
                gallerys,
                loaded: 1
            });
            Toast.hide();
        }).catch(this.middleware.bind(this));
    }
    middleware(response){
        let {message} = response;
        Toast.hide();
        Toast.fail(message);
    }
    goto(options = {}){
        let {title: name, href: link, link: l} = options;
        let {modal} = this.state;
        if(lock){
            lock = !lock;
            Toast.loading(undefined, 0);
            request({
                url: 'credit-web/user-click-count',
                params: {
                    title: name
                }
            }).then(response => {
                Toast.hide();
                if(l) {
                  window.location.href = l;
                  return  
                }
                window.location.href = link;
                lock = !lock;
            }).catch(this.middleware.bind(this));
        }
    }
    banner(data, index){
        let {id, link} = data;
        window.location.href = link;
    }
    render(){
        let {wrapper = {clientWidth: 0}} = this.refs;
        let {tips, gallerys, loaded} = this.state;
        const carouselStyle = this.state.initialHeight ? {height: this.state.initialHeight} : {};
        return (
            <div ref='wrapper' className={`wrapper wrapper-misc-flow ${loaded ? 'loaded' : ''}`}>
                {tips && (<NoticeBar icon={null}>{tips}</NoticeBar>)}
                {(gallerys && Array.isArray(gallerys) && gallerys.length) ?
                  <div className='banner'>
                    <Slick arrows={false}>
                      {gallerys.map((data, index) => (
                        <div key={index}>
                          <a onClick={this.banner.bind(this, data, index)}><img src={data.image}/></a>
                        </div>
                      ))}
                    </Slick>
                  </div>
                : false}
                {loaded ? <JianghuEmergency location={this.props.location}/> : ''}
            </div>
        );
    }
};