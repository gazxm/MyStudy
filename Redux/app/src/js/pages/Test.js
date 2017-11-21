import React from 'react'
// import Password from '../components/Password'
// import ReactDOM from 'react-dom'
import Toast from '../components/Toast'
import { Icon, Button } from 'antd-mobile'
import {get} from '../utils'

import 'scss/test.component.scss'
import twitterIcon from 'svg/twitter.svg'

// class MyComponent extends React.Component {
//   onClick () {
//     console.log(ReactDOM.findDOMNode(this))
//   }
//   alert () {
//     ReactDOM.render(this.findDOMNode(), document.body)
//   }
//   render () {
//     return <div onClick={this.onClick.bind(this)}>hello world</div>
//   }
// }

const printPostsToConsole = async () => {
  try {
    const posts = await get('http://credit.xianjincard.com/credit-app/multi-index')
    console.log(posts)
  } catch (err) {
    console.log(err)
  }
}

export default class Test extends React.Component {
  constructor (props) {
    super(props)
    this.state = {title: 'hello world'}
    // printPostsToConsole()
    // console.log('abc'.includes('a'))
  }
  componentDidMount () {
    // let component = new MyComponent()
    // component.alert()
    // Password.show(function (v) {
    //   console.log(v)
    //   Password.error()
    // })
    setTimeout(() => {
      this.setState({title: 'he he he'})
      // console.log('hello')
    }, 3000)

    var mySet = new Set()

    mySet.add(1) // Set { 1 }
    mySet.add(5) // Set { 1, 5 }
    mySet.add(6)
    mySet.add(7)

    // for (let f of mySet) {
    //   console.log(f)
    // }

    // Toast.info('jlkjlkjl', 3, () => {
    //   console.log('ok')
    // })
  }
  onClick () {
    // Password.show(function (v) {
    //   console.log(v)
    //   setTimeout(function () {
    //     Password.error()
    //   }, 500)
    // })
    // Toast.info('This is a toast tips !!!', 0)
    // get('http://credit.xianjincard.com/credit-app/multi-index').then(function (data) {
    //   console.log(data, 'h5')
    // })
    console.log(info)
  }
  render () {
    return (
      <div class='transition-group'>
        <input type='file' accept='video/*;capture=camcorder' />
        <h1 class='test-svg'>hello world</h1>
        <Icon type='search' />
        <Button type='primary' loading onClick={this.onClick}>test</Button>
        <img width='300' src='../../assets/svg/facebook.svg' alt='' />
        <svg width='100' height='100'>
          <use xlinkHref={twitterIcon}/>
        </svg>
      </div>
    )
  }
}
