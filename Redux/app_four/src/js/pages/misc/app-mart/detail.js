import React from 'react'
import {Toast} from 'antd-mobile'
import {post, callBrowser} from 'utils'
import 'scss/misc/app-mart.component.scss'

export default class Approve extends React.Component {
    // 初始化加载

  constructor (props) {
    super(props)
    this.state = {
      model: {},
      infos: [],
      images: []
    }
  }

  componentWillMount () {
    document.title = '应用详情'
    Toast.loading('加载中...', 0)
    const id = this.props.location.query.id
    post('http://credit.xianjincard.com/appstore/action-log', {app_id: id, type: '2'})
    post('http://credit.xianjincard.com/appstore/app', {id: id}).then(data => data.data).then(data => {
      if (data.code !== 0) {
        Toast.fail(data.message, 1.5)
        return
      }
      Toast.hide()
      this.setState({
        model: data.data.model,
        infos: data.data.infos,
        images: data.data.images
      })
    })
  }

  download () {
    const { install_url } = this.state.model
    const id = this.props.location.query.id
    post('http://credit.xianjincard.com/appstore/action-log', {app_id: id, type: '1'})
    callBrowser(install_url)
  }

  render () {
    const {model, images, infos} = this.state
    const imgs = images ? images.map((v, i) =>
      <img key={i} src={v.img} />
    ) : null
    const info = infos ? infos.map((v, i) => <p key={i}><span className='left'>{v.item}</span><span>{v.detail}</span></p>) : null

    return (
      <div className='app-mart-detail'>
        <div className='brief clearfix'>
          <img src={model.icon} />
          <div className='right'>
            <h2>{model.name}</h2>
            <p>{model.size} MB</p>
            <h3>{model.brief_info}</h3>
          </div>
        </div>
        <div className='imgs'>
          <div className='content'>
            {imgs}
          </div>
        </div>
        <div className='intro'>
          <h3>应用介绍</h3>
          <p>{model.introduction}</p>
        </div>
        <div className='info'>
          <h3>应用信息</h3>
          {info}
        </div>
        <div className='btn-area'>
          <a className='btn' onClick={this.download.bind(this)}>安装</a>
        </div>
      </div>
    )
  }
}
