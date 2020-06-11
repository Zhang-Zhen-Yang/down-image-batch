/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/main/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ({

/***/ 10:
/***/ (function(module, exports) {

//-------------------- 右键菜单演示 ------------------------//
function shouldSendToTab(url) {
	// tab.url.indexOf('danbooru') > -1 || tab.url.indexOf('yande.re') > -1  ||tab.url.indexOf('localhost') > -1 || tab.url.indexOf('wonbao') > -1 || tab.url.indexOf('file:') > -1 || tab.url.indexOf('192.168') > -1
	let list = [/danbooru/, /yande.re/, /baidu.com/, /bilibili.com/, /www.acfun.cn\/a\//, /localhost/, /ichi\-up\.net\//, /bing\.ioliu\.cn/];
	let should = false;
	list.forEach(item => {
		if (url.match(item)) {
			should = true;
		}
	});
	return should;
}
var bgUtil = {
	ver: '1.0.0',
	// 删除右键菜单（未使用）
	removeMenuItem: function () {
		chrome.contextMenus.remove('wb-context', function () {});
	},
	createMenuItem: function () {
		var itemId = 'wb-context-add-to-copy-list';
		// 只在下列网站显示右键菜单
		var documentUrlPatterns = ['https://detail.tmall.com/*', 'https://item.taobao.com/*', 'https://detail.1688.com/*', 'https://h5.m.taobao.com/*', 'https://detail.m.tmall.com/*', 'https://m.1688.com/*'];

		var ua = navigator.userAgent.toLocaleLowerCase();
		// 搜狗浏览器没 默认icon，要手动添加，而稍旧的版本不支持onclick属性
		if (ua.match(/metasr/) != null) {
			chrome.contextMenus.create({
				title: "添加到宝贝复制队列",
				id: itemId,
				icon: { path: 'img/icon.png' },
				// 右键菜单只在下列网站可用
				documentUrlPatterns: documentUrlPatterns,
				onclick: function () {
					chrome.tabs.query({ active: true, currentWindow: true }, function (currentTab) {
						// 当前页面的url
						// 向当前页面的content-script 发送获取html内容的请求
						chrome.tabs.sendMessage(currentTab[0].id, { cmd: "fetchHtmlAndDesc" }, function (response) {
							response();
						});
					});
					return;
				}
			});
			chrome.contextMenus.onClicked.addListener(function (a, b) {
				if (a.menuItemId == itemId) {
					chrome.tabs.query({ active: true, currentWindow: true }, function (currentTab) {
						// 当前页面的url
						// 向当前页面的content-script 发送获取html内容的请求
						chrome.tabs.sendMessage(currentTab[0].id, { cmd: "fetchHtmlAndDesc" }, function (response) {
							response();
						});
					});
				}
			});
		} else {
			chrome.contextMenus.create({
				title: "添加到宝贝复制队列",
				id: itemId,
				// 右键菜单只在下列网站可用
				documentUrlPatterns: documentUrlPatterns,
				onclick: function () {
					chrome.tabs.query({ active: true, currentWindow: true }, function (currentTab) {
						// 当前页面的url
						// 向当前页面的content-script 发送获取html内容的请求
						chrome.tabs.sendMessage(currentTab[0].id, { cmd: "fetchHtmlAndDesc" }, function (response) {
							response();
						});
					});
					return;
				}
			});
		}
	},
	// 电脑右下角通知
	notify: function (params) {
		chrome.notifications.create(null, {
			type: params.type || 'basic',
			iconUrl: params.iconUrl || 'img/icon.png',
			title: params.title || '这是标题',
			message: params.message || ''
		});
	},
	setBadgeText: function (text) {
		chrome.browserAction.setBadgeText({ text: text });
	},
	setStorage: function (params) {
		chrome.storage.sync.set(params);
	}
};

function backgroundInit() {

	bgUtil.createMenuItem();
	bgUtil.setStorage({ ver: bgUtil.ver });
	// 能够检测版本的url
	/* var verUrl = 'http://wdb.wonbao.com/goodsCopyVer.json';
 $.ajax({
 	type: "GET",
 	url: verUrl,
 	async: false,
 	data: {},
 	dataType: "json",
 	success: function(data){
 		if(data.ver != bgUtil.ver) {
 			bgUtil.setBadgeText('new');
 		}
 	},
 	error: function(data) {
 	}
 });
 */
}
backgroundInit();
//-------------------- badge演示 ------------------------//
var contentMap = {};
// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	// 只作测试用
	if (request.cmd == 'default') {
		// console.log('收到来自content-script的消息：');
		// console.log(request, sender, sendResponse);
		sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
	} /*else if(request.cmd == 'receiveContent') { // 不再使用了
   var id = request.id;
   if (!id) {
   contentMap[id] = '';
   }
   contentMap[id] = ((contentMap[id] || '')+ (request.content || ''));
   	$.ajax({
   type: "POST",
   url: "http://localhost:3000/receive",
   data: {content: request.content, id: id},
   dataType: "json",
   success: function(data){
   
   },
   error: function(data) {
   }
   });
   } */
	else if (request.cmd == 'notifyIframeHtmlUsefull') {
			// 告知当前iframe 页面是否有内容
			chrome.tabs.query({}, function (tabs) {
				tabs.forEach(function (tab, index) {
					if (tab.url.indexOf('localhost') > -1 || tab.url.indexOf('wonbao') > -1 || tab.url.indexOf('file:') > -1 || tab.url.indexOf('192.168') > -1 || tab.url.indexOf('yangkeduo.com/goods') > -1) {
						chrome.tabs.sendMessage(tabs[index].id, {
							index: index,
							cmd: "notifyIframeUsefull",
							href: request.href
						}, function (response) {});
					}
				});
			});
			sendResponse();
		} else if (request.cmd == 'notifyIframeCopyResult') {
			chrome.tabs.query({}, function (tabs) {
				tabs.forEach(function (tab, index) {
					if (tab.url.indexOf('localhost') > -1 || tab.url.indexOf('wonbao') > -1 || tab.url.indexOf('file:') > -1 || tab.url.indexOf('192.168') > -1 || tab.url.indexOf('yangkeduo.com/goods') > -1) {
						chrome.tabs.sendMessage(tabs[index].id, {
							index: index,
							cmd: "reveiverIframeHtml",
							content: request.content,
							href: request.href,
							html: request.html
						}, function (response) {});
					}
				});
			});
			sendResponse();
		} else if (request.cmd == 'openTab') {
			// 打开新tab页面
			var params = request.params;
			chrome.tabs.create({ url: params.url });
		} else if (request.cmd == 'notify') {
			var params = request.params;
			chrome.notifications.create(null, {
				type: params.type || 'basic',
				iconUrl: params.iconUrl || 'img/icon.png',
				title: params.title || '这是标题',
				message: params.message || ''
			});
			sendResponse();
		} else if (request.cmd == 'fetchData') {
			// 跨域获取数据
			$.ajax({
				type: "GET",
				url: request.url,
				timeout: request.timeout,
				async: false,
				data: {},
				dataType: "json",
				success: function (data) {
					var dist = {
						url: request.url,
						res: data.responseText,
						uuid: request.uuid
					};
					sendFetchDataToContentScript(dist, "reveiveFetchData");
					/* chrome.notifications.create(null, {
     	type: params.type || 'basic',
     	iconUrl: params.iconUrl || 'img/icon.png',
     	title: params.title || '这是标题' + 'success',
     	message: params.message || ''
     }); */

					// sendResponse((dist));
				},
				error: function (data) {
					var dist = {
						url: request.url,
						res: data.responseText,
						uuid: request.uuid
					};
					sendFetchDataToContentScript(dist, "reveiveFetchData");
					/* chrome.notifications.create(null, {
     	type: params.type || 'basic',
     	iconUrl: params.iconUrl || 'img/icon.png',
     	title: params.title || '这是标题' + 'error',
     	message: params.message || ''
     }); */
					// sendResponse(JSON.stringify(dist));
				}
			});
			sendResponse();
		} else if (request.cmd == 'notifyReceiveTaskFetchHtmlAndDesc') {
			// 右键点击后获取的数据
			chrome.tabs.query({}, function (tabs) {
				tabs.forEach(function (tab, index) {
					if (tab.url.indexOf('localhost') > -1 || tab.url.indexOf('wonbao') > -1 || tab.url.indexOf('file:') > -1 || tab.url.indexOf('192.168') > -1) {
						chrome.tabs.sendMessage(tabs[index].id, {
							cmd: "receiveNewQueue",
							url: request.url,
							html: request.html,
							desc: request.desc,
							msg: request.msg
						}, function (response) {});
					}
				});
			});
			sendResponse();
		} else if (request.cmd == 'httpRequest') {
			var xhr = new XMLHttpRequest();
			xhr.open("GET", request.url, true);
			xhr.responseType = request.responseType || 'blob'; //"arraybuffer";
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200 || xhr.status == 304) {
						var blob = xhr.response;

						if (blob) {
							var file = new FileReader();
							file.onload = function () {
								// callback(blob);
								var dist = {
									url: request.url,
									res: file.result,
									uuid: request.uuid,
									success: true
								};
								sendFetchDataToContentScript(dist, 'receiveHttpRequest');
							};
							file.readAsDataURL(blob);
						}
					} else {
						var dist = {
							url: request.url,
							res: '',
							uuid: request.uuid,
							success: false
						};
						sendFetchDataToContentScript(dist, 'receiveHttpRequest');
					}
				}
			};
			xhr.send(null);
			sendResponse();
		} else if (request.cmd == 'sendDownload') {
			// 下载文件
			var dlData = [];
			chrome.downloads.download({
				url: request.url,
				filename: request.fileName,
				conflictAction: 'overwrite',
				saveAs: false
			}, function (id) {
				// id 是 Chrome 新建立的下载任务的 id
				dlData[id] = {
					url: request.url,
					id: request.id,
					uuid: false
				};
			});
		}
});

