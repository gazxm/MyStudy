import React from 'react'
import 'scss/mobile/agreement.component.scss'

export default class NewEasyLoan extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div className='agreement'>
        <h1>“新易贷-微贷款”个人金融信息查询授权书</h1>
        <p>本人因向中银消费金融有限公司（以下简称”中银消费金融”）申请“新易贷-微贷款”贷款，现特授权中银消费金融：</p>
        <p>1. 通过有关机构或单位（包括但不限于中国人民银行金融信用信息基础数据库、中国银行、公安、公积金、社保、税务、民政等）查询本人的个人信用报告（包括但不限于身份信息、账户信息、信用信息等），用于审核本人“新易贷-微贷款”贷款申请；</p>
        <p>2. 在本人提出贷款额度申请之日起至贷款账户销户之日止，通过有关机构或单位（包括但不限于中国人民银行金融信用信息基础数据库、中国银行、公安、公积金、社保、税务、民政等）对本人的贷款用途、还款和资信状况开展中途授信审核及开展贷后管理及公司内部审计等事项；</p>
        <p>3.将本人的本贷款及还款记录、还款违约行为等金融信息向中国银行、中国人民银行金融信用信息基础数据库及依法设立的第三方数据库等机构报送。</p>
        <p>中银消费金融承诺查询内容不超出授权范围，对相关信息承担保密义务，超出授权范围查询的一切后果及法律责任由中银消费金融承担。</p>
        <p>本人承诺提供、填写的全部申请材料及信息准确无误，充分了解并清楚知晓授权条款的内容和该贷款产品的相关信息，愿意遵守各项约定并承担相应的法律责任。</p>
        <p>本人通过“新易贷-微贷款” 平台点击“同意”选项即视为对本授权书的确认。</p>
      </div>
    )
  }
}
