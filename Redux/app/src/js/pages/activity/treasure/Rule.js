import React from 'react'
import 'scss/activity/treasure.component.scss'

export default class Rule extends React.Component {
  constructor (props) {
    super(props)
    document.title = '夺宝规则'
  }
  render () {
    return (
      <div class='treasure-rule'>
        <div class='content'>
          <h1>活动规则</h1>
          <ol>
            <li>活动时间：5月11日10:00起，在活动期间点击“获得夺宝券”按钮后，3天内满足以下条件即可获得投注机会。参与夺宝；<br />获得我要夺宝机会的条件：</li>
            <ol class='subtitle'>
              <li>活动期间成功放款一次，可获得1张夺宝券；</li>
              <li>活动期间邀请1个新用户注册，可获得1张，每人每天最多10次；</li>
            </ol>
            <li>每期的活动奖品为1000元现金，每期夺宝集齐1000份夺宝券即可开奖。用户进行夺宝后，按投注顺序获得四位数夺宝号，可多次投注增加中奖概率；</li>
            <li>中奖规则如下：
              <p>中奖号码= (数值A÷1000)取余数+1</p>
              <p>每期夺宝时会记录每个参与用户的投注时间，将对最后50个投注时间进行求和，得出数值A</p>
              <p>数值A=活动项目最后50个投注时间点数值之和</p>
              <p>例如最后一个投注时间点为11:30:12，则换算为113012，余数是指整数除法中被除数未被除尽部分，例如17除3，商数为5，余数为2 </p>
            </li>
            <li>获奖名单将公布在活动页面，请获奖者在获奖5天内致电4006812016联系我们，逾期视为自动放弃，确认信息后奖金将打至现金卡APP【我的】->【现金红包】中；</li>
            <li>如发现存在违法行为（包括但不限于恶意套取奖品、机器作弊等违反诚实守信原则行为）现金卡有权取消中奖资格，必要时追究法律责任；</li>
            <li>本活动解释权归现金所有，与Apple.lnc无关。</li>
          </ol>
        </div>
      </div>
    )
  }
}
