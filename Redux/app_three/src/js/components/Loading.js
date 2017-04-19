import React from 'react'
import 'scss/components/loading.component.scss'

export default class Loading extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      offset: 0
    }
  }

  componentDidMount () {
    const { loading } = this.props
    setTimeout(() => this.setState({
      offset: loading.percent
    }), loading.animDelay * 1000)
  }

  render () {
    const { loading } = this.props
    const { offset } = this.state
    const rem = 75
    //  svg宽度，高度
    const svgWidth = `${loading.width / rem}rem`
    const svgHeight = `${loading.height / rem}rem`
    //  circle的半径，圆心坐标
    const cR = `${loading.radius / rem}rem`
    const cX = `${(loading.width / 2) / rem}rem`
    const cY = `${(loading.height / 2) / rem}rem`
    //  第一个圆的stroke宽度
    const sW1 = `${loading.strokeWidth / rem}rem`
    const sW2 = `${(loading.strokeWidth + 1) / rem}rem`
    //  第二个圆的stroke宽度
    const sD = 3.14 * 2 * loading.radius / rem
    //  stroke-dasharray：定义描边的虚线长度，如果提供奇数个，则会自动复制该值成偶数
    //  stroke-dashoffset：定义虚线描边的偏移量（在路径开始的前面，看不到）
    //  原理就是设置stroke-dasharray和stroke-dashoffset一样大的数值，为圆形的周长
    const sDa = `${sD}rem`
    const sDo = `${sD - (offset / 100) * sD}rem`
    const lodAnim = {
      transition: `stroke-dashoffset ${loading.animTime}s ease-in-out`,
      strokeDasharray: sDa,
      strokeDashoffset: sDo
    }

    return (
      <div className={loading.elementClass}>
        <svg width={svgWidth} height={svgHeight} xmlns='http://www.w3.org/2000/svg' className='donut__svg'>
          <circle id='donut-graph-x' className='donut__svg__scrim' r={cR} cy={cY} cx={cX} strokeWidth={sW1} stroke={loading.bgColor} fill='none' />
          <circle id='donut-graph' r={cR} cy={cY} cx={cX} strokeWidth={sW2} stroke='url(#circleColor)' strokeLinejoin='round' strokeLinecap='round' fill='none' style={lodAnim} />
          <defs>
            <linearGradient id='circleColor' x1='0%' y1='0%' x2='100%' y2='0%'>
              <stop offset='0%' stopColor={loading.loadingColor} />
              <stop offset='100%' stopColor={loading.loadingColor} />
            </linearGradient>
          </defs>
        </svg>
        <div className='donut__copy'>
          <span className='donut__title'>
            <span className='js-donut-figure'>{loading.percent}</span>
            <span className='donut__spic'>%</span>
          </span>
        </div>
      </div>
    )
  }
}
