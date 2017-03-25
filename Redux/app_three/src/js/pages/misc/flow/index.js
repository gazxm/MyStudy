import React, {Component} from 'react';
import {NoticeBar, Carousel, List, Modal, Icon, Toast, Flex} from 'antd-mobile';
import './index.component.scss';
import request from './request';
import {login, share, platform} from 'utils';

const TITLE = '更多选择';
const Item = List.Item;
const Brief = Item.Brief;

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
        document.title = TITLE;
        Toast.loading(undefined, 0);
        request(`notice/get-flow-list`).then(response => {
            let {tips, gallerys, item: items} = response.data;
            this.setState({
                tips,
                gallerys,
                items,
                loaded: 1
            });
            Toast.hide();
        }).catch(this.middleware.bind(this));
    }
    middleware(response){
        let {message} = response;
        Toast.hide();
        Toast.fail(message, 1.5);
    }
    carousel(){
    }
    goto(options = {}){
        let {name, link} = options;
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
                if(name && platform.isAndroid){
                    modal.name = name;
                    modal.link = link;
                    this.setState({
                        modal
                    });
                    setTimeout(() => {
                        modal.visible = 1;
                        this.setState({
                            modal
                        });
                    }, 100);
                }else{
                    window.location.href = link;
                }
                lock = !lock;
            }).catch(this.middleware.bind(this));
        }
    }
    close(){
        let {modal} = this.state;
        modal.visible = 0;
        this.setState({
            modal
        });
    }
    render(){
        let {tips, gallerys, items, modal, loaded} = this.state;
        return (
            <div className={`wrapper ${loaded ? 'loaded' : ''}`}>
                {tips && (<NoticeBar icon={null}>{tips}</NoticeBar>)}
                <div className='carousel'>
                    {
                        gallerys && (
                            <Carousel autoplay={true} infinite>
                                {gallerys.map((gallery, index) => (
                                    <a key={index} className='slider-link' onClick={this.goto.bind(this, gallery)}>
                                        <img src={gallery.image}/>
                                    </a>
                                ))}
                            </Carousel>
                        )
                    }
                </div>
                <List>
                    {
                        items && items.map(({name, slogan, description, thumb, interest, interestType, maximumAmount} = item, index) => (
                            <Item key={index} arrow='horizontal' thumb={thumb} onClick={this.goto.bind(this, items[index])} multipleLine>
                                {name}{slogan ? ` - ${slogan}` : ''}
                                <div className='description'>
                                    <Brief>{description}</Brief>
                                </div>
                                <div className='params'>
                                    <Brief>
                                        <p>
                                            参考
                                            {interestType == 0 ? '年' : interestType == 1 ? '月' : interestType == 2 ? '日' : '/'}
                                            利率：
                                            <span>{interest}</span>
                                        </p>
                                        <p>
                                            最高额度：
                                            <span>{maximumAmount}</span>
                                        </p>
                                    </Brief>
                                </div>
                            </Item>
                        ))
                    }
                </List>
                <Modal
                className='goto'
                title={`即将进入"${modal.name}"页面`}
                visible={modal.visible}
                onClose={this.close.bind(this)}
                maskClosable={true}
                transparent>
                    <p>注册完成后请至各大应用市场下载"{modal.name}"APP</p>
                    <a href={modal.link || 'javascript:;'} className='button'>前往</a>
                </Modal>
            </div>
        );
    }
};