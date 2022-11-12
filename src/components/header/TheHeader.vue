<template>
  <transition
    :css="false"
    @leave="(el, done) => motions.theHeaderMotion.leave(done)"
  >
    <header
      v-motion="'theHeaderMotion'"
      :initial="{
        opacity: 0,
        y: -100,
      }"
      :enter="{
        opacity: 1,
        y: 0,
        transition: {
          duration: 600,
          delay: 300,
        },
      }"
      :leave="{
        opacity: 0,
        y: -100,
        transition: {
          duration: 600,
          delay: 300,
        },
      }"
      class="
        flex flex-row
        items-center
        md:justify-between
        justify-center
        py-4
        px-3
        md:px-[5%]
        lg:px-[10%]
      "
    >
      <i class="hidden w-8 md:block">
        <img src="@/assets/images/logo.svg" alt="" class="w-full" />
      </i>

      <nav>
        <ul
          class="flex flex-row items-center justify-between gap-x-5 md:gap-x-10"
        >
          <NavLinkItem v-for="link in links" :to="link.to" :key="link.to.name">
            {{ link.text }}
          </NavLinkItem>
        </ul>
      </nav>
    </header>
  </transition>
</template>

<script setup>
import NavLinkItem from "@/components/header/NavLinkItem.vue";
import { useTokenStore } from "@/stores/token.js";

import { computed } from "vue";
import { useMotions } from "@vueuse/motion";

const motions = useMotions();

const tokenStore = useTokenStore();

const links = computed(() =>
  tokenStore.hasRefreshToken
    ? [
        {
          to: {
            name: "home",
          },
          text: "Home",
        },
        {
          to: {
            name: "dashboard",
          },
          text: "Dashboard",
        },
        {
          to: {
            name: "about",
          },
          text: "About",
        },
      ]
    : [
        {
          to: {
            name: "home",
          },
          text: "Home",
        },
        {
          to: {
            name: "register",
          },
          text: "Register",
        },
        {
          to: {
            name: "login",
          },
          text: "Login",
        },
        {
          to: {
            name: "about",
          },
          text: "About",
        },
      ]
);
</script>

<style scoped>
</style>