<template>
  <div class="min-h-screen pb-32">
    <h1
      v-motion
      :initial="{
        opacity: 0,
        x: '100vw',
      }"
      :visibleOnce="{
        opacity: 1,
        x: 0,
        textDecoration: 'none',
        transition: {
          duration: 600,
          delay: 300,
        },
      }"
      class="mb-20 text-4xl text-center text-primary"
    >
      The reasons why it's worth it
    </h1>

    <ul class="flex flex-row flex-wrap items-start gap-y-20 justify-evenly">
      <li
        v-for="(advantage, index) in advantages"
        v-motion="`advantage-${index}`"
        :initial="{
          opacity: 0,
          y: 200,
          rotate: 10,
        }"
        :visibleOnce="{
          opacity: 1,
          y: 0,
          rotate: 0,
          transition: {
            duration: 500,
            delay: index * 150,
          },
        }"
        :key="index"
        class="w-full px-3 sm:max-w-md"
      >
        <AdvantageItem
          :title="advantage.title"
          :description="advantage.description"
          :imageUrl="advantage.imageUrl"
        />
      </li>
    </ul>
  </div>
</template>

<script setup>
import AdvantageItem from "@/components/sections/reasonSection/AdvantageItem.vue";
import illustrationSimple from "@/assets/images/illustrations/illustration-simple.jpg";
import illustrationSecure from "@/assets/images/illustrations/illustration-secure.jpg";
import illustrationEffective from "@/assets/images/illustrations/illustration-effective.jpg";

import { ref } from "vue";

const advantages = ref([
  {
    title: "Simple",
    imageUrl: illustrationSimple,
    description:
      "You only need one account to manage all your time.\nYes, ALL YOUR TIME!",
  },
  {
    title: "Effective",
    imageUrl: illustrationEffective,
    description:
      "Your time is divided into a group of 15 minutes that you can associate according to your needs.\nYou can use the same account on more than one device and all changes will be synchronized instantly.",
  },
  {
    title: "Secure",
    imageUrl: illustrationSecure,
    description:
      "ONLY YOU can know the events on your agenda: what you did, what you are doing and what you plan to do.",
  },
]);
</script>

<style scoped>
</style>