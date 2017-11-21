import { retrievePassword } from 'utils'
import 'scss/components/password.component.scss'

export default new class Password {
  createDom () {
    let html = `<div class="overlay"></div>\
                <div class="dialog pay">\
                  <span class="close"></span>\
                  <h2>${this.title}</h2>\
                  <p class="clearfix">\
                    <i></i> <i></i> <i></i> <i></i> <i></i> <i></i>\
                    <input type="tel" value="" autofocus>\
                  </p>\
                  <p class="error-tips">密码错误</p>\
                  <a href="">忘记密码?</a>\
                </div>`
    let popup = document.createElement('div')
    popup.className = 'popup-password'
    popup.innerHTML = html
    document.body.appendChild(popup)

    this.errorDom = popup.querySelector('p.error-tips')
    this.popup = popup
    this.lock = false
    popup.querySelector('.overlay').addEventListener('click', function (e) {
      e.stopPropagation()
    }, false)

    popup.querySelector('a').addEventListener('click', function (e) {
      e.preventDefault()
      retrievePassword()
    }, false)
    popup.querySelector('span.close').addEventListener('click', this.close, false)
    popup.querySelector('p.clearfix').addEventListener('click', (e) => {
      input.focus()
    }, false)

    const input = popup.querySelector('input')
    const i = popup.querySelectorAll('i')
    const els = Array.prototype.slice.call(i, '')
    const inputHandler = this.inputHandler
    input.addEventListener('input', function (e) { inputHandler(e, this, els) }, false)
    input.addEventListener('focus', this.focusHandler, false)
  }

  focusHandler = (e) => {
    let dom = this.popup.querySelector('.dialog')
    let interval = setInterval(function () {
      if (document.activeElement.nodeName === 'INPUT') {
        dom.style.top = '0'
        dom.style.webkitTransform = 'translate(-50%, 0)'
        document.body.scrollTop = 0
      } else {
        dom.style.top = '50%'
        dom.style.webkitTransform = 'translate(-50%, -50%)'
        if (interval) {
          clearInterval(interval)
          interval = null
        }
      }
    }, 300)
  }

  inputHandler = (e, input, els) => {
    els.map(function (v) { v.className = '' })
    els.slice(0, input.value.length).map(function (v) {
      v.className = 'point'
    })
    if (input.value.length >= 6) {
      input.value = input.value.slice(0, 6)
      if (!this.lock) {
        this.lock = true
        this.callback && this.callback(input.value)
      }
    }

    if (input.value.length < 6) {
      this.errorDom.style.display = 'none'
    }
  }

  error (msg = '密码错误') {
    this.errorDom.style.display = 'block'
    this.errorDom.innerHTML = msg
    this.lock = false
  }

  close = (e) => {
    e && e.preventDefault()
    this.popup.style.display = 'none'
    this.lock = false
  }

  hide () {
    this.popup.style.display = 'none'
    this.lock = false
  }

  reset (dom) {
    const i = dom.querySelectorAll('i')
    const els = Array.prototype.slice.call(i, '')
    const input = dom.querySelector('input')
    this.errorDom.style.display = 'none'
    els.map(function (v) { v.className = '' })
    input.value = ''
    input.focus()
  }

  show (callback, title = '请输入交易密码') {
    this.callback = callback
    this.title = title
    this.lock = false
    let popup = document.querySelector('.popup-password')
    if (popup !== null) {
      popup.style.display = 'block'
      popup.querySelector('h2').innerHTML = title
      this.reset(popup)
      return
    }
    this.createDom()
  }

  remove () {
    let popup = document.querySelector('.popup-password')
    if (popup !== null) {
      popup.parentNode.removeChild(popup)
    }
  }
}()
