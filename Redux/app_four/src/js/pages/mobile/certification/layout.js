/* eslint-disable */
import React, {Component} from 'react';
import {Steps, Modal, Toast} from 'antd-mobile';
import classnames from 'classnames';
import 'scss/mobile/certification-layout.component.scss';
import request from 'common/request';
import {login, redirect, platform} from 'utils';

import basics from './basics';

const READY_TEXT = '正在准备数据';
const COMPLETED_TEXT = '保存';

let Step = Steps.Step;

export default class CertificationLayout extends Component{
    state = {
        steps: [],
        visible: 1,
        current: 0,
        loaded: 0
    }
    constructor(props){
        super(props);
        request.interceptors.response.use(response => {
            let {code, message} = response;
            if(code == -2){
                let modal = document.querySelector('.am-modal');
                if(!modal){
                    Modal.alert('提 示', message, [{
                        text: '确 定',
                        onPress(){
                            login();
                        }
                    }])
                }
                return Promise.reject(response);
            }else if([0, -2].indexOf(code) == -1){
                return Promise.reject(response);
            }
            return Promise.resolve(response);
        }, error => {
            return Promise.reject(error);
        });

    }
    componentDidMount(){
        this.loadSteps.bind(this)();
    }
    middleware(response){
        let {code, message} = response;
        Toast.hide();
        if([0, -2].indexOf(code) == -1){
            Toast.fail(message);
        }
        setTimeout(() => {
            this.setState({lock: 1, loaded: 1, loading: 0});
        });
    }
    step(current = 0){
        this.setState({
            current
        });
    }
    loadSteps(){
        request('credit-card/get-verification-step').then(response => {
            let {item: {list: steps, pass_index: current, pass_verify, is_show_progress}} = response.data;
            steps.map(step => {
                basics.map(basic => {
                    if(step.tag_id == basic.id){
                        step.name = basic.name;
                        step.link = basic.link;
                    }
                });
            });
            this.setState({
                steps,
                current: current - 1,
                visible: !platform.isApp && !pass_verify,
                loaded: 1
            });
        }).catch(this.middleware.bind(this));
    }
    hideSteps(){
        this.setState({visible: 0})
    }
    loaded(){
        this.setState({
            loaded: 1
        });
    }
    label(name){
        if(name && name.length > 1){
            name = name.split('').map(value => {
                return `<span>${value}</span>`;
            }).join('');
        }
        return <p className='label' dangerouslySetInnerHTML={{__html: name}}/>;
    }
    nextStepLink(route){
        let {path} = route;
        let {steps} = this.state;
        let url;
        for(let i = 0;i < steps.length;i++){
            let {name, link} = steps[i];
            let next = steps[i + 1];
            if(name == path && next){
                url = next.link;
                break;
            }
        }
        if(url){
            this.loadSteps.bind(this)();
            redirect.replace(url);
        }else{
            redirect.push('/mobile/loan/1/14/1000');
        }
    }
    getButtonText(route){
        let text = COMPLETED_TEXT;
        // let {path} = route;
        // let {steps} = this.state;

        // for(let i = 0;i < steps.length;i++){
        //     let {name, link, button_text} = steps[i];
        //     if(name == path){
        //         text = button_text;
        //         break;
        //     }
        // }
        return text;
    }
    formatPickerData(data){
        data.label = data.name || data.bank_name;
        data.value = data.type || data.work_type || data.degrees || data.live_time_type || data.marriage || data.bank_id;
    }
    render(){
        let {steps, visible, current, loaded} = this.state;
        return (
            <div className={classnames({'wrapper wrapper-mobile wrapper-mobile-certification': true, loaded})}>
                {(visible && false) && 
                    <Steps className='am-steps-certification' current={current} direction='horizontal'>
                        {steps.map((step, index) => (
                            <Step key={index} title={step.title} description={step.data || ' '}/>
                        ))}
                    </Steps>
                }
                {loaded ? React.cloneElement(this.props.children, {
                    READY_TEXT,
                    COMPLETED_TEXT,
                    step: this.step.bind(this),
                    loaded: this.loaded.bind(this),
                    label: this.label,
                    formatPickerData: this.formatPickerData,
                    middleware: this.middleware,
                    nextStepLink: this.nextStepLink.bind(this),
                    hideSteps: this.hideSteps.bind(this),
                    getButtonText: this.getButtonText.bind(this)
                }) : ''}
            </div>
        );
    }
};
