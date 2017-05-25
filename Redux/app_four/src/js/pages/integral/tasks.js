/* eslint-disable */
import React, {Component} from 'react';
import {Carousel, List, Button, Toast, Icon} from 'antd-mobile';
import classnames from 'classnames';
import request from 'common/request';
import {login, redirect, hrefNative as native, platform} from 'utils';

import 'scss/integral/tasks.component.scss';

let title = '任务中心';
let Item = List.Item;
let Brief = Item.Brief;

export default class Tasks extends Component{
    state = {
        lock: 1,
        loaded: 0,
        description: {}
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        document.title = title;
        let {middleware} = this.props;
        request('credit-gold/task-list').then(response => {
            let {gold_task_banner: {items: gallery} = {}, task} = response.data;
            this.setState({
                gallery,
                task,
                loaded: 1
            });
        }).catch(middleware.bind(this));
    }
    reward(options = {}){
        let {type, link} = options;
        if(type === 0){
            return;
        }else if(type === 1){
            if(platform.isApp){
                native(link);
            }else{
                Modal.alert('下载App', '下载app后可完善高级认证，完善后可借更高的额度', [{
                    text: '取消'         
                }, {
                    text: '下载app',
                    onPress: download
                }]);
            }
            return;
        }else if(type === 2){
            window.location.href = link;
            return;
        }else{
            Toast.fail('服务器繁忙，请稍后重试');
        }
    }
    receive(data, parentIndex, index){
        let {middleware} = this.props;
        let {task, lock} = this.state;
        if(lock && data.status == 1 && !data.loading){
            if(task[parentIndex] && task[parentIndex].item && task[parentIndex].item[index]){
                data.loading = 1;
                task[parentIndex].item[index] = data;
                this.setState({
                    task,
                    lock: 0
                });
                let start = Date.now();
                request(`credit-gold/get-task-gold?id=${data.id}`).then(response => {
                    let end = Date.now();
                    let timeout = 0;
                    if(end - start < 1000) timeout = 1000;
                    if(end - start > 1000) timeout = 0;
                    setTimeout(() => {
                        data.received = 1;
                        data.status = 2;
                        data.loading = 0;
                        task[parentIndex].item[index] = data;
                        this.setState({
                            task,
                            lock: 1
                        });
                    }, timeout);
                }).catch(response => {
                    let end = Date.now();
                    let timeout = 0;
                    if(end - start < 1000) timeout = 1000;
                    if(end - start > 1000) timeout = 0;
                    setTimeout(() => {
                        data.loading = 0;
                        task[parentIndex].item[index] = data;
                        this.setState({
                            task,
                            lock: 1
                        });
                        middleware.bind(this, response)();
                    }, timeout);
                });
            }else{
                Toast.fail('服务器繁忙，请稍后重试');
            }
        }
    }
    render(){
        let {task, gallery, description, loaded} = this.state;
        let format = (data, parentIndex, index) => {
            let {status, url, loading} = data;
            return (
                <div>
                    {status == 0 ?
                        <div className='reward' onClick={this.reward.bind(this, url)}>去完成</div>
                    : 
                        <Button className={classnames({
                            'receive': true,
                            'received': status == 2
                        })} loading={loading} onClick={this.receive.bind(this, data, parentIndex, index)}/>
                    }
                </div>
            );
        };
        return (
            <div className={classnames({'wrapper wrapper-integral-tasks': true, loaded})}>
                {gallery ?
                    <Carousel className='gallery' infinite dots={gallery.length > 1} autoplay={gallery.length > 1} variableWidth>
                        {(gallery && gallery.length) && gallery.map((data, index) => (
                            <a key={index} className='slider-slide-link' href={data.link}>
                                <img src={data.img}/>
                            </a>
                        ))}
                    </Carousel>
                : ''}
                {(task && task.length) && task.map(({name, item: items, active}, parentIndex) => (
                    <List
                    key={parentIndex}
                    className={classnames({
                        tasks: true,
                        active
                    })}
                    renderHeader={() => name || '其他任务'}
                    renderFooter={((items && items.length && items.length > 3) ? () => <div className='more' onClick={() => {
                        task.map((data, index) => (index == parentIndex) && (data.active = !data.active));
                        this.setState({task});
                    }}>{active ? '收起' : '更多'}</div> : false)}>
                        {(items && items.length) ? items.map((item, index) => (
                            <Item
                            key={index}
                            thumb={<i style={item.img ? {backgroundImage: `url(${item.img})`} : {}}/>}
                            multipleLine
                            extra={format.bind(this, item, parentIndex, index)()}>
                                <div className='title'>
                                    {item.name}
                                    {item.icon ? <i style={item.icon ? {backgroundImage: `url(${item.icon})`} : {}}/> : ''}
                                </div>
                                <Brief>
                                    <div className='money'>+{item.gold_score}金币</div>
                                    {item.desc ? 
                                        <div className='description'>
                                            {description[`d_${parentIndex}_${index}`] ? <p>任务说明：{item.desc}</p> : ''}
                                            <div className='handle' onClick={() => this.setState({
                                                description: {
                                                    [`d_${parentIndex}_${index}`]: !description[`d_${parentIndex}_${index}`]
                                                } 
                                            })}>
                                                <Icon type={description[`d_${parentIndex}_${index}`] ? 'up' : 'down'}/>
                                            </div>
                                        </div>
                                    : ''}
                                </Brief>
                            </Item>
                        )) : <div className='empty'>暂无数据</div>}
                    </List>
                ))}
                <div className='toolbar' onClick={() => setTimeout(redirect.push('/integral-mall'))}>金币兑换</div>
            </div>
        );
    }
};