webpackJsonp([111],{1309:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r=t(136),o=i(r),a=t(28),c=i(a),l=t(29),d=i(l),s=t(124),h=i(s),m=t(125),p=i(m),u=t(27),g=i(u),b=t(754),f=i(b),w=t(161),A=i(w),k=t(56),v=i(k),y=t(54);t(510),t(756);var R=1,E=1,I=0,M=0,N=function(e){function n(e){(0,c.default)(this,n);var t=(0,h.default)(this,(n.__proto__||(0,o.default)(n)).call(this,e));return t.state={scratchDisplay:"hide",bannerDisplay:"show",loginFlag:1},t}return(0,p.default)(n,e),(0,d.default)(n,[{key:"componentDidMount",value:function(){}},{key:"componentDidUpdate",value:function(){I=document.getElementsByClassName("canvas")[0].offsetWidth,M=document.getElementsByClassName("canvas")[0].offsetHeight,this.init()}},{key:"init",value:function(){f.default.init(this.refs.lotteryContainer,"/assets/img/activity/scratch-card/scratch-04.jpg","image",I,M,30,60,"太遗憾了,没有中奖","text",this.scratch.bind(this))}},{key:"scratch",value:function(e){var n=this;e>35&&R&&(R=0,v.default.loading(""),(0,y.get)("http://credit.xianjincard.com/activity/scratch-act/scratch?tag=h5-20170526-scratch_act").then(function(e){return e.data}).then(function(e){if(v.default.hide(),0!==e.code)return A.default.alert(Content.showHtml(e.code),"popup-show"),-1001===e.code?(n.setState({loginFlag:0}),void A.default.click("a.click",y.login)):-2022===e.code?void A.default.click("a.click",y.goHome):-2024===e.code?void A.default.click("a.click",function(){n.init(),R=1}):void A.default.click("a.click");n.setState({})})),e<35&&E&&(E=0,v.default.info("请在多刮一点哦",2),setTimeout(function(){E=1},2200))}},{key:"showPic",value:function(){this.setState({scratchDisplay:"show",bannerDisplay:"hide"})}},{key:"render",value:function(){var e=this.state,n=e.bannerDisplay,t=e.scratchDisplay;return g.default.createElement("div",{className:"scratch"},g.default.createElement("a",{className:n,onClick:this.showPic.bind(this)}," ",g.default.createElement("img",{src:"/assets/img/activity/week/scratch-banner.png"}),"点击刮奖"),g.default.createElement("div",{className:"canvas-content "+t},g.default.createElement("div",{ref:"lotteryContainer",className:"canvas"})))}}]),n}(g.default.Component);n.default=N,e.exports=n.default},132:function(e,n){function t(e,n){var t=e[1]||"",r=e[3];if(!r)return t;if(n&&"function"==typeof btoa){var o=i(r);return[t].concat(r.sources.map(function(e){return"/*# sourceURL="+r.sourceRoot+e+" */"})).concat([o]).join("\n")}return[t].join("\n")}function i(e){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(e))))+" */"}e.exports=function(e){var n=[];return n.toString=function(){return this.map(function(n){var i=t(n,e);return n[2]?"@media "+n[2]+"{"+i+"}":i}).join("")},n.i=function(e,t){"string"==typeof e&&(e=[[null,e,""]]);for(var i={},r=0;r<this.length;r++){var o=this[r][0];"number"==typeof o&&(i[o]=!0)}for(r=0;r<e.length;r++){var a=e[r];"number"==typeof a[0]&&i[a[0]]||(t&&!a[2]?a[2]=t:t&&(a[2]="("+a[2]+") and ("+t+")"),n.push(a))}},n}},133:function(e,n,t){function i(e,n){for(var t=0;t<e.length;t++){var i=e[t],r=u[i.id];if(r){r.refs++;for(var o=0;o<r.parts.length;o++)r.parts[o](i.parts[o]);for(;o<i.parts.length;o++)r.parts.push(s(i.parts[o],n))}else{for(var a=[],o=0;o<i.parts.length;o++)a.push(s(i.parts[o],n));u[i.id]={id:i.id,refs:1,parts:a}}}}function r(e,n){for(var t=[],i={},r=0;r<e.length;r++){var o=e[r],a=n.base?o[0]+n.base:o[0],c=o[1],l=o[2],d=o[3],s={css:c,media:l,sourceMap:d};i[a]?i[a].parts.push(s):t.push(i[a]={id:a,parts:[s]})}return t}function o(e,n){var t=b(e.insertInto);if(!t)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var i=A[A.length-1];if("top"===e.insertAt)i?i.nextSibling?t.insertBefore(n,i.nextSibling):t.appendChild(n):t.insertBefore(n,t.firstChild),A.push(n);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");t.appendChild(n)}}function a(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var n=A.indexOf(e);n>=0&&A.splice(n,1)}function c(e){var n=document.createElement("style");return e.attrs.type="text/css",d(n,e.attrs),o(e,n),n}function l(e){var n=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",d(n,e.attrs),o(e,n),n}function d(e,n){Object.keys(n).forEach(function(t){e.setAttribute(t,n[t])})}function s(e,n){var t,i,r,o;if(n.transform&&e.css){if(!(o=n.transform(e.css)))return function(){};e.css=o}if(n.singleton){var d=w++;t=f||(f=c(n)),i=h.bind(null,t,d,!1),r=h.bind(null,t,d,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(t=l(n),i=p.bind(null,t,n),r=function(){a(t),t.href&&URL.revokeObjectURL(t.href)}):(t=c(n),i=m.bind(null,t),r=function(){a(t)});return i(e),function(n){if(n){if(n.css===e.css&&n.media===e.media&&n.sourceMap===e.sourceMap)return;i(e=n)}else r()}}function h(e,n,t,i){var r=t?"":i.css;if(e.styleSheet)e.styleSheet.cssText=v(n,r);else{var o=document.createTextNode(r),a=e.childNodes;a[n]&&e.removeChild(a[n]),a.length?e.insertBefore(o,a[n]):e.appendChild(o)}}function m(e,n){var t=n.css,i=n.media;if(i&&e.setAttribute("media",i),e.styleSheet)e.styleSheet.cssText=t;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(t))}}function p(e,n,t){var i=t.css,r=t.sourceMap,o=void 0===n.convertToAbsoluteUrls&&r;(n.convertToAbsoluteUrls||o)&&(i=k(i)),r&&(i+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var a=new Blob([i],{type:"text/css"}),c=e.href;e.href=URL.createObjectURL(a),c&&URL.revokeObjectURL(c)}var u={},g=function(e){var n;return function(){return void 0===n&&(n=e.apply(this,arguments)),n}}(function(){return window&&document&&document.all&&!window.atob}),b=function(e){var n={};return function(t){return void 0===n[t]&&(n[t]=e.call(this,t)),n[t]}}(function(e){return document.querySelector(e)}),f=null,w=0,A=[],k=t(134);e.exports=function(e,n){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");n=n||{},n.attrs="object"==typeof n.attrs?n.attrs:{},n.singleton||(n.singleton=g()),n.insertInto||(n.insertInto="head"),n.insertAt||(n.insertAt="bottom");var t=r(e,n);return i(t,n),function(e){for(var o=[],a=0;a<t.length;a++){var c=t[a],l=u[c.id];l.refs--,o.push(l)}if(e){i(r(e,n),n)}for(var a=0;a<o.length;a++){var l=o[a];if(0===l.refs){for(var d=0;d<l.parts.length;d++)l.parts[d]();delete u[l.id]}}}};var v=function(){var e=[];return function(n,t){return e[n]=t,e.filter(Boolean).join("\n")}}()},134:function(e,n){e.exports=function(e){var n="undefined"!=typeof window&&window.location;if(!n)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var t=n.protocol+"//"+n.host,i=t+n.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(e,n){var r=n.trim().replace(/^"(.*)"$/,function(e,n){return n}).replace(/^'(.*)'$/,function(e,n){return n});if(/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(r))return e;var o;return o=0===r.indexOf("//")?r:0===r.indexOf("/")?t+r:i+r.replace(/^\.\//,""),"url("+JSON.stringify(o)+")"})}},161:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var r=t(57),o=i(r),a=t(28),c=i(a),l=t(29),d=i(l);n.default=new(function(){function e(){(0,c.default)(this,e)}return(0,d.default)(e,[{key:"createDom",value:function(e,n,t,i){var r=this,a={overlay:!0,span:!0};(0,o.default)(a,i),this.callback=t;var c='<div class="popup-cover"></div>\n                  <div class="content">\n                    <span class="close" style="'+(a.span?"":"display: none;")+'"></span>\n                    '+e+"\n                  </div>",l=document.createElement("div");l.className="popup-container "+(n||""),l.innerHTML=c,document.body.appendChild(l),l.querySelector("div.content").className="content in",l.querySelector("div.popup-cover").addEventListener("click",function(e){e.stopPropagation(),a.overlay&&r.close(e)},!1),l.querySelector("span.close").addEventListener("click",function(e){e.preventDefault(),a.span&&r.close(e)},!1),this.dom=l}},{key:"addEventListener",value:function(e,n,t){for(var i=this.dom.querySelectorAll(e),r=0,o=i.length;r<o;r++)i[r].addEventListener(n,function(e){e.preventDefault(),t(e)},!1)}},{key:"click",value:function(e,n){var t=this;this.addEventListener(e,"click",function(e){t.close(e,n)})}},{key:"clickAndClose",value:function(e,n){var t=this;this.addEventListener(e,"click",function(e){n(t.close.bind(t,e),e)})}},{key:"closeClick",value:function(e,n){this.dom.querySelector(e).addEventListener("click",function(e){e.preventDefault(),n&&n(e)},!1)}},{key:"close",value:function(e,n){var t=this;e.preventDefault(),this.dom.querySelector("div.content").className="content out",setTimeout(function(){t.dom.parentNode.removeChild(t.dom),t.callback&&t.callback(),n&&n(e)},200)}},{key:"alert",value:function(e,n,t,i){this.createDom(e,n,t,i)}}]),e}()),e.exports=n.default},510:function(e,n,t){var i=t(511);"string"==typeof i&&(i=[[e.i,i,""]]);var r={};r.transform=void 0;t(133)(i,r);i.locals&&(e.exports=i.locals)},511:function(e,n,t){n=e.exports=t(132)(void 0),n.push([e.i,"button {\n  border: none; }\n\ni {\n  font-style: inherit; }\n\n.hide {\n  display: none; }\n\n.show {\n  display: block; }\n\n.card-list {\n  width: 9.2rem; }\n  .card-list dt {\n    font-size: 0.37333rem;\n    height: 0.50667rem;\n    line-height: 0.50667rem; }\n    .card-list dt button {\n      color: #4bb6fa;\n      font-size: 0.37333rem;\n      float: right;\n      background: none; }\n      .card-list dt button:after {\n        content: '';\n        display: inline-block;\n        width: 0.34667rem;\n        height: 0.25333rem;\n        background: url("+t(512)+") 0 0 no-repeat;\n        background-size: contain; }\n  .card-list dd {\n    width: 8.81333rem;\n    padding-left: 0.38667rem;\n    padding-bottom: 0.29333rem;\n    background: #f5f5f5;\n    border-radius: 0.26667rem;\n    margin-top: 0.22667rem; }\n    .card-list dd span {\n      display: inline-block;\n      background: #e4e4e4;\n      padding: 0 0.26667rem;\n      line-height: 0.6rem;\n      border-radius: 0.06667rem;\n      font-size: 0.32rem; }\n    .card-list dd .card-wrapper {\n      width: 100%;\n      margin-top: 0.28rem; }\n    .card-list dd a {\n      display: inline-block;\n      margin-right: 0.26667rem;\n      width: 1.90667rem;\n      height: 2.57333rem;\n      background: url("+t(513)+") 0 0 no-repeat;\n      background-size: contain;\n      position: relative; }\n      .card-list dd a img {\n        position: absolute;\n        top: 0.66667rem;\n        left: 0.57333rem;\n        width: 0.82667rem;\n        height: 0.82667rem; }\n      .card-list dd a b {\n        position: absolute;\n        top: 1.57333rem;\n        left: 0;\n        width: 100%;\n        text-align: center;\n        font-size: 0.32rem;\n        color: #666;\n        font-weight: 100; }\n    .card-list dd.win {\n      background: #fff1f1; }\n      .card-list dd.win span {\n        background: #ffc3c3; }\n      .card-list dd.win button {\n        display: block;\n        border-radius: 0.26667rem;\n        background: #fb6b47;\n        margin: 0.16rem auto 0;\n        color: #fff;\n        font-size: 0.32rem;\n        padding: 0.10667rem 0.46667rem; }\n\n.btn {\n  width: 100%;\n  height: 1.12rem;\n  background: #e33209;\n  text-align: center;\n  line-height: 1.12rem;\n  color: #fff;\n  font-size: 0.42667rem;\n  border-radius: 0.53333rem;\n  margin-top: 0.66667rem; }\n\n.link {\n  text-align: center;\n  display: block;\n  font-size: 0.37333rem;\n  color: #666;\n  margin-top: 0.26667rem;\n  line-height: 0.42667rem; }\n  .link:before {\n    content: '';\n    display: inline-block;\n    width: 0.42667rem;\n    height: 0.42667rem;\n    background: url("+t(514)+") 0 0 no-repeat;\n    background-size: contain;\n    vertical-align: middle;\n    margin-right: 0.13333rem;\n    padding-bottom: 0.13333rem; }\n\n.right-top-btn {\n  position: absolute;\n  right: 0.4rem;\n  top: -0.8rem; }\n\n.popup-container .close {\n  top: -1.2rem;\n  right: -0.33333rem;\n  border: 0.02667rem solid #e9e9e9;\n  border-radius: 100%;\n  padding: 0.13333rem; }\n  .popup-container .close:before, .popup-container .close:after {\n    background: #e9e9e9;\n    top: 0.44rem;\n    left: 0.10667rem; }\n\n.popup-container .content {\n  padding: 0;\n  width: 7.65333rem;\n  height: 10.30667rem;\n  border-radius: 0.26667rem; }\n\n.popup-win {\n  text-align: center; }\n  .popup-win h2 {\n    height: 1.6rem;\n    background: #fc6221;\n    font-size: 0.37333rem;\n    color: #fff;\n    line-height: 0.6rem;\n    padding-top: 0.48rem;\n    border-top-left-radius: 0.26667rem;\n    border-top-right-radius: 0.26667rem;\n    font-weight: bold; }\n  .popup-win p {\n    font-size: 0.32rem;\n    margin: 0.24rem 0 0.32rem; }\n  .popup-win .share-btn {\n    display: block;\n    line-height: 0.8rem;\n    background: #e33209;\n    width: 3.18667rem;\n    margin: 0 auto;\n    color: #fff;\n    border-radius: 0.4rem; }\n  .popup-win .card-list {\n    width: 7.46667rem; }\n    .popup-win .card-list dd.win {\n      padding-left: 0.49333rem;\n      width: 7.06667rem;\n      background: #efefef; }\n      .popup-win .card-list dd.win a {\n        width: 1.52rem;\n        height: 2.04rem;\n        margin-right: 0.22667rem; }\n        .popup-win .card-list dd.win a img {\n          width: 0.66667rem;\n          height: 0.66667rem;\n          left: 0.42667rem;\n          top: 0.52rem; }\n        .popup-win .card-list dd.win a b {\n          font-size: 0.25333rem;\n          top: 1.06667rem; }\n  .popup-win .content {\n    width: 7.65333rem;\n    height: 7.50667rem;\n    background: #efefef; }\n\n.popup-rule h2 {\n  font-size: 0.37333rem;\n  margin: 0.4rem 0.66667rem;\n  line-height: 0.56rem; }\n  .popup-rule h2:first-of-type {\n    padding-top: 0.08rem; }\n\n.popup-rule .img1 {\n  width: 5.26667rem;\n  height: 3.10667rem;\n  background: url("+t(515)+") 0 0 no-repeat; }\n\n.popup-rule .img2 {\n  width: 6.66667rem;\n  height: 3.25333rem;\n  background: url("+t(516)+") 0 0 no-repeat; }\n\n.popup-rule .img1, .popup-rule .img2 {\n  background-size: contain;\n  display: block;\n  margin: 0 auto; }\n\n.popup-card .card {\n  width: 7.65333rem;\n  height: 9.24rem;\n  border-radius: 0.26667rem;\n  color: #141414;\n  position: relative;\n  z-index: 102;\n  background-repeat: no-repeat;\n  background-size: 7.65333rem 10.30667rem;\n  padding-top: 1.06667rem; }\n  .popup-card .card span {\n    display: block;\n    margin: 0 auto;\n    width: 1.2rem;\n    height: 1.2rem;\n    padding: 0.49333rem;\n    border-style: solid;\n    border-width: 0.01333rem;\n    border-color: #dfdfdf;\n    background-color: white;\n    -webkit-box-shadow: 0 0.01333rem 0.32rem 0 rgba(34, 23, 20, 0.1);\n            box-shadow: 0 0.01333rem 0.32rem 0 rgba(34, 23, 20, 0.1);\n    border-radius: 100%; }\n    .popup-card .card span img {\n      display: block;\n      width: 1.2rem;\n      height: 1.2rem; }\n  .popup-card .card h2 {\n    width: 5.66667rem;\n    font-size: 0.56rem;\n    text-align: center;\n    margin: 0.8rem auto 0; }\n  .popup-card .card p {\n    width: 5.66667rem;\n    height: 4.53333rem;\n    font-size: 0.37333rem;\n    margin: 0.4rem auto 0;\n    line-height: 0.6rem;\n    overflow: hidden; }\n\n.popup-video .content {\n  padding: 0;\n  width: 7.86667rem;\n  height: 14rem;\n  top: 48%;\n  border-radius: 0; }\n\n.week-happy {\n  padding: 0.4rem;\n  color: #323333; }\n  .week-happy .banner-wrapper {\n    position: relative;\n    height: 5.82667rem;\n    margin-bottom: 0.53333rem; }\n    .week-happy .banner-wrapper .banner-item img {\n      display: block;\n      width: 9.18667rem;\n      height: 5.12rem; }\n    .week-happy .banner-wrapper .slider-decorator-0, .week-happy .banner-wrapper .am-carousel-wrap {\n      height: 1.06667rem;\n      vertical-align: top; }\n    .week-happy .banner-wrapper .video-meta {\n      background-color: white;\n      -webkit-box-shadow: 0 0.06667rem 0.06667rem 0 rgba(34, 23, 20, 0.16);\n              box-shadow: 0 0.06667rem 0.06667rem 0 rgba(34, 23, 20, 0.16);\n      width: 6.04rem;\n      height: 0.93333rem;\n      padding: 0.09333rem 0;\n      position: absolute;\n      bottom: 0;\n      margin-left: 1.57333rem;\n      font-size: 0.32rem;\n      line-height: 0.45333rem;\n      text-align: center;\n      border-radius: 0.53333rem; }\n      .week-happy .banner-wrapper .video-meta span i {\n        background: #323333;\n        padding: 0.01333rem 0.09333rem;\n        display: inline-block;\n        border-radius: 0.06667rem;\n        color: #fff; }\n      .week-happy .banner-wrapper .video-meta b {\n        color: #e34000; }\n      .week-happy .banner-wrapper .video-meta a {\n        font-weight: bold;\n        color: #4bb6fa;\n        font-size: 0.4rem; }\n        .week-happy .banner-wrapper .video-meta a:after {\n          content: '';\n          display: inline-block;\n          width: 0.22667rem;\n          height: 0.33333rem;\n          background: url("+t(517)+") 0 0 no-repeat;\n          background-size: contain; }\n  .week-happy ul.prizer {\n    margin-bottom: 0.93333rem; }\n    .week-happy ul.prizer li {\n      font-size: 0.37333rem;\n      line-height: 0.4rem;\n      padding: 0.2rem 0 0.2rem 0.85333rem; }\n      .week-happy ul.prizer li:first-of-type {\n        background: #ffeae1;\n        position: relative; }\n        .week-happy ul.prizer li:first-of-type:before {\n          position: absolute;\n          left: 0.16rem;\n          top: 0.16rem;\n          content: ' ';\n          width: 0.52rem;\n          height: 0.52rem;\n          background: url("+t(518)+") 0 0 no-repeat;\n          background-size: contain; }\n\n.scratch a {\n  font-size: 0;\n  margin-top: 0.4rem; }\n  .scratch a img {\n    display: block;\n    width: 10rem;\n    height: 2.98667rem; }\n\n.scratch .canvas-content {\n  display: none; }\n  .scratch .canvas-content .canvas {\n    position: relative;\n    width: 10rem;\n    height: 2.98667rem;\n    margin: 0.4rem auto 0;\n    overflow: hidden; }\n  .scratch .canvas-content.show {\n    display: block; }\n\n.rule {\n  padding: 0.26667rem 0.4rem;\n  line-height: 0.6rem; }\n  .rule h2 {\n    font-weight: bold; }\n  .rule h2, .rule h3 {\n    color: #000;\n    font-size: 0.42667rem; }\n  .rule p {\n    color: #333;\n    font-size: 0.37333rem;\n    margin-bottom: 0.53333rem; }\n    .rule p.grey {\n      color: #666; }\n  .rule .red {\n    color: red; }\n  .rule table {\n    width: 100%;\n    text-align: center;\n    font-size: 0.32rem;\n    margin-top: 0.13333rem;\n    margin-bottom: 0.13333rem;\n    border-top: 0.01333rem solid #333;\n    border-left: 0.01333rem solid #333; }\n    .rule table th {\n      background: #ccc;\n      font-weight: bold;\n      color: #000;\n      text-align: center; }\n    .rule table th, .rule table td {\n      border-right: 0.01333rem solid #333;\n      border-bottom: 0.01333rem solid #333; }\n    .rule table span {\n      display: inline-block;\n      width: 0.37333rem;\n      height: 0.37333rem;\n      color: #fff;\n      border-radius: 100%;\n      margin-left: 0.06667rem;\n      text-align: center;\n      line-height: 0.37333rem;\n      font-size: 0.32rem;\n      background: #dedede; }\n      .rule table span.red {\n        background: #fb2e11;\n        color: #fff; }\n\n.gold-exchange {\n  padding: 0.4rem; }\n  .gold-exchange img {\n    display: block;\n    width: 100%;\n    border-radius: 0.4rem; }\n  .gold-exchange button {\n    width: 100%;\n    height: 1.10667rem;\n    line-height: 1.10667rem;\n    text-align: center;\n    font-size: 0.42667rem;\n    color: #fff;\n    background: #e33209;\n    margin-top: 0.4rem;\n    margin-bottom: 0.8rem;\n    border-radius: 0.53333rem; }\n    .gold-exchange button:before {\n      content: '';\n      display: inline-block;\n      margin-right: 0.13333rem;\n      width: 0.53333rem;\n      height: 0.54667rem;\n      vertical-align: middle;\n      background: url("+t(519)+") 0 0 no-repeat;\n      background-size: contain; }\n  .gold-exchange .introduce {\n    padding: 0.4rem;\n    background: #f1f1f1;\n    color: #323333; }\n    .gold-exchange .introduce h2 {\n      font-size: 0.4rem;\n      margin-bottom: 0.4rem; }\n    .gold-exchange .introduce p {\n      font-size: 0.32rem;\n      line-height: 0.50667rem; }\n      .gold-exchange .introduce p:first-of-type {\n        margin-bottom: 0.8rem; }\n\n.my-history {\n  padding: 0.4rem; }\n  .my-history dt b {\n    font-weight: bold; }\n\n.award-history {\n  padding: 0.4rem; }\n  .award-history .card-list dd {\n    height: 5.86667rem;\n    margin-bottom: 0.46667rem;\n    position: relative; }\n  .award-history .prizer {\n    position: absolute;\n    left: 0;\n    bottom: 0.04rem;\n    width: 9.2rem;\n    height: 2.08rem;\n    display: table-row;\n    background: #fff;\n    border-bottom-right-radius: 0.26667rem;\n    border-bottom-left-radius: 0.26667rem;\n    padding-top: 0.13333rem; }\n    .award-history .prizer p {\n      display: table-cell;\n      width: 2.62667rem;\n      text-align: center;\n      line-height: 0.6rem;\n      font-size: 0.37333rem; }\n      .award-history .prizer p i {\n        font-size: 0.32rem;\n        color: #fb6020; }\n      .award-history .prizer p b {\n        font-size: 0.42667rem;\n        font-weight: 100; }\n",""])},512:function(e,n){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAATCAMAAAC5m+00AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpGMTVERDREM0E3ODdFNzExOTk0RDlBOTAxMUFDRTU5MCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpCQUFFNTRBNThEMkExMUU3ODUzNjkxRTlEQjBGQ0YxNiIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpCQUFFNTRBNDhEMkExMUU3ODUzNjkxRTlEQjBGQ0YxNiIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZCRTlGREU0QTI4OEU3MTE5OTREOUE5MDExQUNFNTkwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkYxNURENEQzQTc4N0U3MTE5OTREOUE5MDExQUNFNTkwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+PwJSlQAAAC1QTFRF////9Pr/bcT7j9H8u+T93fH+0u3+g838Vrv6Yr/7eMj7sN/9mtb86Pb+x+j9HhMBIAAAAGhJREFUeNqMkUsOgCAMBVsof/H+x2VRTW18Emc1YUGGBxHlSDcPVWJgoIqEBFQ5WwaqpCpAFQ4H0OugFH7rn9CagCqlMdDtjdyto7uOacnT13+/WWwe8UsNG3X4fTdpEah+7UBKtAQYACjJAj0OcQsCAAAAAElFTkSuQmCC"},513:function(e,n,t){e.exports=t.p+"assets/img/activity/week/card-bg.png?4c9d0325ca96b32004179186f4e803c9"},514:function(e,n){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkMzRDVDM0UwOEM2MDExRTdBQTFCQUNGRDhGRTJCODNFIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkMzRDVDM0UxOEM2MDExRTdBQTFCQUNGRDhGRTJCODNFIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzNENUMzREU4QzYwMTFFN0FBMUJBQ0ZEOEZFMkI4M0UiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzNENUMzREY4QzYwMTFFN0FBMUJBQ0ZEOEZFMkI4M0UiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4iXg5GAAADfUlEQVR42ryXXUgVQRSAr6vWtezHDCITybAgJbWCDJEoe0go0JLIfp7F6qF6UQgpAoMkAnvIfOopoiJNQUEhDCKiIKwEDaIwQ7q9iEHXumVa58S3MWx7d/daduDjzt2dOefsnJlzZpJqa2tDASVTqBTKhUIhV0jnXVQYEQaFfqFLGA+iNCVAnwKhUdgnzHO8+8KvOrIBDgtXhQ6hSRjyUm55vFOlV/iqGvr2CEeFIiFNWCFk0y7iXQ99axirOhYl6oB+9TPhmDAtXBZyhD1CG4pjwjvhg7CcZ230yWHMNDoG0BnIgRLhoZAnvBCKhZNCxKXvUiEVB0yJMKYYHXnoLPFzQL3sRfEdYasw7BGmSWFGmIjzfhgd7ejsdc6E5Yh5Jx3biWHMZ4GuFdYIox59VMcBw4lOc02YDjQb036E+PlJxMe4LdPotMNxwemATkudMCUc8vjyBaz01aHEJYbuKWwVmA400m71ifl5+lwLzU6GGW9h81cjkyTznTB4yV1+dwh7Z+lEM7bUZqZFetUM1xdnq5nyQLhN+5IQdumjulb6rJs++lVa5HaV7oBfUE88tRaccryrEl4Kb3zWiW2r3KKwqDwK6ICu+ou0TwtZ1IB7hEi3ZZKQ4aHDtlVo8SUqrxKIo26j9+SOAdL2Tt5pAlvPM1OWMStLDFu5FkpipFTNaD8or15x/CaM0daClMwe3y7sF946+mdTM0ZYA2FsppvlWB1YSDvNpfSackbYYvzX2r85YPL6oxZE8egz8dsYIL3eFz4JT5kx3crbPPqPMVO5zGwMm9EUpkUX0TpK6lgAx9WBxbTPCqtwxksmjKJlL/yRFIyqA6W0E5VzsxhTyu+gxRkuxEHif4ltq9/iAKmrepfPyv9XkoUttdllsYI7OKA2/AcH6rGlNsftatjEyUbPb/lzaDwfGzPY/F2OhzhQai64EafI/K2E0Z2KrSHniUin/zXH6+tkNz/JIAf4STI6i7DR4HYki1LNPgrVwi2fmUgjZ0R8nAijqxrdVdhyPRXrtFQYTjz2WBPzOaKlelw88tFhG69w3pTc7gVPhDIjHM+FFpct+pWUOkVadm61Fsba016G7kA3oyFqQivxO8EtqJsDZSE1IJs0PMmzOvqMMiYZHZvi3RG9Lqcap+MosC+nu8E86YZc1oommZtBLqdBbseq4OBcXc9/CjAAPN/Wd3wZSXIAAAAASUVORK5CYII="},515:function(e,n,t){e.exports=t.p+"assets/img/activity/week/rule-img1.jpg?d749f49b3be96fdf543e3359e26da286"},516:function(e,n,t){e.exports=t.p+"assets/img/activity/week/rule-img2.jpg?dac8383b3affbfce2f1dfb6c264530f7"},517:function(e,n){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAZCAMAAADg4DWlAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA2ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpGMTVERDREM0E3ODdFNzExOTk0RDlBOTAxMUFDRTU5MCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo3QjlGRjQzMzhEMkIxMUU3QkZBRkEwODlBN0ZDM0UxRSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3QjlGRjQzMjhEMkIxMUU3QkZBRkEwODlBN0ZDM0UxRSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjZCRTlGREU0QTI4OEU3MTE5OTREOUE5MDExQUNFNTkwIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkYxNURENEQzQTc4N0U3MTE5OTREOUE5MDExQUNFNTkwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ymddCQAAACpQTFRF////S7b63fH+9Pr/u+T9Vrr6bMP7jtH8mdb8pdr8x+j90u3+g838d8j7MurR0gAAAFRJREFUeNqM0TkOwDAIRFGGzXaW+183aT1YiSlfgb5AZGv0UpKO8FksASJpS+pEA2hEvqQ0yootKrvehuO7k8FuhkScDNORtEBUoNZR4s1/XvMIMAAsywFjo6PWDwAAAABJRU5ErkJggg=="},518:function(e,n){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACcAAAAnCAYAAACMo1E1AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkU4NTA5RDZBOEM4RDExRTc5NzZCQ0VCMkEzQTIxNzk3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkU4NTA5RDZCOEM4RDExRTc5NzZCQ0VCMkEzQTIxNzk3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RTg1MDlENjg4QzhEMTFFNzk3NkJDRUIyQTNBMjE3OTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RTg1MDlENjk4QzhEMTFFNzk3NkJDRUIyQTNBMjE3OTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5F68EcAAADfklEQVR42sSYaUhUURTH34xTYoQrky1SCIVR0UoERWkpUUQ0WURfooWg+igZRRRGRvSp+lRQUdGCti9Gm2RS2UoWFUF90agGnMFpoUVMrf+hM/B4vDv33DeDHvihvLnv3v+799xzzr2+SPEgy6MNAeWgBIwDBWAg6ABR8A48AFfAS1UnwcY25QA+D+ImgO1gMfAL32kGu8EFE3F+A1HpYC94DpYYvjsZnAcNYLj0JekAQdAEKkCa5d1m8xIXp0ocCXsIplipsRxwA5QmK64fqAMjhQN3CdtlgIugKBlxO8E04YDki/sNZjAT1EZL8gNexNFXVRoMdhjs4jAitYlggxdx20BAOMgvUAO+gSpDH9yK2Us3EZcHlhsMcAZ8t83gG4N3B3MwF4srN5g1siOOTbHRcPZcJ0IloFTYaTeo51Bjt9tgHRgFhnI4GsZ/gy79zMLS+pEteiTixiued4JnoJHzJvFD0faQIjRdB2WO59lgBGiRiHOLazEwnRO6VzvgIixuhU5xbj7Xn7/QabngLid+L7YZrNXEPe2G6NGUSffAHENhS8Eegf9qxXVxvEr0hTcNQg3N9AlBu5g0lLQKcm4Nl0I6y+JcqrMPUnFPDEKJzp6CP5o2YYSRT1Jxd4Ti2gRtOrgoSGT1JhmiLkH8spszyU8F1Rxw7XZf00+tibjfAieO2pZ1AJfwj7lgoHh1DIzl35sS9NNiOnPxgCmZtTJO9BW2/mjDrOLn1zSl/UH4W7epuE0acT/BUf7qwgTtFridumy2Bnk100TcFrBSI478a3UKzhSjwSkI9EnEhfiM2Zu20K1IdYqbBE7TYdvqfavC7IVU4ihvXuWd11d2EgLHOMVl8J1GgdW3RnctlyEwOy6OlvA4O7gXC4O3fMiJF6SUJ1977I+q5xoITKNicwdYxj9QNdLOxJh5fEp3s698xfBeURfS3cgMxbtfuLrJZfKYLB6zmm6ZirhhTHFivwXmKuq++XxeUFk+J363yxsq8Wc6b5n4kE1icwKCsjuseF6pERYvDEIsxLnR2hX3dTRBEcIv9CmnUd7cJ/ShF5zKLIk401smZ531CKw3dPJzfO/i9LmkxX22/f/R+n+j2elhF9LGu5SoLPciLmwro0LCAtPN/oIV4FUqxcWXlfymOckgS5XMIi63tMsquQ+JcFI+m6Is0MpHRW3+/ifAAKGfy3dCnL3LAAAAAElFTkSuQmCC"},519:function(e,n){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAApCAYAAABHomvIAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjI5Q0U1QkI3OEJDNzExRTdBNzc1RkU3MUYwRUYyOTgzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjI5Q0U1QkI4OEJDNzExRTdBNzc1RkU3MUYwRUYyOTgzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MjlDRTVCQjU4QkM3MTFFN0E3NzVGRTcxRjBFRjI5ODMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6MjlDRTVCQjY4QkM3MTFFN0E3NzVGRTcxRjBFRjI5ODMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5uY+ehAAAEkklEQVR42syZWWyMURTHvxltqKq2iLXUUm1p1J6QECQkJYQHIggS4cke8SBILC+CB9sLHqwReyJIqyJB7BK1x1ZGq5TYStEWHf/D/+O42plvvplOnOSn08699/t/5957zrmXx+/3W0GsFegPeoIOoD1oDRqCBiAWVIIP4C3wkbvgArgHqi2X5qlFYG8wDowFnazwrAwcBftBPl/GtcARYDnoY7QrB7fpmWfgJfjGh8sA8fRkE9ASpIAs0M4Y5xVYCzaCCkcKRSCIB/v8f6wa5IPZIBN42S5UmoAxYBt4r8a/B7o5GUP+iQMXVOedIN2loEAkgWWggs8pA9lOBK5UXptcB8JM+oNPfOZN4AkmsJiNt0VBnM0iNWO9A7X1ckGLXbSiZ3nqc3qghl71eVAUBSarz/WdCpwI5kRBXD2wxGljr/H7epALBtSRuAwG6yFOO8Soz09BKsghkqKOg1PgBnjuQpBMXzZfeLSbZaQFrmOkXwXagkyygN+/AUWglO2+GGlLZiOR2SSZL9tGspXxzCJmkjWhChTbAw7ybSdxKhrzu6bEjUmxcJbj7wBd3XjQtipwgMiC7s5p6kqvpNBDUs0k0HNl7PsRfAKvuWQKwU1whdWOFc4U12TfwTUSSStlUSJ2PRyB4Zp4txvXcho9H8+/i6ff8ftYbsSqaAmUAncmGM5N48TKGTE2M9P4TYEJERDWgg8YbfzdrrBL6LlqruHWTHUSHxuxn3AZTAEPLJW0pWhICaMAaA4K1Xh3wSyHYzYFU8El1V/qxwwtUKwE5LgUuF6NszCMIneCqhlzTYG2nQYjQWwIA99i3wegXpjl2EmO9VkL3MJp0fYGbAfTQZcggn2q31HQxmXVvVUL0ALngRgwQ3nDtG/gCTgLjoMDoF0NAsW+8PgwCiQGECVHjqFgI48Bf5nH/+dYN5/52DY5B48CQ3kMbVjLzu3JYOtjpilh1uhitCtmHi7nLm7ErJRqVFXFjI/ZweJgAVnBdhkq4LZi0E1Uac62R8zhw8B4MBI0ZwHSNsDZOY9n52NgtROB2uQMfIc4Os2y7svn73I+7sXqJokee8+UJxnkoR2Yo53qdIlV5DZX/temBSZFaMx0rlG3JptnoL76uM8d/QqkhRFcfUb8XMj057R/AuOtzwwzUnVsol65PpsF9ta2aAOYHWbMevIquMTd/VyFmQTu7s68rOrH67x/Lo9E5G4jPhYwJ8a58GABr1NK/aGbFAgbwCHtQXstLgZLWTxaqoTP5XniHE96lUE8eAYM5ph9GBOzGLiTecbxMpi/47HgNp9xHnxlwpirr99sOjP3VtbyhnLB9BScAyfA4RpS3ekI3N2s07m4JhJ503WECz6Q9WCfwroQGBMg9ewiHi7kHqAj76hbMs014PnY+ln9/vo+iz8fuwwzzZj/LbuijhRDlFfl/m8Nb2ed9pelstiYsRkeB7f8odg0hqw4ozq5ys3wgmHmOzdLMxYfvThL+qC/4ufRtA4uJ9MYtqpchJlqFrt97fEi7UFzLQ1jyMlkCmys6soKhjHx7H2GmXz+L8Jv+yHAAKpRib0B71lkAAAAAElFTkSuQmCC"},754:function(e,n,t){"use strict";function i(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(n,"__esModule",{value:!0});var r=t(28),o=i(r),a=t(29),c=i(a);n.default=new(function(){function e(){(0,o.default)(this,e)}return(0,c.default)(e,[{key:"createElement",value:function(e,n){var t=document.createElement(e);for(var i in n)t.setAttribute(i,n[i]);return t}},{key:"getTransparentPercent",value:function(e,n,t){for(var i=e.getImageData(0,0,n,t),r=i.data,o=[],a=0,c=r.length;a<c;a+=4){r[a+3]<128&&o.push(a)}return(o.length/(r.length/4)*100).toFixed(2)}},{key:"resizeCanvas",value:function(e,n,t){e.width=n,e.height=t,e.getContext("2d").clearRect(0,0,n,t)}},{key:"drawPoint",value:function(e,n){this.maskCtx.beginPath();var t=this.maskCtx.createRadialGradient(e,n,0,e,n,this.drawPointSize);t.addColorStop(0,"rgba(0, 0, 0, 1)"),t.addColorStop(1,"rgba(255, 255, 255, 0)"),this.maskCtx.fillStyle=t,this.maskCtx.arc(e,n,this.drawPointSize,0,2*Math.PI,!0),this.maskCtx.fill(),this.drawPercentCallback&&this.drawPercentCallback.call(null,this.getTransparentPercent(this.maskCtx,this.width,this.height))}},{key:"bindEvent",value:function(){var e=this,n=!1,t=/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()),i=t?"touchstart":"mousedown",r=t?"touchmove":"mousemove";t?(document.addEventListener("touchmove",function(e){n&&e.preventDefault()},!1),document.addEventListener("touchend",function(e){n=!1},!1)):document.addEventListener("mouseup",function(e){n=!1},!1),this.mask.addEventListener(i,function(i){n=!0;var r=document.documentElement;e.clientRect||(e.clientRect={left:0,top:0});var o=(t?i.touches[0].clientX:i.clientX)-e.clientRect.left+r.scrollLeft-r.clientLeft,a=(t?i.touches[0].clientY:i.clientY)-e.clientRect.top+r.scrollTop-r.clientTop;e.drawPoint(o,a)},!1),this.mask.addEventListener(r,function(i){if(!t&&!n)return!1;var r=document.documentElement;e.clientRect||(e.clientRect={left:0,top:0});var o=(t?i.touches[0].clientX:i.clientX)-e.clientRect.left+r.scrollLeft-r.clientLeft,a=(t?i.touches[0].clientY:i.clientY)-e.clientRect.top+r.scrollTop-r.clientTop;e.drawPoint(o,a)},!1)}},{key:"drawLottery",value:function(){if(this.background=this.background||this.createElement("canvas",{style:"position:absolute;left:0;top:0;"}),this.mask=this.mask||this.createElement("canvas",{style:"position:absolute;left:0;top:0;"}),this.conNode.innerHTML.replace(/[\w\W]| /g,"")||(this.conNode.appendChild(this.background),this.conNode.appendChild(this.mask),this.clientRect=this.conNode?this.conNode.getBoundingClientRect():null,this.bindEvent()),this.backCtx=this.backCtx||this.background.getContext("2d"),this.maskCtx=this.maskCtx||this.mask.getContext("2d"),"image"===this.lotteryType){var e=new Image,n=this;e.onload=function(){n.resizeCanvas(n.background,n.width,n.height),n.backCtx.drawImage(this,0,0,n.width,n.height),n.drawMask()},e.src=this.lottery}else"text"===this.lotteryType&&(this.width=this.width,this.height=this.height,this.resizeCanvas(this.background,this.width,this.height),this.backCtx.save(),this.backCtx.fillStyle="#FFF",this.backCtx.fillRect(0,0,this.width,this.height),this.backCtx.restore(),this.backCtx.save(),this.backCtx.font="Bold "+this.fontSize/75+"rem Arial",this.backCtx.textAlign="center",this.backCtx.fillStyle="#F60",this.backCtx.fillText(this.lottery,this.width/2,this.height/2+this.fontSize/2),this.backCtx.restore(),this.drawMask())}},{key:"drawMask",value:function(){if(this.resizeCanvas(this.mask,this.width,this.height),"color"===this.coverType)this.maskCtx.fillStyle=this.cover,this.maskCtx.fillRect(0,0,this.width,this.height),this.maskCtx.globalCompositeOperation="destination-out";else if("image"===this.coverType){var e=new Image,n=this;this.maskCtx.fillStyle="#afafaf",this.maskCtx.fillRect(0,0,this.width,this.height),this.maskCtx.globalCompositeOperation="destination-out",e.onload=function(){n.resizeCanvas(n.mask,n.width,n.height),n.maskCtx.drawImage(this,0,0,n.width,n.height),n.maskCtx.globalCompositeOperation="destination-out"},e.src=this.cover}}},{key:"init",value:function(e,n,t,i,r,o,a,c,l,d){this.conNode=e,this.cover=n||"#afafaf",this.coverType=t||"color",this.width=i,this.height=r,this.fontSize=o||50,this.drawPointSize=this.calcNum(a)||this.calcNum(30),this.lottery=c||"恭喜你中奖了!",this.lotteryType=l||"text",this.drawPercentCallback=d||null,this.clientRect=null,this.background=null,this.backCtx=null,this.mask=null,this.maskCtx=null,this.drawLottery()}},{key:"calcNum",value:function(e){var n=e/750;return document.documentElement.clientWidth*n}}]),e}()),e.exports=n.default},756:function(e,n,t){e.exports=t.p+"assets/img/activity/scratch-card/scratch-04.jpg?2c1b6b3f9b28c213444d2691ee0b7ffa"}});