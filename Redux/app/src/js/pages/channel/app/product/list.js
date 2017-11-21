import React, {Component} from 'react'
import {Button, ListView, List, Toast} from 'antd-mobile'
import classnames from 'classnames'
import request from 'common/request'
import {redirect} from 'utils'
import 'scss/channel/app/product/list.component.scss'

const title = '极速贷款'
const Item = List.Item
const Brief = Item.Brief

export default class list extends Component {
  constructor (props) {
    super(props)
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2
    })
    this.state = {
      dataSource: dataSource.cloneWithRows([])
    }
  }
  componentDidMount () {
    document.title = title
    let {dataSource} = this.state
    request.post('/pool/pool/index').then(response => {
      let {data} = response
      data && data.length && this.setState({dataSource: dataSource.cloneWithRows(data)})
    })
  }
  render () {
    let {dataSource} = this.state
    let row = (data, index) => {
      let {id, title, icon, description, interest_type, interest_rate, max_money, prompt_msg} = data
      let goto = () => {
        if (id) {
          redirect.push({
            pathname: '/channel/app',
            search: `?product_id=${id}`
          })
        } else {
          Toast.fail('缺少参数')
        }
      }
      return (
        <Item key={index} arrow='horizontal' thumb={icon} onClick={goto} multipleLine>
          <div className='title'>
            <span>{title}</span>
            {prompt_msg ? <span className='tips'>{prompt_msg}</span> : false}
          </div>
          <div className='description'><Brief>{description}</Brief></div>
          <div className='params'>
            <Brief>
              <p>
                  参考
                  {interest_type == 1 ? '年' : interest_type == 2 ? '月' : interest_type == 3 ? '日' : '/'}
                  利率：
                  <span>{interest_rate}</span>
              </p>
              <p>
                  最高额度：
                  <span>{max_money}</span>
              </p>
            </Brief>
          </div>
        </Item>
      )
    }
    return (
      <div className='wrapper-channel-product-list'>
        <ListView
          dataSource={dataSource}
          renderRow={row}
          style={{
            height: document.documentElement.clientHeight
          }} />
      </div>
    )
  }
};
