import React, {Component} from 'react'
import {Carousel, Modal, Flex} from 'antd-mobile'
import {DATAS} from './data'
import request from 'common/request'
import redPacket from '../../../../assets/img/activity/compensate/icon-red-packet.png'
import 'scss/activity/compensate.component.scss'
import {platform, qc, openApp, share} from 'utils'

const alert = Modal.alert

export default class Wrapper extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: 0
    }
    this.show = () => {
      this.setState({
        visible: 1
      })
    }
    this.close = () => {
      this.setState({
        visible: 0
      })
    }
    this.onLoan = () => {
      if (platform.isApp) {
        request(`credit-info/login-mjp-jjp`)
        .then(response => {
          try {
            if (response.code != 0) {
              qc.track('jump', {url: 'koudaikj://app.launch/login/applogin'})
            } else {
              qc.track('jump', {url: 'koudaikj://app.launch/main'})
            }
          } catch (error) {
            openApp()
          }
        })
      } else {
        location.href = 'http://credit.xianjincard.com/credit-web/open-app'
      }
    }
  }
  componentWillMount () {
    document.title = '双赔活动'
    share('doublepei1')
  }
  render () {
    return (
      <div className='wrapper wrapper-activity-compensate loaded'>
        <span className='participate-rules' onClick={this.show} />
        <Carousel className='drawresults' autoplayInterval={3000} dots={false} swiping={false} easing='easeInQuad' autoplay infinite vertical>
          {
              DATAS.map((data, index) => (
                <div className='drawitems' key={index}>
                      恭喜<span>{data.phone}</span>
                      获得{data.type ? `慢就赔` : `拒就赔`}<span>{data.prize}</span>元
                  </div>
              ))
          }
        </Carousel>
        <div className='panel'>
          <div className='panel-title'>
            <i className='icon icon-prize' />
                        申请被拒 红包补偿
                    </div>
          <div className='panel-inner'>
            <Flex justify='center' className='steps'>
              <Flex.Item className='step'>
                <div className='step-icon step-icon-phone' />
                <div className='step-title'>
                  <p>注册</p>现金卡
                                </div>
              </Flex.Item>
              <Flex.Item className='step'>
                <div className='step-icon step-icon-money' />
                <div className='step-title'>
                  <p>选择借款</p>额度期限
                                </div>
              </Flex.Item>
              <Flex.Item className='step'>
                <div className='step-icon step-icon-information' />
                <div className='step-title'>
                  <p>填写资料</p>提交审核
                                </div>
              </Flex.Item>
              <Flex.Item className='step'>
                <div className='step-icon step-icon-compensate' />
                <div className='step-title text-danger'>
                  <p>审核被拒</p>获得赔偿
                                </div>
              </Flex.Item>
            </Flex>
            <Flex className='details'>
              <Flex.Item>
                <div className='red-packet'>
                  <div className='amount'>1000<span>元</span></div>
                </div>
              </Flex.Item>
              <Flex.Item>
                <div className='description'>
                  <p>用户首次在平台上申请借</p>
                  <p>款，资料属实，如因风控</p>
                  <p><span className='text-danger'>审核未能通过</span>，将获<span className='text-danger'>最高</span></p>
                  <p><span className='text-danger'>1000元现金红包</span>补偿。</p>
                </div>
              </Flex.Item>
            </Flex>
          </div>
        </div>
        <div className='panel'>
          <div className='panel-title'>
            <i className='icon icon-money' />
                        极速放款 慢了就赔
                    </div>
          <div className='panel-inner'>
            <Flex align='start' justify='center' className='steps'>
              <Flex.Item className='step normal'>
                <div className='step-icon step-icon-apply' />
                <div className='step-title'>
                                    申请借款
                                </div>
              </Flex.Item>
              <Flex.Item className='step'>
                <div className='step-normal'>
                  <div className='step-title'>
                                        审核
                                        <span className='text-danger'>超过2小时</span>
                  </div>
                  <div className='step-arrow' />
                  <div className='step-title'>用户获得红包</div>
                </div>
              </Flex.Item>
              <Flex.Item className='step'>
                <div className='step-icon step-icon-success' />
                <div className='step-title'>
                                    审核通过
                                </div>
              </Flex.Item>
              <Flex.Item className='step'>
                <div className='step-icon step-icon-compensate' />
                <div className='step-title text-danger'>
                                    超时赔偿
                                </div>
              </Flex.Item>
            </Flex>
            <Flex className='details'>
              <Flex.Item>
                <div className='red-packet'>
                  <div className='amount'>100<span>元</span></div>
                </div>
              </Flex.Item>
              <Flex.Item>
                <div className='description'>
                  <p>用户从成功提交借款申请到</p>
                  <p>审核通过，时间<span className='text-danger'>大于2小时</span>，</p>
                  <p>即可获得随机红包补偿，最</p>
                  <p><span className='text-danger'>高100元！</span></p>
                </div>
              </Flex.Item>
            </Flex>
          </div>
        </div>
        <div className='quick-loan'>
          <div className='quick-loan-button' onClick={this.onLoan} />
        </div>
        <Modal
          className='modal-primary'
          title='参与规则'
          transparent
          onClose={this.close}
          visible={this.state.visible}
          closable>
          <div className='modal-primary-content'>
            <div className='modal-primary-content-inner'>
              <ul>
                <h5>1.活动时间：</h5>
                <li>2017年1月16日起</li>
              </ul>
              <ul>
                <h5>2.参与条件：</h5>
                <li>拒就赔（活动期间24小时均可参加，仅限首次借款用户）</li>
                <li>慢就赔（活动期间9:00-18:00，新老用户均可）</li>
              </ul>
              <ul>
                <h5>3.活动奖励：</h5>
                <li>活动期间每天按照申请顺序限量发出2万个双赔红包（拒就赔、慢就赔各一万个），如果截止至当日23:59:59仍未发放完毕，则当日剩余红包作废</li>
              </ul>
              <ul>
                <h5>4.奖励如何领取：</h5>
                <li>第一步：当你符合赔偿条件时，系统将会自动显示赔偿红包领取图标<img className='icon' src={redPacket} /> ，你可在首页审核结果页面或“借款记录”-“借款详情”中找到，图标显示时间为7天，如7天内未领取，视为自动放弃，图标消失</li>
                <li>第二步：点击图标领取红包，根据页面提示操作成功后，系统将随机发放一个现金红包/现金抵扣券至您的账户（拒就赔用户为现金红包，慢就赔用户为现金抵扣券），可至“我的优惠”中查看领取，有效期20天，请在有效期内使用</li>
              </ul>
              <ul>
                <li>5.对于胡填乱写审核资料或利用非法手段恶意刷奖用户，平台有权利取消红包领取资格。</li>
              </ul>
              <ul>
                <li>6.本活动最终解释权归现金卡所有，如有疑问请联系：400-681-2016</li>
              </ul>
            </div>
          </div>
        </Modal>
      </div>
    )
  }
};
