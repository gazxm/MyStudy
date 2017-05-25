/* eslint-disable */
import React, {Component} from 'react';
import {Modal, Grid, Carousel} from 'antd-mobile';
import classnames from 'classnames';
import {redirect, login, forwardApp as download} from 'utils';
import 'scss/mobile/certification.component.scss';
import request from 'common/request';

import basics from './basics';

import Gauge from './gauge';

const title = '认证中心';

export default class Certification extends Component {
    state = {
        loaded: 0
    }
    constructor(props){
        super(props);
        request.interceptors.response.use(response => {
            let {code, message} = response;
            if(code == -2){
                Modal.alert('提 示', message, [{
                    text: '确 定',
                    onPress(){
                        login();
                    }
                }])
                return Promise.reject(response);
            }
            return Promise.resolve(response);
        }, error => {
            return Promise.reject(error);
        });
    }
    componentDidMount(){
        document.title = title;
        request('v2/credit-card/get-verification-info').then(response => {
            let {item: {
                header,
                list,
                list_name,
            }, verify_loan_pass: is_basics_verify, double_repayment, is_new_user, is_living} = response.data;
            let verify = [];
            // url format
            list && list.map(data => {
                (!data.url && data.first_url) && (data.url = data.first_url);
                data.type == 1 && verify.push(data.tag);
                basics.map(basic => {
                    if(basic.id == data.tag){
                        data.url = basic.link;
                    }
                });
                if(data.tag == 4 && data.status && is_basics_verify){
                    data.url = data.first_url;
                }
            });
            if(!!!is_basics_verify){
                for(let i in list){
                    let {tag: id, url: link, status} = list[i];
                    if(verify.indexOf(id) >= 0 && !!!status && link){
                        redirect.replace(link);
                        break;
                    }
                }
            }else{
                let verifys = [];
                for(let i in list_name){
                    let data = list_name[i];
                    let children = [];
                    list && list.map(data => {
                        i == data.type && children.push(data);
                    });
                    verifys.push({
                        id: +i,
                        label: data.title,
                        children
                    })
                }
                this.setState({
                    header,
                    verifys,
                    is_basics_verify,
                    double_repayment,
                    is_new_user,
                    is_living,
                    loaded: 1
                });
                setTimeout(() => {
                    let {verify_score: data} = header;
                    let gauge = new Gauge({
                        element: this.refs.credit,
                        value: 0,
                        value_max: data.max
                    });
                    gauge.render();
                    setTimeout(() => {
                        gauge.update(data.score);
                    }, 500);
                });
            }
        }).catch(response => response);
        
    }
    render(){
        let {wrapper = {clientWidth: 0}} = this.refs;
        let {header = {}, verifys = [], loaded, double_repayment, is_new_user, is_living} = this.state;
        let item = (data, index) => {
            let {title: text, data: value, logo: icon, url: link, status, type} = data;
            let style = {
                height: wrapper.clientWidth / 4
            };
            let click = () => {
                if(!!!link) return;
                if(!is_new_user && type != 1 && status != 1 && !is_living){
                    Modal.alert('下载App', '下载app后可完善高级认证，完善后可借更高的额度', [{
                        text: '取消'         
                    }, {
                        text: '下载app',
                        onPress(){
                            download();
                        }
                    }])
                    return;
                }
                if(/^(https?|\/\/)/.test(link)){
                    window.location.href = link;
                }else{
                    redirect.push(link);
                }
            };
            return (
                <div className={classnames({
                    'am-grid-item-contain': true,
                    active: !!status
                })} style={style} onClick={click}>
                    <div className='am-grid-icon' style={{backgroundImage: `url(${icon})`}}></div>
                    <div className='am-grid-text'>{text}</div>
                    {(!status && value) && (<div className='corner-mark'>
                        <span>{value}</span>
                    </div>)}
                </div>
            );
        };
        return (
            <div ref='wrapper' className={classnames({'wrapper wrapper-mobile': true, loaded})}>
                <div className='authentication'>
                    <div className='header'>
                        <div className='instruction' onClick={() => {
                            redirect.push('/mobile/certification/instruction');
                        }}>分数说明</div>
                        
                        <Carousel>
                            <div className='credit'>
                                <canvas ref='credit' data-value='60' data-max-value='120'/>
                                <div className='tips'>{header.verify_score && header.verify_score.title}</div>
                            </div>
                            <div className='credit-amount'>
                                <div className='credit-line'>
                                    <div>
                                        <p>{header.status == 3 ? header.data : '认证中'}</p>
                                        <span>我的额度</span>
                                    </div>
                                </div>
                                <div className='tips'>{header.title}</div>
                            </div>
                        </Carousel>
                    </div>
                    {verifys && verifys.map((verify, index) => (
                        <div key={index}>
                            {!(is_new_user && verify.id != 1) ? 
                                <div className='verifys'>
                                    <div className='title' dangerouslySetInnerHTML={{__html: verify.label}}></div>
                                    {verify.children && <Grid data={verify.children} renderItem={item}/>}
                                </div>
                            : ''}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
};