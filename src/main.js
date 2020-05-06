import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { createProvider } from "./plugins/vue-apollo/vue-apollo";
import vuetify from "./plugins/vuetify/vuetify";
import vuelidate from "vuelidate";

Vue.config.productionTip = false;
Vue.use(vuelidate);

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  vuetify,
  render: h => h(App)
}).$mount("#app");
