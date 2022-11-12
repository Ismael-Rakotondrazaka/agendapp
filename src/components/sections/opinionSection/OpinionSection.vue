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
      What our customers say
    </h1>

    <ul class="flex flex-row flex-wrap items-start gap-y-20 justify-evenly">
      <li
        v-for="(opinion, index) in opinions"
        v-motion
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
        class="w-full px-3 sm:max-w-md"
        :key="index"
      >
        <OpinionItem
          :profileImage="opinion.profileImage"
          :fullName="opinion.fullName"
          :star="opinion.star"
          :opinion="opinion.opinion"
        />
      </li>
    </ul>
  </div>
</template>

<script setup>
import OpinionItem from "@/components/sections/opinionSection/OpinionItem.vue";
import AdellaRomaguera from "@/assets/images/opinions/adella-romaguera.jpg";
import FosterBartoletti from "@/assets/images/opinions/foster-bartoletti.jpg";
import ZackarySanford from "@/assets/images/opinions/zackary-sanford.jpg";

const opinions = [
  {
    profileImage: AdellaRomaguera,
    fullName: "Adella Romaguera",
    star: 5,
    opinion:
      "The best thing I like about Agendapp is that it keeps all the history of events. This allows me to see all I've done since I use it.",
  },
  {
    profileImage: FosterBartoletti,
    fullName: "Foster Bartoletti",
    star: 4,
    opinion:
      "As an entrepreneur, I need to manage my schedule well, and not to lose a single minute. That's why I use Agendapp, it satisfies my expectations.",
  },
  {
    profileImage: ZackarySanford,
    fullName: "Zackary Sanford",
    star: 5,
    opinion:
      "With the statistics of Agendapp, I can follow the evolution of my work. It's a very useful and complete application.",
  },
];
</script>

<style scoped>
</style>