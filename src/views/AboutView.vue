<template>
  <TheHeader class="absolute w-full top-0" />

  <main
    class="
      bg-primary/20
      min-h-screen
      flex flex-col
      items-center
      justify-center
      h-full
      w-full
    "
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
      class="hover:bg-primary max-w-md group mx-3"
    >
      <h1 class="font-nunito-bold text-2xl text-center mb-3 group-hover:text-white">
        Agendapp
      </h1>

      <p
        class="
          bg-primary/20
          border-l-4 border-primary
          px-3
          py-3
          text-slate-800
          group-hover:text-white
          group-hover:bg-white/10
          group-hover:border-white
        "
      >
        Agendapp is a web application created by
        <a
          href="https://github.com/Ismael-Rakotondrazaka"
          target="_blank"
          class="text-black font-nunito-bold hover:underline group-hover:text-white"
          >Ismael</a
        >.
        <br />
        The purpose of this application is to put into practice date
        manipulations, TypeScript, tests with Jest, and the Composition API of
        Vue.js.
      </p>
    </CardUI>
  </main>

  <TheFooter />
</template>

<script setup>
import TheHeader from "@/components/header/TheHeader.vue";
import TheFooter from "@/components/footer/TheFooter.vue";
import CardUI from "@/components/ui/CardUI.vue";
</script>

<style scoped>
</style>
