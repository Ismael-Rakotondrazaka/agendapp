import { createApp } from "vue";
import App from "./App.vue";
const app = createApp(App);

import "./assets/styles/index.css";
import "v-calendar/dist/style.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import * as fontAwesomeSolid from "./assets/icons/fontAwesomeSolid.js";
import fontAwesomeBrands from "./assets/icons/fontAwesomeBrands.js";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add({
  ...fontAwesomeSolid,
  ...fontAwesomeBrands,
});
app.component("fa-icon", FontAwesomeIcon);

import VCalendar from "v-calendar";
app.use(VCalendar);

import { createPinia } from "pinia";
const pinia = createPinia();
import piniaPersistedState from "pinia-plugin-persistedstate";
pinia.use(piniaPersistedState);
app.use(pinia);

import { MotionPlugin } from "@vueuse/motion";
app.use(MotionPlugin);

import router from "./router";
app.use(router);

app.mount("#app");
