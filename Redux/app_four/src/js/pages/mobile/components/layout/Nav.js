import React from 'react'
import { IndexLink, Link } from 'react-router'
import { Flex } from 'antd-mobile'

import 'scss/mobile/common.scss'

export default class Nav extends React.Component {
  render () {
    const { location } = this.props
    const loanClass = location.pathname.match(/^\/mobile\/loan/) ? 'active' : ''
    const certificationClass = location.pathname.match(/^\/mobile\/certification/) ? 'active' : ''
    const findClass = location.pathname.match(/^\/mobile\/find/) ? 'active' : ''
    const meClass = location.pathname.match(/^\/mobile\/me/) ? 'active' : ''

    return (
      <Flex class="nav">
        <Flex.Item class={loanClass}><IndexLink class="loan" to="/mobile/loan">借款</IndexLink></Flex.Item>
        <Flex.Item class={certificationClass}><Link class="certification" to="/mobile/certification">认证</Link></Flex.Item>
        <Flex.Item class={findClass}><Link class="find" to="/mobile/find">发现</Link></Flex.Item>
        <Flex.Item class={meClass}><Link class="me" to="/mobile/me">我的</Link></Flex.Item>
      </Flex>
    )
  }
}
