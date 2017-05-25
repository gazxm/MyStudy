import axios from 'axios';
import {resolveUrl as url} from 'utils';

axios.interceptors.request.use(config => {
    config.responseType = 'json';
    config.url = url(`http://credit.xianjincard.com/${config.url.replace(/^\//, '')}`);
    if(config.method && config.method.toUpperCase() === 'POST'){
        config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    return config;
}, error => {
    return Promise.reject(error);
});
axios.interceptors.response.use(response => {
    return Promise.resolve(response.data || {});
}, error => {
    return Promise.reject(error);
});

export default axios;