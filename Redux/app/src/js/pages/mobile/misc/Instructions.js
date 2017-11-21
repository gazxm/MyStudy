import React from 'react'
import 'scss/mobile/instructions.component.scss'

export default class Instructions extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    document.title = '使用说明'
  }

  render () {
    return (
      <div className='instructions'>
        <div className='content'>
          <h3>什么是优惠券？</h3>
          <p>优惠券是现金卡为了推出的平台福利，有抵扣券、返现券、临时提额券和续期券4种。</p>
          <div className='line' />
          <h3>如何使用优惠券？</h3>
          <p>抵扣券仅白卡和金卡产品适用，每单借款仅可使用一张，在借款申请页面选择可使用的抵扣券即可，返现券可抵扣部分还款金额；与平台其他优惠券不可同时使用。</p>
          <br />
          <p>返现券仅白卡和金卡产品适用，每单借款仅可使用一张，在借款申请页面选择可使用的返现券即可；与平台其他优惠券不可同时使用<br />返现券返现金额=（用户借款服务费+利息）*返现天数/借款期限<br />备注：返现金额不满1元部分将不进行返现。</p>
          <br />
          <p>临时提额券仅白卡和金卡产品适用，每单借款仅可使用一张，在借款申请页面选择可使用的提额券即可，可临时提高借款额度；与平台其他优惠券不可同时使用。</p>
          <br />
          <p>续期券仅白卡和金卡产品适用，每次续期操作时仅可使用一张，可抵扣部分续期费用；</p>
        </div>
      </div>
    )
  }
}
