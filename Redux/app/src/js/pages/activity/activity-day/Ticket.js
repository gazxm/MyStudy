import React from 'react'

let ticketInterval = null

export default class Ticket extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      ticket: {
        ...this.props.ticket[0]
      },
      className: 'wait',
      restTime: '00:00:00'
    }
  }

  componentWillMount () {
    let { nowTime, code } = this.props

    if (code === -2013 || code === -2035) {
      this.setState({
        className: 'end'
      })
      return
    }

    let nt = nowTime.slice(0, 2) * 60 * 60 + nowTime.slice(3, 5) * 60 + nowTime.slice(6, 8) * 1
    let startTime = this.state.ticket.start_time.slice(0, 2) * 3600

    this.interval(nt, startTime)
    ticketInterval = setInterval(() => {
      this.interval(++nt, startTime)
    }, 1000)
  }

  componentWillReceiveProps (nextProps) {
    this.changeTicket(nextProps.ticket[0])
  }

  componentWillUnmount () {
    clearInterval(ticketInterval)
  }

  interval (nt, st) {
    let time = st - nt
    if (time > 0) {
      this.setState({
        restTime: this.calcTime(time)
      })
      return
    }
    if (time === 0) {
      this.setState({
        className: 'active'
      })
      return
    }
    if (time < 0 && this.state.ticket.amount > 0) {
      this.setState({
        className: 'active'
      })
      return
    }
    this.setState({
      className: 'end'
    })
  }

  changeTicket (ticket) {
    const time = this.state.restTime.slice(0, 2) * 60 * 60 + this.state.restTime.slice(3, 5) * 60 + this.state.restTime.slice(6, 8) * 1
    if (ticket.amount === 0 && time <= 1) {
      this.setState({
        ticket: {
          ...ticket
        },
        className: 'end'
      })
      return
    }
    this.setState({
      ticket: {
        ...ticket
      }
    })
  }

  rob () {
    const { type } = this.state.ticket
    this.props.rob(type, name)
  }

  calcTime (time) {
    let hour = Math.floor(time / 3600) + ''
    let min = Math.floor((time - hour * 3600) / 60) + ''
    let sec = (time - hour * 3600 - min * 60) + ''
    if (hour.length === 1) {
      hour = `0${hour}`
    }
    if (min.length === 1) {
      min = `0${min}`
    }
    if (sec.length === 1) {
      sec = `0${sec}`
    }
    return `${hour}:${min}:${sec}`
  }

  render () {
    const { ticket, className, restTime } = this.state

    const text1 = className === 'active' ? <a className='right' onClick={this.rob.bind(this)}><span>立即开抢</span></a> : null
    const text2 = className === 'wait' ? <a className='right'><span>即将开抢</span></a> : null
    const text3 = className === 'end' ? <a className='right'><span>已结束</span></a> : null

    const footerL = className === 'end' ? <span><b>{ticket.start_time}</b>本次秒杀已结束</span> : <span><b>{ticket.start_time}</b></span>
    const footerR1 = className === 'active' ? <p className='right'>还剩余{ticket.amount}{ticket.unit}{ticket.name}</p> : null
    const footerR2 = className === 'wait' ? <p className='right'>距开始还有{restTime}</p> : null

    return (
      <div className={`ticket ${className}`}>
        <div className='head clearfix'>
          <p className='left'><img alt={ticket.name} src={ticket.icon} />{ticket.name}{ticket.total_amount}{ticket.unit}</p>
          {text1}{text2}{text3}
          <ul><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /><li /></ul>
        </div>
        <div className='footer clearfix'>
          <div className='left'>
            <i />
            {footerL}
          </div>
          {footerR1}{footerR2}
        </div>
      </div>
    )
  }
}
