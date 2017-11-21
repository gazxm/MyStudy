import React from 'react'
import ReactSlider from 'react-slider'

export default class Slider extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: this.props.defaultValue
    }
  }
  onChange (value) {
    this.setState({'value': value})
    this.props.onChange(value)
  }
  render () {
    const {min, max} = this.props
    const newMin = min === max ? 0 : min
    return (
      <ReactSlider disabled={min === max} withBars={this.props.withBars} step={this.props.step} min={newMin} max={this.props.max} className={this.props.orientation + '-slider'} pearling={true} onChange={this.onChange.bind(this)} value={this.state.value}>
        <div>{this.state.value}元</div>
      </ReactSlider>
    )
  }
}
