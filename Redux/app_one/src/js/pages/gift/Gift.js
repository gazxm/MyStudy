import React from 'react'
import {connect} from 'react-redux'
import 'scss/activity/gift.component.scss'

import Download from '../activity/components/DownloadPopup'
import * as giftAction from '../../actions/giftAction'

import Toast from '../../components/Toast'

import Festival from './Festival'
import Valentine from './Valentine'

@connect((store) => {
  const gift = store.giftReducer
  return {
    tabState: gift.tabState,
    fetching: gift.fetching,
    valentineInfo: gift.valentineInfo
  }
})
export default class Gift extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    this.props.dispatch(giftAction.getInfo())
    Toast.hide()
  }

  componentWillUpdate (nextProps, nextState) {
    const { fetching } = nextProps
    fetching ? Toast.loading('') : Toast.hide()
  }

  Festival () {
    this.props.dispatch(giftAction.festival())
  }

  Valentine () {
    this.props.dispatch(giftAction.valentine())
  }

  render () {
    const { tabState } = this.props

    const content = tabState ? <Festival gift={this} /> : <Valentine gift={this} />

    return (
      <div>
        <div class='transition-group'>
          <div class='spring-gift'>
            <div class='gift-tab'>
              <div className={`festival-tab ${tabState ? 'tab-active' : ''}`} onClick={this.Festival.bind(this)}>
                <h3>元宵喜乐会</h3>
                <h4>猜灯谜 提额度 得免息</h4>
                <h4>2月10日-2月11日</h4>
              </div>
              <div className={`valentine-tab ${tabState ? '' : 'tab-active'}`} onClick={this.Valentine.bind(this)}>
                <h3>为爱夺宝</h3>
                <h4>夺取999元恋爱基金</h4>
                <h4>2月12日-2月14日</h4>
              </div>
            </div>
            <div class='gift-content'>
              {content}
            </div>
          </div>
        </div>
        <Download />
      </div>
    )
  }
}
