<template>
  <TheHeader class="absolute top-0 w-full" />

  <main
    class="flex flex-col items-center justify-center w-full h-full min-h-screen  bg-primary/20"
  >
    <CardUI
      v-motion
      :initial="{
        opacity: 0,
        scale: 0.5,
      }"
      :enter="{
        opacity: 1,
        scale: 1,
        transition: {
          // duration: 5000,
          type: 'spring',
          stiffness: 250,
          damping: 5,
          mass: 0.5,
          delay: 500,
        },
      }"
      class="max-w-md mx-3 hover:bg-primary group"
    >
      <h1
        class="mb-3 text-2xl text-center  font-nunito-bold text-danger group-hover:text-white"
      >
        <i class="mr-3">
          <fa-icon icon="warning" />
        </i>
        Not found
      </h1>

      <p
        class="px-3 py-3 border-l-4  bg-danger/20 border-danger text-danger group-hover:text-white group-hover:bg-white/10 group-hover:border-white"
      >
        The link
        <a
          :href="url"
          class="text-danger font-nunito-bold hover:underline group-hover:text-white"
        >
          {{ url }}
        </a>
        is not found.
      </p>
    </CardUI>
  </main>

  <TheFooter />
</template>

<script setup>
import TheHeader from "@/components/header/TheHeader.vue";
import TheFooter from "@/components/footer/TheFooter.vue";
import CardUI from "@/components/ui/CardUI.vue";

import { computed } from "vue";

const url = computed(() => document.URL);
</script>

<style scoped>
</style>
