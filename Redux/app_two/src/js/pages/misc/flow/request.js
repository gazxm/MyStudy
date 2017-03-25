import axios from 'axios';
import {Toast} from 'antd-mobile';
import {platform, resolveUrl, share} from 'utils';

const url = url => resolveUrl(url);

export default (options) => {
    let config = {};
    if(typeof options === 'string'){
        config.url = options;
    }else{
        config = Object.assign(config, options);
    }
    if(!/^https?|^\/\//.test(options)){
        config.url = url(`http://credit.xianjincard.com/${config.url.replace(/^\//, '')}`);
    }
    return axios(config).then(response => response.data).then(response => {
        let {code, message} = response;
        if(code !== 0){
            throw response;
        }
        return response;
    });
};