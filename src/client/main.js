/*
 * @Author: zhangzhenyang 
 * @Date: 2020-06-06 08:46:27 
 * @Last Modified by: zhangzhenyang
 * @Last Modified time: 2020-06-06 15:44:04
 */
import Vue from 'vue'
import App from './App.vue'
import rootStore from './store/store.js';
import Vuex from 'vuex';
import util from './util';
import widget from './widgets/widgets';
Vue.use(widget);

// 只有在相关的网站才显示下载界面
if(util.shouldInjectDom()) {
  Vue.use(Vuex);
  const store = new Vuex.Store(rootStore);
  
  let hostView = document.createElement('div');
  hostView.setAttribute('id', 'app');
  document.body.appendChild(hostView);
  
  
  window.project = new Vue({
    el: '#app',
    store,
    render: h => h(App)
  })
  console.log('2020-06-06 08:46:27');

}

/* util.notifyStatus('progress');
setTimeout(()=>{
  util.notifyStatus('success');
  window.notify('', '', '获取完成', `user:ohisashiburi`);       
}, 2000) 
 */