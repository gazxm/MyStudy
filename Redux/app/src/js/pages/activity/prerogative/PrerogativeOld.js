import React from 'react'
import Popup from '../components/Popup'
import {get, platform, hrefNative, redirect, statistics, share } from 'utils'
import Toast from '../../../components/Toast'
import {Carousel} from 'antd-mobile'
import 'scss/activity/prerogative.component.scss'
import 'slick-carousel/slick/slick.css'

export default class PrerogativeOld extends React.Component {
  constructor (props) {
    super(props)

    this.bannerData = []
    this.newUserData = []
    this.oldUserData = []
    this.permanentBanner = []

    this.state = {
    	isInit: false
    }
  }

  componentWillMount () {
  	this.initData()
  }

  componentDidMount () {
    document.title = '特权营'
    share('prerogative')
  }

  // 初始化页面数据
  initData () {
  	Toast.loading('')
  	 get('http://credit.xianjincard.com/activity/privilege-act/index').then(data => data.data).then(data => {
  	 		Toast.hide()
			 	if (data.code != 0) {
			 		Toast.info(data.message, 2)
			 		return
			 	}
			 	// 新手特权
			 	this.newUserData = data.data.newer.map((ele, index) => {
			 		return (<div className='group' key={index}><img src={ele.icon} className='newer-icon' /><span className='txt'><h3>{ele.name}</h3>{ele.desc}</span><button onClick={() => {
				    	statistics({
					      type: 'prerogative',
					      tag: ele.button_text
					    })

					    if (ele.native.length > 0 && platform.isApp) {
					    	hrefNative(ele.native)
					    	return
					    }
				    	redirect.push(ele.link)
				    }} style={{backgroundImage: 'url(' + ele.button_bg + ')'}}>{ele.button_text}</button>
			  	</div>)
			 	})

			 	// 老客户特权
			 	this.oldUserData = data.data.older.map((ele, index) => {
			 		if (ele.status) {
					  return (<img src={ele.imgUrl} onClick={() => {
				    redirect.push(ele.link)
						 		statistics({
						      type: 'prerogative',
						      tag: '老客区第' + (parseFloat(index) + 1) + '块'
						    })
						 	}

						} key={index} />)
 					}
				  return (<img src={ele.imgUrl} onClick={() => {
			  	statistics({
			      type: 'prerogative',
			      tag: '老客户第' + (parseFloat(index) + 1) + '块'
			    })
				 		Popup.alert(`<p>${ele.message}</p><a class='click'>去看看其它</a>`, 'popup-pre')
    				Popup.click('a.click')
				 }} key={index} />)
			 	})

			 	// 金粉关怀日
			 	this.permanentBanner = <img src={data.data.careDay.imgUrl} onClick={() => {
			 		statistics({
			      type: 'prerogative',
			      tag: '立即领取'
			    })
			 		redirect.push(data.data.careDay.link)
			 	}} />

			 	// banner区
			 	this.bannerData = data.data.banner.map((ele, index) => {
			 		return (<div onClick={() => {
			 			statistics({
				      type: 'prerogative',
				      tag: '轮播图,第' + (parseFloat(index) + 1) + '张'
				    })
			 			redirect.push(ele.link)
			 		}} key={index} className='banner-item' ><img src={ele.imgUrl} /> </div>)
			 	})

			 	this.setState({isInit: true})
  	 })
  }

  render () {
    return (
      <div className='prerogative'>
        <div className='floor1'><div className='move' /><span className='light fadeIn' /></div>
        <div className='floor2'><div className='box'><span /></div></div>
        <div className='floor4'><h2 /><p>(老客：在平台有过借款的用户)</p></div>
        <div className='floor5' >
          {this.oldUserData}
        </div>
        <div className='floor7'>{this.permanentBanner}</div>
        <div className='floor6' />
        <div className='floor8' >
          <Carousel autoplay infinite>
            {this.bannerData}
          </Carousel>
        </div>
      </div>
    )
  }
}
