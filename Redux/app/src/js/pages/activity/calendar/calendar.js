/* eslint-disable */
import React, {Component} from 'react';
import {Carousel, Toast, List, Button} from 'antd-mobile';
import classnames from 'classnames';
import request from 'common/request';
import {redirect, statistics, hrefNative, platform} from 'utils';
import moment from 'common/moment';
import 'scss/activity/calendar.component.scss';

const Item = List.Item
const Brief = Item.Brief
const title = '活动日历';
const RETRY_TEXT = '系统繁忙，请稍后重试';
const date = moment()
const month = date.get('month');
const {_monthsShort: Month} = moment().localeData();
const Weeks = ['一', '二', '三', '四', '五', '六', '日'];

const calendars = [{
	key: 1
}, {
	key: 2
}];

calendars.map((calendar, index) => {
	let today = date.clone().add(15 * index, 'days');
	let days = [];
	let startTime;
	let endTime;
	// console.log(titleDate.format('MM月DD日'))
	if(today.get('date') <= 15){
		startTime = today.clone().set('date', 1);
		endTime = today.clone().set('date', 15);
	}else{
		startTime = today.clone().set('date', 16);
		endTime = today.clone().set('date', today.daysInMonth());
	}
	let dayOfWeek = startTime.clone().days();
	let diff = endTime.diff(startTime, 'days', true) + 1;
	let start = Math.ceil((dayOfWeek + diff) / 7);
	calendar.title = `${startTime.format('MM月D日')} - ${endTime.format('MM月D日')}`;
	for(let i = 0;i < start;i++){
		let week = [];
		for(let k = 1;k < 8;k++){
			let id = 7 * i + k;
			let now = id - dayOfWeek + 1;
			let current = startTime.clone().day(id);
			let value = current.format('D');
			// console.log(value);
			if(current.isBefore(startTime) || current.isAfter(endTime)){
				value = undefined;
			}else{
			}
				week.push({
					value,
					date: current
				});
		}
		days.push(week);
	}
	calendar.days = days;
});

export default class calendar extends Component{
	state = {
		index: 0,
		loaded: 0
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
	click(link, name){
		if(link){
			statistics({
				type: 'activity/calendar',
				tag: name
			}).then(() => {
				window.location.href = link
			})
		}
	}
	componentDidMount(){
    document.title = title
		statistics({
			type: 'activity/calendar',
			tag: '访问量'
		})
		request.post('activity/activity-date/calendar').then(response => {
			let {button_column, gallery, activity, events} = response.data;
			let colors = [];
			(activity && activity.length) && activity.map(data => {
				let {weeks} = data;
				if(weeks && weeks.length){
					weeks.split(',').map((week, index) => {
						colors[week - 1] = data.color || undefined;
					});
				}
			});
			this.setState({
				button_column,
				colors,
				gallery,
				activity,
				events,
				loaded: 1
			});
		}).catch(response => {
			let {code, message} = response;
			Toast.fail(RETRY_TEXT, () => {
				redirect.goBack();
			})
		})
	}
	removeProtocol(url, all){
		let match = all ? new RegExp('(https?):', 'g') : new RegExp('^(https?):');
		return url ? url.replace(match, '') : url;
	}
	render(){
		let {button_column, colors, gallery, activity, events, index, loaded} = this.state;
		let Day = (data, index) => {
			let event;
			for(let i in events){
				if(events && events.length){
					if(data.value && moment(data.date.format('YYYY-MM-DD')).isSame(events[i].date)){
						event = events[i];
						break;
					}
				}
			}
			return (
				<td
				key={index}
				onClick={() => event ? this.click(event.link , `days-${event.name}`) : false}
				className={classnames({
					active: event,
					closed: event && !event.status
				})}>
					<div
					className='day'>{data.value}</div>
					{event ? (<div className='event'>{event.name}</div>) : ''}
				</td>
			);
		}
		return (
			<div className={classnames({
				'wrapper wrapper-activity-calendar': true,
				loaded
			})}>
				{(gallery && typeof gallery === 'object' && (gallery.title || gallery.banner)) ?
					<div
					className='banner'
					onClick={() => redirect.push('/activity/calendar/today')}
					style={{backgroundImage: gallery.banner ? `url(${this.removeProtocol(gallery.banner)})` : false}}>
						<div className='date'>
							<div className='day'>{date.format('DD')}</div>
							<div className='year-month'>
								<p>{date.format('dddd')}</p>
								<p>{date.format('YYYY年')}{Month[month]}月</p>
							</div>
						</div>
						<div className='title'>{gallery.title}</div>
					</div>
				: ''}
				
				<div className='subject'>
					<div className='slogan'>在这里，每一个人都会成为现金卡达人哦！</div>
					<div className='signin' onClick={() => redirect.push('/signin')}>签到</div>
				</div>
				<div className='main'>
					<div className='tabs'>
						{calendars.map((calendar, i) => (
							<div
							key={i}
							onClick={() => this.setState({index: i})}
							className={classnames({
								tab: true,
								active: i === index
							})}>{calendar.title}</div>
						))}
					</div>
					<div className='calendar'>
						{(activity && activity.length) ?
							<div className='activity'>
								{activity.map((data, index) => (
									<span
									key={index}
									onClick={() => this.click(data.link, `week-${data.name}`)}
									style={{
										width: data.weeks ? (`${14.28 * data.weeks.split(',').length}%`) : false,
										left: data.weeks ? (`${14.28 * (data.weeks.split(',')[0] - 1)}%`) : 0,
										backgroundImage: data.image ? `url(${data.image})` : false
									}}>{data.name}</span>
								))}
							</div>
						: ''}
						<table>
							<thead>
								<tr className='week'>
									{Weeks.map((week, index) => (
										<th
										key={index}
										style={{
											color: (colors && colors[index]) ? '#fff' : false,
											backgroundColor: (colors && colors[index]) ? colors[index] : false
										}}
										>{week}</th>
									))}
								</tr>
							</thead>
							{calendars.map(({days}, iii) => (
								<tbody key={iii} className={classnames({active: index == iii})}>
									{days.map((day, ii) => (
										<tr key={ii}>
											{day.map(Day)}
										</tr>
									))}
								</tbody>
							))}
						</table>
					</div>
				</div>
				{(button_column && Array.isArray(button_column)) ?
					<List className='article'>
						{button_column.map(((data, index) => (
							<Item key={index} extra={data.button ? <Button type='primary' size='small' onClick={() => {
								if(!platform.isApp || data.app == ''){
									window.location.href = data.link
								}else{
									hrefNative(data.app)
								}
							}} inline>{data.button}</Button> : false}>
								<div className='title' dangerouslySetInnerHTML={{__html: data.text}}/>
								{
									// <Brief>
									// 	<div className='subtitle' dangerouslySetInnerHTML={{__html: data.text}}/>
									// </Brief>
								}
							</Item>
						)))}
					</List>
				: false}
			</div>
		);
	}
};
