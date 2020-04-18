import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import store from './store'



Vue.config.productionTip = false
Vue.prototype.$user = {}


new Vue({
  router,
  store,
  render: h => h(App),
  created()
  {
    if(localStorage.user && localStorage.user.Name) this.$user = JSON.parse(localStorage.user);
  }
}).$mount('#app')
