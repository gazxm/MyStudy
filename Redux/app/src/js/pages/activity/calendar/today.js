/* eslint-disable */
import React, {Component} from 'react';
import classnames from 'classnames';
import moment from 'common/moment';
import {platform, partake} from 'utils';
import request from 'common/request';
import lrz from 'lrz';
import {Toast} from 'antd-mobile';
import html2canvas from 'html2canvas';
import 'scss/activity/calendar-today.component.scss';
import qrcode from '../../../../assets/img/activity/calendar/today/qrcode.nolimit.png';


const title = '日签活动';
const date = moment()
const month = date.get('month');
const {_monthsShort: Month} = moment().localeData();
const Weeks = ['一', '二', '三', '四', '五', '六', '日'];

// function getDataURL(url){
// 	return new Promise(async (resolve, reject) => {
// 		let canvas = document.createElement('canvas');
// 		let context = canvas.getContext('2d');
// 		let image = new Image();
// 			image.style.position = 'absolute';
// 			image.src = url;
// 			image.crossOrigin = 'anonymous'
// 			image.onload = await function(){
// 				canvas.width = this.width;
// 				canvas.height = this.height;
// 				context.drawImage(this, 0, 0);
// 				this.remove();
// 				try{
// 					console.log(canvas.toDataURL('image/png'));
// 					resolve(canvas.toDataURL('image/png'));
// 				}catch(error){
// 					let {message} = error;
// 					Toast.fail(message);
// 				}
// 			}
// 			image.onerror = reject;
// 	})
// }

export default class today extends Component{
	state = {
		loaded: 0
	}
	constructor(props){
		super(props);
	}
	componentDidMount(){
		document.title = title;
		request.post('/oc/daily-sign/detail', {
			strtotime: moment().format('X')
		}).then(async response => {
			let {title, suitable, taboo, image, front_image, date: time} = response.data;
			this.setState({
				title, suitable, taboo, image, front_image, time,
				loaded: true
			});
		});
	}
	async share(platform){
		let {wrapper} = this.refs;
		let element = wrapper.cloneNode(true);
		let share = element.querySelector('.share');
		(share && share.remove) && share.remove();
		element.className = element.className.replace(/loaded/, '');
		document.body.appendChild(element);
		let canvas = await html2canvas(element, {background: '#fff'});
		let thumb = await lrz(canvas.toDataURL(), {width: canvas.width / 3});
		partake({
			share_title: '日签活动',
			share_body: '',
			share_url: window.location.href,
			share_logo: canvas.toDataURL(),
			thumb_logo: thumb.base64,
			platform,
			type: 2,
			share_type: 1
		});
		setTimeout(() => {
			element && element.remove();
		});
		
	}
	removeProtocol(url, all){
		let match = all ? new RegExp('(https?):', 'g') : new RegExp('^(https?):');
		return url ? url.replace(match, '') : url;
	}
	render(){
		let {title, suitable, taboo, image, front_image, time, loaded} = this.state;
		return (
			<div ref='wrapper' className={classnames({
				'wrapper wrapper-activity-calendar-today': true,
				loaded
			})}>
				<div className='main' style={{
					backgroundImage: image ? `url(${image})` : false
				}}>
					{front_image ? <div className='front_image' style={{backgroundImage: `url(${front_image})`}}/> : ''}
					<div className='themes'>
						<div className='element knot-left'/>
						<div className='element knot-right'/>
						<div className='element cloud-left'/>
						<div className='element cloud-right'/>
					</div>
					<div className='date'>
						<div className='year-month'>{date.format('YYYY年MM月')}</div>
						<div className='lunar'>【农历{time}】</div>
						<div className='day'>{date.format('D')}</div>
						<div className='arrow'/>
						<div className='week'>{date.format('dddd')}</div>
					</div>
					<div className='subject'>{title}</div>
					<div className='tips'>
						<div className='suitable'>{suitable}</div>
						<div className='taboo'>{taboo}</div>
					</div>
				</div>
				<div className='footer'>
					{platform.isApp ?
					<div className='share'>
						<div className='title'><span>分享给好友 开启一天好时光</span></div>
						<div className='content'>
							<div className='wechat needsclick' onClick={this.share.bind(this, 'WEIXIN')}/>
							<div className='friends needsclick' onClick={this.share.bind(this, 'WEIXIN_CIRCLE')}/>
							<div className='weibo needsclick' onClick={this.share.bind(this, 'SINA')}/>
						</div>
					</div>
					: ''}
					<div className='download'>
						<div>
							<div className='picture logo'/>
							<p>扫描识别二维码</p>
						</div>
						<div>
							<div className='picture'><img src={qrcode}/></div>
							<p>领取新手大礼包</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
};