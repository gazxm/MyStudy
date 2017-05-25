/* eslint-disable */
import React, {Component} from 'react';
import {NoticeBar, Carousel, List, Modal, Icon, Toast, Flex, Grid} from 'antd-mobile';
import classnames from 'classnames';
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
            let {tips, gallerys, item} = response.data;
            let items = [];
            for(let i in item){
                items.push(item[i]);
            }
            this.setState({
                active: items[0].id,
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
                    if(l) {
                      window.location.href = l;
                      return  
                    }
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
        let {wrapper = {clientWidth: 0}} = this.refs;
        let {tips, gallerys, items, modal, loaded, active} = this.state;
        let grid = data => {
            let {id, name: text} = data;
            let style = {
                height: wrapper.clientWidth / items.length
            };
            let iconSize = style.height * .44;
            let click = () => {
                (active != id) && this.setState({active: id});
            };
            return (
                <div className={classnames({
                    'am-grid-item-contain': true,
                    active: (active == id)
                })} style={style} onClick={click}>
                    <div className='am-grid-icon' style={{width: iconSize, height: iconSize}}></div>
                    <div className='am-grid-text'>{text}</div>
                </div>
            );
        };
        let item = (data, index) => {
            let {title: name, slogan, remark: description, img_url: thumb, loan_apr: interest, type: interestType, max_amount: maximumAmount} = data;
            return (
                <Item key={index} arrow='horizontal' thumb={thumb} onClick={this.goto.bind(this, data)} multipleLine>
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
            )
        };
        const carouselStyle = this.state.initialHeight ? {height: this.state.initialHeight} : {};
        return (
            <div ref='wrapper' className={`wrapper wrapper-misc-flow ${loaded ? 'loaded' : ''}`}>
                {tips && (<NoticeBar icon={null}>{tips}</NoticeBar>)}
                <div className='carousel'>
                    {
                        gallerys && (
                            <Carousel dots={gallerys.length > 1} autoplay={gallerys.length > 1} infinite>
                                {gallerys.map((gallery, index) => (
                                    <a key={index} className='slider-link' onClick={this.goto.bind(this, gallery)} style={carouselStyle}>
                                        <img src={gallery.image} onLoad={() => {
                                            // fire window resize event to change height
                                            window.dispatchEvent(new Event('resize'));
                                            this.setState({
                                                initialHeight: null,
                                            });
                                        }}/>
                                    </a>
                                ))}
                            </Carousel>
                        )
                    }
                </div>
                <Grid data={items} columnNum={items.length} renderItem={grid}/>
                {items && items.length && items.map(({id, blackFlowInfo: children}, index) => (
                    <List key={index} className={classnames({active: active == id})}>
                        {(children && children.length) ? children.map(item) : <div className='empty'>暂无数据</div>}
                    </List>
                ))}
                
                    {
                        // items && items.map(({name, slogan, description, thumb, interest, interestType, maximumAmount} = item, index) => (
                        //     <Item key={index} arrow='horizontal' thumb={thumb} onClick={this.goto.bind(this, items[index])} multipleLine>
                        //         {name}{slogan ? ` - ${slogan}` : ''}
                        //         <div className='description'>
                        //             <Brief>{description}</Brief>
                        //         </div>
                        //         <div className='params'>
                        //             <Brief>
                        //                 <p>
                        //                     参考
                        //                     {interestType == 0 ? '年' : interestType == 1 ? '月' : interestType == 2 ? '日' : '/'}
                        //                     利率：
                        //                     <span>{interest}</span>
                        //                 </p>
                        //                 <p>
                        //                     最高额度：
                        //                     <span>{maximumAmount}</span>
                        //                 </p>
                        //             </Brief>
                        //         </div>
                        //     </Item>
                        // ))
                    }
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