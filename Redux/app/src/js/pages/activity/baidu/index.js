import React from 'react'
import Popup from '../components/Popup'
import Toast from '../../../components/Toast'
import { post } from 'utils'
import { ImagePicker } from 'antd-mobile'

export default class index extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      files: [],
      filesTwo: [],
      name: '',
      id: '',
      data: '',
      dataTwo: ''
    }
  }

  componentDidMount () {
    document.title = '百度认证'
  }

  onChange = (files, type, index) => {
    this.setState({
      files
    })
  }

  onChangeTwo = (files, type, index) => {
    this.setState({
      filesTwo: files
    })
  }

  safe = () => {
    const { files, name, id } = this.state
    Toast.loading('')
    post('http://credit.xianjincard.com/user-info/id-card', {name: name, id_number: id, image: files[0].url}).then(data => data.data).then(data => {
      Toast.hide()
      if (data.data.matting_image) {
        data.data.matting_image = '图片base64编码'
      }
      this.setState({
        data: this.formatJson(JSON.stringify(data))
      })
    })
  }

  online = () => {
    const { filesTwo } = this.state
    Toast.loading('')
    post('http://credit.xianjincard.com/user-info/face', {image: filesTwo[0].url}).then(data => data.data).then(data => {
      Toast.hide()
      this.setState({
        dataTwo: this.formatJson(JSON.stringify(data))
      })
    })
  }

  formatJson (json, options) {
    let reg = null
    let formatted = ''
    let pad = 0
    let PADDING = ''

    options = options || {}
    options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false
    options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true
    if (typeof json !== 'string') {
      json = JSON.stringify(json)
    } else {
      json = JSON.parse(json)
      json = JSON.stringify(json)
    }
    reg = /([\{\}])/g
    json = json.replace(reg, '\r\n$1\r\n')
    reg = /([\[\]])/g
    json = json.replace(reg, '\r\n$1\r\n')
    reg = /(\,)/g
    json = json.replace(reg, '$1\r\n')
    reg = /(\r\n\r\n)/g
    json = json.replace(reg, '\r\n')
    reg = /\r\n\,/g
    json = json.replace(reg, ',')

    if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
      reg = /\:\r\n\{/g
      json = json.replace(reg, ':{')
      reg = /\:\r\n\[/g
      json = json.replace(reg, ':[')
    }
    if (options.spaceAfterColon) {
      reg = /\:/g
      json = json.replace(reg, ': ')
    }

    (json.split('\r\n')).forEach(function (node, index) {
      let i = 0
      let indent = 0
      let padding = ''
      if (node.match(/\{$/) || node.match(/\[$/)) {
        indent = 1
      } else if (node.match(/\}/) || node.match(/\]/)) {
        if (pad !== 0) {
          pad -= 1
        }
      } else {
        indent = 0
      }
      for (i = 0; i < pad; i++) {
        padding += PADDING
      }
      formatted += padding + node + '\r\n'
      pad += indent
    })
    return formatted
  }

  handleChange (e) {
    if (!e.target.value.match(/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/)) {
      this.setState({
        error: true
      })
    } else {
      this.setState({
        error: false
      })
    }
    this.setState({
      id: e.target.value
    })
  }

  handleChangeTwo (e) {
    this.setState({
      name: e.target.value
    })
  }

  render () {
    const { files, filesTwo, id, name, error, data, dataTwo } = this.state
    return (
      <div className='test' style={{background: '#fff', width: '10rem', paddingTop: '1px'}}>
        <h1>公安验证</h1>
        <ImagePicker files={files} onChange={this.onChange} selectable={files.length < 1}></ImagePicker>
        <input style={{display: 'block', lineHeight: '1rem', margin: '0.4rem 0 0 0.4rem', width: '7rem'}} type='text' value={id} placeholder='请输入身份证号' onChange={this.handleChange.bind(this)} />
        <h2 style={{display: `${error ? 'block' : 'none'}`, color: '#ff8b00', margin: '0.2rem 0 0 0.4rem'}}>请输入正确的身份证号</h2>
        <input style={{display: 'block', lineHeight: '1rem', margin: '0.4rem 0 0 0.4rem', width: '7rem'}} type='text' value={name} placeholder='请输入姓名' onChange={this.handleChangeTwo.bind(this)} />
        <a style={{display: 'block', margin: '0.4rem 0 0 0.4rem', width: '3rem', lineHeight: '1rem', background: '#4ab6fa', color: '#fff', textAlign: 'center', fontSize: '0.5rem'}} onClick={this.safe}>公安验证</a>
        <pre style={{margin: '0.4rem 0 0 0.4rem', width: '9rem', wordWrap: 'break-word'}}>{data}</pre>
        <h1>活体在线</h1>
        <ImagePicker files={filesTwo} onChange={this.onChangeTwo} selectable={filesTwo.length < 1}></ImagePicker>
        <a style={{display: 'block', margin: '0.4rem 0 0 0.4rem', width: '3rem', lineHeight: '1rem', background: '#4ab6fa', color: '#fff', textAlign: 'center', fontSize: '0.5rem'}} onClick={this.online}>活体在线</a>
        <pre style={{margin: '0.4rem 0 0 0.4rem', width: '9rem', wordWrap: 'break-word'}}>{dataTwo}</pre>
      </div>
    )
  }
}