// 将跨域获取的数据传回到content-script, content-script 再传到宿主页面 
function sendFetchDataToContentScript(data, cmd) {
	chrome.tabs.query({}, function (tabs) {
		tabs.forEach(function (tab, index) {
			if (shouldSendToTab(tab.url)) {
				chrome.tabs.sendMessage(tabs[index].id, {
					index: index,
					cmd: cmd,
					url: data.url,
					res: data.res,
					uuid: data.uuid
				}, function (response) {});
			}
		});
	});
}

$('#test_cors').click(function (e) {
	/* $.get('https://www.baidu.com', function(html){
 	console.log( html);
 	alert('跨域调用成功！');
 }); */
	// var url = 'https://detail.1688.com/offer/577545270423.html';
	var url = 'https://ai.taobao.com/search/index.htm?source_id=search&key=%E5%90%95';
	$.ajax({
		type: "GET",
		url: url,
		timeout: 10000000,
		async: false,
		data: {},
		dataType: "json",
		success: function (data) {
			console.log('success');
			console.log(data);
		},
		error: function (data) {
			console.log('error');
			console.log(data);
		}
	});
});

$('#get_popup_title').click(function (e) {
	var views = chrome.extension.getViews({ type: 'popup' });
	if (views.length > 0) {
		alert(views[0].document.title);
	} else {
		alert('popup未打开！');
	}
});

