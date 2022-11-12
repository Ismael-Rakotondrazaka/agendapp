import HomeView from "../views/HomeView.vue";
import LoginView from "../views/auth/LoginView.vue";
import RegisterView from "../views/auth/RegisterView.vue";
import DashboardView from "../views/DashboardView.vue";
import AboutView from "../views/AboutView.vue";
import { useTokenStore } from "../stores/token";

import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      title: "Agendapp | Keep your time in your hands",
    },
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
    meta: {
      title: "Agendapp | About",
    },
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: {
      title: "Agendapp | Login",
    },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
    meta: {
      title: "Agendapp | Register",
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: {
      title: "Agendapp | Dashboard",
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

const authRoutes = ["dashboard"];
const unauthRoutes = ["login", "register"];
const unauthRedirectTo = "login";
const authRedirectTo = "dashboard";

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;

  const tokenStore = useTokenStore();

  let nextLocation = {
    ...to,
  };

  if (authRoutes.includes(to.name)) {
    if (!tokenStore.hasRefreshToken) {
      nextLocation = unauthRedirectTo;
    }
  } else if (unauthRoutes.includes(to.name)) {
    if (tokenStore.hasRefreshToken) {
      nextLocation = authRedirectTo;
    }
  }

  if (nextLocation.name !== to.name) {
    next(nextLocation);
  } else {
    next();
  }
});

export default router;
