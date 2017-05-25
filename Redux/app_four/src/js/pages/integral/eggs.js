/* eslint-disable */
import React, {Component} from 'react';
import {Carousel, List, Button, Toast, Icon} from 'antd-mobile';
import classnames from 'classnames';
import request from 'common/request';
import {login, redirect, hrefNative as native, platform} from 'utils';

import 'scss/integral/eggs.component.scss';

let title = '欢乐砸金蛋';
let Item = List.Item;
let Brief = Item.Brief;

export default class Tasks extends Component{
    state = {
        lock: 1,
        loaded: 1,
        description: {}
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        document.title = title;
        let {middleware} = this.props;
    }
    render(){
        let {loaded} = this.state;
        return (
            <div className={classnames({'wrapper wrapper-integral-eggs': true, loaded})}>
                1
            </div>
        );
    }
};