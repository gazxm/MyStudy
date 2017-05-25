/* eslint-disable */
import React, {Component, createClass} from 'react';
import {List, InputItem, TextareaItem, Button, Tag, Toast} from 'antd-mobile';
import {createForm} from 'rc-form';
import classnames from 'classnames';
import 'scss/mobile/feedback.component.scss';
import request from 'common/request';
import {resolveUrl as url, redirect, hrefNative as native, platform, login} from 'utils';

const RETRY_TEXT = '系统繁忙，请稍后重试';

class Feedback extends Component{
    static contextTypes = {
        router: React.PropTypes.object.isRequired
    }
    state = {
        tag: 0,
        lock: true,
        // 数据加载完毕
        loaded: false,
        // request loading
        loading: false,
        placeholder: undefined
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
        let {type = 1} = this.props.location.query;
        let title = type == 1 ? '意见反馈' : '催收投诉';
        document.title = title;
        if(type != 1){
            request('credit-info/feedback').then(response => {
                let {sub_type} = response.data;
                let tags = [];
                for(let i in sub_type){
                    tags.push({
                        id: i,
                        name: sub_type[i]
                    });
                }
                this.setState({
                    tags,
                    placeholder: '请输入您的投诉内容',
                    loaded: 1,
                    type
                });
            }).catch(this.middleware.bind(this));
        }else{
            this.setState({
                placeholder: '请输入您的反馈意见，我们会为您不断改进',
                loaded: 1,
                type
            });
        }
    }
    middleware(response){
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
            Toast.fail(message, () => {
                this.setState && this.setState({lock: 1, loaded: 1, loading: 0});
            });
        }
    }
    submit(){
        let {getFieldInstance, getFieldsValue, setFieldsValue, validateFields} = this.props.form;
        validateFields((errors, values) => {
            if(errors){
                for(let i in errors){
                    let input = errors[i];
                    input.errors && input.errors.map(error => {
                        Toast.offline(error.message, 1.5, () => {
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
                let {lock, type} = this.state;
                let {order_id} = this.props.location.query;
                let {tag, content} = getFieldsValue();
                if(lock){
                    this.setState({lock: 0, loading: 1});
                    let data = {type: type == 1 ? 0 : 1, content};
                    let start = Date.now();
                    if(type != 1){
                        data.sub_type = tag
                        order_id && (data.order_id = order_id);
                    }

                    request.post('credit-info/feedback', data).then(response => {
                        let end = Date.now();
                        let timeout = 0;
                        if(end - start < 1000) timeout = 1000;
                        if(end - start > 1000) timeout = 0;
                        let {message} = response;
                        setTimeout(() => {
                            Toast.success(message, 1.5);
                            setFieldsValue({content: '', tag: undefined});
                            this.setState({lock: 1, loading: 0, tag: undefined});
                        }, timeout);
                    }).catch(this.middleware.bind(this));
                }
            }
        });
    }
    tag(id){
        let {tag} = this.state;
        let {getFieldValue, setFieldsValue} = this.props.form;
        tag != id ? (tag = id) : (tag = undefined);
        setFieldsValue({tag})
        this.setState({tag});
    }
    render(){
        let {form: {getFieldProps}} = this.props;
        let {type, tag, tags = [], placeholder, lock, loaded, loading} = this.state;
        let editable = !loading && loaded && lock;
        return (
            <div className={classnames({'wrapper wrapper-mobile wrapper-settings-feedback': true, loaded})}>
                {(tags && tags.length) ?
                    <div className='tags'>
                        <div className='title'>请选择投诉类型</div>
                        <Tag className='hidden'/>
                        <InputItem
                        className='hidden'
                        {...getFieldProps('tag', {
                            rules: [{
                                required: true,
                                message: '请选择投诉类型'
                            }]
                        })}/>
                        {tags.map((data, index) => (
                            <div key={index} className={classnames({
                                'am-tag': true,
                                'am-tag-normal': tag != data.id,
                                'am-tag-active': tag == data.id
                            })} onClick={this.tag.bind(this, data.id)}>
                                <div className='am-tag-text'>{data.name}</div>
                            </div>
                        ))}
                    </div>
                : ''}
                <TextareaItem
                autoFocus
                editable={editable}
                rows={8}
                count={160}
                placeholder={placeholder}
                {...getFieldProps('content', {
                    rules: [{
                        required: true,
                        message: '内容不能为空'
                    }]
                })}/>
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
                {(type == 1) ? 
                    <div>
                        <div className='custom-service-header'>
                            <div className='icon'/>
                            <div className='details'>
                                <p>客服工作时间</p>
                                <span>9:00 ~ 18:00</span>
                            </div>
                        </div>
                        <div className='custom-service'>
                            <a href='mqqwpa://im/chat?chat_type=crm&uin=938179310&version=1&src_type=web&web_src=file:://'>在线客服</a>
                            <a href='tel:400-681-2016'>电话客服</a>
                        </div>
                    </div>
                : ''}
            </div>
        )
    }
};

export default createForm()(Feedback);