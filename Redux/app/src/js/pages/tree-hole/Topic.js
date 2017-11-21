import React from 'react'
import 'scss/tree-hole/tree-hole.component.scss'

const data = [{name: '为什么你适龄了却不结婚', num: 998, img_url: '../assets/img/tree-hole/tree-01.jpg'}, {name: '为什么你适龄了却不结婚', num: 998, img_url: '../assets/img/tree-hole/tree-01.jpg'}, {name: '为什么你适龄了却不结婚', num: 998, img_url: '../assets/img/tree-hole/tree-01.jpg'}, {name: '为什么你适龄了却不结婚', num: 998, img_url: '../assets/img/tree-hole/tree-01.jpg'}]

export default class Topic extends React.Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount () {
    document.title = '话题'
  }

  render () {
    const content = data.length > 0 ? data.map((v, i) =>
      <div className='content' key={i}>
        <img src={v.img_url} />
        <h3>{v.name}</h3>
        <h4>已有<b>{v.num}</b>人参与了本话题</h4>
        <a>点此发言</a>
      </div>
    ) : <div>当前暂无话题</div>

    return (
      <div className='topic'>
        {content}
      </div>
    )
  }
}
