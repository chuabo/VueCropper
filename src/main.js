import Vue from 'vue'
import App from './App.vue'

import axios from 'axios';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Element);

Vue.config.productionTip = false
Vue.prototype.$http = axios;

new Vue({
  render: h => h(App),
}).$mount('#app')
