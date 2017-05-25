import React from 'react'
import { share, platform } from 'utils'
import 'img/activity/mother-day/mother-01.jpg'
import 'img/activity/mother-day/mother-02.jpg'
import 'img/activity/mother-day/mother-03.jpg'
import 'img/activity/mother-day/mother-04.jpg'
import 'img/activity/mother-day/mother-05.jpg'
import 'img/activity/mother-day/mother-09.jpg'
import 'audio/activity/mother-day/bgm.mp3'
import 'audio/activity/mother-day/bgm.wma'
import 'audio/activity/mother-day/bgm.ogg'
import 'scss/activity/mother-day.component.scss'

const animNum = 3
let animFlag = 0
let locked = 1

export default class Share extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      anim1: {},
      anim2: {},
      animA: {},
      animR: {},
      src1: '../../assets/img/activity/mother-day/mother-01.jpg',
      src2: '../../assets/img/activity/mother-day/mother-02.jpg'
    }
  }

  componentDidMount () {
    document.title = '庆祝母亲节'
    share('mother')
    if (!platform.isIos) {
      setTimeout(() => {
        this.audio()
      }, 500)
    }
  }

  anim () {
    if (animFlag === 0 && locked) {
      locked = 0
      this.setState({
        anim1: {animation: `one ${animNum}s ease 1 forwards`},
        anim2: {animation: `two ${animNum}s ease 1 forwards`}
      })
      setTimeout(() => {
        this.setState({
          anim1: {},
          anim2: {},
          src1: '../../assets/img/activity/mother-day/mother-02.jpg',
          src2: '../../assets/img/activity/mother-day/mother-03.jpg'
        })
        locked = 1
      }, animNum * 1000)
      animFlag++
    } else if (animFlag === 1 && locked) {
      locked = 0
      this.setState({
        anim1: {animation: `three ${animNum}s ease 1 forwards`},
        anim2: {animation: `four ${animNum}s ease 1 forwards`}
      })
      setTimeout(() => {
        this.setState({
          anim1: {},
          anim2: {},
          src1: '../../assets/img/activity/mother-day/mother-03.jpg',
          src2: '../../assets/img/activity/mother-day/mother-04.jpg'
        })
        locked = 1
      }, animNum * 1000)
      animFlag++
    } else if (animFlag === 2 && locked) {
      locked = 0
      this.setState({
        anim1: {animation: `five ${animNum}s ease 1 forwards`},
        anim2: {animation: `six ${animNum}s ease 1 forwards`}
      })
      setTimeout(() => {
        this.setState({
          anim1: {},
          anim2: {opacity: 0},
          src1: '../../assets/img/activity/mother-day/mother-04.jpg',
          src2: '../../assets/img/activity/mother-day/mother-05.jpg'
        })
        locked = 1
      }, animNum * 1000)
      animFlag++
    } else if (animFlag === 3 && locked) {
      locked = 0
      this.setState({
        anim1: {animation: `seven ${animNum}s ease 1 forwards`},
        anim2: {animation: `seven ${animNum}s linear 1 reverse forwards`},
        animA: {animation: `seven ${animNum}s ease 1 forwards`}
      })
      setTimeout(() => {
        this.setState({
          anim1: {display: 'none'},
          animA: {display: 'none'}
        })
      }, animNum * 1000)
    }
  }

  audio () {
    const audio = this.refs.audio
    if (audio.paused) {
      this.setState({
        animR: {animation: `r ${animNum}s linear infinite`}
      })
      audio.load()
      audio.play()
    } else {
      this.setState({
        animR: {}
      })
      audio.pause()
    }
  }

  render () {
    const { anim1, anim2, src1, src2, animA, animR } = this.state
    return (
      <div className='transition-group'>
        <div className='mother'>
          <img className='bg1' src={src1} style={anim1} />
          <img className='bg2' src={src2} style={anim2} />
          <div className='audio-div' style={animR} onClick={this.audio.bind(this)}>
            <audio ref='audio' loop>
              <source type='audio/mpeg' src='../../assets/audio/activity/mother-day/bgm.mp3' />
              <source type='audio/mpeg' src='../../assets/audio/activity/mother-day/bgm.wma' />
              <source type='audio/ogg' src='../../assets/audio/activity/mother-day/bgm.ogg' />
            </audio>
          </div>
          <a className='anim-a' onClick={this.anim.bind(this)} style={animA}>点一下</a>
        </div>
      </div>
    )
  }
}
