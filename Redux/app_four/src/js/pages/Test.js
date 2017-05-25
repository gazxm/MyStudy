import React from 'react'
import Password from '../components/Password'

export default class Test extends React.Component {
  componentDidMount () {
    Password.show(function (v) {
      console.log(v)
      Password.error()
    })
  }
  onClick () {
    // Password.show(function (v) {
    //   console.log(v)
    //   setTimeout(function () {
    //     Password.error()
    //   }, 500)
    // })
  }
  render () {
    return <div class="transition-group"><input type="file" accept="video/*;capture=camcorder"/></div>
  }
}
