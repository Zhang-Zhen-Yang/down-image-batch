!function(e){function t(a){if(n[a])return n[a].exports;var o=n[a]={i:a,l:!1,exports:{}};return e[a].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,a){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:a})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/main/js/",t(t.s=13)}({13:function(module,exports){function injectCustomJs(e,t){e=e||"js/inject.js";var n=document.createElement("script");n.setAttribute("type","text/javascript"),n.src=t?e:chrome.extension.getURL(e),document.body.appendChild(n),n.onload=function(){this.parentNode.removeChild(this)}}function sendMessageToBackground(e){chrome.runtime.sendMessage({cmd:"default",greeting:e||"你好，我是content-script呀，我主动发消息给后台！"},function(e){tip("收到来自后台的回复："+e)})}function initCustomEventListen(){var e=document.getElementById("myCustomEventDiv");e||(e=document.createElement("div"),e.style.display="none",e.id="myCustomEventDiv",document.body.appendChild(e)),e.addEventListener("myCustomEvent",function(){tip("收到自定义事件："+document.getElementById("myCustomEventDiv").innerText)})}function tip(e){e=e||"";var t=document.createElement("div");t.className="chrome-plugin-simple-tip slideInLeft",t.style.top=70*tipCount+20+"px",t.innerHTML="<div>"+e+"</div>",document.body.appendChild(t),t.classList.add("animated"),tipCount++,setTimeout(function(){t.style.top="-100px",setTimeout(function(){t.remove(),tipCount--},400)},3e3)}console.log("这是content script!"),document.addEventListener("DOMContentLoaded",function(){injectCustomJs()}),chrome.runtime.onMessage.addListener(function(e,t,n){if(console.log("收到来自 "+(t.tab?"content-script("+t.tab.url+")":"popup或者background")+" 的消息：",e),"update_font_size"==e.cmd){var a=document.createElement("style");a.innerHTML="* {font-size: "+e.size+"px !important;}",document.head.appendChild(a)}else if("getContent"==e.cmd){var o=document.cookie,i=$(e.node||"body").html(),c=JSON.stringify({cookie:o,content:i,date:Date.now(),href:location.href});n(c)}else if("fetchHtmlAndDesc"==e.cmd){var i=document.getElementsByTagName("html")[0].innerHTML;n(i);var s=URL.createObjectURL(new Blob(["window.wonbaoInjectedObj&&window.wonbaoInjectedObj.receiveTaskFetchHtmlAndDesc&&window.wonbaoInjectedObj.receiveTaskFetchHtmlAndDesc()"]),{type:"application/javascript"});injectCustomJs(s,!0)}else if("notifyIframeUsefull"==e.cmd){var d={href:e.href},r=URL.createObjectURL(new Blob(["window.wonbaoInjectedObj&&window.wonbaoInjectedObj.receiveNotifyIframeUsefull && window.wonbaoInjectedObj.receiveNotifyIframeUsefull("+JSON.stringify(d)+")"]),{type:"application/javascript"});injectCustomJs(r,!0)}else if("reveiverIframeHtml"==e.cmd){var d={href:e.href,content:(e.content||"").replace(/'/gim,"a1562723483981KJZvFoxt").replace(/"/gim,"b1562723483981KJZvFoxt"),html:(e.html||"").replace(/'/gim,"a1562723483981KJZvFoxt").replace(/"/gim,"b1562723483981KJZvFoxt")},r=URL.createObjectURL(new Blob(["window.wonbaoInjectedObj&&window.wonbaoInjectedObj.receiveTaskResult&&window.wonbaoInjectedObj.receiveTaskResult("+JSON.stringify(d)+")"]),{type:"application/javascript"});injectCustomJs(r,!0)}else if("receiveNewQueue"==e.cmd){var m=e.url,u=e.html,l=e.desc,f=e.msg,d={url:m,html:(u||"").replace(/'/gim,"a1562723483981KJZvFoxt").replace(/"/gim,"b1562723483981KJZvFoxt"),desc:(l||"").replace(/'/gim,"a1562723483981KJZvFoxt").replace(/"/gim,"b1562723483981KJZvFoxt"),msg:f},r=URL.createObjectURL(new Blob(["window.wonbaoInjectedObj&&window.wonbaoInjectedObj.receiveInjectNewQueue&&window.wonbaoInjectedObj.receiveInjectNewQueue("+JSON.stringify(d)+")"]),{type:"application/javascript"});injectCustomJs(r,!0)}else if("reveiveFetchData"==e.cmd){var d={url:e.url,res:(e.res||"").replace(/'/gim,"a1562723483981KJZvFoxt").replace(/"/gim,"b1562723483981KJZvFoxt"),uuid:e.uuid},r=URL.createObjectURL(new Blob(["window.wonbaoInjectedObj&&window.wonbaoInjectedObj.receiveFetchDataTaskResult&&window.wonbaoInjectedObj.receiveFetchDataTaskResult("+JSON.stringify(d)+")"]),{type:"application/javascript"});injectCustomJs(r,!0)}else if("receiveHttpRequest"==e.cmd){var d={url:e.url,uuid:e.uuid,res:e.res};console.log("result",d);var r=URL.createObjectURL(new Blob(["window.wonbaoInjectedObj&&window.wonbaoInjectedObj.receiveHttpRequestTaskResult&&window.wonbaoInjectedObj.receiveHttpRequestTaskResult("+JSON.stringify(d)+")"]),{type:"application/javascript"});injectCustomJs(r,!0)}}),chrome.runtime.onConnect.addListener(function(e){console.log(e),"test-connect"==e.name&&e.onMessage.addListener(function(t){tip("收到长连接消息："+JSON.stringify(t)),"你是谁啊？"==t.question&&e.postMessage({answer:"我是你爸！"})})}),window.addEventListener("message",function(e){if(console.log("收到消息：",e.data),e.data&&"invoke"==e.data.cmd)eval("("+e.data.code+")");else if(e.data&&"message"==e.data.cmd)tip(e.data.data);else if("notifyIframeHtmlUsefull"==e.data.cmd)chrome.runtime.sendMessage({cmd:"notifyIframeHtmlUsefull",href:e.data.href},function(e){});else if("notifyIframeCopyResult"==e.data.cmd)chrome.runtime.sendMessage({cmd:"notifyIframeCopyResult",content:e.data.content,href:e.data.href,html:e.data.html},function(e){});else if("openTab"==e.data.cmd)chrome.runtime.sendMessage({cmd:"openTab",params:e.data.params},function(e){});else if("notify"==e.data.cmd)chrome.runtime.sendMessage({cmd:"notify",params:e.data.params},function(e){});else if("fetchData"==e.data.cmd)chrome.runtime.sendMessage({cmd:"fetchData",url:e.data.url,timeout:e.data.timeout,uuid:e.data.uuid,blob:e.data.blob},function(e){});else if("notifyReceiveTaskFetchHtmlAndDesc"==e.data.cmd){var html=e.data.html,desc=e.data.desc,msg=e.data.msg;chrome.runtime.sendMessage({cmd:"notifyReceiveTaskFetchHtmlAndDesc",html:html,desc:desc,url:location.href,msg:msg},function(e){})}else"httpRequest"==e.data.cmd?(console.log([e.data.url,e.data.uuid,e.data.responseType]),chrome.runtime.sendMessage({cmd:"httpRequest",url:e.data.url,uuid:e.data.uuid,responseType:e.data.responseType},function(e){})):"sendDownload"==e.data.cmd&&(console.log([e.data.url,e.data.fileName]),chrome.runtime.sendMessage({cmd:"sendDownload",url:e.data.url,fileName:e.data.fileName},function(e){}))},!1);var tipCount=0}});
//# sourceMappingURL=content-script.js.map