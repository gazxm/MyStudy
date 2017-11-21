/* eslint-disable */
import lrz from 'lrz';
import React, {Component, createClass} from 'react';
import PropTypes from 'prop-types';
import {List, InputItem, TextareaItem, Button, Toast, ImagePicker, Modal} from 'antd-mobile';
import {createForm} from 'rc-form';
import classnames from 'classnames';
import 'scss/mobile/feedback.component.scss';
import request from 'common/request';
import {resolveUrl as url, redirect, hrefNative as native, platform, login} from 'utils';

let title = '还款问题反馈';
const RETRY_TEXT = '系统繁忙，请稍后重试';

class Feedback extends Component{
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    state = {
        files: [],
        lock: 1,
        // 数据加载完毕
        loaded: 1,
        // request loading
        loading: 0
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
    componentDidMount(){
        document.title = title;
    }
    middleware(response){
        let {setFieldsValue} = this.props.form;
        let {code, message = RETRY_TEXT} = response;
        Toast.hide();
        if(code == -2){
            let modal = document.querySelector('.am-modal');
            if(!modal){
                Modal.alert('提 示', message, [{
                    text: '确 定',
                    onPress: login
                }])
            }
        }else{
            if(code == -1){
                setFieldsValue({content: ''});
                this.setState({files: []});
            }
            Toast.fail(message, 3, () => {
                this.setState && this.setState({lock: 1, loaded: 1});
            });
            this.setState({loading: 0});
        }
    }
    submit(){
        let {getFieldInstance, getFieldsValue, setFieldsValue, validateFields} = this.props.form;
        validateFields((errors, values) => {
            if(errors){
                for(let i in errors){
                    let input = errors[i];
                    input.errors && input.errors.map(error => {
                        Toast.offline(error.message, 3, () => {
                            let element = getFieldInstance(error.field);
                            if(element && element.refs && element.refs.input){
                                let {input} = element.refs;
                                setTimeout(input.focus());
                            }else if(element && element.refs && element.refs.textarea){
                                let {textarea} = element.refs;
                                setTimeout(textarea.focus());
                            }
                        });
                    });
                    break;
                }
            }else{
                let {lock, files} = this.state;
                let {content} = getFieldsValue();
                let attach = [];
                if(lock){
                    // if(!files.length && !platform.isAndroid){
                    if(!files.length){
                        Toast.offline('请上传图片');
                        return;
                    }
                    let queue = [];
                    files.map(file => queue.push(lrz(file.file, {width: 640})))
                    Promise.all(queue).then(file => {
                        file.map(data => attach.push(data.base64));
                        let data = {type: 1, content, attach};
                        var form = new FormData();
                        for(let i in data){
                            let value = data[i];
                            if(typeof value === 'object'){
                                for(let ii in value){
                                    form.append(`${i}[${ii}]`, value[ii]);
                                }
                            }else{
                                form.append(i, value);
                            }
                        }
                        this.setState({lock: 0, loading: 1});
                        let start = Date.now();
                        request.post('picture/upload-order-image', data).then(response => {
                            let end = Date.now();
                            let timeout = 0;
                            if(end - start < 1000) timeout = 1000;
                            if(end - start > 1000) timeout = 0;
                            let {message} = response;
                            setTimeout(() => {
                                Toast.success(message, 3, () => redirect.goBack());
                                setFieldsValue({content: ''});
                                this.setState({lock: 1, loading: 0});
                            }, timeout);
                        }).catch(this.middleware.bind(this));
                    });
                }
            }
        });
    }
    onChange(files, type, index){
        this.setState({
            files
        });
    }
    render(){
        let {getFieldProps} = this.props.form;
        let {files, lock, loaded, loading} = this.state;
        let editable = !loading && loaded && lock;
        return (
            <div className={classnames({'wrapper wrapper-mobile wrapper-settings-feedback': true, loaded})}>
                <div className='subtitle'>问题描述</div>
                <TextareaItem
                autoFocus
                editable={editable}
                rows={8}
                count={100}
                placeholder='请详细描述您的还款问题'
                {...getFieldProps('content', {
                    rules: [{
                        required: true,
                        message: '内容不能为空'
                    }]
                })}/>
                {
                    // {!platform.isAndroid && <div className='subtitle'>上传图片</div>}
                    // {!platform.isAndroid && <ImagePicker
                    //         files={files}
                    //         selectable={files.length < 3}
                    //         onChange={this.onChange.bind(this)}/>
                    // }
                }
                <div className='subtitle'>上传图片</div>
                <ImagePicker
                files={files}
                selectable={files.length < 3}
                onChange={this.onChange.bind(this)}/>

                <Button
                type='primary'
                disabled={!lock || loading}
                loading={loading}
                className={classnames({
                    'button-submit': true,
                    'button-round': true,
                    'button-loading': !loaded,
                    // 'button-disabled': disabled
                })}
                onClick={this.submit.bind(this)}>保存</Button>
            </div>
        )
    }
};

export default createForm()(Feedback);