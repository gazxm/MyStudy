webpackJsonp([183],{132:function(e,t){function n(e,t){var n=e[1]||"",a=e[3];if(!a)return n;if(t&&"function"==typeof btoa){var l=r(a);return[n].concat(a.sources.map(function(e){return"/*# sourceURL="+a.sourceRoot+e+" */"})).concat([l]).join("\n")}return[n].join("\n")}function r(e){return"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(e))))+" */"}e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var r=n(t,e);return t[2]?"@media "+t[2]+"{"+r+"}":r}).join("")},t.i=function(e,n){"string"==typeof e&&(e=[[null,e,""]]);for(var r={},a=0;a<this.length;a++){var l=this[a][0];"number"==typeof l&&(r[l]=!0)}for(a=0;a<e.length;a++){var i=e[a];"number"==typeof i[0]&&r[i[0]]||(n&&!i[2]?i[2]=n:n&&(i[2]="("+i[2]+") and ("+n+")"),t.push(i))}},t}},133:function(e,t,n){function r(e,t){for(var n=0;n<e.length;n++){var r=e[n],a=p[r.id];if(a){a.refs++;for(var l=0;l<a.parts.length;l++)a.parts[l](r.parts[l]);for(;l<r.parts.length;l++)a.parts.push(c(r.parts[l],t))}else{for(var i=[],l=0;l<r.parts.length;l++)i.push(c(r.parts[l],t));p[r.id]={id:r.id,refs:1,parts:i}}}}function a(e,t){for(var n=[],r={},a=0;a<e.length;a++){var l=e[a],i=t.base?l[0]+t.base:l[0],o=l[1],u=l[2],s=l[3],c={css:o,media:u,sourceMap:s};r[i]?r[i].parts.push(c):n.push(r[i]={id:i,parts:[c]})}return n}function l(e,t){var n=g(e.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var r=x[x.length-1];if("top"===e.insertAt)r?r.nextSibling?n.insertBefore(t,r.nextSibling):n.appendChild(t):n.insertBefore(t,n.firstChild),x.push(t);else{if("bottom"!==e.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");n.appendChild(t)}}function i(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e);var t=x.indexOf(e);t>=0&&x.splice(t,1)}function o(e){var t=document.createElement("style");return e.attrs.type="text/css",s(t,e.attrs),l(e,t),t}function u(e){var t=document.createElement("link");return e.attrs.type="text/css",e.attrs.rel="stylesheet",s(t,e.attrs),l(e,t),t}function s(e,t){Object.keys(t).forEach(function(n){e.setAttribute(n,t[n])})}function c(e,t){var n,r,a,l;if(t.transform&&e.css){if(!(l=t.transform(e.css)))return function(){};e.css=l}if(t.singleton){var s=v++;n=b||(b=o(t)),r=f.bind(null,n,s,!1),a=f.bind(null,n,s,!0)}else e.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=u(t),r=m.bind(null,n,t),a=function(){i(n),n.href&&URL.revokeObjectURL(n.href)}):(n=o(t),r=d.bind(null,n),a=function(){i(n)});return r(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap)return;r(e=t)}else a()}}function f(e,t,n,r){var a=n?"":r.css;if(e.styleSheet)e.styleSheet.cssText=w(t,a);else{var l=document.createTextNode(a),i=e.childNodes;i[t]&&e.removeChild(i[t]),i.length?e.insertBefore(l,i[t]):e.appendChild(l)}}function d(e,t){var n=t.css,r=t.media;if(r&&e.setAttribute("media",r),e.styleSheet)e.styleSheet.cssText=n;else{for(;e.firstChild;)e.removeChild(e.firstChild);e.appendChild(document.createTextNode(n))}}function m(e,t,n){var r=n.css,a=n.sourceMap,l=void 0===t.convertToAbsoluteUrls&&a;(t.convertToAbsoluteUrls||l)&&(r=y(r)),a&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(a))))+" */");var i=new Blob([r],{type:"text/css"}),o=e.href;e.href=URL.createObjectURL(i),o&&URL.revokeObjectURL(o)}var p={},h=function(e){var t;return function(){return void 0===t&&(t=e.apply(this,arguments)),t}}(function(){return window&&document&&document.all&&!window.atob}),g=function(e){var t={};return function(n){return void 0===t[n]&&(t[n]=e.call(this,n)),t[n]}}(function(e){return document.querySelector(e)}),b=null,v=0,x=[],y=n(134);e.exports=function(e,t){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");t=t||{},t.attrs="object"==typeof t.attrs?t.attrs:{},t.singleton||(t.singleton=h()),t.insertInto||(t.insertInto="head"),t.insertAt||(t.insertAt="bottom");var n=a(e,t);return r(n,t),function(e){for(var l=[],i=0;i<n.length;i++){var o=n[i],u=p[o.id];u.refs--,l.push(u)}if(e){r(a(e,t),t)}for(var i=0;i<l.length;i++){var u=l[i];if(0===u.refs){for(var s=0;s<u.parts.length;s++)u.parts[s]();delete p[u.id]}}}};var w=function(){var e=[];return function(t,n){return e[t]=n,e.filter(Boolean).join("\n")}}()},134:function(e,t){e.exports=function(e){var t="undefined"!=typeof window&&window.location;if(!t)throw new Error("fixUrls requires window.location");if(!e||"string"!=typeof e)return e;var n=t.protocol+"//"+t.host,r=n+t.pathname.replace(/\/[^\/]*$/,"/");return e.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,function(e,t){var a=t.trim().replace(/^"(.*)"$/,function(e,t){return t}).replace(/^'(.*)'$/,function(e,t){return t});if(/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(a))return e;var l;return l=0===a.indexOf("//")?a:0===a.indexOf("/")?n+a:r+a.replace(/^\.\//,""),"url("+JSON.stringify(l)+")"})}},1516:function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=n(258),l=r(a),i=n(136),o=r(i),u=n(28),s=r(u),c=n(29),f=r(c),d=n(124),m=r(d),p=n(125),h=r(p),g=n(27),b=r(g),v=n(54);n(310);var x=function(e){function t(e){(0,s.default)(this,t);var n=(0,m.default)(this,(t.__proto__||(0,o.default)(t)).call(this,e));return n.state={data:{username:"",idnumber:""}},n}return(0,h.default)(t,e),(0,f.default)(t,[{key:"componentDidMount",value:function(){var e=this;document.title="高级认证信息授权使用协议";var t=this.props.location.query;(0,v.post)("http://credit.xianjincard.com/user-contract/get-userbyid",{user_id:t.user_id}).then(function(e){return e.data}).then(function(t){if(0!==t.code)return void l.default.alert("",t.message,[{text:"确定"}]);e.setState({data:t.data})})}},{key:"render",value:function(){var e=this.state.data;return b.default.createElement("div",{className:"agreement"},b.default.createElement("h1",null,"高级认证信息授权使用协议"),b.default.createElement("p",null,"郑重提示：本协议系您（以下或称“用户”）与现金（白）卡（包括域名为xianjincard.com的网站、手机客户端及其运营方上海浅橙网络科技有限公司，以下简称“平台”或“我们”）之间的法律协议，请您认真阅读并理解本协议。您通过平台点击“确定”按钮的，即表示您同意遵循本协议的所有约定，本协议在您和平台之间具有法律约束力。如发生法律纠纷，您不得以未仔细阅读或理解本协议为由进行抗辩。"),b.default.createElement("h3",null,"一、授权事项"),b.default.createElement("p",null,"您同意并于此授权平台及与平台合作的第三方查看、储存、分析和使用您的关联信用卡相关信息（包括但不限于持卡人姓名、发卡行、储蓄卡/信用卡卡号后四位、是否开通快捷支付）、社保信息（包括但不限于账号信息）、公积金缴存情况等、工资卡账户流水、电子邮件等信息。"),b.default.createElement("p",null,"您需自行登录支付宝、京东、淘宝、饿了么、百度外卖、美团外卖等第三方平台，您同意并于此授权平台及与平台合作的第三方查看、储存、分析和使用您在平台留存的账号信息、实名认证状态、交易记录相关信息（包括但不限于交易时间、交易内容、收货人姓名、收货人固话/手机、收货人地址、付款银行）、交易对方户名（对方淘宝号、或姓名、或其它）等。"),b.default.createElement("p",null,"被授权的与平台合作的第三方包括上海诚数信息科技有限公司、深圳市随手科技有限公司、杭州魔蝎数据科技有限公司、江苏易启策网络科技有限公司。"),b.default.createElement("p",null,"若是有新的合作方需要按照本协议项下约定的授权事项查看、储存您的相关信息的，我们会及时通过手机平台、网站向您公布，取得您的授权。"),b.default.createElement("p",null,"上述信息范围以您选择的本协议项下具体的认证内容为准。"),b.default.createElement("h3",null,"二、信息保密"),b.default.createElement("p",null,"我们非常重视您的个人信息安全。平台将采取不低于一般行业惯例对于通过您的授权所获取的信息进行保护，并以一切商业上的合理努力确保这些信息的安全。我们组织内部也将根据国家相关法律、法规、规章等制度制定严格的隐私和安全准则，并要求全体员工知晓和遵守，在我们组织内部严格实施。通常，平台的员工或与平台合作的第三方并不会查看在平台系统中存储的用户信息，当我们得知您可能违反了平台的产品及服务条款时，为了及时提醒您以免您留下不良信用记录，我们会及时与您电话联系。如无法与您取得联系，我们会通过联系您通讯录中的部分人，从而能够及时告知您，向您提示相关风险。"),b.default.createElement("p",null,"基于防火墙或其他安全软件可能发生故障，或按照当前商业上可以采取的安全手段也难以避免或及时消除的故障及破坏，将可能导致您的信息遭到外部访问、窃取或删除，此等情形下平台不承担相应的责任。"),b.default.createElement("p",null,"因不可抗力所导致的用户信息泄露（包含但不限于黑客攻击、第三方导致的系统缺陷等），平台不承担相应的责任。"),b.default.createElement("h3",null,"三、例外情形"),b.default.createElement("p",null,"出现下列情形之一的，平台可向外部第三方公开平台所获取的用户个人资料和信息"),b.default.createElement("p",null,"1.基于用户的同意或授权。"),b.default.createElement("p",null,"2.出于用户对产品及服务的需求。"),b.default.createElement("p",null,"3.出于履行平台的法定义务，为了预防、调查非法活动，保护社会或他人人身、财产安全，所必须向有关司法、行政机关履行之报告义务。"),b.default.createElement("p",null,"4.基于用户违反平台相关产品及服务的规则，平台基于法定或与第三方之间的约定就用户的违约行为履行相应的报告义务。"),b.default.createElement("p",null,"5.平台因用户违反平台相关产品及服务的规则，基于维护自身合法权益的需要，向第三方披露用户的相关信息，从而保障平台合法权益之目的。"),b.default.createElement("p",null,"6.根据法律规定及合理的商业习惯，平台在计划与其他公司进行合并或进行其他资本市场活动时（包括但不限于股权融资、债券发行等），以及其他情形下我们需要接受其他主体的尽职调查时，我们可能会将通过用户授权所获取的信息提供给相应的主体。平台会通过与相关主体签订保密协议的形式以及其他商业上合理的手段要求相关主体对于用户信息加以保密。"),b.default.createElement("h3",null,"四、关于电子合同"),b.default.createElement("p",null,"本协议采用电子文本形式制成，并在平台系统上保留存档。用户通过平台系统点击“确认”或以其他方式选择接受本协议，即表示已同意接受本协议的全部内容以及与本协议有关的各项平台规则。"),b.default.createElement("p",null,"用户应当妥善保管自己的账号、密码等账户信息，不得以账户信息被盗用或其他理由否认本协议的效力或不履行相关义务。"),b.default.createElement("h3",null,"五、其他"),b.default.createElement("p",null,"本协议未尽事项按照平台现有及不时发布的各项规则执行。"),b.default.createElement("p",null,"如本协议中的任何一条或多条被确认为无效，该无效条款并不影响本协议其他条款的效力。"),b.default.createElement("p",null,"因履行本协议所产生的争议应当通过友好协商解决；如协商不成，则本协议任意一方均可向本协议签订地上海市杨浦区有管辖权的人民法院起诉。"),b.default.createElement("p",{className:"right"},"授权人：",e.username),b.default.createElement("p",{className:"right"},"授权人身份证号码：",e.idnumber))}}]),t}(b.default.Component);t.default=x,e.exports=t.default},310:function(e,t,n){var r=n(311);"string"==typeof r&&(r=[[e.i,r,""]]);var a={};a.transform=void 0;n(133)(r,a);r.locals&&(e.exports=r.locals)},311:function(e,t,n){t=e.exports=n(132)(void 0),t.push([e.i,".agreement {\n  padding: 0.4rem 0.37333rem;\n  background: #fff; }\n  .agreement h1 {\n    font-size: 0.48rem;\n    font-weight: bold;\n    color: #333;\n    text-align: center;\n    line-height: 2em; }\n  .agreement h2 {\n    font-size: 0.32rem;\n    text-align: right;\n    line-height: 1.8em;\n    font-weight: bold; }\n  .agreement h3 {\n    font-size: 0.34667rem;\n    font-weight: bold;\n    line-height: 1.8em; }\n  .agreement h4 {\n    font-size: 0.32rem;\n    text-indent: 2em;\n    line-height: 1.8em; }\n  .agreement h5 {\n    font-size: 0.32rem;\n    margin-top: 0.66667rem;\n    line-height: 2em; }\n  .agreement h6 {\n    font-size: 0.32rem;\n    font-weight: bold;\n    line-height: 2em;\n    text-align: center; }\n  .agreement p {\n    font-size: 0.32rem;\n    text-indent: 2em;\n    line-height: 1.8em;\n    margin: 0.16rem 0;\n    text-align: justify; }\n  .agreement h3.indent {\n    text-indent: 2em; }\n  .agreement h3.center {\n    text-align: center; }\n  .agreement p.bold {\n    font-weight: bold; }\n  .agreement p.small {\n    font-size: 0.26667rem; }\n  .agreement p.line {\n    border-top: 1PX solid #333; }\n  .agreement .underline {\n    text-decoration: underline; }\n  .agreement .margin {\n    margin: 0.4rem 0 0.16rem; }\n  .agreement .margin-top {\n    margin-top: 0.66667rem; }\n  .agreement .small-top {\n    margin-top: 0.2rem; }\n  .agreement .right {\n    text-align: right; }\n  .agreement .no-indent {\n    text-indent: 0; }\n  .agreement .more-indent {\n    text-indent: 4em; }\n  .agreement span.indent {\n    display: block;\n    text-indent: 7em; }\n  .agreement table {\n    width: 100%;\n    margin-top: 0.26667rem; }\n    .agreement table td, .agreement table th {\n      border: 1PX solid #333;\n      height: 0.56rem; }\n    .agreement table th {\n      text-align: center; }\n  .agreement table.no-margin {\n    margin-top: 0; }\n  .agreement .enclosure h4 {\n    font-size: 0.53333rem;\n    color: #333;\n    text-align: center;\n    line-height: 2em; }\n  .agreement .enclosure .left {\n    text-align: left; }\n  .agreement .enclosure p {\n    font-size: 0.37333rem;\n    line-height: 1.8em;\n    text-indent: 0; }\n  .agreement .enclosure .small {\n    font-size: 0.32rem; }\n\n.loan table tr td, .loan table tr th {\n  text-align: center; }\n\n.platform-service table tr td, .platform-service table tr th {\n  text-align: center; }\n\n.auth table tr > td:first-child {\n  width: 40%; }\n\n.auth table tr td, .auth table tr th {\n  padding-left: 0.06667rem; }\n\n.crs .table-one {\n  margin: 0.4rem 0; }\n  .crs .table-one tr > td {\n    text-align: center; }\n    .crs .table-one tr > td:first-child {\n      min-width: 0.73333rem; }\n\n.crs .table-two {\n  margin: 0.4rem 0; }\n  .crs .table-two tr > td {\n    text-align: center; }\n    .crs .table-two tr > td:first-child {\n      max-width: 1.33333rem; }\n  .crs .table-two table {\n    margin: 0;\n    border: none; }\n  .crs .table-two span.left {\n    margin-left: 0.32rem; }\n  .crs .table-two span.more-left {\n    margin-left: 2.4rem; }\n  .crs .table-two .td-two {\n    width: 1.06667rem; }\n\n.crs h2 {\n  text-align: center; }\n\n.am-modal-body > div {\n  font-size: 0.37333rem; }\n\n.hr-loan h1.small {\n  font-size: 0.4rem;\n  margin-top: 1.33333rem; }\n\n.ynxt table td {\n  padding-left: 0.13333rem; }\n\n.ynxt table.center td {\n  text-align: center;\n  padding-left: 0; }\n",""])}});