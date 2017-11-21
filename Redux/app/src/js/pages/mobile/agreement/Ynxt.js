import React from 'react'
import { post } from 'utils'
import { Modal } from 'antd-mobile'
import 'scss/mobile/agreement.component.scss'

export default class Ynxt extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: {
        repayment: {}
      }
    }
  }

  componentDidMount () {
    document.title = '云南信托贷款合同'
    const { query } = this.props.location
    post('http://credit.xianjincard.com/user-contract/get-yunnan-contract', {
      money: query.money,
      period: query.period,
      fund: query.fund,
      card_type: query.card_type,
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
      <div className='agreement ynxt'>
        <h3 className='center'>附件1：信托贷款合同信息表</h3>
        <table>
          <tbody>
            <tr>
              <td colSpan='100'>贷款合同信息表编号：云信信2017-13-DK-【{data.contact_id}】</td>
            </tr>
            <tr>
              <td colSpan='100'>甲方（贷款人）：云南国际信托有限公司</td>
            </tr>
            <tr>
              <td rowSpan='4'>乙方（借款人）</td>
            </tr>
            <tr>
              <td colSpan='3'>姓名：{data.user_name}</td>
              <td colSpan='3' style={{textAlign: 'center', paddingLeft: '0'}}>收款\还款账户信息</td>
            </tr>
            <tr>
              <td colSpan='3'>手机号：{data.user_mobile}</td>
              <td colSpan='3'>开户行：{data.user_bank}</td>
            </tr>
            <tr>
              <td colSpan='3'>身份证号码：{data.id_number}</td>
              <td colSpan='3'>银行卡号：{data.card_no}</td>
            </tr>
            <tr>
              <td rowSpan='6'>还款计划</td>
            </tr>
            <tr>
              <td>期数</td>
              <td>还款日期</td>
              <td>应还款额</td>
              <td>本金</td>
              <td>利息</td>
              <td>服务费</td>
            </tr>
            <tr>
              <td>{data.repayment.index}</td>
              <td>{data.repayment.plan_time}</td>
              <td>{data.repayment.remain_money}</td>
              <td>{data.repayment.principal}</td>
              <td>{data.repayment.loan_interests}</td>
              <td>{data.repayment.counter_fee}</td>
            </tr>
          </tbody>
        </table>
        <h3 className='center margin-top'>附件2：授权书</h3>
        <p className='no-indent'>本人 ，身份证号码为：【{data.id_number}】</p>
        <p>鉴于：本人与云南国际信托有限公司于{data.contract_date}签署了编号为【{data.contact_id}】的《贷款合同》，本人根据该等《贷款合同》的约定应当承担按期还本付息等义务。 兹确认：</p>
        <p>1. 本人在此做出以下不可撤销且无条件的授权，授权云南国际信托有限公司（下称 “云南信托”）或云南信托指定的银行、上海浅橙网络科技有限公司、其他第三方支付机构（下称“代扣机构”）等，根据还款计划从本人预留的自有的账户中划扣相应金额的资金。</p>
        <p>2. 本人确认，如本人自有账户内的资金不足，或者由于本人的自有账户被查封、冻结等任何原因而导致代扣机构无法根据云南信托的指令从本人的自有账户中划扣或足额划扣相应款项的，则代扣机构有权从本人预留的自有账户中划扣所有可以划扣的款项，不足的部分本人将根据《贷款合同》的约定向云南信托进行支付，并承担相应的违约责任。</p>
        <p className='bold'>3. 本人授权甲方及甲方聘请的服务机构--上海浅橙网络科技有限公司为信用评估、数据处理、风险控制、逾期账款催收等与本合同履行相关的目的从有关机构或单位（包括但不限于中国人民银行个人信用信息基础数据库、合法的征信机构、公安机关、公积金、社保、税务、民政以及其他第三方信息服务机构）查询本人个人信息或者向上述机关或单位报送本人个人信息。</p>
        <p>4. 本委托授权的期限自本授权函出具日起，至本人在《贷款合同》项下的全部义务履行完毕时止。</p>
        <p className='small-top'>本授权书由本人点击附有本授权书电子版页面上“确认”或“同意”的按钮后生效，为本人真实意思的表达。</p>
        <p className='right'>授权人：{data.user_name}</p>
        <p className='right'>日期：{data.contract_date}</p>
        <h3 className='center margin-top'>云南信托普惠66号现金卡单一资金信托<br />信托贷款合同</h3>
        <p className='center'>编号：云信信2017-13-DK-【{data.contact_id}】</p>
        <table>
          <tbody>
            <tr>
              <td colSpan='100'>甲方（贷款人）：云南国际信托有限公司</td>
            </tr>
            <tr>
              <td rowSpan='4'>乙方（借款人）</td>
            </tr>
            <tr>
              <td>姓名：{data.user_name}</td>
              <td style={{textAlign: 'center', paddingLeft: '0'}}>收款\还款账户信息</td>
            </tr>
            <tr>
              <td>手机号：{data.user_mobile}</td>
              <td>开户行：{data.user_bank}</td>
            </tr>
            <tr>
              <td>身份证号码：{data.id_number}</td>
              <td>银行卡号：{data.card_no}</td>
            </tr>
            <tr>
              <td colSpan='100'>甲乙双方根据中国法律法规，就本贷款合同的具体条款，经协商达成一致，均同意信守。借款人对具体条款及基本条款已充分注意并完全理解。</td>
            </tr>
            <tr>
              <td rowSpan='3'>基本要素</td>
            </tr>
            <tr>
              <td>借款本金：【{data.loan_amount}】元</td>
              <td>周期：【{data.loan_period}】</td>
            </tr>
            <tr>
              <td>贷款利率：【{data.loan_rate}】%/年</td>
              <td>贷款偿还方式：【{data.repayment_type}】</td>
            </tr>
            <tr>
              <td>借款用途</td>
              <td colSpan='2' style={{textAlign: 'center'}}>个人日常生活消费</td>
            </tr>
          </tbody>
        </table>
        <p>甲方和乙方在本合同下文分别称为“一方”，合称“各方”。</p>
        <h3>第一条 贷款的受托支付和发放</h3>
        <p>1.1 满足下列条件后，甲方将贷款划至乙方指定接收账户：</p>
        <p>（1）乙方已按照甲方要求提供有关文件资料；</p>
        <p>（2）乙方已签署本合同；</p>
        <p>（3）保证人与甲方已签署《最高额保证合同》；</p>
        <p>（4）甲方规定的其他条件。</p>
        <p>甲方有权单方面决定调整上述放款条件，乙方不得抗辩。</p>
        <p>1.2 贷款起息日为贷款发放至借款人预留账户之日。</p>
        <p>1.3 在贷款发放至借款人预留账户前，甲方保留对乙方终止发放贷款的权利，且该行为不视为甲方违约。双方的借贷金额，以甲方对乙方账户实际发放的贷款数目为准。</p>
        <h3>第二条 正常还款</h3>
        <p>2.1 正常情况下，乙方采用以下第 3 种方式还款：</p>
        <p>（1）委托扣款的还款方式，即乙方授权甲方在乙方绑定的银行卡扣划相应款项。</p>
        <p>（2）主动还款。</p>
        <p>（3）甲方委托合作的第三方支付机构从乙方在第三方支付账户（包括但不限于快捷通、宝付、通联、中金、拉卡拉、先锋、京东、翼支付等）扣划相应款项至甲方信托财产专户。</p>
        <p>2.2 如果任何本合同项下的代扣失败，无论何种原因所致，乙方在本合同项下的还款义务不得因此而减免，如有必要乙方应采取主动还款的方式继续清偿债务。</p>
        <p>2.3 乙方知悉并同意，上海浅橙网络科技有限公司基于与乙方签订的《用户服务协议》向乙方收取相关服务费，相关服务费由乙方自行承担。乙方与上海浅橙网络科技有限公司因《用户服务协议》而产生的一切纠纷，均由乙方与上海浅橙网络科技有限公司自行解决，甲方不承担任何责任。</p>
        <p>2.4 甲方以还款金额成功划付至信托财产专户时间为准记录乙方还款时间。还款金额、还款时间详见本合同附件1约定。如还款日遇到法定节假日或公休日，还款日期不进行顺延。甲方以书面文件通知还款或划款的，相关义务人应当按照通知的期限内将应还款项划付至甲方指定账户。</p>
        <p>2.5 乙方应偿还本合同项下所有应付本金、利息和逾期罚息的收款银行账户为本合同项下的信托财产专户，账户信息如下：</p>
        <p>户    名：【  云南国际信托有限公司  】</p>
        <p>开户银行：【  平安银行深圳南山支行  】</p>
        <p>账    号：【  19521071000096  】</p>
        <h3>第三条 逾期还款</h3>
        <p>3.1 乙方贷款逾期的，应当支付本金、利息和逾期罚息（上述款项合称为“逾期款项”）。乙方所绑定银行卡账户余额不足、在甲方的第三方支付账户余额不足或甲方委托合作的第三方支付机构迟于还款日期或指定日期划付应还款项至信托财产专户的，视为乙方贷款逾期。</p>
        <p>3.2 贷款逾期期间为自逾期发生之日起计算至逾期款项清偿之日止。从逾期之日起（含该日）每日按当期应还金额的【1%】计收逾期罚息，按国家法律规定，逾期费用超过本金年化利率36%的部分，不再计算与收取，但乙方仍应承担因乙方违约逾期还款，出借人诉诸维权的费用，包括但不限于：</p>
        <p>（1）因债权转让发生的税费；</p>
        <p>（2）诉讼、仲裁过程中支出的费用，包括法院、仲裁机构收取的费用等；</p>
        <p>（3）审计费、拍卖费、律师费等中介费用；</p>
        <p>（4）包括但不限于交通费、餐费等必要差旅费用。</p>
        <p>3.3 有足够证据证明因资金在途、系统故障、系统延迟、第三人过错导致乙方逾期还款的，甲方有权减免乙方的罚息。</p>
        <p>3.4 乙方可以从“【现金卡】应用”处查看每一期的还款、尚未到期的各期还款、以及应支付的逾期罚息等。</p>
        <p>3.5 当乙方逾期时，甲方有权自己或授权上海浅橙网络科技有限公司的合法受托人，以包括电话、手机短信或其他合法方式提醒并催告乙方履行还款义务。</p>
        <h3>第四条 提前还款</h3>
        <p>4.1 乙方有权对贷款信息表中还款计划的应还款项选择全部/部分期数提前偿还，乙方提前还款的，应按照原有还款计划（包原利息计算区间）的全部应还款项向甲方支付提前还款对应的本金和利息。</p>
        <p>4.2 乙方要求提前还款，其还款方式参照第二条约定。发生风险预警事件时提前还款的，扣款可能在到期日前发生。</p>
        <h3>第五条 借款债权的转让</h3>
        <p>5.1 甲方可根据自己的意愿，将本合同项下的全部或部分债权转让予第三人，无需事先获得乙方的同意。</p>
        <p>5.2 若甲方转让其贷款债权的，甲方授权上海浅橙网络科技有限公司将贷款债权转让交易通知乙方，包括但不限于短信、电话、APP消息推送等方式。</p>
        <h3>第六条 陈述与保证</h3>
        <p>6.1 乙方已在申请文件中向甲方如实、完整地说明了其个人有关信息，乙方保证上述情况说明及材料（如有）全部真实、完整、准确、有效，不存在任何隐瞒、虚假陈述或误导。</p>
        <p>6.2 乙方保证本合同项下任何一笔借款的用途符合国家法律、法规和规范性文件的规定并符合本合同约定的用途，不擅自改变借款用途或将借款挪作他用。</p>
        <p>6.3 乙方应积极配合甲方对乙方的信用、借款使用情况、借款偿还情况进行监督。</p>
        <p>6.4 如果乙方违约，乙方不可撤销地同意甲方（或者其授权的第三方）直接或间接，就该违约事件通过当面拜访、短信、电话、邮寄等合法形式提醒乙方或者督促乙方对违约行为进行改正，并且同意甲方向该第三方披露此违约事件。</p>
        <p>6.5 申请文件上的乙方信息发生任何变化或者发生了可能影响乙方履行本合同项下义务的任何其他情况时，乙方均应在发生变化之日起五日内通知甲方。甲方有权根据具体情况决定是否提前要求乙方清偿本协议项下的部分或全部借款。</p>
        <h3>第七条 违约</h3>
        <p>7.1 发生下列任何一项或几项情形的，视为乙方违约：</p>
        <p>（1）乙方未能按期、足额偿还贷款本息的；</p>
        <p>（2）乙方擅自改变本合同约定的借款用途的；</p>
        <p>（3）乙方提供虚假资料或故意隐瞒重要事实，影响甲方和上海浅橙网络科技有限公司审核乙方信用和还款能力的；</p>
        <p>（4）乙方存在可能无法正常还款的情况（包括但不限于财务状况恶化、无法联系、注销现金卡账户、账户冻结、拒绝承认欠款等）且不及时进行补救的；</p>
        <p>（5）乙方违反其在本合同项下的其他义务的、承诺或保证的；</p>
        <p>7.2 违约事件发生时，甲方有权采取包括但不限于下述措施：</p>
        <p>（1）甲方视情况要求乙方立即提前清偿本协议项下的全部或部分债务（包括不限于全部本息、逾期违约金及给乙方造成的全部损失），无论债务是否到期；</p>
        <p>（2）发生逾期情况时，甲方将根据应还未还款项逐日收取一定比例的逾期罚息，直至清偿为止。</p>
        <p>（3）要求乙方偿还债务并承担甲方实现债权所支付的费用。</p>
        <p>（4）乙方有逃避甲方监管、拖欠借款及利息、恶意逃避债务等行为时，甲方有权将该等行为向其所在单位及其他有关单位通报，并在媒体及网络平台上公告。</p>
        <p>（5）宣布本合同项下未偿还的贷款提前到期，有权委托还款账户开户行或第三方支付机构组织从乙方的还款账户中扣除相应金额以收回逾期罚息和贷款本息，并以合法手段追偿应付款项；</p>
        <p>7.3 除本合同另有约定外，若因一方违约而给对方造成损失的，违约方有责任对对方的损失予以赔偿，损失赔偿范围包括但不限于所有直接损失、间接损失、为处理该争议支付的诉讼费、律师费、鉴定费、差旅费等全部费用。</p>
        <h3>第八条 通知</h3>
        <p>8.1 甲方、甲方委托的合作机构将根据乙方按照本合同或乙方向上海浅橙网络科技有限公司【现金卡】APP或网络数据页面平台提供的通讯方式如手机号码、电子邮箱等向乙方发出与借款及还款计划相关的通知或其他信息。</p>
        <p>8.2 乙方亦可通过登录上海浅橙网络科技有限公司【现金卡】APP或网络数据页面自行查询与授信额度申请、借款申请及还款计划相关的通知或其他信息。</p>
        <h3>第九条 争议解决</h3>
        <p>9.1 本合同适用中华人民共和国（仅为本合同之目的，不包括香港特别行政区、澳门特别行政区和台湾地区）法律。</p>
        <p>9.2 凡因本合同引起的或与本合同有关的任何争议，应通过协商解决，若协商仍无法解决，任何一方可以向甲方所在地的人民法院提起诉讼。</p>
        <p>9.3 若争议正在解决过程之中，除存在争议的条款和事项之外，合同各方应继续履行其在本合同项下的所有义务。</p>
        <h3>第十条 免责条款</h3>
        <p>10.1 借款发放前，如因国家有关部门颁布的法律、法规、规范性文件等导致甲方合作的金融机构不能发放本协议项下的借款的，甲方有权停止发放借款或解除本协议，不视为甲方违约，甲方不承担任何责任。</p>
        <h3>第十一条 其他约定 </h3>
        <p>11.1 本合同自甲、乙双方签署时成立，自甲方将出借款项支付到乙方指定收款账户时生效。</p>
        <p>11.2 本合同的任何修改、补充均须以书面形式做出，补充条款与本合同具有同等的法律效力。</p>
        <p>11.3 本合同的电子件、传真件、复印件和扫描件等有效复本的效力与本合同原件具有同等法律效力。</p>
        <p className='margin-top'>（本页无正文，仅为《云南信托普惠66号现金卡单一资金信托贷款合同》之签署页）</p>
        <p className='margin'>甲方：云南国际信托有限公司</p>
        <p className='margin'>乙方（借款人）：{data.user_name}</p>
      </div>
    )
  }
}