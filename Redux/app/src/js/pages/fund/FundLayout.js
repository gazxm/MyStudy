import React from 'react'

export default class FundLayout extends React.Component {
  render () {
    return (
      <div class="transition-group-container">
        {this.props.children}
      </div>
    )
  }
}
