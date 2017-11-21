import React, {Component} from 'react';
import classnames from 'classnames';
import {goHome} from 'utils';
import 'scss/activity/privilege.component.scss';

/*
* 默认 第二单半价
* 1 九单五折
* 2 神秘大礼
* 3 首借专享
* 4 五单五折
* 5 服务费减半
* 6 提额10%+
*/
const data = [{
	name: '二单半价',
	className: 'second-half',
	description: {
		title: '第二单半价',
		content: '正常还款首笔借款后，24小时内借第二单立享借款综合服务费<span>减半特权</span>。'
	}
}, {
	name: '九单五折',
	className: 'ninth-half',
	description: {
		title: '九单五折',
		content: '正常还款八笔借款后，24小时内第九单立享借款综合服务费<span>半价特权</span>。'
	}
}, {
	name: '神秘大礼',
	className: 'gold-card',
	description: {
		title: '神秘大礼',
		content: '为了感谢您在平台的良好信用，特为你开通<span>金卡借款通道</span>。'
	}
}, {
	name: '首借专享',
	className: 'interest-free',
	description: {
		title: '首借本息全免',
		content: '每天定点放出300个名额，按完成借款时间先后顺序为准，先到先得。',
		buttonText: '点击领取'
	}
}, {
	name: '五单五折',
	className: 'fifth-half',
	description: {
		title: '五单五折',
		content: '正常还款四笔借款后，24小时内第五单立享借款综合服务费<span>半价特权</span>。'
	}
}, {
	name: '服务费减半',
	className: 'service-charge',
	description: {
		title: '服务费减半（50%）',
		content: '<span orange>【老用户特权】</span>正常还款后24小时内，进行再次申请时，即有机会<span>在还款时享受半价机会</span>！',
		buttonText: '马上申请',
		introduce: ['随机抽取']
	}
}, {
	name: '提额10%+',
	className: 'lift-tenPercent',
	description: {
		title: '提额10%+ (100~300元）',
		content: '<span orange>【老用户特权】</span>正常还款后的24小时内，进行再次申请，即有机会享受临时额度提升至少10%（100-300元）！',
		buttonText: '马上申请',
		introduce: ['随机抽取']
	}
}];

const Cards = props => {
	let {title} = props;
	return (
		<div className='card'>
			<div>
				<p className='title'>卡迷特权营之</p>
				<p>{title}</p>
			</div>
			<div className='icon'/>
		</div>
	)
}

export default class index extends Component{
	state = {
		loaded: 1
	}
	constructor(props){
		super(props)
	}
	componentDidMount(){
		document.title = '卡迷特权营';
	}
	render(){
		let {loaded} = this.state;
		let {type = 0} = this.props.location.query;
		let card = (item, index) => {
			let {name, className, description} = item;
			let {introduce} = description;
			if(type != index) return;
			return (
				<div key={index} className={className}>
					<Cards title={name}/>
					<div className='description'>
						<div className='title'>{description.title}</div>
						<p dangerouslySetInnerHTML={{__html: description.content}}/>
						{(introduce && introduce.length) ? 
							<ul>
								{introduce.map((data, index) => (
									<li key={index}>{data}</li>
								))}
							</ul>
						: ''}
						{description.buttonText ? <div className='button' onClick={() => goHome()}>{description.buttonText}</div> : ''}
					</div>
				</div>
			);
		}
		return (
			<div className='wrapper wrapper-activity-privilege loaded'>
				{data.map(card)}
			</div>
		);
	}
};