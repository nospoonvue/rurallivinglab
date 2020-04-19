import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from './router'
import store from './store'



Vue.config.productionTip = false
Vue.prototype.$baseUrl = "https://script.google.com/macros/s/AKfycbxdxAaP33kUP1kO0J4TOHKdz6FMoiIVPCqQvrGaoNfrWbAeJiY/exec"



new Vue({
  router,
  store,
  render: h => h(App),
  created()
  {


 
  },
  mounted()
  {

  }
}).$mount('#app')
