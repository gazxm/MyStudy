/* eslint-disable */
import React, {Component, createClass} from 'react';
import PropTypes from 'prop-types';
import {List, InputItem, Button, Picker, Toast, Checkbox} from 'antd-mobile';
import {createForm} from 'rc-form';
import classnames from 'classnames';
import 'scss/mobile/certification-layout.component.scss';
import 'scss/mobile/operators.component.scss';
import request from 'common/request';
import {resolveUrl as url, redirect, hrefNative as native, platform} from 'utils';

const CheckboxItem = Checkbox.CheckboxItem;
const AgreeItem = Checkbox.AgreeItem;

const title = '手机运营商';

let timer;

class Operator extends Component{
    static contextTypes = {
        router: PropTypes.object.isRequired
    }
    state = {
        lock: true,
        // 数据加载完毕
        loaded: false,
        // request loading
        loading: false,
        agree: 1,
        // 按钮文案
        buttonText: this.props.READY_TEXT
    }
    constructor(props){
        super(props);
    }
    componentDidMount(){
        document.title = title;
        try{
            document.domain = 'xianjincard.com';
        }catch(e){};
        let {loaded, formatPickerData, middleware, nextStepLink, getButtonText, hideSteps, route} = this.props;
        let {buttonText} = this.state;
        let {router} = this.context;
        let {operator} = this.refs;
        window.operatorSuccess = () => {
            if(platform.isApp){
                native(12);
            }else{
                setTimeout(nextStepLink(route));
            }
        }
        {
            let step = document.body.querySelector('.am-steps');
            let stepHeight = 0;
            if(step){
                stepHeight = step.scrollHeight + step.style.marginTop + step.style.marginBottom;
            }
            operator.width = document.body.scrollWidth;
            operator.height = document.body.scrollHeight - stepHeight;
        }
        loaded();
    }
    submit(){
        let {COMPLETED_TEXT, nextStepLink, route, middleware} = this.props;
        let {getFieldInstance, getFieldsValue, validateFields} = this.props.form;
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
                            }
                        });
                    });
                    break;
                }
            }else{
                let {lock, buttonText} = this.state;
                let {service_password} = getFieldsValue();
                if(lock){
                    this.setState({lock: 0, loaded: 0, loading: 1});
                    let start = Date.now();
                    request.post('credit-info/post-service-code', {
                        p: service_password
                    }).then(response => {
                        let end = Date.now();
                        let timeout = 0;
                        if(end - start < 1000) timeout = 1000;
                        if(end - start > 1000) timeout = 0;
                        let {message} = response;
                        setTimeout(() => {
                            Toast.success(message, 3, () => {
                                buttonText = COMPLETED_TEXT;
                                setTimeout(nextStepLink(route));
                            });
                            this.setState({lock: 1, loaded: 1, loading: 0, disabled: 1, buttonText});
                        }, timeout);
                    }).catch(middleware.bind(this));
                }
                
            }
        });
    }
    render(){
        let {form: {getFieldProps}, label} = this.props;
        let {
            lock,
            loaded,
            loading,
            disabled,
            phone,
            status,
            agree,
            buttonText,
            verify
        } = this.state;
        let editable = !loading && loaded && lock;
        return (
            <div className='operator loaded'>
                <iframe ref='operator' src={url('http://credit.xianjincard.com/credit-web/verification-jxl')}/>
            </div>
        )
    }
};

export default createForm()(Operator);