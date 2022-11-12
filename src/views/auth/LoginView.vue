<template>
  <TheHeader class="absolute w-full top-0" />

  <main class="pt-16 md:pt-28 bg-primary/20 min-h-screen">
    <div
      class="
        flex flex-row flex-wrap
        lg:flex-nowrap
        items-center
        justify-evenly
        pb-32
        px-3
        md:px-16
        lg:px-32
        gap-x-20 gap-y-20
        min-h-screen
      "
    >
      <div class="w-full md:w-2/3 lg:w-1/2 xl:w-1/3 py-7">
        <div
          v-motion
          :initial="{
            opacity: 0,
            y: '100vh',
          }"
          :enter="{
            opacity: 1,
            y: 0,
            transition: {
              duration: 600,
              delay: 200,
            },
          }"
          class="mb-7"
        >
          <h1 class="text-2xl">Hi, welcome back</h1>

          <p>Hurry to fill out the form and no longer lose your time.</p>
        </div>

        <StartSession
          @session:started="sessionStartedHandler"
          :reset="reset"
          @resettled="resettledHandler"
        />
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
            duration: 1000,
            delay: 400,
          },
        }"
        class="
          relative
          absolutef
          inset-0
          w-3/4
          transition-all
          duration-1000
          lg:staticf
          opacity-70
          lg:opacity-100
          -z-10
          lg:w-1/3
        "
      >
        <Pie
          :chart-options="{
            responsive: true,
          }"
          :chart-data="chartData"
          chart-id="illustration-pie-chart"
          dataset-id-key="label"
          css-classes="md:w-2/3p w-fullp"
        />
        <img
          v-motion
          :initial="{
            scale: 1,
          }"
          :enter="{
            scale: 1.2,
            transition: {
              repeat: Infinity,
              repeatType: 'mirror',
              duration: 1500,
            },
          }"
          src="@/assets/images/illustrations/blob.svg"
          alt="blob"
          class="absolute -top-20 -left-10 w-40 z-[-1]"
        />
        <img
          v-motion
          :initial="{
            x: 10,
            y: -10,
          }"
          :enter="{
            x: 0,
            y: 0,
            transition: {
              repeat: Infinity,
              repeatType: 'mirror',
              duration: 1500,
              delay: 400,
            },
          }"
          src="@/assets/images/illustrations/blob-1.svg"
          alt="blob"
          class="absolute top-0 -right-10 w-28 z-[-1]"
        />
        <figure>
          <img
            v-motion
            :initial="{
              rotate: 0,
            }"
            :enter="{
              rotate: 360,
              transition: {
                repeat: Infinity,
                repeatType: 'mirror',
                duration: 5000,
                // delay: 400,
              },
            }"
            src="@/assets/images/illustrations/blob-2.svg"
            alt="blob"
            class="absolute -bottom-24 -left-16 w-28 z-[-1]"
          />

          <caption
            class="text-center text-black w-full mt-7 text-lg inline-block"
          >
            Dynamic chart of events' status per month
          </caption>
        </figure>
      </div>
    </div>
  </main>

  <TheFooter />
</template>

<script setup>
import TheHeader from "@/components/header/TheHeader.vue";
import TheFooter from "@/components/footer/TheFooter.vue";
import StartSession from "@/components/sessions/StartSession.vue";

import { onMounted, ref, onUnmounted, computed } from "vue";
import { Pie } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
} from "chart.js";
ChartJS.register(Title, Tooltip, Legend, PieController, ArcElement);

const reset = ref(false);

const sessionStartedHandler = () => {
  reset.value = true;
};

const completedCount = ref(3);
const failedCount = ref(2);
const pendingCount = ref(5);

const chartData = computed(() => ({
  labels: ["Completed", "Failed", "Pending"],
  datasets: [
    {
      backgroundColor: [
        "rgb(0, 197, 105)",
        "rgb(255, 10, 84)",
        "rgb(13, 117, 248)",
      ],
      borderColor: ["white"],
      data: [failedCount.value, failedCount.value, pendingCount.value],
    },
  ],
}));

const timeoutId = ref(-1);

const resettledHandler = () => {
  reset.value = false;
};

onMounted(() => {
  timeoutId.value = setInterval(() => {
    completedCount.value = Math.floor(Math.random() * 10);
    failedCount.value = Math.floor(Math.random() * 10);
    pendingCount.value = Math.floor(Math.random() * 10);
  }, 5000);
});

onUnmounted(() => {
  clearInterval(timeoutId);
});
</script>

<style scoped>
</style>