/* eslint-disable */
import React, {Component} from 'react';
import {Modal, Toast, Button} from 'antd-mobile';
import request from 'common/request';
import {share, platform, login, hrefNative as native, resolveUrl, forwardApp as download} from 'utils';
import classnames from 'classnames';

let lock = true;

export default class Welcome extends Component{
    constructor(props){
        super(props);
    }
    go(){
        native(4);
    }
    render(){
        return (
            <div className='wrapper loaded'>
                <Button onClick={this.go.bind(this)}>跳转</Button>
            </div>
        )
    }
}