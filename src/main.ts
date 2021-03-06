import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { client_id } from "./store/auth";
import { initializeApp } from "./store/app";
import { LoaderPlugin } from "vue-google-login";

Vue.config.productionTip = false;

Vue.use(LoaderPlugin, {
  client_id,
});

initializeApp();

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
