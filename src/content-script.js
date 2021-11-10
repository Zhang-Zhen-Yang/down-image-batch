console.log('这是content script!');
// 注意，必须设置了run_at=document_start 此段代码才会生效
document.addEventListener('DOMContentLoaded', function()
{	
	console.log('ddddddddddddddddddd');
	// var hostNames = ['item.taobao.com', 'detail.tmall.com', 'detail.1688.com']
	// 注入自定义JS
	if(!window.jQuery) {
		injectCustomJs('js/jq.js');
	}
	injectCustomJs();

});
/* setTimeout(function(){
	alert('ddd');
	if(!window.jQuery) {
		injectCustomJs('js/jq.js');
		injectCustomJs();
	}
}, 5000) */

/* function initCustomPanel()
{
	var panel = document.createElement('div');
	panel.className = 'chrome-plugin-demo-panel';
	panel.innerHTML = '\
		<h2>injected-script操作content-script演示区：</h2>\
		<div class="btn-area">\
			<a href="javascript:sendMessageToContentScriptByPostMessage(\'你好，我是普通页面！\')">通过postMessage发送消息给content-script</a><br>\
			<a href="javascript:sendMessageToContentScriptByEvent(\'你好啊！我是通过DOM事件发送的消息！\')">通过DOM事件发送消息给content-script</a><br>\
			<a href="javascript:invokeContentScript(\'sendMessageToBackground()\')">发送消息到后台或者popup</a><br>\
		</div>\
		<div id="my_custom_log">\
		</div>\
	';
	document.body.appendChild(panel);
}*/

// 向页面注入JS
function injectCustomJs(jsPath, additional)
{
	jsPath = jsPath || 'js/inject.js';
	var temp = document.createElement('script');
	temp.setAttribute('type', 'text/javascript');
	// 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
	if(!additional) {
		temp.src = chrome.extension.getURL(jsPath);
		// console.log(chrome.extension.getURL(jsPath));
	} else {
		temp.src = jsPath;
	}
	setTimeout(function(){
		console.log('temp', temp);
		document.body.appendChild(temp);
	}, 2000);
	temp.onload = function()
	{
		// 执行完后移除掉
		this.parentNode.removeChild(this);
	};
}

// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
	console.log('收到来自 ' + (sender.tab ? "content-script(" + sender.tab.url + ")" : "popup或者background") + ' 的消息：', request);
	if(request.cmd == 'update_font_size') {
		var ele = document.createElement('style');
		ele.innerHTML = ('* {font-size: '+request.size+'px !important;}');
		document.head.appendChild(ele);
	}
	else if(request.cmd == 'getContent') {
		var cookie = document.cookie;
		var content = $(request.node || 'body').html();
		var response = JSON.stringify(
			{
				cookie: cookie,
				content: content,
				date: Date.now(),
				href: location.href,
			}
		) 
		sendResponse(response);
	} else if(request.cmd == 'fetchHtmlAndDesc') { // 
		var content = document.getElementsByTagName('html')[0].innerHTML;
		// console.log(location.href);
		// console.log('content', content);
		sendResponse(content);
		var fetchDescURL = URL.createObjectURL(new Blob(
			['window.wonbaoInjectedObj&&window.wonbaoInjectedObj.receiveTaskFetchHtmlAndDesc&&window.wonbaoInjectedObj.receiveTaskFetchHtmlAndDesc()']
			),{
				type: 'application/javascript'
			}
		)
		injectCustomJs(fetchDescURL, true);

	}
	else if(request.cmd == 'notifyIframeUsefull') { // 向 page 通知 iframe有内容
		var result = {
			href: request.href,
		}
		// alert(request.content);
		var codeURL = URL.createObjectURL(new Blob(
			['window.wonbaoInjectedObj&&window.wonbaoInjectedObj.receiveNotifyIframeUsefull && window.wonbaoInjectedObj.receiveNotifyIframeUsefull('+JSON.stringify(result)+')']
			),{
				type: 'application/javascript'
			}
		)
		injectCustomJs(codeURL, true);
	}
	else if(request.cmd == 'reveiverIframeHtml') { // 向 page 通知 iframe 的html内容
		var result = {
			href: request.href,
			content: (request.content || '').replace(/'/mig, 'a1562723483981KJZvFoxt').replace(/"/mig, 'b1562723483981KJZvFoxt' ),
			html: (request.html ||'').replace(/'/mig, 'a1562723483981KJZvFoxt').replace(/"/mig, 'b1562723483981KJZvFoxt' ),
		}
		// alert(request.content);
		var codeURL = URL.createObjectURL(new Blob(
			['window.wonbaoInjectedObj&&window.wonbaoInjectedObj.receiveTaskResult&&window.wonbaoInjectedObj.receiveTaskResult('+JSON.stringify(result)+')']
			),{
				type: 'application/javascript'
			}
		)
		injectCustomJs(codeURL, true);
		// tip(JSON.stringify(request));
		// sendResponse('我收到你的消息了：'+JSON.stringify(request));
	} else if(request.cmd == 'receiveNewQueue') { // 向 page 通知接收到 复制请链接等内容
		// console.log('request', request);

		var url = request.url;
		var html = request.html;
		var desc = request.desc;
		var msg = request.msg;

		var result = {
			url: url,
			html: (html || '').replace(/'/mig, 'a1562723483981KJZvFoxt').replace(/"/mig, 'b1562723483981KJZvFoxt' ),
			desc: (desc || '').replace(/'/mig, 'a1562723483981KJZvFoxt').replace(/"/mig, 'b1562723483981KJZvFoxt' ),
			msg: msg,
		}
		var codeURL = URL.createObjectURL(new Blob(
			['window.wonbaoInjectedObj&&window.wonbaoInjectedObj.receiveInjectNewQueue&&window.wonbaoInjectedObj.receiveInjectNewQueue('+JSON.stringify(result)+')']
			),{
				type: 'application/javascript'
			}
		)
		injectCustomJs(codeURL, true);
	} else if (request.cmd == 'reveiveFetchData') { // 向 page 通知接收到的跨域请求到的数据
		var result = {
			url: request.url,
			res: (request.res || '').replace(/'/mig, 'a1562723483981KJZvFoxt').replace(/"/mig, 'b1562723483981KJZvFoxt' ),
			uuid: request.uuid,
		}
		// console.log('result', result);
		var codeURL = URL.createObjectURL(new Blob(
			['window.wonbaoInjectedObj&&window.wonbaoInjectedObj.receiveFetchDataTaskResult&&window.wonbaoInjectedObj.receiveFetchDataTaskResult('+JSON.stringify(result)+')']
			),{
				type: 'application/javascript'
			}
		)
		injectCustomJs(codeURL, true); 
	} else if (request.cmd == 'receiveHttpRequest') { // 向 page通知接收到时 数握
		var result = {
			url: request.url,
			uuid: request.uuid,
			res: request.res //(request.res || '').replace(/'/mig, 'a1562723483981KJZvFoxt').replace(/"/mig, 'b1562723483981KJZvFoxt' ),
		}
		console.log('result', result);
		var codeURL = URL.createObjectURL(new Blob(
			['window.wonbaoInjectedObj&&window.wonbaoInjectedObj.receiveHttpRequestTaskResult&&window.wonbaoInjectedObj.receiveHttpRequestTaskResult('+JSON.stringify(result)+')']
			),{
				type: 'application/javascript'
			}
		)
		injectCustomJs(codeURL, true); 
	} else if(request.cmd == 'downloadComplete') {
		console.log('content 下载通知 --- downloadComplete -------------------');
		var result = {
			url: request.url,
			uuid: request.uuid,
			res: request.res //(request.res || '').replace(/'/mig, 'a1562723483981KJZvFoxt').replace(/"/mig, 'b1562723483981KJZvFoxt' ),
		}
		console.log(result);
		console.log('result', result);
		var codeURL = URL.createObjectURL(new Blob(
			['window.wonbaoInjectedObj&&window.wonbaoInjectedObj.notifyDownloadComplete&&window.wonbaoInjectedObj.notifyDownloadComplete('+JSON.stringify(result)+')']
			),{
				type: 'application/javascript'
			}
		)
		injectCustomJs(codeURL, true); 
	}
});

// 主动发送消息给后台
// 要演示此功能，请打开控制台主动执行sendMessageToBackground()
function sendMessageToBackground(message) {
	chrome.runtime.sendMessage({cmd:'default', greeting: message || '你好，我是content-script呀，我主动发消息给后台！'}, function(response) {
		tip('收到来自后台的回复：' + response);
	});
}

// 监听长连接
chrome.runtime.onConnect.addListener(function(port) {
	console.log(port);
	if(port.name == 'test-connect') {
		port.onMessage.addListener(function(msg) {
			//console.log('收到长连接消息：', msg);
			tip('收到长连接消息：' + JSON.stringify(msg));
			if(msg.question == '你是谁啊？') port.postMessage({answer: '我是你爸！'});
		});
	}
});

window.addEventListener("message", function(e)
{
	// alert(JSON.stringify(e));
	console.warn('收到消息：', e);
	
	if(e.data && e.data.cmd == 'invoke') {
		eval('('+e.data.code+')');
	}
	else if(e.data && e.data.cmd == 'message') {
		tip(e.data.data);
	}
	else if(e.data.cmd == 'notifyIframeHtmlUsefull') {
		chrome.runtime.sendMessage({cmd:'notifyIframeHtmlUsefull', href: e.data.href}, function(response) {
			
		});
	}
	// 收到复制的html信息
	else if(e.data.cmd == 'notifyIframeCopyResult') {
		console.log(e.data);
		chrome.runtime.sendMessage({cmd:'notifyIframeCopyResult', content: e.data.content, href: e.data.href, html: e.data.html}, function(response) {
			
		});
	} else if (e.data.cmd == 'openTab') {
		chrome.runtime.sendMessage({cmd:'openTab', params: e.data.params}, function(response) {
			
		});
	} else if (e.data.cmd == 'notify') {
		chrome.runtime.sendMessage({cmd:'notify', params: e.data.params}, function(response) {
			
		});
	} else if(e.data.cmd == 'fetchData') {
		// alert('fetchData----');
		chrome.runtime.sendMessage({cmd:'fetchData', url: e.data.url, timeout: e.data.timeout, uuid: e.data.uuid, blob: e.data.blob}, function(response) {
			// console.log('fetchHttpContent', response);
			// alert('fetchHttpContent');
			// var result = response.replace(/'/mig, 'a1562723483981KJZvFoxt').replace(/"/mig, 'b1562723483981KJZvFoxt' );
	
			// alert(request.content);


			/* var codeURL = URL.createObjectURL(new Blob(
				['window.receiveFetchTataTaskResult&&window.receiveFetchTataTaskResult('+response+')']
				),{
					type: 'application/javascript'
				}
			)
			injectCustomJs(codeURL, true);  */
			// console.log('fetchHttpContent', response);
		});
	} else if (e.data.cmd == 'notifyReceiveTaskFetchHtmlAndDesc') {
		var html =  e.data.html;
		var desc = e.data.desc;
		var msg = e.data.msg;
		// console.warn(location.href);
		// console.log('desc', desc);
		chrome.runtime.sendMessage({
			cmd:'notifyReceiveTaskFetchHtmlAndDesc',
			html: html,
			desc: desc,
			url: location.href,
			msg: msg,
		}, function(response) {

		})
	} else if (e.data.cmd == 'httpRequest') {
		console.log([e.data.url, e.data.uuid, e.data.responseType]);
		chrome.runtime.sendMessage({cmd:'httpRequest', url: e.data.url, uuid: e.data.uuid, responseType: e.data.responseType}, function(response) {
		});
	} else if(e.data.cmd == 'sendDownload') {
		console.log([e.data.url, e.data.fileName]);
		chrome.runtime.sendMessage({cmd:'sendDownload', url: e.data.url, uuid: e.data.uuid, fileName: e.data.fileName}, function(response) {
		});
	}
}, false);

function initCustomEventListen() {
	var hiddenDiv = document.getElementById('myCustomEventDiv');
	if(!hiddenDiv) {
		hiddenDiv = document.createElement('div');
		hiddenDiv.style.display = 'none';
		hiddenDiv.id = 'myCustomEventDiv';
		document.body.appendChild(hiddenDiv);
	}
	hiddenDiv.addEventListener('myCustomEvent', function() {
		var eventData = document.getElementById('myCustomEventDiv').innerText;
		tip('收到自定义事件：' + eventData);
	});
}

var tipCount = 0;
// 简单的消息通知
function tip(info) {
	info = info || '';
	var ele = document.createElement('div');
	ele.className = 'chrome-plugin-simple-tip slideInLeft';
	ele.style.top = tipCount * 70 + 20 + 'px';
	ele.innerHTML = '<div>'+info+'</div>';
	document.body.appendChild(ele);
	ele.classList.add('animated');
	tipCount++;
	setTimeout(function() {
		ele.style.top = '-100px';
		setTimeout(function() {
			ele.remove();
			tipCount--;
		}, 400);
	}, 3000);
}