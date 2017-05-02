import React from 'react'
import Loading from '../../../components/Loading'
import Scroll from '../../../components/Scroll'
import { Carousel } from 'antd-mobile'

export default class Test extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: {
        //  svg宽度
        width: 240,
        //  svg高度
        height: 240,
        //  loading圆的百分比
        percent: 80,
        //  loading圆的半径
        radius: 90,
        //  border的宽度
        strokeWidth: 6,
        //  loading圆的动画时间
        animTime: 1,
        //  loading圆的动画延迟时间
        animDelay: 1,
        //  背景圆的颜色
        bgColor: '#333',
        //  loading圆的颜色
        loadingColor: '#7a5bcf',
        //  svg的class
        elementClass: 'loading'
      },
      scroll: {
        //  滚动条奖励
        prize: ['30%', '50%'],
        //  滚动条数量
        length: 20,
        //  滚动条刷新时间(单位：s)
        rTime: 60,
        //  滚动条滚动延迟时间(单位：s)
        delayTime: 3,
        //  滚动条滚动时间(单位：s)
        time: 0.5
      }
    }
  }

  componentDidMount () {
    this.setState({
      scroll: {
        prize: ['20%', '40%', '60%'],
        length: 20,
        rTIme: 60,
        delayTime: 3,
        time: 0.5
      }
    })
  }

  render () {
    const { loading, scroll } = this.state

    return (
      <div className='transition-group'>
        <div className='test'>
          <Loading loading={loading} />
          <Scroll scroll={scroll} />
          <div className='sub-title'>vertical</div>
          <Carousel className='my-carousel'
            dots={false} dragging={false} swiping={false} autoplay infinite vertical
          >
            <div className='v-item'>Carousel 1</div>
            <div className='v-item'>Carousel 2</div>
            <div className='v-item'>Carousel 3</div>
          </Carousel>
        </div>
      </div>
    )
  }
}
