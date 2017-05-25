/* eslint-disable */
import React, {Component} from 'react';
import {Card, List, Flex, Icon, Toast, Carousel} from 'antd-mobile';
import classnames from 'classnames';
import 'scss/mobile/find.component.scss';
import request from 'common/request';

import {redirect, hrefNative, platform} from 'utils';

const title = '发现';
const subject = (options) => {
    let {title, subtitle, extra = '更多', link} = options;
    let click = () => {
        typeof link === 'function' && link();
        /^(https?|\/\/)/.test(link) && (window.location.href = link);
    };
    return (
        <List className='subject'>
            <List.Item extra={extra} arrow='horizontal' onClick={click}>
                {title}
                {subtitle && (<span>{subtitle}</span>)}
            </List.Item>
        </List>
    );
};
// {interestType == 0 ? '年' : interestType == 1 ? '月' : interestType == 2 ? '日' : '/'}
export default class Find extends Component {
    state = {
        initialHeight: 200,
        loaded: 0
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        document.title = title;
        request('notice/discovery-channel').then(response => {
            let {item: guides, personal: entries, card: cards, channel: channels, article: articles, carousel: carousels} = response.data;
            setTimeout(() => {
                this.setState({
                    guides,
                    entries,
                    carousels: carousels,
                    cards,
                    channels,
                    articles,
                    loaded: 1
                })
            })
        }).catch(this.middleware.bind(this));
    }
    middleware(response){
        let {code, message} = response;
        Toast.hide();
        if([0, -2].indexOf(code) == -1){
            Toast.fail(message, 1.5);
        }
        setTimeout(() => {
            this.setState({loaded: 1});
        });
    }
    render(){
        let {guides, entries, cards, channels, carousels, articles, loaded} = this.state;
        let Guide = (guide, index) => {
            let {button: text, url, type, img, visible} = guide;
            let click = () => {
                if(type && platform.isApp){
                    hrefNative(type);
                }else{
                    url && (window.location.href = url);
                }
            };
            if(platform.isIos && visible == 2) return;
            if(platform.isAndroid && visible == 1) return;
            return (
                <Flex.Item key={index} onClick={click}>
                    <div>
                        <div className='icon' style={{backgroundImage: 'url(' + img + ')'}}/>
                        <p>{text}</p>
                    </div>
                </Flex.Item>
            );
        };
        let Entrie = (entrie, index) => {
            let {button: text, content, Jump_url: url, type, img_url: img, visible} = entrie;
            let click = () => {
                if(type && platform.isApp){
                    hrefNative(type);
                }else{
                    url && (window.location.href = url);
                }
            };
            if(platform.isIos && visible == 2) return;
            if(platform.isAndroid && visible == 1) return;
            return (
                <li key={index} onClick={click}>
                    <div>
                        <p>{text}</p>
                        <span>{content}</span>
                    </div>
                    <div className='icon' style={{backgroundImage: 'url(' + img + ')'}}/>
                </li>
            );
        };
        const carouselStyle = this.state.initialHeight ? {height: this.state.initialHeight} : {};
        return (
            <div className={classnames({'wrapper wrapper-mobile': true, loaded})}>
                {guides && <Flex className='guides'>{guides.map(Guide)}</Flex>}
                {entries && <ul className='entries'>{entries.map(Entrie)}</ul>}
                {(carousels && carousels.length && !platform.isIos) ? 
                    <div className='activitys'>
                        {carousels.length > 1 ? 
                            <Carousel selectedIndex={1} autoplay={carousels && carousels.length > 1} infinite>
                                {carousels.map((data, index) => (
                                    <a key={index} href={data.action_url} style={carouselStyle}>
                                        {data.title && (<h6>{data.title}</h6>)}
                                        <img src={data.img_url} onLoad={() => {
                                            // fire window resize event to change height
                                            window.dispatchEvent(new Event('resize'));
                                            this.setState({
                                                initialHeight: null,
                                            });
                                        }}/>
                                    </a>
                                ))}
                            </Carousel>
                        :
                            <div>
                                {carousels.map((data, index) => (
                                    <a key={index} href={data.action_url} style={carouselStyle}>
                                        {data.title && (<h6>{data.title}</h6>)}
                                        <img src={data.img_url} onLoad={() => {
                                            // fire window resize event to change height
                                            window.dispatchEvent(new Event('resize'));
                                            this.setState({
                                                initialHeight: null,
                                            });
                                        }}/>
                                    </a>
                                ))}
                            </div>
                        }
                    </div>
                 : ''}
                {(channels && channels.data) && (
                    <div>
                        {subject({
                            title: channels.header.title,
                            subtitle: channels.header.content,
                            link: channels.header.moreUrl
                        })}
                        {channels.data && (
                            <List className='diversion'>
                                {channels.data.map((data, index) => (
                                    <List.Item key={index} thumb={data.img_url} arrow='horizontal' onClick={() => {
                                        data.href && (window.location.href = data.href);
                                    }}>
                                        {data.title}
                                        <div className='description'>
                                            <List.Item.Brief>{data.sub_title}</List.Item.Brief>
                                        </div>
                                        <div className='params'>
                                            <List.Item.Brief>
                                                <p>
                                                    参考{data.interest_type == 0 ? '年' : data.interest_type == 1 ? '月' : data.interest_type == 2 ? '日' : '/'}利率：
                                                    <span>{data.loan_apr}</span>
                                                </p>
                                                <p>
                                                    最高额度：
                                                    <span>{data.max_amount}</span>
                                                </p>
                                            </List.Item.Brief>
                                        </div>
                                    </List.Item>
                                ))}
                            </List>
                        )}
                    </div>
                )}

                {(cards && cards.data) && (
                    <div className='banks'>
                        {subject({
                            title: cards.header.title,
                            subtitle: cards.header.content,
                            link: cards.header.moreUrl
                        })}
                        {cards.data.map((data, index) => (
                            <Card key={index} full>
                                <Card.Header title={data.title}/>
                                <Card.Body>
                                    <div className='am-card-thumb' style={{backgroundImage: 'url(' + data.img + ')'}}/>
                                    <div className='details'>
                                        <p>取现额度: {data.quota}</p>
                                        <p>免息期: {data.free}</p>
                                        <p>发卡组织: {data.organization}</p>
                                        <div className='button-apply' onClick={() => {
                                            data.url && (window.location.href = data.url);
                                        }}>立即申请</div>
                                    </div>
                                </Card.Body>
                            </Card>
                        ))}
                    </div>
                )}
                {(articles) && (
                    <List className='articles'>
                        {articles.map((data, index) => (
                            <List.Item key={index} thumb={data.img_url} onClick={() => {
                                // redirect.push(`/mobile/find/article/${data.id}`);
                                location.href = `/mobile/find/article/${data.id}`
                            }}>
                                <h6>{data.title}</h6>
                                <List.Item.Brief>
                                    <div className='preview'>+{data.see}</div>
                                </List.Item.Brief>
                            </List.Item>
                        ))}
                    </List>
                )}
            </div>
        )
    }
};
