/* eslint-disable */
import React, {Component} from 'react';
import {Carousel, Modal, List, Toast} from 'antd-mobile';
import Back2Top from 'react-back2top';
import classnames from 'classnames';
import request from 'common/request';
import {login, redirect} from 'utils';

import 'scss/integral/tasks.component.scss';

const RETRY_TEXT = '系统繁忙，请稍后重试';

export default class Tasks extends Component{
	state = {

	}
	constructor(props){
        super(props);
        request.interceptors.response.use(response => {
            let {code, message} = response;
            if(code != 0){
                return Promise.reject(response);
            }
            return Promise.resolve(response);
        }, error => {
            return Promise.reject(error);
        });
    }
    middleware(response){
        let {code, message = RETRY_TEXT} = response;
        Toast.hide();
        if(code == -1001){
            let modal = document.querySelector('.am-modal');
            if(!modal){
                Modal.alert('提 示', message, [{
                    text: '确 定',
                    onPress: login
                }])
            }
        }else{
            Toast.fail(message, () => {
                this.setState && this.setState({lock: 1, loaded: 1, loading: 0});
            });
        }
    }
	render(){
        let {middleware} = this;
		return (
            <div>
    			{React.cloneElement(this.props.children, {
                    middleware
                })}
                <Back2Top/>
            </div>
		);
	}
};