// 获取当前选项卡ID
function getCurrentTabId(callback) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		if (callback) callback(tabs.length ? tabs[0].id : null);
	});
}

// 当前标签打开某个链接
function openUrlCurrentTab(url) {
	getCurrentTabId(function (tabId) {
		chrome.tabs.update(tabId, { url: url });
	});
}

// 新标签打开某个链接
function openUrlNewTab(url) {
	chrome.tabs.create({ url: url });
}

// 预留一个方法给popup调用
function testBackground() {
	alert('你好，我是background！');
}

/* 
// 是否显示图片
var showImage;
chrome.storage.sync.get({showImage: true}, function(items) {
	showImage = items.showImage;
});

// web请求监听，最后一个参数表示阻塞式，需单独声明权限：webRequestBlocking
chrome.webRequest.onBeforeRequest.addListener(function (details) {
	// cancel 表示取消本次请求
	if(!showImage && details.type == 'image') return {cancel: true};
	// 简单的音视频检测
	// 大部分网站视频的type并不是media，且视频做了防下载处理，所以这里仅仅是为了演示效果，无实际意义
	if(details.type == 'media') {
		chrome.notifications.create(null, {
			type: 'basic',
			iconUrl: 'img/icon.png',
			title: '检测到音视频',
			message: '音视频地址：' + details.url,
		});
	}
}, {urls: ["<all_urls>"]}, ["blocking"]); */

/***/ })

/******/ });
//# sourceMappingURL=background.js.map