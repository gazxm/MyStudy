import React from 'react'
import 'scss/activity/dragon.component.scss'

export default class Dragon extends React.Component {
  constructor (props) {
    super(props)
  }

  componentDidMount () {
    document.title = '端午节活动'
    share('dragon')
  }

  render () {
    return (
      <div>hello</div>
    )
  }
}
