import Vue from 'vue'
import App from './App.vue'
import rootStore from './store/store.js';
import Vuex from 'vuex';
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