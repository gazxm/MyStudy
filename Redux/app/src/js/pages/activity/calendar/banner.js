/* eslint-disable */
import React, {Component} from 'react';
import classnames from 'classnames';
import moment from 'common/moment';
import {resolveUrl as url, platform, partake, redirect} from 'utils';
import request from 'common/request';
import 'scss/activity/calendar-banner.component.scss';

const date = moment();
const month = date.get('month');
const {_monthsShort: Month} = moment().localeData();
const Weeks = ['一', '二', '三', '四', '五', '六', '日'];
let timestamp = Math.ceil(new Date(moment().format('YYYY-MM-DD')).getTime() / 1000);

export default class banner extends Component{
	state = {
		loaded: 0
	}
	constructor(props){
		super(props)
	}
	componentDidMount(){
		request.post('/oc/daily-sign/index', {
			// strtotime: timestamp
		}).then(response => {
			let {title, image, front_image} = response.data;
			front_image && (image = front_image);
			this.setState({
				title,
				image,
				front_image,
				loaded: true
			});
		});
	}
	removeProtocol(url, all){
		let match = all ? new RegExp('(https?):', 'g') : new RegExp('^(https?):');
		return url ? url.replace(match, '') : url;
	}
	render(){
		let {title, image, front_image, loaded} = this.state;
		return (
			<div
			onClick={() => window.location.href = url('http://h.xianjincard.com/activity/calendar/today')}
			className={classnames({
				'wrapper wrapper-activity-calendar-banner': true,
				loaded
			})}>
				<div
				className={classnames({
					banner: true,
					front: front_image
				})} style={{
					backgroundImage: image ? `url(${this.removeProtocol(image)})` : false
				}}>
					<div className='date'>
						<div className='day'>{date.format('DD')}</div>
						<div className='year-month'>
							<p>{date.format('dddd')}</p>
							<p>{date.format('YYYY年')}{date.format('MM')}月</p>
						</div>
					</div>
					<div className='title'>{title}</div>
				</div>
			</div>
		);
	}
};