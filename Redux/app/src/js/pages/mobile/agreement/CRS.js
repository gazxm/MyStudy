import React from 'react'
import { post } from 'utils'
import { Modal } from 'antd-mobile'
import 'scss/mobile/agreement.component.scss'

export default class CRS extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      data: {}
    }
  }

  componentWillMount () {
    document.title = '线上个人消费信贷借款合同'
    const { query } = this.props.location
    post('http://credit.xianjincard.com/user-contract/get-hai-nan-contract', {
      order_id: query.order_id,
      money: query.money
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

    const loanMoney = data.loan_money ? data.loan_money + '' : '0'

    return (
      <div className='agreement crs'>
        <h3 className='right'>零售类/线上消贷/002</h3>
        <h1>线上个人消费信贷借款合同</h1>
        <h2>合同编号:B海银消贷字【{data.loan_time ? data.loan_time.slice(0, 4) : null}】年{data.contract_id}号【-】行【-】部/支行</h2>
        <h4 className='no-indent'>甲方（出借人）: 【海南银行股份有限公司】</h4>
        <h4>法定代表人（负责人）：王年生</h4>
        <h4>证照种类：营业执照</h4>
        <h4>证照号码：91460000348086474N</h4>
        <h4>联系地址：海南省海口市龙华区海秀东路31号</h4>
        <h4>联系电话：0898-96566</h4>
        <h4 className='no-indent'>乙方（借款人）: 【{data.username}】</h4>
        <h4>证照种类：{data.card_type}</h4>
        <h4>证照号码：{data.card_number}</h4>
        <h4>联系地址：{data.contact_address}</h4>
        <h4>联系电话：{data.phone}</h4>
        <h4 className='no-indent'>丙方（服务方）：【上海浅橙网络科技有限公司】</h4>
        <h4>证照种类：营业执照</h4>
        <h4>证照号码：91310120351089799E</h4>
        <h4>联系地址：上海市杨浦区政学路88号创智天地四期5号楼602 浅橙科技</h4>
        <h4>联系电话：021-80260892</h4>
        <p>甲方是一家拥有完全民事行为能力能够独立承担民事责任的法人银行。乙方是拥有完全民事行为能力能够独立承担民事责任的自然人，具备所有必要的权利能力，能以自身名义履行本合同的义务并承担民事责任。丙方是一家合法成立并有效存续的有限责任公司，向甲方推介有融资需求的乙方。丙方接受甲方和乙方的委托，对乙方的个人信息、借款用途以及还款来源等进行初步审核，接受甲方委托对乙方开展还款提醒等活动。根据《中华人民共和国合同法》及相关法律法规的规定，本合同各方遵循诚实信用、平等自愿、互惠互利的原则，就有关借款事项各方达成如下协议，以资共同信守。</p>
        <h3>第一条 借款基本信息</h3>
        <table className='table-one'>
          <tbody>
            <tr>
              <td>借款用途</td>
              <td>个人消费</td>
              <td>--</td>
              <td>百</td>
              <td>十</td>
              <td>万</td>
              <td>千</td>
              <td>百</td>
              <td>十</td>
              <td>元</td>
              <td>角</td>
              <td>分</td>
            </tr>
            <tr>
              <td>借款本金</td>
              <td>人民币{data.loan_money}元</td>
              <td>￥</td>
              <td>{loanMoney && loanMoney.length - 6 >= 0 ? loanMoney.slice(loanMoney.length - 7, loanMoney.length - 6) : null}</td>
              <td>{loanMoney && loanMoney.length - 5 >= 0 ? loanMoney.slice(loanMoney.length - 6, loanMoney.length - 5) : null}</td>
              <td>{loanMoney && loanMoney.length - 4 >= 0 ? loanMoney.slice(loanMoney.length - 5, loanMoney.length - 4) : null}</td>
              <td>{loanMoney && loanMoney.length - 3 >= 0 ? loanMoney.slice(loanMoney.length - 4, loanMoney.length - 3) : null}</td>
              <td>{loanMoney && loanMoney.length - 2 >= 0 ? loanMoney.slice(loanMoney.length - 3, loanMoney.length - 2) : null}</td>
              <td>{loanMoney && loanMoney.length - 1 >= 0 ? loanMoney.slice(loanMoney.length - 2, loanMoney.length - 1) : null}</td>
              <td>{loanMoney && loanMoney.length >= 0 ? loanMoney.slice(loanMoney.length - 1, loanMoney.length) : null}</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>应还本息合计</td>
              <td colSpan='11'>{data.total_money_back}元</td>
            </tr>
            <tr>
              <td>借款期限</td>
              <td>自{data.loan_time ? data.loan_time.slice(0, 4) : null}年{data.loan_time ? data.loan_time.slice(5, 7) : null}月{data.loan_time ? data.loan_time.slice(8, 10) : null}日起至{data.plan_time ? data.plan_time.slice(0, 4) : null}年{data.plan_time ? data.plan_time.slice(5, 7) : null}月{data.plan_time ? data.plan_time.slice(8, 10) : null}日止</td>
              <td colSpan='2'>还款日</td>
              <td colSpan='9'>{data.plan_time ? data.plan_time.slice(0, 4) : null}年{data.plan_time ? data.plan_time.slice(5, 7) : null}月{data.plan_time ? data.plan_time.slice(8, 10) : null}日</td>
            </tr>
            <tr>
              <td>利率</td>
              <td>{data.interest}</td>
              <td colSpan='2'>还款方式</td>
              <td colSpan='9'>一次还本付息</td>
            </tr>
          </tbody>
        </table>
        <h3>第二条 借款流程与还款流程</h3>
        <p>2.1 借款流程</p>
        <p>（1）借款申请时，乙方同意指定其在甲方开立的电子账户作为本次借款的贷款发放及指定还款账户（以下简称“指定账户”），若乙方贷款申请前未在甲方开立过电子账户即同意甲方于本次借款申请时自动为其开立，借款人同意并自愿遵守《海南银行个人电子账户服务协议》与《海南银行电子账户扣款协议》（详见附件1-2)。开立电子账户时，乙方填写的本人名下其他银行账户即为指定账户的关联账户。</p>
        <p>（2）本合同成立后，甲方按本合同约定的金额划付至乙方指定账户，即视为甲方完成本合同项下资金的出借。</p>
        <p>（3）若本协议项下借款设定有担保，根据法律法规规定，担保需在相关部门办理登记或备案手续后方始生效的，甲方和乙方同意特此授权丙方指定工作人员代为办理登记或备案手续以及代为签署担保相关法律文件，以使担保产生法律效力，甲方和乙方无须另行授权。</p>
        <p>2.2 还款流程</p>
        <p>（1）乙方承诺，按照本合同第一条约定的时间和金额按时足额向甲方还款。乙方授权甲方从其在甲方开立的指定账户中将乙方应还借款本息金额进行全额扣划。乙方授权甲方在指定账户余额不足的情况下可采取第三方代扣等方式向乙方关联账户进行资金扣划，乙方知晓并同意此扣划为甲方为确保乙方还本付息成功而采取的补充措施，如扣划不成功，甲方不承担任何责任。</p>
        <p>（2）乙方须在指定账户中留有足够余额，否则因账户余额不足或不可归责于甲方或丙方的任何事由，导致无法及时扣款或扣款错误、失败，责任均由乙方自行承担。</p>
        <p>（3）乙方的还款，必须包含全部应还本金、利息、逾期罚息、违约金及所有根据本合同所产生的其他费用等。</p>
        <h3>第三条 各方声明</h3>
        <p>3.1 乙方和丙方均承诺其提供给甲方的信息真实、完整、有效。乙方保证借款需求与借款用途的真实性与合法性。甲方以本合同为依据与乙方形成真实、合法、有效的债权。</p>
        <p>3.2 乙方须亲自通过甲方或丙方平台系统向甲方提出借款申请，乙方承诺其提供的邮箱、手机号码、短信、身份信息等均为真实意思表示，所有申请信息是真实、完整、准确、合法、有效的。乙方同意并自愿签署《海南银行个人信用信息查询授权书》（详见附件3），不可撤销地授权甲方及丙方向有关机构或单位（包括但不限于中国人民银行个人信用信息基础数据库、合法的征信机构、公安机关、公积金、社保、税务、民政、关联公司等）查询或确认与乙方借款申请相关的信息，如乙方身份校验不通过或相关资信等情况未达甲方贷款条件，甲方有权拒绝乙方的贷款申请，且乙方同意无论甲方最终是否向乙方发放贷款，乙方向甲方提交的申请资料以及甲方查询获取的乙方的个人征信等信息资料均不予退还。</p>
        <p>3.3 乙方应妥善保管常用手机设备（含手机号码）、银行账户密码、线上服务平台绑定的手机号码、手机校验码等信息，并应确保不向任何人泄露以上信息。对于因账号、密码泄露所致的损失，由乙方自行承担。如乙方发现有他人冒用或盗用乙方的账号及密码申请本贷款业务的，应立即以有效方式通知甲方或丙方，要求暂停本服务。同时，乙方理解甲方及丙方对上述请求采取行动需要合理期限，在此之前，甲方及丙方对已执行的指令及(或)所导致的乙方的损失不承担任何责任。</p>
        <p>3.4 乙方不可撤销地授权甲方或丙方（或第三方支付机构）在其未能按时足额支付应付款项的情况下，在乙方全部到期应付款项的范围内，随时划扣乙方账户及其它银行账户中的资金用于归还乙方到期应付款项及其他费用，该等划扣无需乙方另行同意。</p>
        <p>3.5 甲方在此确认并同意：授权丙方作为其代理人，按照本合同约定宣布乙方未偿本息全部到期；接受乙方的提前还款申请；向甲方或乙方的联系人包括但不限于亲属、朋友联系获取信息；向乙方进行借款的违约提醒及催收工作（包括但不限于电话通知或上门通知乙方及其家属朋友、发律师函、对乙方以丙方名义提起诉讼等）等事宜。</p>
        <p>3.6 甲方享有其所出借款项所带来的利息收益及相关收益，并应主动自行缴纳由利息及相关收益带来的可能税费。</p>
        <p>3.7 甲方清楚可能面临的出借风险。甲方已充分了解并认识到了本次借款的特殊性、风险的不确定性以及回收该等借款可能面临的困难，经独立慎重判断后仍做出出借决定，并自愿签署本合同，同时乙方同意配合甲方按照其授信管理规定在必要的情况下完成贷款面谈、面签等相关手续。</p>
        <p>3.8 乙方承诺所借款项不得用于本合同约定的借款用途之外的任何其他用途,亦不用于任何违法用途,不会利用丙方进行诈骗、非法集资或其他违法行为,否则应依法独立承担法律责任。若乙方在使用本贷款额度过程中出现监管机关规定的或甲方依其主观判断认定的风险特征时，甲方有权不经任何形式的事先通知或事先确认而随时中止或终止乙方对本贷款额度的使用，乙方有义务积极协助贷款人识别相关风险，并承担因此所产生的损失。</p>
        <p>3.9 甲方承诺根据监管要求对客户资料承担保密义务，不得将收集到的用户相关信息提供给甲方以外的无关的第三方，但甲方出于向用户提供消费贷款及相关服务之目的，提供用户的个人相关信息和贷款信息给甲方的关联公司以及合作伙伴的情形除外。</p>
        <p>乙方同意并确认：甲方、丙方有权将乙方提供的或其他方自行收集的乙方资料和信息用于以下用途（包括但不限于）： </p>
        <p>（1）为了完成向甲方提供本合同项下的服务，丙方向有关的合作机构提供必要之资料；</p>
        <p>（2）办理抵押登记、公证等相关部门所需手续；</p>
        <p>（3）用于解决争议、对纠纷进行调停等其他合法用途。</p>
        <p>3.10 乙方清楚并自愿接受丙方对本次借款提供的相关服务，乙丙方双方因本次服务产生的本协议之外的其他约定事项应另行签订协议，由此产生的纠纷与甲方无关。</p>
        <h3>第四条 债权转让</h3>
        <p>4.1 乙方同意并确认，甲方可将本合同项下的全部或部分债权转让给丙方或丙方指定的第三方，债权转让次数无限定，且无需另行通知乙方，乙方承诺不以任何理由和形式对此提出异议或抗辩。</p>
        <p>4.2 甲方根据本合同转让全部或部分债权的，本借款合同中对应权利义务一并转让受让人，包括但不限于主张利息、逾期罚息、解除合同等权利和支付相关费用的义务。本合同项下的丙方变更为债权受让人，本合同项下其他条款不受影响，且对乙方仍有约束力。</p>
        <h3>第五条 提前结清</h3>
        <p>5.1 乙方可一次性全额偿还所欠借款，但须通过丙方向甲方提前申请，甲方在收到乙方申请之日起1个工作日内告知乙方结果。</p>
        <p>5.2 经甲方同意的，乙方应结清并支付所有欠款，包括本协议第一条约定的应付本息合计及提前还款违约金等。</p>
        <p>5.3 未经甲方同意的，乙方应按照原约定还款计划还款。</p>
        <h3>第六条 逾期还款</h3>
        <p>6.1 乙方未在还款日（包括被宣布提前到期）18点前在本合同指定账户上备足当期应付之利息、本金及其他应付款项的，视为乙方逾期还款。</p>
        <p>6.2 如本合同项下贷款出现逾期，丙方按本合同约定成为债权受让人的，丙方有权以合法手段进行催收（包括但不限于委托债务催讨公司、律师事务所等其他第三方机构代为催收，申请相关部门进行调查、向法院提起诉讼等），由此产生的一切费用、责任与甲方无关。</p>
        <p className='bold'>6.3 乙方无条件同意:若乙方应付款项逾期超过30日，或乙方在逾期后两次或两次以上拒绝接听电话或拒收书面催款通知，或无论以何种方式拒绝承认欠款事实等恶意行为的，甲方和丙方有权将乙方违约失信的相关信息在www.hnbankchina.com.cn及www.daishangqian.com网站或其他公开媒体上进行公告，或向媒体、用人单位、公安机关、检察机关、行业协会以及合作单位等披露，或将乙方的“逾期记录”录入中国人民银行征信系统及/或信用数据库。同时，甲方和丙方可以通过发布乙方的相关信息或悬赏等方式追索债权，并有权将乙方提交或丙方自行收集的乙方的个人资料和信息与任何第三方进行数据共享，以便甲方、丙方和其他授权第三方催收逾期借款及对用户的其他申请进行审核之用。前述行为产生的相关法律责任及后果概由乙方自负，与甲方及丙方均无涉。</p>
        <p>6.4 还款顺序：甲方和乙方同意，如乙方的还款金额不足以清偿全部到期应付款项的，乙方的还款应按照如下顺序清偿：(1)实现债权费用(包括但不限于律师费(按最高收费标准)、催收费用、交通费、人工费、运输费、担保费、鉴定费、评估费等)；(2)逾期罚息、违约金；(3)利息；(4)拖欠的借款本金。</p>
        <p>6.5 为维护甲方权利，如乙方在逾期后出现逃避、拒绝沟通或拒绝承认欠款事实等恶意行为的，经甲方确认同意将本合同下债权转让给丙方，由丙方向乙方宣布借款提前到期及追索。</p>
        <p>6.6 乙方的信息或工作情况、经营情况发生重大变动，可能影响乙方按时还款的，乙方应于发生前述变更后的五个工作日内书面通知甲方和丙方。</p>
        <h3>第七条 合同变更、解除</h3>
        <p>7.1 甲方有权随时单方面修改本合同中与乙方相关的权利义务，但相关修改不得加重乙方在贷款金额和利率方面的责任。合同变更的原因包括但不限于国家法律、法规及其他规范性文件的变化。因所涉客户数量众多，故甲方和丙方在对本合同内容进行变更时，不另行单独通知乙方，该等变更会以官方网站或其他适当方式公布，除法律法规或监管规定另有强制性规定外，经修订的内容一经公示，立即生效。若乙方不同意修改本合同，则应当自该等告示之日起立即停止使用本服务并全额还清本合同项下的应付款项；否则，视为乙方同意并接受修改后的合同。</p>
        <p>7.2 本合同生效后，除本合同另有约定外，乙方不得要求单方擅自变更或解除本合同。甲方有权基于自身经营考虑，随时宣布中断、终止本合同或其任何部分，并要求乙方在指定期限内偿还本合同项下应付款项。</p>
        <h3>第八条 违约条款</h3>
        <p>8.1 本合同各方均应严格履行各项义务，任何一方违约，违约方应承担因违约使其他各方产生的全部费用和损失，包括但不限于催收费用、调查费、诉讼费、律师费等。</p>
        <p>8.2 各方同意，若出现如下任何一种情况，本合同项下的全部借款本息自动提前到期，乙方应立即清偿本合同项下尚未偿付的全部本金、利息、逾期罚息、违约金及根据本合同产生的其他全部费用：</p>
        <p>（1）提供虚假资料、故意隐瞒重要事实；</p>
        <p>（2）未经甲方同意擅自转让本合同项下债务的；</p>
        <p>（3）乙方因任何原因逾期30天支付还款的；</p>
        <p>（4）乙方的信息或工作情况、经营情况发生重大变动的五个工作日内未书面通知其他各方的；</p>
        <p>（5）乙方在逾期偿还借款后出现逃避、拒绝沟通或拒绝承认欠款事实等恶意行为的；</p>
        <p>（6）乙方违反本合同其他规定的。</p>
        <h3>第九条 保密条款</h3>
        <p>本合同各方应当对为签署和履行本合同的目的而了解到的对方有关其债务、财务、生产、经营资料及情况等进行保密，非因促进交易、一方违约、本合同方授权或相关权力部门要求（包括但不限于法院、仲裁机构、金融托管机构等），不得对外披露。</p>
        <h3>第十条 免责条款</h3>
        <p> 甲方、丙方在出现下列情形下未履行或未完全履行本合同约定的义务而免责：</p>
        <p>1、自然灾害、贸易抵制、罢工、动乱、战乱和火灾、水灾、疫情等意外事故，政府规定、指令、法规的变更。</p>
        <p>2、黑客攻击。</p>
        <p>3、电信部门技术调整导致之重大影响。</p>
        <p>4、因政府管制而造成之暂时关闭。</p>
        <p>5、病毒侵袭。</p>
        <h3>第十一条 通知</h3>
        <p>11.1 本协议任何一方因履行本协议做出的通知和/或文件均应以书面形式做出，通过网站公示、站内消息及推送消息、专人送达、以及向您注册时预留的联系方式发出挂号邮递、特快专递、短信及邮件等方式传送。</p>
        <p>11.2 通知在下列日期视为送达：</p>
        <p>（1）网站公示，以网站公布之日即为有效送达；</p>
        <p>（2）专人递送的通知，在专人递送之交付对方日为有效送达；</p>
        <p>（3）以挂号信（付清邮资）发出的通知，在寄出（以邮戳为凭）后的五个工作日内为有效送达；</p>
        <p>（4）以特快专递（付清邮资）发出的通知，在寄出（以邮戳为凭）后的三个工作日内为有效送达；</p>
        <p>（5）以短信方式发出的通知，短信成功发出即为有效送达；</p>
        <p>（6）以邮件方式、站内消息及推送消息发出的通知，以发送成功时即为有效送达。</p>
        <p>11.3 甲方在注册时所填写的联系信息即为其有效的通讯方式，丙方在其网站上公布的联系信息即为其有效的通讯方式。</p>
        <p>11.4 甲方及乙方均授权委托丙方发送消息通知。</p>
        <p>11.5 在借款期间，乙方不得对其申请贷款时所填写的手机号码进行变更。</p>
        <h3>第十二条 争议解决</h3>
        <p>12.1 本合同及本合同所涉及的任何事项适用中华人民共和国法律（不包括香港特别行政区、澳门特别行政区和台湾地区），并按照中华人民共和国法律（不包括香港特别行政区、澳门特别行政区和台湾地区）进行解释。上述法律没有规定的,适用行业惯例。</p>
        <p>12.2 各方在履行本合同过程中所发生的争议，首先应协商解决；协商无法达成一致的，应将争议提交给海口市龙华区或上海市长宁区人民法院诉讼解决。</p>
        <h3>第十三条 合同的订立及生效</h3>
        <p>13.1 除非法律另有规定，本合同任何条款的无效或不可执行，不影响其他条款的有效性和可执行性，也不影响整个合同的效力。本合同未尽事宜，由各方协商一致后另行签订补充合同。本合同的注解、附件、补充规定为本合同组成部分，与本合同具有同等法律效力。</p>
        <p>13.2 合同的订立</p>
        <p>（1）本合同满足以下条件成立：</p>
        <p className='more-indent'>a) 乙方签字捺印；</p>
        <p className='more-indent'>b) 甲方加盖公章/合同专用章；</p>
        <p className='more-indent'>c) 丙方加盖公章/合同专用章。</p>
        <p>（2）或，本合同采用电子文本形式制成，各方通过电子签方式进行合同签署亦视为合同成立。</p>
        <p className='more-indent'>a) “电子签”是指，通过在线上点击“确认”或“同意”等相关按钮电子签署方式确认签署本合同，且各方均不得以任何理由否认已确认订立的合同的效力或不按照该等合同履行相关义务。</p>
        <p className='more-indent'>b) 在各方通过电子签的方式签署本合同后，并且丙方保存备案。如发生任何争议，各方以丙方保存备案的合同为准，各方均认可该合同的法律效力。</p>
        <p>13. 3合同的生效</p>
        <p>本合同为附条件生效合同，在同时满足以下条件后，本合同才生效：</p>
        <p>（1）本合同已经成立；</p>
        <p>（2）借款资金已经到达乙方指定账户。</p>
        <p>若以上条件未同时满足，则本协议不生效，甲方已划付的借款资金将原路退回至甲方的账户。</p>
        <p>（以下无正文）</p>
        <p>甲方（盖章）：海南银行股份有限公司</p>
        <p>乙方（签字捺印）：{data.username}</p>
        <p>丙方（盖章）：上海浅橙网络科技有限公司</p>
        <p className='right'>日期：{data.loan_time ? data.loan_time.slice(0, 4) : null}年{data.loan_time ? data.loan_time.slice(5, 7) : null}月{data.loan_time ? data.loan_time.slice(8, 10) : null}日</p>
        <h5>附件1</h5>
        <h6>海南银行个人电子账户服务协议</h6>
        <p>海南银行个人电子账户服务协议（以下简称“本协议”），是海南银行股份有限公司（以下简称“我行”）与您签订海南银行电子账户专属协议。</p>
        <p className='bold'>本协议内容中对您的权益具有重大关系或对我行具有免责或限制责任的条款均已用粗体标注，请您认真阅读。</p>
        <p>电子账户是我行为您提供的互联网金融专属服务账户，具备资金管理、金融理财、支付、消费等多项互联网金融综合服务功能，同时具有高效、安全、便捷的特性。与借记卡、存折等传统结算账户相比，电子账户无实体交易介质载体。</p>
        <h3>一、定义及解释</h3>
        <p>本协议所称个人电子账户是指您在我行开立的个人Ⅱ类银行账户（以下简称Ⅱ类户）。</p>
        <p>个人Ⅰ类户是指具有实体介质并可为您提供存款、购买投资理财产品等金融产品、转账、消费和缴费支付、支取现金等服务的账户；</p>
        <p>个人Ⅱ类户是指不具有实体介质，可为您提供存款、购买投资理财产品等金融产品、限定金额的消费和缴费支付等服务的账户。</p>
        <h3>二、声明与承诺</h3>
        <p>（一）您确认，在您申请开通我行个人账户用于接受个人账户服务（以下简称“本服务”）前，您已充分阅读、理解并接受本协议的全部内容，<b>一旦您使用本服务，即表示您同意遵循本协议的所有约定并认同我行已应您的要求对相关条款进行了充分的提示和说明；</b></p>
        <p className='bold'>（二）您保证，在您同意接受本协议并申请成为电子账户用户时，您已年满十六周岁并具有完全的民事行为能力；</p>
        <p className='bold'>（三）本协议内容不受您所属国家或地区法律的排斥。在您不具备前述条件时，应立即停止使用本服务。</p>
        <h3>三、申请</h3>
        <p>（一）您可通过我行个人网银、手机银行、各类APP等渠道申请开立电子账户。</p>
        <p className='bold'>（二）我行保留向您收取账户管理费的权利。如我行向您收取账户管理费，将通过您预留的联系方式提前告知并预留一定的考虑期，您在考虑期内有权注销账户。一旦收费，个人账户申请成功后按年度（自申请月起每满12个月为一个年度）预收管理费。年度账户管理费每年从账户自动预先扣收，注销时已收取的账户管理费不再退还。如电子账户未激活，则不收取账户管理费。</p>
        <p className='bold'>（三）您申请开立电子账户所绑定的借记卡、绑定手机号码必须为本人实名合法所有。如有非本人或非法获取等情形，相应的法律责任由您本人承担。</p>
        <p className='bold'>（四）申请电子账户时，您须指定一个绑定账户的所在城市网点信息作为电子账户向绑定账户转账的接收行。如因您选择的接收行与您绑定账户的真实开户行有差异，导致的包含但不限于后续资金转入、转出失败并由此产生的费用或损失，均由您个人承担全部责任。</p>
        <p className='bold'>（五）如经审核后发现您的电子账户开户申请信息有误或存在其他违法情形，我行有权按照相关规定随时终止开户申请流程或将您已开立的电子账户进行限制处理。电子账户被限制期间引发的账户资金损失或其他不利影响，均由您个人承担全部责任。</p>
        <h3>四、使用</h3>
        <p>（一）您申请开通电子账户时必须绑定您的同名Ⅰ类户（以下简称绑定账户，仅限借记卡），您授权我行查询并验证您绑定账户的相关要素，验证要素包括但不限于账号、开户姓名、身份证号码、开户时预留银行手机号码，验证成功后，我行将为您开通相关账户。</p>
        <p>（二）电子账户与绑定账户之间的资金划转受绑定账户开户行的限额控制，具体金额以绑定账户开户行的相关规定为准。</p>
        <p>（三）电子账户办理消费和缴费支付的单日累计支付的默认限额为10000元。您可以通过我行个人网银、手机银行、各类APP等渠道根据个人需要在限额内进行自主设定，如不设定，则我行将为您设置为默认限额。</p>
        <p>（四）开户时，您须提供一张您本人在我行指定商业银行（具体银行以我行合作情况为准）开立的合法、与您同名的，并且您有效支配的借记卡作为电子账户资金转入、转出的绑定账户。电子账户只能向绑定账户转出资金。</p>
        <p className='bold'>（五）电子账户不允许与信用卡进行绑定。如出现因您预留的绑定账户非您本人的、账户状态异常或为信用卡等情形而导致的资金或其他相关损失，由您个人承担全部责任。</p>
        <p className='bold'>（六）电子账户成功开通后，您还须从绑定账户向电子账户转入任意金额来激活该账户；如您账户尚未激活，将不能正常使用转入转出等电子账户相关功能，同时该账户仅能接收绑定账户向其转入资金。通过个人网上银行和手机银行渠道开立电子账户成功后，未开通我行个人网上银行、手机银行的客户默认开通个人网上银行和手机银行。</p>
        <p className='bold'>（七）凭密码进行的交易，相应产生的电子信息记录为该项交易完成的有效凭证；不凭密码进行的交易，则记载有您签名的交易凭证或我行提供的其他确认方式为该项交易完成的有效凭证。基于您签字形成的交易凭证和网上交易所产生的信息记录为该项交易的有效凭据。如有关交易确已发生，不得以无交易凭证、交易凭证上签字非本人所为等理由拒绝偿付因交易发生的款项。</p>
        <h3>五、密码</h3>
        <p>（一）您在开通账户时设定的密码即为所开立账户的交易密码。您应采取合理措施，防止本人密码被窃取，具体措施包括但不限于：勿将密码告知包括我行工作人员在内的任何人；勿在在计算机、电话、手机或其他电子设备上记录或保留。<b>由于密码泄露造成的后果由您本人承担。</b></p>
        <p>（二）使用时如连续输错五次密码，您的账户将被锁定，您需凭本人有效身份证件、预留手机号和安全问题（如设置）在我行电子渠道进行密码重置。如您未设置安全问题或忘记安全问题答案，须通过从绑定账户向个人电子账户转账任意金额的方式进行密码重置。</p>
        <h3>六、注销</h3>
        <p>您可以通过我行个人网银、手机银行等渠道注销个人电子账户。注销时，<b>您须确保绑定账户状态正常，因绑定账户状态异常导致被销账户余额无法正常转至绑定账户或销户后仍然有来账等导致的后果，我行不承担任何责任。</b></p>
        <h3>七、其他</h3>
        <p>（一）您在享受我行提供的服务时，应当遵守本协议以及我行不定期通过网点、网站或互联网等渠道公布的相关业务规定。</p>
        <p>（二）个人账户不得出租、转让、转借。您因个人账户保管不善、将个人账户交他人使用或自身使用不当而造成的损失，由您本人承担。</p>
        <p>（三）因不可抗力（包括但不限于我行不能预见、不能避免且不能克服的战争、暴动、严重火灾、水灾、台风、地震、政府行为、禁令、或供电、通讯等客观情况）导致个人账户不能正常使用的，我行将视情况协助解决或提供必要的帮助。根据不可抗力的影响，我行部分或全部免除责任。<b>对于在交易过程中，因暂时的网络通讯故障或其他原因造成的错账现象，我行有权根据实际交易情况进行账务处理，您有权提出异议。</b></p>
        <p>（四）我行保留收回或拒绝开立个人电子账户的权利。为保障您账户资金的安全，我行在发现您的个人电子账户存在被他人冒用或作为非法用途等使用风险时，有权暂时对该账户进行止付。若发现您在使用过程中有不遵守本协议规定或其他违规、违法行为的，我行有权终止您的账户使用权利。</p>
        <p>（五）我行的服务项目、服务内容、服务价格、优惠政策、与价格相关的例外条款和限制性条款、咨询（投诉）的联系方式等信息将通过我行网点、网站等渠道以公告的方式向您明示。我行公告内容构成本协议不可分割的一部分，与本协议具有同等效力，您应在充分知晓、理解有关公告内容后签署本协议。签署本协议表示您同意按我行公布的收费标准支付各类应承担的费用，同意采用扣收的方式从您账户中收取相关费用。我行有权依据国家有关规定及业务需要，对服务内容、收费项目或标准等内容进行调整，并正式对外公告一定时期后执行并适用于本协议，无需另行通知您。如有需要，我行将在公告前报经有关金融监管部门核准或备案。您有权在我行公告期间选择是否继续使用本协议项下相关服务。如果您不愿意接受我行公告内容，应在我行公告期满前申请变更或终止相关服务。公告期届满您未提出变更或取消相关服务申请，视同接受我行公告内容。如您既不申请变更或终止服务，又不执行我行公告内容，我行有权终止本协议。个人账户的服务内容，收费项目及标准等内容，均以我行最新公告为准。</p>
        <p>（六）我行不介入客户与第三方之间的交易纠纷，但可协助客户查明交易情况。</p>
        <p>（七）本协议未尽事宜均依据中华人民共和国法律、行政法规、人民银行及银行业监督机关的有关规章、政策规定及金融业的行业惯例办理。<b>双方在履行本协议时发生的争议，由双方协商处理；如协商不成，则依法提交我行所在地人民法院处理。</b>在诉讼期间，本协议不涉及争议部分的条款仍须履行。</p>
        <h3>八、本协议自您确认且我行同意您申请并生成电子账户之日起生效。</h3>
        <p className='bold'>客户（签字捺印）：{data.username}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            </p>
        <p className='bold'>日期：{data.loan_time ? data.loan_time.slice(0, 4) : null}年{data.loan_time ? data.loan_time.slice(5, 7) : null}月{data.loan_time ? data.loan_time.slice(8, 10) : null}日</p>
        <h5>附件2</h5>
        <h6>海南银行电子账户扣款协议</h6>
        <p>客户：简称“您”或“本人”。</p>
        <p>海南银行股份有限公司：简称“我行”或“海南银行”。</p>
        <p>感谢您选用海南银行电子账户（以下简称“电子账户”）资金代扣服务。为更好的向您提供服务，明确您与我行之间的权责，以下为海南银行电子账户扣款协议内容，请仔细阅读。</p>
        <p>资金代扣业务为电子账户附加服务内容，主要方便您将同名账户资金转移至电子账户，以便使用电子账户进行相关理财业务交易及其他服务。以下须知内容将对本业务涉及的电子账户绑定账户以及资金代扣业务的注意事项及权责进行明确：</p>
        <h3>一、定义</h3>
        <p>代扣业务是指利用我行资金结算系统及第三方机构代扣系统，将客户本人开立在本行或他行借记卡中的资金，代扣至其建立绑定关系的我行同名电子账户中。</p>
        <h3>二、使用</h3>
        <p>1、绑定账户的验证操作及资金转入转出操作，均须在我行指定渠道办理，电子账户作为我行特殊的无实体介质储蓄账户，可用于支付、消费等场景。</p>
        <p>2、我行向您提供两种电子账户资金转入方式：</p>
        <p>（1）转账汇款方式。您可根据我行电子账户所生成的卡号及我行行号，通过转账汇款方式将资金转入电子账户。</p>
        <p>（2）银联或第三方代扣方式。您授权我行通过银联或第三方代扣方式将绑定账户的资金扣划到电子账户中。</p>
        <p>3、代扣交易的单笔及日累计交易限额以绑定账户开户行的相关规定为准。我行的交易手续费暂定不收取，但保留向您收取手续费的权利。</p>
        <h3>三、双方权利义务</h3>
        <p>1、电子账户的绑定账户必须是您本人（电子账户开户人）名下的我行或他行的借记卡（活期储蓄账户）。<b>如您绑定了信用卡或其他非个人活期储蓄账户，您需要承担全部责任及损失。</b></p>
        <p className='bold'>2、您在发起申请为电子账户绑定账户时，需保证提供给本行的银行卡资料（包括但不限于：卡号、姓名、证件号码、预留手机号码等）为您本人持有的真实、完整、准确、合法、有效的银行借记卡信息，并授权本行将以上信息发送至我行合作的第三行机构与发卡银行进行核验。我行将以验证结果为依据确定绑定账户与电子账户的关系，您个人、我行、验证信息的第三方机构、绑定账户开户行，均有防止相关信息泄漏的责任。</p>
        <p className='bold'>3、您应确保开通本服务提供的手机号码为本人所有，并授权我行通过第三方机构对您所提供手机号码的真实性、有效性进行核实。</p>
        <p className='bold'>4、因您提供的银行卡账户余额不足或存在被挂失、冻结、销户等情形以及提供他人银行卡资料或虚假信息等引起的一切法律责任，由您本人承担。</p>
        <p className='bold'>5、您应妥善保管绑定卡号、开户户名、证件号码、手机号码等与该卡有关的一切信息。如您遗失绑定卡、泄露身份信息及卡信息，泄露我行电子账户登录密码、交易密码、手机验证码等所致损失需您自行承担。</p>
        <p className='bold'>6、如因您电子账户或绑定账户状态不正常、余额不足等原因导致代扣交易失败，引发的理财、支付、消费、资金等风险，我行不承担任何责任。</p>
        <p>7、因第三方机构代扣系统故障，付款账户开户行调整扣款规则等我行无法控制的情况，导致扣款失败或扣款资金延时入账的情况与我行无关。</p>
        <p className='bold'>8、您认可和同意：您发出的指令不可撤回或撤销，我行一旦根据您的指令从我行或委托第三方从绑定卡中划扣资金给电子账户，您不应以非本人意愿交易或其他任何原因要求我行退款或承担其他责任。</p>
        <p>9、当您遗忘电子账户交易密码时，按《海南银行电子账户服务协议》的相关条款执行。</p>
        <p className='bold'>10、您同意，我行有权随时对本协议内容进行单方面变更，并以在我行官方网站以公告的方式提前予以公布，无需另行通知您；若您在本协议公告变更生效后继续使用本服务的，表示您已充分阅读、理解并接受变更后的协议内容，也将遵循变更后的协议内容使用本服务。</p>
        <h3>四、其他</h3>
        <p>本协议同时受我行《海南银行电子账户服务协议》、我行及我国其他金融业务管理条例、章程约束，我行有权依法对本协议内容进行解释，并保留根据国家法律、规定、业务规则变化引发的修改本协议内容的权利，修改后的协议对您仍然具有同等的法律效力。其他未尽事宜，根据我行相关管理办法及中国人民银行和中国银行监督管理委员会的有关规定办理。</p>
        <p className='bold'>海南银行股份有限公司</p>
        <p className='bold'>本协议经客户在海南银行个人网银、手机银行、各类APP等渠道点击同意本协议或以其他方式选择接受本协议，即表示您与我行已达成协议并同意接受本协议的全部约定内容，并经海南银行确认后成立并生效。除非依照法律规定或双方约定终止，否则本协议持续有效。</p>
        <p className='margin-top bold'>客户（签字捺印）：{data.username}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        </p>
        <p className='bold'>授权日期：{data.loan_time ? data.loan_time.slice(0, 4) : null}年{data.loan_time ? data.loan_time.slice(5, 7) : null}月{data.loan_time ? data.loan_time.slice(8, 10) : null}日</p>
        <h5>附件3</h5>
        <h6>海南银行个人信用信息查询授权书</h6>
        <p className='bold'>尊敬的客户：为了维护您的权益，请在签署本授权书前，仔细阅读本授权书各条款（特别是黑体字条款），关注您的权利、义务。</p>
        <h3>海南银行股份有限公司：</h3>
        <p>一、本人同意并不可撤销地授权：<b>贵行有权按照国家相关规定，采集并向中国人民银行征信中心金融信用信息基础数据库及其他依法成立的征信机构提供包括本人基本信息、信贷交易信息以及反映本人信用状况的其他信息等在内的信用信息（包含本人因未及时履行合同义务产生的不良信息）。</b></p>
        <p>二、本人同意并不可撤销地授权：贵行有权根据国家有关规定，在办理涉及本人的业务时，向中国人民银行征信中心金融信用信息基础数据库及其他依法成立的征信机构查询、打印、保存本人的信用信息，并用于下述用途：</p>
        <p>对本人（或本人配偶）提出的贵行合法经营范围内的其他业务申请进行审核及后续管理，具体业务为：<span className='underline' /></p>
        <p><span className='underline'>消费分期</span></p>
        <p className='bold'>三、若贵行超出本授权范围进行数据报送和查询使用，贵行应承担与此有关的法律责任。</p>
        <p className='bold'>四、若本人在贵行的业务未获批准办理，本人同意贵行留存本授权书及本人信用报告等资料，无须退回本人。</p>
        <p className='bold'>五、本授权书有效期自本人签字授权之日起，至业务结清或终止之日止。</p>
        <p className='small-top bold'>本人声明：本人已仔细阅读上述所有条款，并已特别注意字体加黑的内容。贵行已应本人要求对相关条款予以明确说明。本人对所有条款的含义及相应的法律后果已全部知晓并充分理解，本人自愿作出上述授权、承诺和声明。</p>
        <p className='small-top bold'>客户（签字捺印）：{data.username}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      </p>
        <p>日期：{data.loan_time ? data.loan_time.slice(0, 4) : null}年{data.loan_time ? data.loan_time.slice(5, 7) : null}月{data.loan_time ? data.loan_time.slice(8, 10) : null}日</p>
        <table className='table-two'>
          <tbody>
            <tr>
              <td colSpan='7'><h3>CRS个人税收居民身份声明文件</h3></td>
            </tr>
            <tr>
              <td>基本信息</td>
              <td>姓名</td>
              <td>{data.username}</td>
              <td>证件类型</td>
              <td>{data.card_type}</td>
              <td>证件号码</td>
              <td>{data.card_number}</td>
            </tr>
            <tr>
              <td>税收居民身份判定（单选）</td>
              <td colSpan='6'>
                <p className='no-indent'>1 √仅为中国税收居民(中国税收居民定义请参见注1)<br />
                  2 仅为非居民（非居民定义参见注2）<br />
                  3 既是中国税收居民又是其他国家（地区）税收居民
                </p>
                <p className='no-indent line'>
                  若在以上选项中勾选第1项，请直接进入签名栏位
                </p>
                <p className='no-indent line'>
                  若在以上选项中勾选第2项或第3项，请填写下列信息
                </p>
              </td>
            </tr>
            <tr>
              <td>相关信息</td>
              <td colSpan='6'>
                <table>
                  <tbody>
                    <tr>
                      <td>姓</td>
                      <td />
                      <td>名</td>
                      <td />
                    </tr>
                    <tr>
                      <td>出生日期</td>
                      <td colSpan='3' />
                    </tr>
                    <tr>
                      <td>现居地址（中文）</td>
                      <td>（国家）<br />（境外地址可不填此项）</td>
                      <td>（省）</td>
                      <td>（市）</td>
                    </tr>
                    <tr>
                      <td>现居地址（英文或拼音）</td>
                      <td>（国家）</td>
                      <td>（省）</td>
                      <td>（市）</td>
                    </tr>
                    <tr>
                      <td>出生地（中文）</td>
                      <td>（国家）<br />（境外地址可不填此项）</td>
                      <td>（省）</td>
                      <td>（市）</td>
                    </tr>
                    <tr>
                      <td>出生地（英文或拼音）</td>
                      <td>（国家）</td>
                      <td>（省）</td>
                      <td>（市）</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td>税收居民国（地区） 及纳税人识别号</td>
              <td colSpan='6'>
                <table>
                  <tbody>
                    <tr>
                      <td colSpan='2'>税收居民国(地区)</td>
                      <td>纳税人识别号</td>
                      <td>如没有提供纳税人识别号填写理由A或B</td>
                      <td>如选取理由B，请解释原因</td>
                    </tr>
                    <tr>
                      <td>1</td>
                      <td className='td-two' />
                      <td />
                      <td />
                      <td />
                    </tr>
                    <tr>
                      <td>2</td>
                      <td className='td-two' />
                      <td />
                      <td />
                      <td />
                    </tr>
                    <tr>
                      <td>3</td>
                      <td className='td-two' />
                      <td />
                      <td />
                      <td />
                    </tr>
                    <tr>
                      <td>4</td>
                      <td className='td-two' />
                      <td />
                      <td />
                      <td />
                    </tr>
                    <tr>
                      <td>5</td>
                      <td className='td-two' />
                      <td />
                      <td />
                      <td />
                    </tr>
                    <tr>
                      <td colSpan='5'>理由A: 居民国（地区）不发放纳税人识别号</td>
                    </tr>
                    <tr>
                      <td colSpan='5'>理由B：账户持有人未能取得纳税人识别号，如选此项，请解释具体原因</td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td colSpan='7'>
                <p className='no-indent'>
                  本人确认上述信息真实、准确和完整，且当上述信息发生变更时，将在30日内通知海南银行，否则，本人愿意承担由此造成的不利后果。<br />本人已知晓并同意：根据国家税务总局《非居民金融账户涉税信息尽职调查管理办法》，本表为账户持有人向海南银行提供的税收居民身份声明文件。海南银行将按照《非居民金融账户涉税信息尽职调查管理办法》要求，向国家税务主管机关报送相关客户涉税信息，国家税务主管机关将根据国际多边协议向其他税收管辖区的税务当局转交相关客户涉税信息。
                </p>
                <p>客户（签字捺印）：{data.username}<span className='left'>日期：{data.loan_time ? data.loan_time.slice(0, 4) : null}年{data.loan_time ? data.loan_time.slice(5, 7) : null}月{data.loan_time ? data.loan_time.slice(8, 10) : null}日</span></p>
                <p>√本人<span className='more-left'>代理人</span></p>
              </td>
            </tr>
          </tbody>
        </table>
        <p className='no-indent'>注 ：</p>
        <p className='no-indent small'>(1)中国税收居民个人是指在中国境内有住所，或者无住所而在境内居住满一年的个人。在中国境内有住所是指因户籍、家庭、经济利益关系而在中国境内习惯性居住。在境内居住满一年，是指在一个纳税年度中在中国境内居住365日。临时离境的，不扣减日数。临时离境，是指在一个纳税年度中一次不超过30日或者多次累计不超过90日的离境。</p>
        <p className='no-indent small'>(2)本表所称非居民是指中国税收居民以外的个人。其他国家（地区）税收居民身份认定规则及纳税人识别号相关信息请参见国家税务总局网（http://www.chinatax.gov.cn/aeoi_index.html）。</p>
        <p className='no-indent small'>(3)军人、武装警察无需填写此声明文件。</p>
      </div>
    )
  }
}