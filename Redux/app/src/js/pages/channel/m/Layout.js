import React from 'react'
import {login} from 'utils'

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
    return (
      <div class="mobile-style">
        {this.props.children}
      </div>
    )
  }
}
