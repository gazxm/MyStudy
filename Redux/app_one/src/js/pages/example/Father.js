import React from 'react'
import Child from './Child'

export default class Father extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      totalChecked: 0,
      checked: false
    }
  }

  onChildChanged = (newState) => {
    let newToral = this.state.totalChecked + (newState ? 1 : -1);
    this.setState({
      totalChecked: newToral
    });
  }

  render () {
    let totalChecked = this.state.totalChecked;
    return (
      <div>
        <div>Are you checked: {totalChecked}</div>
        <Child text='Toggle me'
          initialChecked={this.state.checked}
          callbackParent={this.onChildChanged}
          />
        <Child text='Toggle me'
          initialChecked={this.state.checked}
          callbackParent={this.onChildChanged}
          />
        <Child text='Toggle me'
          initialChecked={this.state.checked}
          callbackParent={this.onChildChanged}
          />
      </div>
    )
  }
}
