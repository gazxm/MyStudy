import React, {Component} from 'react'
import 'scss/misc/notfound.component.scss'

export default class notfound extends Component {
  constructor (props) {
    super(props)
  }
  componentDidMount () {

  }
  render () {
    return (
      <div className='wrapper wrapper-misc-notfound loaded'>
        <div className='picture' />
        <p>对不起，没有找到您要访问的页面</p>
      </div>
    )
  }
};
