import React from 'react'
import Nav from 'pages/mobile/components/layout/Nav'
import {platform, login} from 'utils'

import axios from 'axios'

export default class Layout extends React.Component {
  constructor (props) {
    super(props)
    axios.interceptors.response.use(function (response) {
      if (response.data.code === -2) {
        login()
        return Promise.reject()
      }
      return response
    }, function (error) {
      return Promise.reject(error)
    })
  }
  render () {
    const { location } = this.props
    console.log(this.props)
    console.log(location)
    const isMatch = location.pathname.match(/^\/mobile\/(loan|certification|find|me)$/)
    return (
      <div class="mobile-style">
        {this.props.children}
        {(platform.isApp || !isMatch) || <Nav location={location}/>}
      </div>
    )
  }
}
