export default new class Popup {
  createDom (content, className, callback) {
    this.callback = callback
    const html = `<div class="popup-cover"></div>
                  <div class="content">
                    <span class="close"></span>
                    ${content}
                  </div>`
    let dom = document.createElement('div')
    dom.className = `popup-container ${className || ''}`
    dom.innerHTML = html
    document.body.appendChild(dom)
    dom.querySelector('div.popup-cover').addEventListener('click', (e) => {
      e.stopPropagation()
      this.close(e)
    }, false)
    dom.querySelector('span.close').addEventListener('click', (e) => {
      e.preventDefault()
      this.close(e)
    }, false)
    this.dom = dom
  }

  click (el, callback) {
    this.dom.querySelector(el).addEventListener('click', (e) => {
      e.preventDefault()
      callback && callback(e)
      this.close(e)
    }, false)
  }

  close (e) {
    e.preventDefault()
    this.dom.parentNode.removeChild(this.dom)
    this.callback && this.callback()
  }

  alert (content, className, callback) {
    this.createDom(content, className, callback)
  }
}()
