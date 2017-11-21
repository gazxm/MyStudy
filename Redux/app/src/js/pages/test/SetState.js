import React from 'react'
import 'scss/test/set-state.component.scss'

/*
  http://www.w3cplus.com/react/more-reasonable-setstate.html
*/
class IncrementByObj extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      count: 0
    }
    this.increment = this.increment.bind(this)
  }

  increment () {
    this.setState({
      count: this.state.count + 1
    })

    this.setState({
      count: this.state.count + 2
    })
  }
  //  采用这种，下面会覆盖上面的，只执行一次，结果每次+2

  render () {
    return (
      <div>
        <button onClick={this.increment}>IncrementByObject</button>
        <span>{this.state.count}</span>
      </div>
    )
  }
}

class IncrementByFunction extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      count: 0
    }
    this.increment = this.increment.bind(this)
  }

  increment () {
    this.setState((prevState, props) => ({
      count: prevState.count + 1
    }))
    this.setState((prevState, props) => ({
      count: prevState.count + 2
    }))
  }

  //  会执行两次，结果每次+3

  //  我们之前也说过，我们在处理异步更新的时候，需要用到传入函数的方式来更新我们的 state。这样，在更新下一个 state 的时候，我们能够正确的获取到之前的 state，并在在其基础之上进行相应的修改。而不是简单地执行所谓的对象合并。
  //  所以说，我们建议，在使用 setState 的时候，采用传入函数来更新 state 的方式，这样也是一个更合理的方式。

  render () {
    return (
      <div>
        <button onClick={this.increment}>IncrementByFunction</button>
        <span>{this.state.count}</span>
      </div>
    )
  }
}

export default class SetState extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div className='set-state'>
        <IncrementByObj />
        <IncrementByFunction />
      </div>
    )
  }
}
