import React, {Component} from 'react'
import {NoticeBar, Carousel, List, Modal, Icon, Toast, Flex} from 'antd-mobile'
import {get, post, login} from 'utils'
import 'scss/misc/approve.component.scss'

export default class Approve extends React.Component {
    // 初始化加载

  constructor (props) {
    super(props)
    this.state = {
      id: this.props.location.query.id,
      icon: '',
      name: '',
      btnActive: 0,
      username: '',
      password: '',
      smscode: '',
      piccode: '',
      smsText: '获取验证码',
      canSend: 0,
      successLayout: 0
    }
    this.intval
  }

  componentWillMount () {
    document.title = '借贷认证'
    var InitsParams = {}
    InitsParams.platform_id = this.state.id
    Toast.loading('加载中', 0)
    post('http://credit.xianjincard.com/approve-auth/inits-approve-page', InitsParams).then(data => data.data).then(response => {
      if (response.code != 0) {
        Toast.fail(response.message)
        return
      }
      Toast.hide()
      this.setState({
        icon: response.data.info.icon,
        name: response.data.info.name,
        username: response.data.phone,
        successLayout: response.data.isauth
      })
    })
    if (this.state.id == 6) {
            // 现金巴士一进来就发短信验证码
      this.reSendSmsCode()
    }
  }

  componentDidMount () {
        // console.log("b")
  }

  fetchData () {
        // get('http://credit.xianjincard.com/credit-app/multi-index').then(result => {console.log(result)})
  }
  handleClick (e) {
    if (this.state.btnActive != 1) {
            // 信息不完整,不可以提交
      return
    }
    var params = {}
    params.phone = this.state.username
    params.password = this.state.password
    params.platform_id = this.state.id
    if (this.state.id == '6') {
      params.checkcode = this.state.smscode
    } else if (this.state.id == '7') {
      params.checkcode = this.state.piccode
    }
    Toast.loading('认证中', 0)
    post('http://credit.xianjincard.com/approve-auth/submit-approve-info', params).then(data => data.data).then(response => {
      if (response.code != 0) {
        if (response.code != 1000) {
          Toast.fail(response.message)
        } else {
          Toast.fail('目前服务不可用,请稍候再试。')
        }
        return
      }
      Toast.hide()
            // 认证成功
      this.setState({
        successLayout: 1
      })
    })
  }
  reSendSmsCode () {
    var params = {}
    params.platform_id = this.state.id
    Toast.loading('验证码发送中...', 0)
    post('http://credit.xianjincard.com/approve-auth/get-sms-code', params).then(data => data.data).then(response => {
      if (response.code != 0 && response.code != -2) {
        if (response.code != 1000) {
          Toast.fail(response.message, 1.5)
        } else {
          Toast.fail('目前服务不可用,请稍候再试。', 1.5)
        }
        this.setState({
          smsText: '获取验证码',
          canSend: 1
        })
        return
      }
      Toast.hide()
      this.setState({
        canSend: 0
      })
      var thistime = response.data.time
      var that = this
      this.intval = setInterval(function () {
        thistime--
        that.setState({
          smsText: thistime
        }, function () {
          if (that.state.smsText == 1) {
            clearInterval(that.intval)
            that.setState({
              smsText: '获取验证码',
              canSend: 1
            })
          }
        })
      }, 1000)
    })
  }
  checkBtnStatus () {
    if (this.state.password != '') {
      switch (this.state.id) {
        default :
          this.setState({btnActive: 1})
          break
        case '6' : // 现金巴士 需要 短信验证码
          if (this.state.smscode != '') {
            this.setState({btnActive: 1})
          } else {
            this.setState({btnActive: 0 })
          }
          break
      }
    } else {
      this.setState({btnActive: 0 })
    }
  }
  hcPassword (e) {
    this.setState({
      password: e.target.value
    }, function () {
      this.checkBtnStatus()
    })
  }
  hcSmscode (e) {
    this.setState({
      smscode: e.target.value
    }, function () {
      this.checkBtnStatus()
    })
  }
  hcPiccode (e) {
    this.setState({
      piccode: e.target.value
    }, function () {
      this.checkBtnStatus()
    })
  }
  render () {
    return (
      <div class='login'>
        <div class='header'>
          <img src={this.state.icon} />
        </div>
        <div class='title'>{this.state.name}</div>
        {this.state.successLayout == 0
                ? <div class='main'>
                  <div class='list'>
                    <input id='username' value={this.state.username} placeholder='平台用户名' disabled type='text' />
                  </div>
                  <div class='list'>
                    <input id='password' value={this.state.password} onChange={this.hcPassword.bind(this)} placeholder='平台密码' type='password' />
                  </div>
                  {this.state.id == '6'
                      ? <div class='list'>
                        <div class='left'>
                          <input id='smscode' value={this.state.smscode} onChange={this.hcSmscode.bind(this)} placeholder='输入验证码' type='text' />
                        </div>
                        {this.state.canSend == 0
                            ? <div class='right'>
                              <a href='javascript:void(0)' class='sms-code'>{this.state.smsText}</a>
                            </div>
                            : <div onClick={this.reSendSmsCode.bind(this)} class='right active'>
                              <a href='javascript:void(0)' class='sms-code'>{this.state.smsText}</a>
                            </div>
                        }
                      </div>
                    : ''}
                  {this.state.id == '7'
                      ? <div class='list hide'>
                        <div class='left'>
                          <input id='piccode' value={this.state.piccode} onChange={this.hcPiccode.bind(this)} placeholder='输入图片验证码' type='password' />
                        </div>
                        <div class='right'>
                          <img class='pic-code' src='http://localhost/April/Index.php/Home/Api/getCode/num/4/w/145/h/44.html' />
                        </div>
                      </div>
                    : ''}
                  <div class='list pd-top'>
                    {this.state.btnActive == 0
                            ? <a onClick={this.handleClick.bind(this)} href='javascript:void(0)' class='btn'>开始认证</a>
                        : <a onClick={this.handleClick.bind(this)} href='javascript:void(0)' class='btn active'>开始认证</a>
                        }
                  </div>
                </div>
                : <div>
                  <img class='auth_done_icon' src='/assets/img/misc/approve/already_auth.png' />
                  <div class='main'>
                    <div class='list pd-top'>
                      <a href='javascript:void(0)' class='btn success'>已认证</a>
                    </div>
                  </div>
                </div>
                }
      </div>
    )
  }
}
