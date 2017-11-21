/* eslint-disable */
import React, {Component} from 'react';
import {Modal, Toast} from 'antd-mobile';
import classnames from 'classnames';
import request from 'common/request';
import {login, redirect} from 'utils';

const RETRY_TEXT = '系统繁忙，请稍后重试';

export default class Channel extends Component{
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
        if(code == -2){
            Modal.alert('提 示', message, [{
                text: '确 定',
                onPress: login
            }]);
        }else if(code == -1){
            Toast.fail(message, 3, redirect.goBack);
        }else{
            Toast.fail(message, 3, () => {
                this.setState && this.setState({lock: 1, loaded: 1, loading: 0});
            });
        }
    }
    render(){
        let {middleware} = this;
        return (
            React.cloneElement(this.props.children, {
                middleware,
                RETRY_TEXT
            })
        );
    }
};