import React from 'react'
import { hrefNative as native, copy } from 'utils'
import 'scss/activity/week.component.scss'

export default class Rule extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    document.title = '周周乐规则'
  }

  render () {
    return (
      <div className='transition-group'>
        <div className='rule'>
          <h2>如何获得周周乐</h2>
          <p>1. 用金币兑换，1000金币换一注，每天最多换10注；<br />
          2. 每成功借款一次即可获得一注；<br />
          3. 参与大转盘，就有机会获得周周乐。</p>
          <h2>开奖规则</h2>
          <p>每周三12:00通过网路直播的形式现场开奖，中奖号码公布之后请确认您在开奖的期数内是否有对应的周周乐。</p>
          <h3>中奖规则及奖金如下：</h3>
          <table>
            <thead><tr><th>奖级</th><th>中奖条件</th><th>中奖金额</th><th>中奖条件</th></tr></thead>
            <tbody>
              <tr><td>一等奖</td><td><span className='red'>√</span><span className='red'>√</span><span className='red'>√</span><span className='red'>√</span></td><td>4张牌面一致</td><td className='red'>1888元</td></tr>
              <tr><td>二等奖</td><td><span className='red'>√</span><span className='red'>√</span><span className='red'>√</span><span>√</span></td><td>连续三张一致</td><td>88元</td></tr>
              <tr><td>三等奖</td><td><span className='red'>√</span><span className='red'>√</span><span>√</span><span>√</span></td><td>连续两张一致</td><td>2元</td></tr>
              <tr><td>四等奖</td><td><span className='red'>√</span><span>√</span><span>√</span><span>√</span></td><td>同顺序1张一致</td><td>周周乐一致</td></tr>
            </tbody>
          </table>
          <p className='grey'>所有开奖号码必须与开奖号码牌面和顺序一致。</p>
          <h2>抽奖规则</h2>
          <p>1. 第一个号码产生公式：每期参与总人数/13的余数加1，举例：20170815这期有199900人参与，那么第一张牌的数字（1999000/13的余数是5，5+1=6）就是6。<br />
            2. 剩余3个号码由主播直播开出，每个号码都是从52张牌里抽取（不含大小王），每张牌被抽中的概率一致。</p>
          <h2>奖品介绍</h2>
          <p>1.每组周周乐包含一等奖4个，金额1888元；二等奖52个，金额88元；三等奖2704个，金额2元；四等奖140608个，奖品为下一期周周乐一注；<br />
            2. 用户获得的牌面信息需要与开奖结果的“顺序与牌面”(即花色、数字、顺序都需要一模一样)完全一致则为中奖；<br />
            3. 每期用户所获得的奖品，将在3个工作日内，以现金红包的形式统一发放到用户的App红包账户中；</p>
        </div>
      </div>
    )
  }
}
