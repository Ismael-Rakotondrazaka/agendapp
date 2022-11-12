<template>
  <footer class="pt-5 md:pt-16 bg-primary/50 pb-5 md:pb-14">
    <div
      class="flex flex-row flex-wrap md:flex-nowrap mb-5 justify-evenly gap-y-5"
    >
      <div class="w-full md:w-max px-3">
        <h2
          class="
            mb-1
            text-2xl
            font-nunito-bold
            text-white
            underline underline-white underline-offset-4
          "
        >
          Links
        </h2>

        <ul>
          <FooterLinkItem
            v-for="(link, index) in links"
            :key="index"
            :to="link.to"
            v-motion
            :initial="{
              opacity: 0,
              x: index % 2 == 0 ? 50 : -50,
            }"
            :visibleOnce="{
              opacity: 1,
              x: 0,
              transition: {
                duration: 600,
                delay: index * 150,
              },
            }"
          >
            {{ link.text }}
          </FooterLinkItem>
        </ul>
      </div>

      <div class="w-full md:w-max px-3">
        <h2
          class="
            mb-1
            text-2xl
            font-nunito-bold
            text-white
            underline underline-white underline-offset-4
          "
        >
          Contact
        </h2>

        <ul>
          <FooterContactItem
            v-for="(contact, index) in contacts"
            :faIcon="contact.faIcon"
            :text="contact.text"
            :href="contact.href"
            :key="index"
            v-motion
            :initial="{
              opacity: 0,
              x: index % 2 == 0 ? -50 : 50,
            }"
            :visibleOnce="{
              opacity: 1,
              x: 0,
              transition: {
                duration: 600,
                delay: index * 150,
              },
            }"
          />
        </ul>
      </div>
    </div>

    <p
      v-motion
      :initial="{
        opacity: 0,
        y: 20,
      }"
      :visibleOnce="{
        opacity: 1,
        y: 0,
        transition: {
          duration: 600,
          delay: 150,
        },
      }"
      class="text-center"
    >
      &copy; Copyright
      <a
        href="https://github.com/Ismael-Rakotondrazaka"
        target="_blank"
        class="text-white text-lg hover:underline"
        >Ismael</a
      >
      2022
    </p>
  </footer>
</template>

<script setup>
import FooterLinkItem from "@/components/footer/FooterLinkItem.vue";
import FooterContactItem from "@/components/footer/FooterContactItem.vue";
import facebookIcon from "@/assets/icons/facebook.svg";
import githubIcon from "@/assets/icons/github.svg";

import { ref } from "vue";

const links = ref([
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
]);

const contacts = ref([
  {
    iconUrl: facebookIcon,
    faIcon: "fa-brands fa-facebook",
    text: "Agendapp page",
    href: "https://www.facebook.com",
  },
  {
    iconUrl: githubIcon,
    faIcon: "fa-brands fa-github",
    text: "Agendapp maintainer",
    href: "https://github.com/Ismael-Rakotondrazaka",
  },
]);
</script>

<style scoped>
</style>