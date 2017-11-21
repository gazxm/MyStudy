import React, {Component} from 'react'

export default class layout extends Component {
  constructor (props) {
    super(props)
  }
  componentDidMount () {

  }
  render () {
    return (
      <div className='wrapper wrapper-treehole loaded'>
        {this.props.children}
      </div>
    )
  }
};
