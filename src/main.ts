import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

// ClientID: 138993422227-h19aliqjhes1rmqcvnkkufsaiq7r9gv5.apps.googleusercontent.com
// Client Secret: jCaNUxKkXBZPHFJEBkX-UcvR

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
