webpackJsonp([143],{1248:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=n(136),o=r(a),i=n(28),l=r(i),c=n(29),u=r(c),s=n(124),d=r(s),f=n(125),p=r(f),m=n(27),v=r(m),h=n(161),b=r(h),g=n(56),y=r(g),k=n(54);n(1249),n(1252),n(1253),n(1254);var E=function(e){function t(e){(0,l.default)(this,t);var n=(0,d.default)(this,(t.__proto__||(0,o.default)(t)).call(this,e));return n.forward=function(e){if(!n.state.isLogin)return b.default.alert("<p>您还未登录哦，请先登录</p><a class='click'>立即登录</a>","popup"),void b.default.click("a.click",k.login);var t=Math.floor((new Date).getTime()/1e3);return t<1495279272?(b.default.alert("<p>活动还未没开始哦！</p><a class='click'>知道了</a>","popup"),void b.default.click("a.click")):t>1495538472?(b.default.alert("<p>活动已经结束啦~<br/>请关注现金卡其他活动吧</p><a class='click'>知道了</a>","popup"),void b.default.click("a.click")):1===e?void(location.href="https://www.baidu.com/"):void(0===e&&(0,k.goCertification)())},n.state={isLogin:!1},n}return(0,p.default)(t,e),(0,u.default)(t,[{key:"componentDidMount",value:function(){document.title="产品升级",(0,k.share)("Update"),this.fetch()}},{key:"fetch",value:function(){var e=this;y.default.loading(""),(0,k.get)("http://credit.xianjincard.com/activity/default/get-invite-code").then(function(t){if(y.default.hide(),-1001!==t.data.code&&0!==t.data.code)return b.default.alert("<p>服务器繁忙 请稍后再试</p><a class='click'>朕知道了</a>","popup"),void b.default.click("a.click");e.setState({isLogin:0===t.data.code})})}},{key:"render",value:function(){var e=this;return v.default.createElement("div",{className:"transition-group"},v.default.createElement("div",{className:"update"},v.default.createElement("div",{className:"content"},v.default.createElement("div",{className:"content-top public"},v.default.createElement("img",{src:"../../../../assets/img/activity/update/m_01.png",alt:""}),v.default.createElement("ul",null,v.default.createElement("li",null,"额度范围：",v.default.createElement("span",{className:"span1"},"1000-2000元")),v.default.createElement("li",null,"借款周期：14天"),v.default.createElement("li",null,"综合费率：",v.default.createElement("span",{className:"span2"},"0.71%"),"/天"),v.default.createElement("li",null,"还款放式：一次性偿还本金"))),v.default.createElement("div",{className:"content-middle public"},v.default.createElement("img",{src:"../../../../assets/img/activity/update/m_02.png",alt:""}),v.default.createElement("ul",null,v.default.createElement("li",null,"额度范围：",v.default.createElement("span",{className:"span1"},"2000-3000元")),v.default.createElement("li",null,"借款周期：30天"),v.default.createElement("li",null,"综合费率：",v.default.createElement("span",{className:"span2"},"0.40%"),"/天"),v.default.createElement("li",null,"还款放式：一次性偿还本金"))),v.default.createElement("div",{className:"content-bottom public"},v.default.createElement("img",{src:"../../../../assets/img/activity/update/m_03.png",alt:""}),v.default.createElement("ul",null,v.default.createElement("li",null,"额度范围：",v.default.createElement("span",{className:"span1"},"3000-5000元")),v.default.createElement("li",null,"借款周期：90天"),v.default.createElement("li",null,"综合费率：",v.default.createElement("span",{className:"span2"},"0.16%"),"/天"),v.default.createElement("li",null,"还款放式：每月等额本息偿还")))),v.default.createElement("button",{className:"bt1",onClick:function(){return e.forward(1)}},v.default.createElement("span",null,"你对产品有什么要说的?")),v.default.createElement("button",{className:"bt2",onClick:function(){return e.forward(0)}},v.default.createElement("span",null,"测信用 领分期卡"))))}}]),t}(v.default.Component);t.default=E,e.exports=t.default},1249:function(e,t,n){var r=n(1250);"string"==typeof r&&(r=[[e.i,r,""]]);var a={};a.transform=void 0;n(133)(r,a);r.locals&&(e.exports=r.locals)},1250:function(e,t,n){t=e.exports=n(132)(void 0),t.push([e.i,'@charset "UTF-8";\n.update {\n  background: url('+n(1251)+') 0 0 no-repeat;\n  width: 10rem;\n  height: 23.06667rem;\n  background-size: 10rem  23.06667rem;\n  position: relative; }\n  .update .content {\n    margin-top: 10.50667rem;\n    padding: 0 0.37333rem; }\n    .update .content .public {\n      position: relative;\n      border: 0.05333rem solid #ffe348;\n      border-radius: 0.33333rem;\n      background-color: #ffffff; }\n      .update .content .public img {\n        width: 3.22667rem;\n        height: 3.05333rem;\n        border-radius: 0.29333rem 0 0 0.29333rem;\n        display: block; }\n      .update .content .public ul {\n        position: absolute;\n        right: 0.72rem;\n        top: 0.41333rem; }\n        .update .content .public ul li {\n          line-height: 0.58667rem;\n          border-bottom: 0.01333rem solid #cecece;\n          color: #606060; }\n          .update .content .public ul li .span1 {\n            color: #ff7506;\n            font-size: 0.46667rem; }\n          .update .content .public ul li .span2 {\n            color: #8e00e9;\n            font-size: 0.4rem; }\n    .update .content .content-middle {\n      margin: 0.24rem 0; }\n  .update .bt1 {\n    position: fixed;\n    bottom: 0.56rem;\n    left: 0.37333rem;\n    background-color: #2ea7f1;\n    width: 4.4rem;\n    height: 1.25333rem;\n    border-radius: 0.26667rem;\n    border: none;\n    color: #fff;\n    font-size: 0.37333rem;\n    -webkit-box-shadow: 0 0.12rem 0.2rem #0a5f93;\n    /*底边阴影*/\n    /*底边阴影*/\n    box-shadow: 0 0.12rem 0.2rem #0a5f93;\n    /*底边阴影*/ }\n  .update .bt2 {\n    position: fixed;\n    bottom: 0.56rem;\n    right: 0.37333rem;\n    background-color: #ff9e06;\n    width: 4.4rem;\n    height: 1.25333rem;\n    border-radius: 0.26667rem;\n    border: none;\n    color: #FFF;\n    font-size: 0.37333rem;\n    -webkit-box-shadow: 0 0.12rem 0.2rem #855100;\n    /*底边阴影*/\n    /*底边阴影*/\n    box-shadow: 0 0.12rem 0.2rem #855100;\n    /*底边阴影*/ }\n\n.popup .content {\n  width: 6.74667rem;\n  height: 4.10667rem;\n  background-color: #fff;\n  border-radius: 0.33333rem;\n  padding: 0;\n  left: 50%;\n  top: 8.02667rem; }\n\n.popup p {\n  font-size: 0.37333rem;\n  color: #000000;\n  text-align: center;\n  margin-top: 1.17333rem;\n  font-family: "\\5FAE\\8F6F\\96C5\\9ED1"; }\n\n.popup a {\n  position: absolute;\n  background: #8e00e9;\n  font-size: 0.48rem;\n  color: #fff;\n  width: 5.17333rem;\n  line-height: 1.2rem;\n  border-radius: 0.33333rem;\n  cursor: pointer;\n  left: 50%;\n  -webkit-transform: translateX(-50%);\n      -ms-transform: translateX(-50%);\n          transform: translateX(-50%); }\n\n.popup .close {\n  height: 0.66667rem;\n  width: 0.66667rem;\n  border: 0.06667rem solid #fff;\n  border-radius: 50%;\n  background-color: #8e00e9;\n  top: -7%;\n  right: -5%; }\n  .popup .close:before, .popup .close:after {\n    height: 0.02667rem;\n    width: 0.46667rem;\n    height: 3PX;\n    background: #fff;\n    left: 0.09333rem; }\n\n.popup a:hover {\n  text-decoration: none; }\n',""])},1251:function(e,t,n){e.exports=n.p+"assets/img/activity/update/bg.jpg?3772a289b01630615357cb4d337db752"},1252:function(e,t,n){e.exports=n.p+"assets/img/activity/update/m_01.png?e755ef3240d7fe3b28a089e32c4aaa7e"},1253:function(e,t,n){e.exports=n.p+"assets/img/activity/update/m_02.png?d9d22427693ad194649f29c0d510eaba"},1254:function(e,t,n){e.exports=n.p+"assets/img/activity/update/m_03.png?a788276a8134587bcf215a4c12620c6d"},132:function(e,t){function n(e,t){var n=e[1]||"",a=e[3];if(!a)return n;if(t&&"function"==typeof btoa){var o=r(a);return[n].concat(a.sources.map(function(e){return"/*# sourceURL="+a.sourceRoot+e+" */"})).concat([o]).join("\n")}return[n].join("\n")}function r(e){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(e))))+" */"}e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var r=n(t,e);return t[2]?"@media "+t[2]+"{"+r+"}":r}).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var r={},a=0;a<this.length;a++){var o=this[a][0];"number"==typeof o&&(r[o]=!0)}for(a=0;a<e.length;a++){var i=e[a];"number"==typeof i[0]&&r[i[0]]||(n&&!i[2]?i[2]=n:n&&(i[2]="("+i[2]+") and ("+n+")"),t.push(i))}},t}},133:function(e,t,n){function r(e,t){for(var n=0;n<e.length;n++){var r=e[n],a=m[r.id];if(a){a.refs++;for(var o=0;o<a.parts.length;o++)a.parts[o](r.parts[o]);for(;o<r.parts.length;o++)a.parts.push(s(r.parts[o],t))}else{for(var i=[],o=0;o<r.parts.length;o++)i.push(s(r.parts[o],t));m[r.id]={id:r.id,refs:1,parts:i}}}}function a(e,t){for(var n=[],r={},a=0;a<e.length;a++){var o=e[a],i=t.base?o[0]+t.base:o[0],l=o[1],c=o[2],u=o[3],s={css:l,media:c,sourceMap:u};r[i]?r[i].parts.push(s):n.push(r[i]={id:i,parts:[s]})}return n}function o(e,t){var n=h(e.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=y[y.length-1];if("top"===e.insertAt)r?r.nextSibling?n.insertBefore(t,r.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),y.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(t)}}function i(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=y.indexOf(e);t>=0&&y.splice(t,1)}function l(e){var t=document.createElement("style");return e.attrs.type="text/css",u(t,e.attrs),o(e,t),t}function c(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",u(t,e.attrs),o(e,t),t}function u(e,t){Object.keys(t).forEach(function(n){e.setAttribute(n,t[n])})}function s(e,t){var n,r,a,o;if(t.transform&&e.css){if(!(o=t.transform(e.css)))return function(){};e.css=o}if(t.singleton){var u=g++;n=b||(b=l(t)),r=d.bind(null,n,u,!1),a=d.bind(null,n,u,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=c(t),r=p.bind(null,n,t),a=function(){i(n),n.href&&URL.revokeObjectURL(n.href)}):(n=l(t),r=f.bind(null,n),a=function(){i(n)});return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else a()}}function d(e,t,n,r){var a=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=E(t,a);else{var o=document.createTextNode(a),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(o,i[t]):e.appendChild(o)}}function f(e,t){var n=t.css,r=t.media;if(r&&e.setAttribute("media",r),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function p(e,t,n){var r=n.css,a=n.sourceMap,o=void 0===t.convertToAbsoluteUrls&&a;(t.convertToAbsoluteUrls||o)&&(r=k(r)),a&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(a))))+" */");var i=new Blob([r],{type:"text/css"}),l=e.href;e.href=URL.createObjectURL(i),l&&URL.revokeObjectURL(l)}var m={},v=function(e){var t;return function(){return void 0===t&&(t=e.apply(this,arguments)),t}}(function(){return window&&document&&document.all&&!window.atob}),h=function(e){var t={};return function(n){return void 0===t[n]&&(t[n]=e.call(this,n)),t[n]}}(function(e){return document.querySelector(e)}),b=null,g=0,y=[],k=n(134);e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");t=t||{},t.attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=v()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var n=a(e,t);return r(n,t),function(e){for(var o=[],i=0;i<n.length;i++){var l=n[i],c=m[l.id];c.refs--,o.push(c)}if(e){r(a(e,t),t)}for(var i=0;i<o.length;i++){var c=o[i];if(0===c.refs){for(var u=0;u<c.parts.length;u++)c.parts[u]();delete m[c.id]}}}};var E=function(){var e=[];return function(t,n){return e[t]=n,e.filter(Boolean).join("\n")}}()},134:function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var n=t.protocol+"//"+t.host,r=n+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(e,t){var a=t.trim().replace(/^"(.*)"$/,function(e,t){return t}).replace(/^'(.*)'$/,function(e,t){return t});if(/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(a))return e;var o;return o=0===a.indexOf("//")?a:0===a.indexOf("/")?n+a:r+a.replace(/^\.\//,""),"url("+JSON.stringify(o)+")"})}},161:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var a=n(57),o=r(a),i=n(28),l=r(i),c=n(29),u=r(c);t.default=new(function(){function e(){(0,l.default)(this,e)}return(0,u.default)(e,[{key:"createDom",value:function(e,t,n,r){var a=this,i={overlay:!0,span:!0};(0,o.default)(i,r),this.callback=n;var l='<div class="popup-cover"></div>\n                  <div class="content">\n                    <span class="close" style="'+(i.span?"":"display: none;")+'"></span>\n                    '+e+"\n                  </div>",c=document.createElement("div");c.className="popup-container "+(t||""),c.innerHTML=l,document.body.appendChild(c),c.querySelector("div.content").className="content in",c.querySelector("div.popup-cover").addEventListener("click",function(e){e.stopPropagation(),i.overlay&&a.close(e)},!1),c.querySelector("span.close").addEventListener("click",function(e){e.preventDefault(),i.span&&a.close(e)},!1),this.dom=c}},{key:"addEventListener",value:function(e,t,n){for(var r=this.dom.querySelectorAll(e),a=0,o=r.length;a<o;a++)r[a].addEventListener(t,function(e){e.preventDefault(),n(e)},!1)}},{key:"click",value:function(e,t){var n=this;this.addEventListener(e,"click",function(e){n.close(e,t)})}},{key:"clickAndClose",value:function(e,t){var n=this;this.addEventListener(e,"click",function(e){t(n.close.bind(n,e),e)})}},{key:"closeClick",value:function(e,t){this.dom.querySelector(e).addEventListener("click",function(e){e.preventDefault(),t&&t(e)},!1)}},{key:"close",value:function(e,t){var n=this;e.preventDefault(),this.dom.querySelector("div.content").className="content out",setTimeout(function(){n.dom.parentNode.removeChild(n.dom),n.callback&&n.callback(),t&&t(e)},200)}},{key:"alert",value:function(e,t,n,r){this.createDom(e,t,n,r)}}]),e}()),e.exports=t.default}});