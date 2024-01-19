import Vue from "vue";
import App from "./App.vue";
import 'element-ui/lib/theme-chalk/index.css';
import { Cascader } from 'element-ui'
Vue.use(Cascader);
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
