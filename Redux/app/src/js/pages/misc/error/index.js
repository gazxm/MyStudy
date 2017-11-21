import React, {Component} from 'react'
import 'scss/misc/notfound.component.scss'

export default class error extends Component {
  constructor (props) {
    super(props)
  }
  componentDidMount () {

  }
  render () {
    let {url, content = '对不起，没有找到您要访问的页面'} = this.props.location.query
    url && setTimeout(() => {
      window.location.href = url
    }, 5000)
    return (
      <div className='wrapper wrapper-misc-notfound loaded'>
        <div className='picture-2' />
        <p>{decodeURIComponent(content)}</p>
      </div>
    )
  }
};
