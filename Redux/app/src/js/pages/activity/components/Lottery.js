export default new class Lottery {
  createElement (tagName, attributes) {
    let ele = document.createElement(tagName)
    for (let key in attributes) {
      ele.setAttribute(key, attributes[key])
    }
    return ele
  }

  getTransparentPercent (ctx, width, height) {
    let imgData = ctx.getImageData(0, 0, width, height)
    let pixles = imgData.data
    let transPixs = []
    for (let i = 0, j = pixles.length; i < j; i += 4) {
      let a = pixles[i + 3]
      if (a < 128) {
        transPixs.push(i)
      }
    }
    return (transPixs.length / (pixles.length / 4) * 100).toFixed(2)
  }

  resizeCanvas (canvas, width, height) {
    canvas.width = width
    canvas.height = height
    canvas.getContext('2d').clearRect(0, 0, width, height)
  }

  drawPoint (x, y) {
    this.maskCtx.beginPath()
    let radgrad = this.maskCtx.createRadialGradient(x, y, 0, x, y, this.drawPointSize)
    radgrad.addColorStop(0, 'rgba(0, 0, 0, 1)')
    radgrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
    this.maskCtx.fillStyle = radgrad
    this.maskCtx.arc(x, y, this.drawPointSize, 0, Math.PI * 2, true)
    this.maskCtx.fill()
    if (this.drawPercentCallback) {
      this.drawPercentCallback.call(null, this.getTransparentPercent(this.maskCtx, this.width, this.height))
    }
  }

  bindEvent () {
    let _this = this
    let isMouseDown = false
    let device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()))
    let clickEvtName = device ? 'touchstart' : 'mousedown'
    let moveEvtName = device ? 'touchmove' : 'mousemove'
    if (!device) {
      document.addEventListener('mouseup', function (e) {
        isMouseDown = false
      }, false)
    } else {
      document.addEventListener('touchmove', function (e) {
        if (isMouseDown) {
          e.preventDefault()
        }
      }, false)
      document.addEventListener('touchend', function (e) {
        isMouseDown = false
      }, false)
    }
    this.mask.addEventListener(clickEvtName, function (e) {
      isMouseDown = true
      let docEle = document.documentElement
      if (!_this.clientRect) {
        _this.clientRect = {
          left: 0,
          top: 0
        }
      }
      let x = (device ? e.touches[0].clientX : e.clientX) - _this.clientRect.left + docEle.scrollLeft - docEle.clientLeft
      let y = (device ? e.touches[0].clientY : e.clientY) - _this.clientRect.top + docEle.scrollTop - docEle.clientTop
      _this.drawPoint(x, y)
    }, false)

    this.mask.addEventListener(moveEvtName, function (e) {
      if (!device && !isMouseDown) {
        return false
      }
      let docEle = document.documentElement
      if (!_this.clientRect) {
        _this.clientRect = {
          left: 0,
          top: 0
        }
      }
      let x = (device ? e.touches[0].clientX : e.clientX) - _this.clientRect.left + docEle.scrollLeft - docEle.clientLeft
      let y = (device ? e.touches[0].clientY : e.clientY) - _this.clientRect.top + docEle.scrollTop - docEle.clientTop
      _this.drawPoint(x, y)
    }, false)
  }

  drawLottery () {
    this.background = this.background || this.createElement('canvas', {
      style: 'position:absolute;left:0;top:0;'
    })
    this.mask = this.mask || this.createElement('canvas', {
      style: 'position:absolute;left:0;top:0;'
    })

    if (!this.conNode.innerHTML.replace(/[\w\W]| /g, '')) {
      this.conNode.appendChild(this.background)
      this.conNode.appendChild(this.mask)
      this.clientRect = this.conNode ? this.conNode.getBoundingClientRect() : null
      this.bindEvent()
    }

    this.backCtx = this.backCtx || this.background.getContext('2d')
    this.maskCtx = this.maskCtx || this.mask.getContext('2d')

    if (this.lotteryType === 'image') {
      let image = new Image()
      let _this = this
      image.onload = function () {
        _this.resizeCanvas(_this.background, _this.width, _this.height)
        _this.backCtx.drawImage(this, 0, 0, _this.width, _this.height)
        _this.drawMask()
      }
      image.src = this.lottery
    } else if (this.lotteryType === 'text') {
      this.width = this.width
      this.height = this.height
      this.resizeCanvas(this.background, this.width, this.height)
      this.backCtx.save()
      this.backCtx.fillStyle = '#FFF'
      this.backCtx.fillRect(0, 0, this.width, this.height)
      this.backCtx.restore()
      this.backCtx.save()
      this.backCtx.font = 'Bold ' + this.fontSize / 75 + 'rem Arial'
      this.backCtx.textAlign = 'center'
      this.backCtx.fillStyle = '#F60'
      this.backCtx.fillText(this.lottery, this.width / 2, this.height / 2 + this.fontSize / 2)
      this.backCtx.restore()
      this.drawMask()
    }
  }

  drawMask () {
    this.resizeCanvas(this.mask, this.width, this.height)
    if (this.coverType === 'color') {
      this.maskCtx.fillStyle = this.cover
      this.maskCtx.fillRect(0, 0, this.width, this.height)
      this.maskCtx.globalCompositeOperation = 'destination-out'
    } else if (this.coverType === 'image') {
      let image = new Image()
      let _this = this
      this.maskCtx.fillStyle = '#afafaf'
      this.maskCtx.fillRect(0, 0, this.width, this.height)
      this.maskCtx.globalCompositeOperation = 'destination-out'
      image.onload = function () {
        _this.resizeCanvas(_this.mask, _this.width, _this.height)
        _this.maskCtx.drawImage(this, 0, 0, _this.width, _this.height)
        _this.maskCtx.globalCompositeOperation = 'destination-out'
      }
      image.src = this.cover
    }
  }

  init (id, cover, coverType, width, height, fontSize, drawPointSize, lottery, lotteryType, drawPercentCallback) {
    // id:dom节点; cover:遮罩层颜色或者图片; coverType:遮罩层类型'color' 'image';drawPointSize:刮卡大小;lottery: 谜底;lotteryType: 谜底类型'text', 'image';drawPercentCallback:返回刮开百分比;
    this.conNode = id
    this.cover = cover || '#afafaf'
    this.coverType = coverType || 'color'
    this.width = width
    this.height = height
    this.fontSize = fontSize || 50
    this.drawPointSize = this.calcNum(drawPointSize) || this.calcNum(30)
    this.lottery = lottery || '恭喜你中奖了!'
    this.lotteryType = lotteryType || 'text'
    this.drawPercentCallback = drawPercentCallback || null

    this.clientRect = null
    this.background = null
    this.backCtx = null
    this.mask = null
    this.maskCtx = null

    this.drawLottery()
  }

  calcNum (val) {
    const ratio = val / 750
    return document.documentElement.clientWidth * ratio
  }
}()
