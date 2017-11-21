import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, login, resolveUrl } from 'utils'
import { RefreshControl, ListView } from 'antd-mobile'
import 'scss/activity/guess.component.scss'

export default class Topic extends React.Component {
  constructor (props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
    this.state = {
      dataSource: dataSource.cloneWithRows([]),
      refreshing: false,
      login: 1
    }
  }

  componentDidMount () {
    document.title = '往期话题'
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/topic-quiz-act/past').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup-stake')
        if (data.code === -1001) {
          this.setState({
            login: 0
          })
          Popup.click('a.click', login)
          return
        }
        Popup.click('a.click')
        return
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(data.data)
      })
    })
  }

  onRefresh () {
    this.setState({refreshing: true})
    get('http://credit.xianjincard.com/activity/topic-quiz-act/past').then(data => data.data).then(data => {
      this.setState({refreshing: false})
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup-stake')
        if (data.code === -1001) {
          this.setState({
            login: 0
          })
          Popup.click('a.click', login)
          return
        }
        Popup.click('a.click')
        return
      }
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(data.data)
      })
    })
  }

  forward (url) {
    location.href = url
  }

  forwardLogin () {
    login()
  }

  forwardGold () {
    location.href = resolveUrl('http://h.xianjincard.com/signin/detailed')
  }

  render () {
    const { login, dataSource, refreshing } = this.state
    const row = (rowData, sectionID, rowID) => {
      return (
        <div className='content' key={rowID}>
          <h4>{rowData.batch}</h4>
          {rowData.link ? <div className='underline' onClick={() => this.forward(rowData.link)}><span>{rowData.title}</span></div> : <div><span>{rowData.title}</span></div>}
          <div className='result clearfix'>
            <span className='left'>上期结果</span>
            <div className='right'>
              <div className='top'><span className='sp1' style={{width: `${rowData.squad_count / (parseInt(rowData.squad_count) + parseInt(rowData.against_count)) * 100}%`}}><b>蓝{rowData.squad_count}注</b></span><span className='sp2' style={{width: `${rowData.against_count / (parseInt(rowData.squad_count) + parseInt(rowData.against_count)) * 100}%`}}>红{rowData.against_count}注</span></div>
              <p className='bottom'>{rowData.result_text}</p>
            </div>
          </div>
          <div className='clearfix'>
            <span className='left'>上期最佳</span>
            <p className='right'>{rowData.best_user_text}</p>
          </div>
          <div className='clearfix'>
            <span className='left'>我的押注</span>
            {login ? rowData.my_blue_num && rowData.my_red_num ? <p className='right'><span className='blue'>押蓝{rowData.my_blue_num}注</span><span className='red'>押红{rowData.my_red_num}注</span></p> : <p className='right'>没有参与本场活动</p> : <p className='right blue' onClick={this.forwardLogin.bind(this)}>请先登录哦</p>}
            {login ? <p className='right2' onClick={this.forwardGold.bind(this)}>查看我的金币</p> : null}
          </div>
        </div>
      )
    }

    return (
      <div className='transition-group'>
        <div className='topic'>
          <h3>往期话题结果</h3>
          <div className='all'>
            <ListView
              dataSource={dataSource}
              renderRow={row}
              initialListSize={5}
              pageSize={5}
              scrollerOptions={{ scrollbars: true }}
              scrollRenderAheadDistance={200}
              onEndReachedThreshold={10}
              className='listview'
              scrollEventThrottle={20}
              refreshControl={<RefreshControl
                refreshing={refreshing}
                onRefresh={this.onRefresh.bind(this)}
                distanceToRefresh={40 / 2 * (window.devicePixelRatio || 2)}
              />}
            />
          </div>
        </div>
      </div>
    )
  }
}
