export default new class Toast {
  loading (content, duration, onClose) {
    this.createLoadingDom(content)
    this.delay(this.loadingDom, duration, onClose)
  }

  info (content, duration, onClose) {
    this.createInfoDom(content)
    this.delay(this.infoDom, duration, onClose)
  }

  hide () {
    this.loadingDom && this.removeDom(this.loadingDom, null)
  }

  delay (dom, duration, callback) {
    if (duration) {
      setTimeout(() => {
        this.removeDom(dom, callback)
      }, duration * 1000)
    }
  }

  removeDom (dom, callback) {
    try {
      dom && dom.parentNode.removeChild(dom)
      callback && callback()
    } catch (e) {
    }
  }

  createLoadingDom (content) {
    const html = `<div class="toast-loading">
                    <div class="uil-default-css">
                      <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div> <div></div>
                    </div>
                    <span>${content}</span>
                  </div>`
    let dom = document.createElement('div')
    dom.className = 'toast-event-mask'
    dom.innerHTML = html
    document.body.appendChild(dom)
    dom.addEventListener('click', function (e) {
      e.stopPropagation()
    }, false)
    this.loadingDom = dom
  }
  createInfoDom (content) {
    let dom = document.createElement('div')
    dom.className = 'toast-info'
    dom.innerHTML = `<span>${content}</span>`
    this.infoDom = dom
    document.body.appendChild(dom)
    dom.addEventListener('click', function (e) {
      e.stopPropagation()
    }, false)
  }
}()
