import axios from 'axios';
import {Toast} from 'antd-mobile';
import {platform, resolveUrl, share} from 'utils';

const url = url => resolveUrl(url);
class abort{};
export default (options) => {
    let config = {};
    if(typeof options === 'string' && !/^https?|^\/\//.test(options)){
        options = url(`http://credit.xianjincard.com/${options.replace(/^\//, '')}`);
        config.url = options;

    }else{
        config = Object.assign(config, options);
    }
    return axios(config).then(response => response.data).then(response => {
        let {code, message} = response;
        if([-1000, -1001,-1003, -1004, -1014].indexOf(code) >= 0){
            throw response;
        }
        return response;
    });
};