import Vue from "vue";
import VueRouter from "vue-router";

import guestRoutes from "./guest";

Vue.use(VueRouter);

const routes = [...guestRoutes];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
