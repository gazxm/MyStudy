export default new class Popup {
  createDom (content, className, callback, close) {
    let closeDe = {
      overlay: true,
      span: true
    }
    Object.assign(closeDe, close)
    this.callback = callback
    const html = `<div class="popup-cover"></div>
                  <div class="content">
                    <span class="close" style="${closeDe.span ? '' : 'display: none;'}"></span>
                    ${content}
                  </div>`
    let dom = document.createElement('div')
    dom.className = `popup-container ${className || ''}`
    dom.innerHTML = html
    document.body.appendChild(dom)
    dom.querySelector('div.content').className = 'content in'
    dom.querySelector('div.popup-cover').addEventListener('click', (e) => {
      e.stopPropagation()
      if (closeDe.overlay) {
        this.close(e)
      }
    }, false)
    dom.querySelector('span.close').addEventListener('click', (e) => {
      e.preventDefault()
      if (closeDe.span) {
        this.close(e)
      }
    }, false)
    this.dom = dom
  }

  addEventListener (el, event, callback) {
    let els = this.dom.querySelectorAll(el)
    for (var i = 0, l = els.length; i < l; i++) {
      els[i].addEventListener(event, (e) => {
        e.preventDefault()
        callback(e)
      }, false)
    }
  }

  click (el, callback) {
    this.addEventListener(el, 'click', (e) => {
      this.close(e, callback)
    })
  }

  clickAndClose (el, callback) {
    this.addEventListener(el, 'click', (e) => {
      callback(this.close.bind(this, e), e)
    })
  }

  closeClick (el, callback) {
    this.dom.querySelector(el).addEventListener('click', (e) => {
      e.preventDefault()
      callback && callback(e)
    }, false)
  }

  close (e, callback) {
    e.preventDefault()
    this.dom.querySelector('div.content').className = 'content out'
    setTimeout(() => {
      this.dom.parentNode.removeChild(this.dom)
      this.callback && this.callback()
      callback && callback(e)
    }, 200)
  }

  alert (content, className, callback, close) {
    this.createDom(content, className, callback, close)
  }
}()
