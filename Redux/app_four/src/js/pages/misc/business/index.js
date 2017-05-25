import qs from 'qs';
import React, {Component} from 'react';
import {Picker, List, InputItem, TextareaItem, Modal, Toast} from 'antd-mobile';
import Register from 'components/Register';
import {forwardApp as download} from 'utils';

import classnames from 'classnames';
import 'scss/components/reboot.component.scss';
import 'scss/misc/business.component.scss';
import data from './data';

const Item = List.Item;

let title = '招募合作';
let lock = true;
let url = '//apimerchant.xianjincard.com/interface/save-apply-info';
let timer;

const ID = `jsonp${Date.now()}`;
function request(data = {}){
    let script = document.getElementById(ID)
    let element = script || document.createElement('script');

    !!!script && (element.id = ID, document.body.appendChild(element));

    data.v = Date.now();
    data.callback = 'callback';
    element.src = `${url}?${qs.stringify(data)}`;
}
// jsonp callback
window.callback = response => {
    let {code, message} = response;
    if(code != 0){
        Toast.fail(message, 1)
    }else{
        Modal.alert('系统提示', message);
        let forms = document.querySelectorAll('input,textarea');
        for(let i in forms){
            if(forms.hasOwnProperty(i)){
                forms[i].value = '';
            }
        }
    }
    lock = true;
};

export default class Welcome extends Component{
    constructor(props){
        super(props);
        this.state = {
            areas: '',
            value: undefined,
            loaded: 1,
            lock: 0,
            visible: 0
        };
    }
    componentDidMount(){
        document.title = title;
    }
    areas(value){
        this.setState({
            value
        });
    }
    format(values){
        let areas = values.join(' ');
        setTimeout(() => {
            this.setState({
                areas
            });
        });
        return areas;
    }
    remark(remark){
        this.setState({
            remark
        });
    }
    submit(){
        let {areas, lock} = this.state;
        let {
            channel_name: {refs: {input: channel_name}},
            relation_name: {refs: {input: relation_name}},
            relation_phone: {refs: {input: relation_phone}},
            remark: {refs: {textarea: remark}},
        } = this.refs;
        
        if(!!!lock){
            if(!!!channel_name.value){
                Toast.offline('渠道商名称不能为空', 1, () => {
                    channel_name.focus();
                });
                return;
            }else if(!!!relation_name.value){
                Toast.offline('姓名不能为空', 1, () => {
                    relation_name.focus();
                });
                return;
            }else if(!!!relation_phone.value){
                Toast.offline('电话不能为空', 1, () => {
                    relation_phone.focus();
                });
                return;
            }else if(!!!areas){
                Toast.offline('合作地区不能为空');
                return;
            }else if(!!!remark.value){
                Toast.offline('备注不能为空', 1, () => {
                    remark.focus();
                });
                return;
            }
            lock = !lock;
            request({
                channel_name: channel_name.value,
                channel_area: areas,
                relation_name: relation_name.value,
                relation_phone: relation_phone.value,
                remark: remark.value
            });
        }

    }
    render(){
        let {remark, value, loaded, lock, visible} = this.state;
        return (
            <div className={classnames({wrapper: true, loaded})}>
                <div className='form'>
                    <div className='form-group'>
                        <InputItem  ref='channel_name' name='channel_name' placeholder='渠道商名称'/>
                    </div>
                    <div className='form-group form-inline'>
                        <InputItem ref='relation_name' name='relation_name' placeholder='姓名'/>
                        <InputItem ref='relation_phone' name='relation_phone' placeholder='电话'/>
                    </div>
                    <div className='form-group'>
                        <Picker className='areas' cols={2} data={data} value={value} extra='合作区域' format={this.format.bind(this)} onChange={this.areas.bind(this)} onPickerChange={this.areas.bind(this)}>
                            <Item className={classnames({'am-area-item': true, active: !!value})} arrow='down'></Item>
                        </Picker>
                    </div>
                    <div className='form-group'>
                        <TextareaItem onChange={this.remark.bind(this)} ref='remark' name='remark' value={remark} rows={5} count={140} placeholder='备注内容（团队介绍、账务的资源情况等）'/>
                    </div>
                    <div className='form-group'>
                        <div className={classnames({'button-submit': true, disabled: lock})} onClick={this.submit.bind(this)}>确认提交</div>
                    </div>
                </div>
            </div>
        );
    }
}