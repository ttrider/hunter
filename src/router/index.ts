import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import Schedule from "../views/Schedule.vue";
import Log from "../views/Log.vue";
import Profile from "../views/Profile.vue";
import Companies from "../views/Companies.vue";
import Company from "../views/Company.vue";
import Contact from "../views/Contact.vue";
import NewContact from "../views/NewContact.vue";
import Contacts from "../views/Contacts.vue";

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
    path: "/companies/:id/contacts",
    name: "CompanyContacts",
    component: Contacts,
  },
  {
    path: "/companies/:id/newcontact",
    name: "CompanyNewContact",
    component: NewContact,
  },
  {
    path: "/contacts",
    name: "Contacts",
    component: Contacts,
  },
  {
    path: "/contacts/:id",
    name: "Contact",
    component: Contact,
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
