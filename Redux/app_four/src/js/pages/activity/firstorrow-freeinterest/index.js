import React, {Component} from 'react';
import {Modal, Toast} from 'antd-mobile';
// import request from './request';
import Register from 'components/Register';
import {forwardApp as download} from 'utils';

import classnames from 'classnames';
import 'scss/components/reboot.component.scss';
import 'scss/activity/firstorrow-freeinterest.component.scss';

let title = '首借免息';
let lock = true;

export default class Welcome extends Component{
    constructor(props){
        super(props);
        this.state = {
            rules: 0,
            download: 0,
            loaded: 1
        };
    }
    componentDidMount(){
        document.title = title;
    }
    success(){
        // console.log('success');
    }
    error(code, message){
        console.log(message);
    }
    rules(){
        this.setState({
            rules: 0
        })
    }
    download(){
        this.setState({
            download: 0
        })
    }
    render(){
        let {rules, download, loaded} = this.state;
        return (
            <div className={classnames({wrapper: true, loaded})}>
                <Register query={{
                    appMarket: 1   
                }}
                buttonText={'小手一抖 现金到手'}
                footer={(
                    <div className='rule' onClick={this.rules.bind(this)}>活动规则</div>
                )}/>
                <div className='footer'>
                    <p>投资有风险 入市需谨慎</p>
                    <p>
                        <span>上海浅橙网络科技有限公司</span>
                        <span>沪ICP备16040623号-1</span>
                    </p>
                </div>
                <Modal className='download' visible={download} onClose={this.download.bind(this)} maskClosable={true} transparent>
                    <h5>恭喜你注册成功</h5>
                    <div className='button'>下载APP</div>
                </Modal>
            </div>
        );
    }
};