import React from 'react'
import Content from './Content'
import Popup from '../components/Popup'
import { List, Radio, Toast } from 'antd-mobile'
import { redirect, get, login } from 'utils'
import 'scss/activity/inte-eval.component.scss'

const RadioItem = Radio.RadioItem

export default class Stepone extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: 0,
      data: [],
      tag: ''
    }
  }

  componentWillMount () {
    document.title = '智能评测'
    Toast.loading('加载中...', 0)
    get('http://credit.xianjincard.com/activity/intelligence-testing/my-tags').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        Popup.alert(Content.showHtml(data.code), 'popup')
        if (data.code === -1001) {
          Popup.click('a.click', login)
          return
        }
        Popup.click('a.click')
        return
      }
      this.setState({
        data: data.data,
        tag: data.data[0].tag
      })
    })
  }

  onChange (value, tag) {
    this.setState({
      value,
      tag
    })
  }

  nextStep () {
    const { tag } = this.state
    redirect.push(`/activity/evaluation/steptwo?tag=${tag}`)
  }

  render () {
    const { value, data } = this.state

    return (
      <div className='transition-group'>
        <div className='eval-one'>
          <h2 className='head'>01/<b>02</b></h2>
          <h3>选出一个最适合你的标签</h3>
          <List>
            {data.map((v, i) => (
              <RadioItem key={i} checked={value === i} onChange={() => this.onChange(i, v.tag)}>
                <img src={v.icon} alt={v.title} />
                <p>{v.title}</p>
              </RadioItem>
            ))}
          </List>
          <a onClick={this.nextStep.bind(this)}>下一步</a>
        </div>
      </div>
    )
  }
}
