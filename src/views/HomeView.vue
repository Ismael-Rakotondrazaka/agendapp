<template>
  <TheHeader class="absolute top-0 z-10 w-full" />

  <main class="min-h-screen bg-primary/20">
    <div
      class="
        relative
        flex flex-row flex-wrap
        items-center
        min-h-screen
        mb-32
        md:flex-nowrap
        justify-evenly
        gap-y-5
      "
    >
      <div class="w-full px-3 lg:max-w-md md:w-1/2 lg:w-1/3">
        <h1
          v-motion
          :initial="{ opacity: 0, y: '100vh' }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              duration: 600,
              delay: 200,
            },
          }"
          class="mb-5 text-5xl font-nunito-bold"
        >
          Keep your time in your hands.
        </h1>

        <p
          v-motion
          :initial="{ opacity: 0, y: '100vh' }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              duration: 600,
              delay: 300,
            },
          }"
          class="mb-3 text-lg text-slate-800"
        >
          Don't know how to manage your schedule or how to do it? Agendapp to
          the rescue! We offer an app that will make your life easier.
        </p>

        <LinkButtonUI
          v-motion
          :initial="{ opacity: 0, y: '100vh' }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              duration: 600,
              delay: 400,
            },
          }"
          :to="{
            name: 'register',
          }"
        >
          Let's get started
        </LinkButtonUI>
      </div>

      <div
        v-motion
        :initial="{
          opacity: 0,
          scale: 0.5,
        }"
        :enter="{
          opacity: 1,
          scale: 1,
          transition: {
            duration: 600,
          },
        }"
        class="
          absolute
          inset-0
          w-full
          transition-all
          duration-1000
          lg:static
          opacity-70
          lg:opacity-100
          -z-10
          lg:w-1/3
        "
      >
        <img
          src="@/assets/images/illustrations/illustration-sand-timer.webp"
          alt=""
          class="object-cover w-full h-full"
        />
      </div>
    </div>

    <ReasonSection />

    <FeatureSection />

    <OpinionSection />
  </main>

  <TheFooter />
</template>

<script setup>
import TheHeader from "@/components/header/TheHeader.vue";
import LinkButtonUI from "@/components/ui/LinkButtonUI.vue";
import TheFooter from "@/components/footer/TheFooter.vue";
import ReasonSection from "@/components/sections/reasonSection/ReasonSection.vue";
import FeatureSection from "@/components/sections/featureSection/FeatureSection.vue";
import OpinionSection from "@/components/sections/opinionSection/OpinionSection.vue";
</script>

<style scoped>
</style>