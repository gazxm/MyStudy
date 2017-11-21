/* eslint-disable */
import qs from 'qs';
import {Toast} from 'antd-mobile';
import axios from 'axios';
import {resolveUrl as url} from 'utils';

let request = axios.create();

request.interceptors.request.use(config => {
    // config.headers['Cookie'] = '888'
    config.timeout = 20000;
    config.url = /^(https?|\/\/)/.test(config.url) ? (/(m|api|api-hj)\.xianjincard\.com/.test(config.url) ? url(config.url) : config.url) : url(`http://credit.xianjincard.com/${config.url.replace(/^\//, '')}`);

    if(config.method && config.method.toUpperCase() === 'POST'){
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        try{
            config.data = qs.stringify(config.data);
        }catch(e){
            console.log(e)
        }
    }
    return config;
}, error => {
    return Promise.reject(error);
});

request.interceptors.response.use(response => {
    return Promise.resolve(response.data || {});
}, error => {
    (error && /timeout/.test(error.message)) && (error.message = '请求超时，请稍后重试');
    return Promise.reject(error);
});

export default request;