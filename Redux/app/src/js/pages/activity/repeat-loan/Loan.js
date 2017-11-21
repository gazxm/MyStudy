import React from 'react'
import Toast from '../../../components/Toast'
import { get, goHome, login } from 'utils'
import 'scss/activity/repeat-loan.component.scss'

export default class Loan extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    document.title = '借1000每天只要3.5'
  }

  repayment () {
    Toast.loading('')
    get('http://credit.xianjincard.com/activity/default/get-invite-code').then(data => data.data).then(data => {
      Toast.hide()
      if (data.code !== 0) {
        login()
        return
      }
      goHome()
    })
  }

  render () {
    return (
      <div className='transition-group'>
        <div className='loan'>
          <div className='button' onClick={this.repayment.bind(this)}>
            <h3>马上还款</h3>
            <h4>(仅限金卡、白卡)</h4>
          </div>
        </div>
      </div>
    )
  }
}
