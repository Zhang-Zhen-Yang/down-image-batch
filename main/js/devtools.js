!function(e){function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}var t={};n.m=e,n.c=t,n.i=function(e){return e},n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:o})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="/main/js/",n(n.s=17)}({17:function(e,n){chrome.devtools.panels.create("MyPanel","img/icon.png","mypanel.html",function(e){console.log("自定义面板创建成功！")}),chrome.devtools.panels.elements.createSidebarPane("Images",function(e){e.setExpression('document.querySelectorAll("img")',"All Images")})}});
//# sourceMappingURL=devtools.js.map