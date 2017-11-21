/* eslint-disable */
import React, {Component} from 'react';
import {Toast, Icon, Modal, Button} from 'antd-mobile';
import classnames from 'classnames';
import request from 'common/request';
import {redirect, login, resolveUrl as url, platform} from 'utils';
import 'scss/mobile/repayment/alipay.component.scss';

const title = '支付宝';
let timer;
function callAlipay(gourl){
	if(gourl){
		var urlscheme = 'alipays';
		if(platform.isIos) {
			urlscheme = 'alipay';
		}
		var p = 'platformapi';
		var sm = '11';
		var s = '100000' + sm; 
		var gopage = urlscheme + '://' + p + '/startApp?appId=' + s + '&url=' + encodeURIComponent(gourl);
		window.location.href = gopage;
	}
}

export default class alipay extends Component{
	state = {
		count: 5,
		awaken: true,
		loaded: false,
		lock: true
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
		let {orderId, amount} = this.props.location.query;
		document.title = title;
		Toast.loading(undefined, 0);
		request('v2/credit-card/get-ali-pay-args', {
			params: {
				orderId,
				amount
			}
		}).then(response => {
			Toast.hide();
			this.countdown();
			this.setState({
				alipayParams: response.data,
				loaded: true
			});
			setTimeout(() => {
				this.awaken();
			});
		}).catch(response => {
			let {code, message} = response;
			if(code == -2){
				Toast.hide();
				Modal.alert('提 示', message, [{
                    text: '确 定',
                    onPress(){
                        login();
                    }
                }])
			}else{
				Toast.fail(message, 3, () => {
					redirect.goBack();
				});
			}
		});
		window.alipayQuery = () => {
		    this.query();
		};
	}
	countdown(){
		let {count} = this.state;
		count--;
		timer = setInterval(() => {
			if(count <= 0){
				timer && clearInterval(timer);
				
			}
			this.setState({
				count: count--
			});
		}, 1000);
	}
	awaken(){
		let {alipayParams} = this.state;
		try{
			callAlipay(alipayParams);
			setTimeout(() => {
				this.setState({awaken: false});
			}, 5000);
		}catch(error){
			this.setState({awaken: false});
			Toast.fail('未能打开支付宝客户端');
		}
	}
	query(){
		let {lock} = this.state;
		let {orderId} = this.props.location.query;
		if(lock){
			this.setState({lock: false});
			request('v2/credit-card/ali-query', {
				params: {
					orderId
				}
			}).then(response => {
				let {message, return_url} = response;
				let {msg, trade_state} = response.data;
				this.setState({lock: true});
				if(trade_state != 9){
					this.result();
				}
			}).catch(response =>{
				let {code, message} = response;
				if(code == -2){
					Toast.hide();
					Modal.alert('提 示', message, [{
	                    text: '确 定',
	                    onPress(){
	                        login();
	                    }
	                }])
				}else{
					Toast.fail(message);
				}
				this.setState({lock: true});
			});
		}
	}
	repayment(){
		let {orderId} = this.props.location.query;
		window.location.href = url(`http://m.xianjincard.com/loan/loan-repayment-type?id=${orderId}`);
	}
	result(){
		let {orderId, amount} = this.props.location.query;
		redirect.replace(`/mobile/repayment/result/${orderId}?alipays&orderId=${orderId}&amount=${amount}`);
	}
	render(){
		let {count, awaken, loaded} = this.state;
		return (
			<div className={classnames({
				'wrapper wrapper-repayment-alipay': true,
				loaded
			})}>
				<div className='logo'/>
				{awaken ?
					<div className='loading'>
						<div className='tips'>正在打开支付宝客户端</div>
						{count ? <div className='loader'>{count}</div> : <Icon type='loading'/>}
					</div>
				:
				<div className='awaken'>
					<div className='tips'>
						<p>1.如果您支付成功，请点击【已完成还款】</p>
						<p>2.如果您支付遇到问题，可点击【选择其他还款方式】</p>
						<p>温馨提示：请先安装支付宝APP</p>
					</div>
					<div className='handle'>
						<Button type='primary' onClick={this.repayment.bind(this)}>选择其他还款方式</Button>
						<Button type='ghost' onClick={this.result.bind(this)}>已完成还款</Button>
					</div>
				</div>
				}
			</div>
		);
	}
};