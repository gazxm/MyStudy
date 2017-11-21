import React from 'react'
import { SearchBar } from 'antd-mobile'

export default class Tree extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div className='tree'>
        <div className='search'>
          <SearchBar placeholder='大家都在搜：为什么不结婚？' />
          <a>最新</a>
          <a>最热</a>
        </div>
      </div>
    )
  }
}
