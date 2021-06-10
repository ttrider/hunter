import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Schedule from "../views/Schedule.vue";
import Log from "../views/Log.vue";
import Profile from "../views/Profile.vue";
import Companies from "../views/Companies.vue";
import Company from "../views/Company.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/schedule",
    name: "Schedule",
    component: Schedule,
  },
  {
    path: "/companies",
    name: "Companies",
    component: Companies,
  },
  {
    path: "/companies/:id",
    name: "Company",
    component: Company,
  },
  {
    path: "/log",
    name: "Log",
    component: Log,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
