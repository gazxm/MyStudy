import React from 'react'
import { post } from 'utils'
import { Modal } from 'antd-mobile'
import 'scss/mobile/agreement.component.scss'

export default class Authorization extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: {}
    }
  }

  componentDidMount () {
    document.title = '授权委托书'
    const { query } = this.props.location
    post(`http://credit.xianjincard.com/user-contract/get-loan-grant`, {
      order_id: query.order_id,
      str_order: query.str_order,
      str_user_id: query.str_user_id
    }).then(data => data.data).then(data => {
      if (data.code !== 0) {
        Modal.alert('', data.message, [{
          text: '确定'
        }])
        return
      }
      this.setState({
        data: data.data
      })
    })
  }

  render () {
    const { data } = this.state

    return (
      <div className='agreement auth'>
        <h1>授权委托书</h1>
        <p>授权人：{data.username}</p>
        <p>被授权人：<span>上海浅橙网络科技有限公司</span><br /><span className='indent'>{data.company}</span></p>
        <p className='margin'>授权人<b>（非高等院校全日制学生）</b>同意并签署本授权委托书，在此通过本授权委托书作出如下授权与承诺：</p>
        <p>一、授权人一经签署本授权委托书，即视为已经同意并授权被授权人及与被授权人合作方的指定第三方银行或第三方支付机构（以下简称“指定第三方”）对授权人通过被授权人运营的网络平台（以下简称“被授权人平台”）发起借款项目（包括本授权委托书生效之前及其之后的借款项目，具体以授权人签订的各《贷款合同》、《借款协议》、《平台服务协议》为准，以下简称相关协议）进行身份信息验证、银行卡验证等必要的信息验证。</p>
        <p>二、授权人同意，在各相关协议生效后，指定第三方有权依照各相关协议约定的期限和金额从授权人通过本授权委托书指定的银行卡（银行卡账户信息见第十三条）进行资金的代扣、代还、代付及划转各相关协议项下的全部应付款项。</p>
        <p>三、授权人承诺，本授权委托书第十三条记载的授权银行卡账户是以本人真实姓名开立的合法、有效的银行卡账户，授权人同意本授权委托书第一条、第二条约定的资金代扣及转账优先于该账户其他任何用途的支付。</p>
        <p>四、授权人同意，与本授权委托书项下的资金代扣、代还、代付及划转服务相关的任何责任，如在借款成功后，因指定第三方的系统维护等任何原因导致无法将款项代还至授权指定的银行卡账户中等情况发生，被授权人、被授权人合作方及指定第三方亦无需承担责任。</p>
        <p>五、授权人在指定银行卡账户中必须留有足够余额，否则因账户余额不足或不可归责于被授权人的任何事由，导致无法及时扣款或扣款错误、失败，责任由授权人自行承担。</p>
        <p>六、各相关协议的债权人按照相关协议约定和被授权人平台规则转让各相关协议项下的债权的，不影响本授权委托书的有效性。</p>
        <p>七、授权人针对授权人指定的银行卡账户向被授权人进行授权后，即视为授权人就该银行卡在授权人通过被授权人平台发起的所有借款项目范围内进行了授权，不因授权人后续更换绑定银行卡，或对其他银行卡进行授权而无效或产生任何影响。</p>
        <p>八、本授权委托书为授权人对被授权人从其授权的指定账户中扣款和/或向该账户转账的授权证明，不作为收付现金的直接凭据。</p>
        <p>九、凡本授权委托书中未约定的事项，适用各相关协议的约定，凡本授权委托书中出现的与各相关协议相同的词语或术语，如果在本授权委托书中无特别定义，适用各相关协议中相同词语和术语的定义、涵义或解释，本授权委托书的规定与各相关协议不一致的，以本授权委托书的规定为准。</p>
        <p>十、授权人发起终止授权或变更账户、通讯地址时，在当期款项支付日2个工作日前通知被授权人并完成信息更新，否则自行承担所造成的风险损失。</p>
        <p>十一、授权人保证本授权委托书的真实性、合法性、有效性，被授权人依据本授权委托书进行的操作引起的一切法律纠纷或风险，由授权人独立承担或解决。</p>
        <p>十二、本授权委托书自授权人确认同意起生效，至授权人通过被授权人平台签订的全部相关协议履行完毕，所有款项全部还清时终止。</p>
        <p>十三、授权人资料：</p>
        <table>
          <tbody>
            <tr>
              <td>姓名</td>
              <td>{data.username}</td>
            </tr>
            <tr>
              <td>身份证号码</td>
              <td>{data.idnumber}</td>
            </tr>
            <tr>
              <td>联系手机</td>
              <td>{data.phone}</td>
            </tr>
            <tr>
              <td>借记卡户名</td>
              <td>{data.account}</td>
            </tr>
            <tr>
              <td>借记卡开户银行</td>
              <td>{data.cardname}</td>
            </tr>
            <tr>
              <td>借记卡账号</td>
              <td>{data.cardno}</td>
            </tr>
          </tbody>
        </table>
        <p className='no-indent'>（以下无正文）</p>
        <p className='right'>{data.time_str ? data.time_str : '年 月 日'}</p>
      </div>
    )
  }
}
