import React from 'react'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { get, login } from 'utils'
import 'scss/activity/overlord-order.component.scss'

export default class Service extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: {}
    }
  }

  componentWillMount () {
    const { query } = this.props.location
    Toast.loading('')
    get(`http://credit.xianjincard.com/activity/vip-act/contract${query.id ? `?id=${query.id}` : ''}`).then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        if (data.code === -1001) {
          Popup.alert(`<p>${data.message}</p><a class='click'>马上登录</a>`, 'popup')
          Popup.click('a.click', login)
          return
        }
        Popup.alert(`<p>${data.message}</p><a class='click'>朕知道了</a>`, 'popup')
        Popup.click('a.click')
        return
      }
      this.setState({
        data: data.data
      })
    })
  }

  componentDidMount () {
    document.title = '霸王令服务协议'
  }

  render () {
    const { data } = this.state

    return (
      <div className='transition-group'>
        <div className='service'>
          <h2>“霸王令”活动合同</h2>
          <p>根据《中华人民共和国合同法》、上海浅橙网络科技有限公司（乙方）“现金卡”有关法律法规及平台的规定，甲乙双方在平等、自愿、公平和诚实信用的基础上，就甲方参与乙方“霸王令”活动有关事宜协商订立合同如下：</p>
          <h3>第一条  活动事宜</h3>
          <h4>1.活动种类、费用及支付方式</h4>
          <table width='100%'>
            <tbody >
              <tr>
                <td width='18%'>
                  甲方
                </td>
                <td>{data.user_name ? data.user_name : ''}</td>
                <td width='18%'>
                  身份证
                </td>
                <td>{data.id_number ? data.id_number : ''}</td>
              </tr>
              <tr>
                <td rowSpan='2' colSpan='1'>
                  活动种类
                </td>
                <td rowSpan='2' colSpan='1' width='34%'>
                  霸王令活动（仅限现金白卡）
                </td>
                <td width='30%'>
                  活动费（人民币）<br />（人民币）
                </td>
                <td>
                  {data.price ? data.price : 300}元
                </td>
              </tr>
              <tr>
                <td colSpan='1' rowSpan='1'>
                  支付时间
                </td>
                <td colSpan='1' rowSpan='1'>
                  {data.pay_time ? data.pay_time : null}
                </td>
              </tr>
              <tr>
                <td>
                  支付方式
                </td>
                <td>
                  银行卡
                </td>
                <td>
                  手机号码：
                </td>
                <td>
                  {data.phone ? data.phone : null}
                </td>
              </tr>
            </tbody>
          </table>
          <p>（1）该活动仅限甲方本人使用，不得转让他人。 </p>
          <p>（2）活动期间，甲方应按照本活动及《借款合同》约定按时、足额还款。甲方部分或全部违约后，不得以实际未使用或未足额使用为由申请退还全部或部分活动费。</p>
          <p>（3）该活动不与乙方其他优惠促销活动同时使用。</p>
          <h4>2.有效期限</h4>
          <p>（1）该活动有效期限自<b>甲方购买并支付“霸王令”之日</b>起<span>60天</span>，即<span className='line' >{data.start_time ? data.start_time.slice(0, 4) : null}</span>年 <span className='line'>{data.start_time ? data.start_time.slice(5, 7) : null}</span>月<span className='line' >{data.start_time ? data.start_time.slice(8, 10) : null}</span>日至<span className='line'>{data.end_time ? data.end_time.slice(0, 4) : null}</span> 年 <span className='line'>{data.end_time ? data.end_time.slice(5, 7) : null}</span>月 <span className='line'>{data.end_time ? data.end_time.slice(8, 10) : null}</span>日；有效期限届满后甲方不再享有该活动。</p>
          <p>（2）有效期届满后，甲方不得以实际未使用或未足额（4次）使用为由申请退还全部或部分活动费。</p>
          <h3>第二条  甲方的权利和义务</h3>
          <p className='bold'>1、自支付活动费之日起的60天内，甲方将享有有活动规则规定的权利，在此期间因甲方通过乙方申请借款而产生的综合服务费乙方将不再额外收取。</p>
          <p className='bold'>2、活动期间，若甲方发生逾期还款等违约行为且超过3日，则将失去活动机会，乙方有权单方终止本合同，并且有权要求甲方支付因甲方违约产生的全部费用。</p>
          <h3>第三条  乙方的权利和义务</h3>
          <p className='bold'>1、在活动期内，乙方应保障甲方的上述权利及时实现，不设置新的审查条件。</p>
          <p className='bold'>2、若甲方违约，乙方有权终止合同。乙方有权要求甲方支付因甲方违约产生的全部费用。</p>
          <h3>第四条  活动费内容</h3>
          <p>1.活动费包含：乙方服务费、信息认证费、风控服务费、风险准备金。</p>
          <p>2.活动费不包含：借款本金、利息、因甲方逾期还款产生的其他费用包括但不限于债权转让产生的税费、诉讼费、仲裁费、审计费、律师费、交通费等一切因出借人诉诸维权的费用。</p>
          <h3>第五条  免责条款：服务合同履行期间，因甲方逾期还款或个人征信等原因造成甲方无法获得出借款项的，乙方不承担任何违约责任及损失赔偿。</h3>
          <h3>第六条  重要事项告知方式</h3>
          <p>乙方向甲方告知本服务合同中重要事项，应当采用<b> □APP  □短信 </b>方式。</p>
          <h3>第七条 争议解决方式</h3>
          <p>本合同项下发生的争议，由双方协商解决或向有关部门申请调解解决；协商或调解解决不成的，可以向乙方所在地人民法院提起诉讼。</p>
          <h3>第八条 其他约定</h3>
          <p>1、本协议经甲方在线确认购买的方式签订，本协议一经签署，即视为甲方向乙方发出不可撤销的活动要约；</p>
          <p>2、有关本协议的任何修改、补充，双方均须在乙方或乙方合作方网络平台上以电子文本形式作出；</p>
          <p>3、双方均确认，本协议的签订、生效和履行以不违反法律为前提。如果本协议中的任何一条或多条违反适用的法律，则该条将被视为无效，但该无效条款并不影响本协议其他条款的效力；</p>
          <p>4、甲方委托乙方保管所有与本协议有关的书面文件或电子信息；</p>
          <p>5、本协议未尽事宜，由甲、乙双方协商处理，或者按国家有关法律、法规的规定执行；</p>
          <p>6、本协议的各项补充、修订或变更，包括本协议的附件、附录及补充协议，为本协议的完整组成部分；</p>
          <p>7、本协议中所使用的定义，除非另有规定，乙方享有最终解释权。</p>
          <em>请用户仔细阅读条款及服务方提供的其他书面或电子材料，甲方购买“霸王令”后视为已知悉并认可上述内容。</em>
        </div>
      </div>
    )
  }
}
