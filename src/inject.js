import main from './client/main.js';
window.plugEffective = true; // 给宿主网页判断插件是否有效
window.wonbaoInjectedObj = {};

// 通过postMessage调用content-script
function invokeContentScript(code)
{
	window.postMessage({cmd: 'invoke', code: code}, '*');
}
// 发送普通消息到content-script
function sendMessageToContentScriptByPostMessage(data)
{
	window.postMessage({cmd: 'message', data: data}, '*');
}

// 通过DOM事件发送消息给content-script
(function() {
	var customEvent = document.createEvent('Event');
	customEvent.initEvent('myCustomEvent', true, true);

	// 通过事件发送消息给content-script
	function sendMessageToContentScriptByEvent(data) {
		data = data || '你好，我是injected-script!';
		var hiddenDiv = document.getElementById('myCustomEventDiv');
		hiddenDiv.innerText = data
		hiddenDiv.dispatchEvent(customEvent);
	}
	window.sendMessageToContentScriptByEvent = sendMessageToContentScriptByEvent;
	var injectUtil = {
		// 向页面加入js 并拿到宝贝详情
		injectCustomJs: function(jsPath, callback) {
			jsPath = jsPath;
			var temp = document.createElement('script');
			temp.setAttribute('type', 'text/javascript');
			temp.src = jsPath;
			// temp.src = 'http://localhost:8081/inject.js';
			temp.onload = function()
			{
				// 放在页面不好看，执行完后移除掉
				this.parentNode.removeChild(this);
				var content = window.desc || window.offer_details || '';
				if(typeof content == 'object' && content.content) {
					content = content.content;
				}
				callback({
					success: true,
					content: content,
				})
			};
			temp.onerror = function() {
				this.parentNode.removeChild(this);
				var content = window.desc || window.offer_details || '';
				if(typeof content == 'object' && content.content) {
					content = content.content;
				}
				callback({
					success: false,
					content: content,
				})
			}
			document.body.appendChild(temp);
		},

		// 获取宝贝详情相关的js地址
		descUrl: function() {
			var html = document.getElementsByTagName('html')[0].innerHTML;
			var descUrl = window.g_config && window.g_config.descUrl;
			if(href.indexOf('detail.1688.com') > -1) { // 1688
				var regx = /data-tfs-url\s*=\s*"(.+?)"\s*/mig;
				var result = regx.exec(html);
				if (result && result[1]) {
					return result[1];
				}
			} else	if(descUrl) {// 淘宝
				return descUrl
			} else {
				// 天猫
				var regx = /"httpsDescUrl"\s*:\s*"(.+?)"\s*/mig;
				var result = regx.exec(html);
				if (result && result[1]) {
					return result[1]
				} else {
					var regx = /(\/\/dscnew.taobao.+?)['"]/mig;
					var result = regx.exec(html);
					if (result && result[1]) {
						return result[1];
					} 
				}
			}
			return '';
		}
	};


	// 通过iframe 的href是否有wbExtensions来判断该网页是否用于获取数据

	var href = location.href;
	// 如果当前网页的search 包含wbExtensions的，说明是通过iframe 来获取数据的
	if(href.indexOf('wbExtensions') > -1) {
		// 告知当前网页是可以访问的
		window.postMessage({cmd: 'notifyIframeHtmlUsefull', href: href}, '*');
		// 去除iframe中控制台的输出
		console.log = console.error = console.warn = function(){}
		var html = document.getElementsByTagName('html')[0].innerHTML;
		var descUrl = window.g_config && window.g_config.descUrl;
		if(href.indexOf('detail.1688.com') > -1) { // 1688
			var regx = /data-tfs-url\s*=\s*"(.+?)"\s*/mig;
			var result = regx.exec(html);
			if (result && result[1]) {
				injectUtil.injectCustomJs(result[1], function(res){
					// console.log('=============================================', res);
					window.postMessage({cmd: 'notifyIframeCopyResult', content: res.content, href: href, html: html}, '*');
				})
			}
		} else	if(descUrl) {// 淘宝
			injectUtil.injectCustomJs(descUrl, function(res){
				// console.log('=============================================', res);
				window.postMessage({cmd: 'notifyIframeCopyResult', content: res.content, href: href, html: html}, '*');
			})
		} else if(href.indexOf('yangkeduo.com/goods') > -1) { // 拼多多 目前没有要通过特殊处理才能拿到数据的数据就在html 页面上，所以直接通过httpRequest拿取会比较好
			var html = document.getElementsByTagName('html')[0].innerHTML;
			window.postMessage({cmd: 'notifyIframeCopyResult', content:  '', href: href, html: html}, '*');
		}  else  if(href.indexOf('t.bilibili.com') > -1) {
			console.log(html);
			console.log('bilibiliSpace=====');
			setTimeout(function() {
				window.postMessage({cmd: 'notifyIframeCopyResult', content:  '', href: href, html:  document.getElementsByTagName('html')[0].innerHTML}, '*');
			}, 1500)
		}else {
			// 天猫
			var regx = /"httpsDescUrl"\s*:\s*"(.+?)"\s*/mig;
			var result = regx.exec(html);
			if (result && result[1]) {
				// console.log(result);
				injectUtil.injectCustomJs(result[1], function(res){
					// console.log('=============================================', res);
					window.postMessage({cmd: 'notifyIframeCopyResult', content: res.content, href: href, html: html}, '*');
				})
			} else {
				var regx = /(\/\/dscnew.taobao.+?)['"]/mig;
				var result = regx.exec(html);
				if (result && result[1]) {
					// console.log(result);
					injectUtil.injectCustomJs(result[1], function(res){
						// console.log('=============================================', res);
						window.postMessage({cmd: 'notifyIframeCopyResult', content: res.content, href: href, html: html}, '*');
					})
				}  else { // 如果什么都没有直接返回html内容
					window.postMessage({cmd: 'notifyIframeCopyResult', content: '', href: href, html: html}, '*');
				}
			}
		}
		// alert(window.g_config.descUrl);
	}



	// 接收右键菜单的任务，拿到数据后传给background.js，并通过tab 循环传给页目。
	window.wonbaoInjectedObj.receiveTaskFetchHtmlAndDesc = function() {
		// 右键只对下列网站有用
		var locationHref = location.href;
		var matches = [
			'https://detail.tmall.com/', //天猫 （可以拿到详情）
			'https://item.taobao.com/', // 淘宝 （可以拿到详情）
			'https://detail.1688.com/', // 1688 （可以拿到详情）
			'https://h5.m.taobao.com/', // 淘宝手机 （暂时无法拿到详情，机制未知）
			'https://detail.m.tmall.com/', // 天猫手机 （暂时无法拿到详情，机制未知）
			'https://m.1688.com/', // 1688手机（暂时无法拿到详情，机制未知）
		];
		if(
			locationHref.indexOf(matches[0]) > -1 ||
			locationHref.indexOf(matches[1]) > -1 ||
			locationHref.indexOf(matches[2]) > -1 ||
			locationHref.indexOf(matches[3]) > -1 ||
			locationHref.indexOf(matches[4]) > -1 ||
			locationHref.indexOf(matches[5]) > -1
		)  {
			var receiveHtml = document.getElementsByTagName('html')[0].innerHTML;
			var receiveDesc = window.desc || window.offer_details || '';
			// console.warn(location.href);
			// console.log(receiveHtml);
			// 1688 中的宝贝详情是在object 中的
			if(typeof receiveDesc == 'object' && receiveDesc.content) {
				receiveDesc = receiveDesc.content;
			}
			// 如果有详情，说明用户已经拉到可以看见详情了
			if(receiveDesc) {
				window.postMessage({
					cmd: 'notifyReceiveTaskFetchHtmlAndDesc',
					html: receiveHtml,
					desc: receiveDesc,
					msg: 'directly fetch in the global window desc'
				}, '*');
			} else {
				var descUrl = injectUtil.descUrl();
				if(!descUrl) {
					window.postMessage({
						cmd: 'notifyReceiveTaskFetchHtmlAndDesc',
						html: receiveHtml,
						desc: '',
						msg: 'can\'not find descUrl value,therefore can\'not fetchdata by load descUrl'
					}, '*');
				} else {
					injectUtil.injectCustomJs(descUrl, function(res) {
						window.postMessage({
							cmd: 'notifyReceiveTaskFetchHtmlAndDesc',
							html: receiveHtml,
							desc: res.content,
							msg: 'fetchdata by load descUrl'
						}, '*');
					});
				}
			}
		}
	}
	if(window.jq) {
		var getUUID = function() {
			var s = [];
			var hexDigits = "0123456789abcdef";
			for (var i = 0; i < 36; i++) {
				s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
			}
			s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
			s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
			s[8] = s[13] = s[18] = s[23] = "-";
		 
			var uuid = s.join("");
			return uuid;
		}
		// ============================================================================================
			// 任务列表
			var taskList = {};

			// 1.接收任务请求(网页可用)
			window.accessTask = function(url, callback){
				var uuid = getUUID();
				taskList[uuid] = {
					callback: callback,
					url: url
				}
				// alert('accessTask');
				var src = new URL(url);
				if(src.search) {
					src.search += ('&v='+Date.now()+'&from=wbExtensions&uuid='+uuid);
				} else {
					src.search = '?v='+Date.now()+'&from=wbExtensions&uuid='+uuid;
				}
				var iframe = jq('<iframe id="'+uuid+'" src="'+src.href+'" width="100" height="10" sandbox="allow-scripts allow-same-origin allow-popups">');
				// 没有onerror事件，在onload 后5s
				iframe.get(0).onload = function() {
					setTimeout(function() {
						if(taskList[uuid] && !taskList[uuid].usefull) {
							taskList[uuid].callback({
								content: '',
								html: '',
								url: taskList[uuid].url,
								msg: 'can not fetch data in 8s after iframe onload'
							});
							delete taskList[uuid];
						}
					}, 8000);
				}
				iframeWrap.append(iframe);
			}
			// 接收判断当前iframe是否可用的任务
			window.wonbaoInjectedObj.receiveNotifyIframeUsefull = function(result) {
				var params = result;
				var href = params.href;
				var regx = /uuid=([^&]+)?&?/mig;
				var result = regx.exec(href);
				if (result && result[1]) {
					var uuid = result[1];
					if(taskList[uuid]) {
						taskList[uuid].usefull = true;
						// alert('yes');
					}
				}
			}
			// 接收iframe任务结果
			window.wonbaoInjectedObj.receiveTaskResult = function(result) {
				var params = result;
				var href = params.href;

				var regx = /uuid=([^&]+)?&?/mig;
				var result = regx.exec(href);
				if (result && result[1]) {
					var uuid = result[1];
					if(taskList[uuid]) {
						taskList[uuid].callback({
							content: params.content.replace(/a1562723483981KJZvFoxt/mig, "'").replace(/b1562723483981KJZvFoxt/mig, '"' ),
							html: params.html.replace(/a1562723483981KJZvFoxt/mig, "'").replace(/b1562723483981KJZvFoxt/mig, '"' ),
							url: taskList[uuid].url
						});
						delete taskList[uuid];
						jq('#'+uuid).remove();
					}
				}
			}


			// 接收右键返回的
			window.wonbaoInjectedObj.receiveInjectNewQueue = function(res) {
				var url =  res.url;
				var html = res.html.replace(/a1562723483981KJZvFoxt/mig, "'").replace(/b1562723483981KJZvFoxt/mig, '"' );
				var desc = res.desc.replace(/a1562723483981KJZvFoxt/mig, "'").replace(/b1562723483981KJZvFoxt/mig, '"' );
				// console.warn(url);
				// console.log(html);
				// 如果宿主网页在receiveNewQueue，把相关的数据传进去
				window.receiveNewQueue&&window.receiveNewQueue({
					url: url,
					html: html,
					desc: desc,
				})

			}
			// 2.打开新标签页(网页可用)
			window.openTab = window.openTab || function(url, name, specs, replace) {
				window.postMessage({cmd: 'openTab', params: {url: url, name: name, specs: specs, replace: replace} }, '*');
			}
			// 3.电脑右下角通知(网页可用)
			window.notify = window.notify || function(type, iconUrl, title, message) {
				window.postMessage({cmd: 'notify', params: {type: type, iconUrl: iconUrl, title: title, message: message}}, '*');
			}

			// 任务列表
			var fetchDataTaskList = {};
			// 4.fetchData (网页可用)
			
			window.fetchData = window.fetchData || function(url, timeout, callback) {
				var uuid = getUUID();
				fetchDataTaskList[uuid] = {
					callback: callback,
					url: url
				}
				console.log({cmd: 'fetchData', url: url, timeout: timeout, uuid: uuid});
				window.postMessage({cmd: 'fetchData', url: url, timeout: timeout, uuid: uuid}, '*');
			}

			window.wonbaoInjectedObj.receiveFetchDataTaskResult = function(result) {
				var uuid = result.uuid;
				if(fetchDataTaskList[uuid]) {
					fetchDataTaskList[uuid].callback({
						res: result.res.replace(/a1562723483981KJZvFoxt/mig, "'").replace(/b1562723483981KJZvFoxt/mig, '"' ),
						url: result.url,
					});
					delete fetchDataTaskList[uuid];
				}
			}
			// 5.httpRequest (网页可用)
			// 任务列表
			var httpRequestTaskList = {};
			// alert('ddddd5555');
			window.httpRequest = window.httpRequest || function(url, responseType, callback) {
				var uuid = getUUID();
				httpRequestTaskList[uuid] = {
					callback: callback,
					url: url
				}
				window.postMessage({cmd: 'httpRequest', url: url, uuid: uuid, responseType: responseType}, '*');
			}
			window.wonbaoInjectedObj.receiveHttpRequestTaskResult = function(result) {
				var uuid = result.uuid;
				if(httpRequestTaskList[uuid]) {
					httpRequestTaskList[uuid].callback({
						res: result.res,//.replace(/a1562723483981KJZvFoxt/mig, "'").replace(/b1562723483981KJZvFoxt/mig, '"' ),
						url: result.url,
					});
					delete httpRequestTaskList[uuid];
				}
			}
			// 向后台发送下载任务
			var downloadTaskList = {};
			window.sendDownload = window.sendDownload || function(data) {
				var uuid = getUUID();
				downloadTaskList[uuid] = {
					callback: data.callback,
					url: data.url
				}
				window.postMessage({cmd: 'sendDownload', uuid: uuid,url: data.url, fileName: data.fileName}, '*');
			}
			window.wonbaoInjectedObj.notifyDownloadComplete = function(result) {
				console.log('inject', result);
				var uuid = result.uuid;
				if(downloadTaskList[uuid]) {
					console.log('yyyy');
					downloadTaskList[uuid].callback && downloadTaskList[uuid].callback({
						url: result.url,
						success: result.res == 'success'
					})
					delete downloadTaskList[uuid];
				}
			}
		jq(function() {
			// alert('d');
			var iframeWrap = jq('<div id="wb-iframe-wrap"></div>');
			iframeWrap.css({
				width: '100px',
				height: '10px',
				border: '1px solid red',
				position: 'absolute',
				left: '-110px',
				top: 0,
				overflow: 'auto',
				opacity: 0,
			})
			
			
			if(
				(location.href.indexOf('localhost') > -1) ||
				(location.href.indexOf('wonbao') > -1) ||
				(location.href.indexOf('file:')>-1) ||
				location.href.indexOf('192.168') > -1||
				location.href.indexOf('bilibili') > -1
			) {
				jq('body').append(iframeWrap);
				window.iframeWrap = iframeWrap;
			}
			/* var copyBtn = jq('#wb-copy');
			copyBtn.addClass('hasplug');
			copyBtn.on('click', function(){
				var list = window.myscript();
				// alert(list);
				list.forEach(function(item, index){
					var iframe = jq('<iframe src="'+item+'&v='+Date.now()+'&from=wbExtensions" width="100" height="500">');
					iframeWrap.append(iframe);
				})
			}) */



			

		})
	}


	/* (function(){
		var href = location.href;
		var origin = location.origin;
		console.log(location);
		console.log(origin);

		
		if(origin == 'https://www.baidu.com') {
			// 下载弹窗
			var dialog = jq('<div style="width:600px;height:400px;background-color:white;position:fixed;left:50%;top:50%;transform: translate(-50%,-50%);box-shadow:0 0 20px rgba(0,0,0,0.3);z-index:100;">\
				<div style="height: 30px;">\
					<div style="float:right;cursor:pointer;color:red;font-size: 30px;margin: 0px 6px 0 0;" class="e-dialog-diss">&times;</div>\
				</div>\
				<!--内容区-->\
				<div style="height: 320px;overflow:auto;">\
					<input id="pddurl" type="text" placeholder="请输入danbooru链接" value="">\
					<button class="btn" id="btn-fetch-data">获取</button>\
					<div>\
						过程：<span id="progress"></span>\
					</div>\
					<br>\
					<div>\
						<button class="btn" id="btn-save-storage">保存未获取列表</button>\
						<button class="btn"  id="btn-get-storage">获取未获取列表</button>\
					</div>\
					<br>\
					<!-- 获取到的列表 -->\
					<button class="btn" id="fetImage">获取以下图片</button> <input id="parallel-num" type="number" min="1" value="1">\
					<div id="fetching-list" class="list-block">\
					</div>\
					<br>\
					<div>未获取的图片</div> <span id="fetch-list-length"></span>\
					<div id="fetched-list" class="list-block"></div>\
					<div>\
					<br>\
					<div>获取失败的图片</div> <span id="fetch-error-list-length"></span> <button class="btn" id="btn-add-to-unfetch">添加到未获取列表</button>\
					<div id="fetch-error-list" class="list-block">\
					</div>\
					<br>\
					<div>获取完成的图片</div><span id="fetch-success-list-length"></span>\
					<div id="fetch-success-list" class="list-block">\
					</div>\
				<div style="height:50px;">\
					<button class="e-start-fetch">开始获取</button>\
				</div>\
			<div>');
			
			// 右侧开始下载按钮
			var downloadBtn = jq('<div style="width: 30px;height:35px;line-height:35px;color:white;border-radius:3px 0 0 3px;background-color:rgb(0,122,204);position:fixed;right:0;top:200px;cursor:pointer;" title="下载">&darr;</div>');
			jq('body').append(downloadBtn)
			dialog.hide().appendTo('body');
	
			downloadBtn.on('click', function(){
				dialog.fadeIn();
			});
			dialog.find('.e-dialog-diss').on('click', function(){
				dialog.fadeOut();
			}).end().find('.e-start-fetch').on('click', function(){
				
			}).end()
	
		} else {

		}
		

	})() */
})();

