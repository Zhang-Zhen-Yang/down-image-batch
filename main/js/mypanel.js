!function(e){function n(o){if(t[o])return t[o].exports;var c=t[o]={i:o,l:!1,exports:{}};return e[o].call(c.exports,c,c.exports,n),c.l=!0,c.exports}var t={};n.m=e,n.c=t,n.i=function(e){return e},n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="/main/js/",n(n.s=16)}({16:function(e,n){document.getElementById("check_jquery").addEventListener("click",function(){chrome.devtools.inspectedWindow.eval("jQuery.fn.jquery",function(e,n){var t="";t=n?"当前页面没有使用jQuery。":"当前页面使用了jQuery，版本为："+e,alert(t)})}),document.getElementById("open_resource").addEventListener("click",function(){chrome.devtools.inspectedWindow.eval("window.location.href",function(e,n){chrome.devtools.panels.openResource(e,20,function(){console.log("资源打开成功！")})})}),document.getElementById("test_inspect").addEventListener("click",function(){chrome.devtools.inspectedWindow.eval("inspect(document.images[0])",function(e,n){})}),document.getElementById("get_all_resources").addEventListener("click",function(){chrome.devtools.inspectedWindow.getResources(function(e){alert(JSON.stringify(e))})})}});
//# sourceMappingURL=mypanel.js.map