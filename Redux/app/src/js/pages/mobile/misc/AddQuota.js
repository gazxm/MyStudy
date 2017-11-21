import React from 'react'
import 'scss/mobile/addQuota.component.scss'

export default class AddQuota extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div className='add-quota'>
        <div className='header'>
          <h3>提额攻略</h3>
          <p>1.下载【现金白卡】APP，完成更多高级认证，可提升至金卡，享受更高额度，更低利率，更长期限产品哦~</p>
          <p>①iOS用户在App store搜索并下载“<b>现金白卡</b>”</p>
          <p>②Android用户请在各大应用市场下载“<b>现金白卡</b>”</p>
          <p className='margin-top'>2.关注微信公众号(<b>xjbk88</b>)，参与活动领提额券，立享更高额度。</p>
        </div>
        <i className='wave' />
        <i className='code' />
        <i className='logo' />
      </div>
    )
  }
}
