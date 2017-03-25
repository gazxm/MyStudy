export default new class Rule {
  createRuleDom (content, className) {
    const html = `<div class='overlay' onClick={this.closeRule.bind(this)} />
      <div class='dialog'>
        <span class='close' onClick={this.closeRule.bind(this)} />
        <h3>活动规则</h3>
        <div class='rule-content'>
          ${content}
        </div>
      </div>`
    console.log(content, className)
    console.log(html)
    let dom = document.createElement('div')
    dom.className = className
    dom.innerHTML = html
    document.body.appendChild(dom)
    dom.addEventListener('click', function (e) {
      e.stopPropagation()
    }, false)
    this.loadingDom = dom
  }
}()
