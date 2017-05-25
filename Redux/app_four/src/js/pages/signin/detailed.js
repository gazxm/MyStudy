import 'scss/signin/detailed.component.scss';
import React, {Component} from 'react';
import {Toast, ListView, List} from 'antd-mobile';
import {login, share} from 'utils';
import moment from 'moment';

import request from './request';

let Item = List.Item;
let Brief = Item.Brief;

let title = '金币明细';
let page = 1;
let size = 15;
let lock = true;

export default class Detailed extends Component{
    constructor(props){
        super(props);
        let data = new ListView.DataSource({
            rowHasChanged: (row1, row2) => row1 !== row2,
        });

        this.data = {};
        this.state = {
            money: 0,
            dataSource: data.cloneWithRows({}),
            loading: 1,
            loaded: 0,
            empty: 0
        };
    }
    componentDidMount(){
        document.title = title;
        let {dataSource, loading, loaded} = this.state;
        Toast.loading(undefined, 0);
        request(`credit-gold/draw-list`).then(response => {
            Toast.hide();
            let {score: money, list: items} = response.data;
            let data = {};
            if(!items.length){
                this.setState({
                    empty: 1,
                    loaded: 1
                });
                return;
            }
            items.map((item, index) => {
                let ii = page * items.length + index;
                data[ii] = item;
            });
            items.length < size && (loading = 0);
            this.data = {...this.data, ...data};
            page++;
            this.setState({
                money,
                dataSource: dataSource.cloneWithRows(this.data),
                loading,
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
    onEndReached(event){
        let {loading, dataSource} = this.state;
        if(lock && loading){
            lock = !lock;
            request(`credit-gold/draw-list?page=${page}`).then(response => {
                let {score: money, list: items} = response.data;
                let data = {};
                if(!items.length){
                    this.setState({
                        loading: 0
                    });
                    return;
                }
                items.map((item, index) => {
                    let ii = page * items.length + index;
                    data[ii] = item;
                });
                this.data = {...this.data, ...data};
                this.setState({
                    money,
                    dataSource: dataSource.cloneWithRows(this.data),
                });
                page++;
                lock = !lock;
            }).catch(this.middleware.bind(this));
        }
    }
    render(){
        let {money, dataSource, loading, loaded, empty} = this.state;
        let row = (data) => {
            let {name, operator_gold_score: money, created_at} = data;
            let date = moment.unix(created_at).format('YYYY-MM-DD HH:mm:ss');
            return (
                <Item multipleLine extra={`${money}`}>
                    {name}<Brief>{date}</Brief>
                </Item>
            );
        };
        return (
            <div className='wrapper wrapper-signin-detailed loaded'>
                <div className='header'>
                    <div>
                        <p>总金币</p>
                        <p>{money}</p>
                    </div>
                </div>
                <div className={`content ${loaded ? 'loaded': ''}`}>
                    {!empty ? <ListView
                    dataSource={dataSource}
                    renderFooter={() => <div style={{padding: 30, textAlign: 'center'}}>
                        {(loading && !loaded) ? '加载中...' : ''}
                    </div>}
                    pageSize={10}
                    renderRow={row}
                    scrollRenderAheadDistance={333}
                    scrollEventThrottle={100}
                    onEndReached={this.onEndReached.bind(this)}
                    onEndReachedThreshold={100}
                    renderBodyComponent={() => <List className='logger'/>}
                    /> : <div className='empty'>暂无数据</div>}
                </div>
            </div>
        )
    }
}
                    // <ListView
                    // dataSource={data}/>