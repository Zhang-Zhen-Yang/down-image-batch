!function(e){function t(o){if(n[o])return n[o].exports;var r=n[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,t),r.l=!0,r.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,o){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:o})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/main/js/",t(t.s=9)}({9:function(e,t){function n(e,t){chrome.tabs.query({},function(n){n.forEach(function(o,r){(o.url.indexOf("danbooru")>-1||o.url.indexOf("yande.re")>-1||o.url.indexOf("localhost")>-1||o.url.indexOf("wonbao")>-1||o.url.indexOf("file:")>-1||o.url.indexOf("192.168")>-1)&&chrome.tabs.sendMessage(n[r].id,{index:r,cmd:t,url:e.url,res:e.res,uuid:e.uuid},function(e){})})})}var o={ver:"1.0.0",removeMenuItem:function(){chrome.contextMenus.remove("wb-context",function(){})},createMenuItem:function(){var e="wb-context-add-to-copy-list",t=["https://detail.tmall.com/*","https://item.taobao.com/*","https://detail.1688.com/*","https://h5.m.taobao.com/*","https://detail.m.tmall.com/*","https://m.1688.com/*"];null!=navigator.userAgent.toLocaleLowerCase().match(/metasr/)?(chrome.contextMenus.create({title:"添加到宝贝复制队列",id:e,icon:{path:"img/icon.png"},documentUrlPatterns:t,onclick:function(){chrome.tabs.query({active:!0,currentWindow:!0},function(e){chrome.tabs.sendMessage(e[0].id,{cmd:"fetchHtmlAndDesc"},function(e){e()})})}}),chrome.contextMenus.onClicked.addListener(function(t,n){t.menuItemId==e&&chrome.tabs.query({active:!0,currentWindow:!0},function(e){chrome.tabs.sendMessage(e[0].id,{cmd:"fetchHtmlAndDesc"},function(e){e()})})})):chrome.contextMenus.create({title:"添加到宝贝复制队列",id:e,documentUrlPatterns:t,onclick:function(){chrome.tabs.query({active:!0,currentWindow:!0},function(e){chrome.tabs.sendMessage(e[0].id,{cmd:"fetchHtmlAndDesc"},function(e){e()})})}})},notify:function(e){chrome.notifications.create(null,{type:e.type||"basic",iconUrl:e.iconUrl||"img/icon.png",title:e.title||"这是标题",message:e.message||""})},setBadgeText:function(e){chrome.browserAction.setBadgeText({text:e})},setStorage:function(e){chrome.storage.sync.set(e)}};!function(){o.createMenuItem(),o.setStorage({ver:o.ver})}();chrome.runtime.onMessage.addListener(function(e,t,o){if("default"==e.cmd)o("我是后台，我已收到你的消息："+JSON.stringify(e));else if("notifyIframeHtmlUsefull"==e.cmd)chrome.tabs.query({},function(t){t.forEach(function(n,o){(n.url.indexOf("localhost")>-1||n.url.indexOf("wonbao")>-1||n.url.indexOf("file:")>-1||n.url.indexOf("192.168")>-1||n.url.indexOf("yangkeduo.com/goods")>-1)&&chrome.tabs.sendMessage(t[o].id,{index:o,cmd:"notifyIframeUsefull",href:e.href},function(e){})})}),o();else if("notifyIframeCopyResult"==e.cmd)chrome.tabs.query({},function(t){t.forEach(function(n,o){(n.url.indexOf("localhost")>-1||n.url.indexOf("wonbao")>-1||n.url.indexOf("file:")>-1||n.url.indexOf("192.168")>-1||n.url.indexOf("yangkeduo.com/goods")>-1)&&chrome.tabs.sendMessage(t[o].id,{index:o,cmd:"reveiverIframeHtml",content:e.content,href:e.href,html:e.html},function(e){})})}),o();else if("openTab"==e.cmd){var r=e.params;chrome.tabs.create({url:r.url})}else if("notify"==e.cmd){var r=e.params;chrome.notifications.create(null,{type:r.type||"basic",iconUrl:r.iconUrl||"img/icon.png",title:r.title||"这是标题",message:r.message||""}),o()}else if("fetchData"==e.cmd)$.ajax({type:"GET",url:e.url,timeout:e.timeout,async:!1,data:{},dataType:"json",success:function(t){n({url:e.url,res:t.responseText,uuid:e.uuid},"reveiveFetchData")},error:function(t){n({url:e.url,res:t.responseText,uuid:e.uuid},"reveiveFetchData")}}),o();else if("notifyReceiveTaskFetchHtmlAndDesc"==e.cmd)chrome.tabs.query({},function(t){t.forEach(function(n,o){(n.url.indexOf("localhost")>-1||n.url.indexOf("wonbao")>-1||n.url.indexOf("file:")>-1||n.url.indexOf("192.168")>-1)&&chrome.tabs.sendMessage(t[o].id,{cmd:"receiveNewQueue",url:e.url,html:e.html,desc:e.desc,msg:e.msg},function(e){})})}),o();else if("httpRequest"==e.cmd){var c=new XMLHttpRequest;c.open("GET",e.url,!0),c.responseType=e.responseType||"blob",c.onreadystatechange=function(){if(4==c.readyState)if(200==c.status||304==c.status){var t=c.response;if(t){var o=new FileReader;o.onload=function(){n({url:e.url,res:o.result,uuid:e.uuid,success:!0},"receiveHttpRequest")},o.readAsDataURL(t)}}else{var r={url:e.url,res:"",uuid:e.uuid,success:!1};n(r,"receiveHttpRequest")}},c.send(null),o()}else if("sendDownload"==e.cmd){var i=[];chrome.downloads.download({url:e.url,filename:e.fileName,conflictAction:"overwrite",saveAs:!1},function(t){i[t]={url:e.url,id:e.id,uuid:!1}})}}),$("#test_cors").click(function(e){$.ajax({type:"GET",url:"https://ai.taobao.com/search/index.htm?source_id=search&key=%E5%90%95",timeout:1e7,async:!1,data:{},dataType:"json",success:function(e){console.log("success"),console.log(e)},error:function(e){console.log("error"),console.log(e)}})}),$("#get_popup_title").click(function(e){var t=chrome.extension.getViews({type:"popup"});t.length>0?alert(t[0].document.title):alert("popup未打开！")})}});
//# sourceMappingURL=background.js.map