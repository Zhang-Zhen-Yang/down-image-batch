$(function(){var o={color:"white"};chrome.storage.sync.get(o,function(o){document.body.style.backgroundColor=o.color}),$("#test_i18n").html(chrome.i18n.getMessage("helloWorld")),$("#back-url").val("55555"),chrome.storage.sync.get({url:"http://localhost:3000/receive",node:"body"},function(o){$("#back-url").val(o.url),$("#node").val(o.node)})}),$("#save-btn").on("click",function(){var o=$("#back-url").val(),e=$("#node").val();chrome.storage.sync.set({url:o,node:e},function(){chrome.notifications.create(null,{type:"basic",iconUrl:"img/icon.png",title:"这是标题",message:"保存成功"})})}),$("#open_background").click(function(o){window.open(chrome.extension.getURL("background.html"))}),chrome.storage.sync.get({ver:"1"},function(o){$("#ver").text(o.ver)});