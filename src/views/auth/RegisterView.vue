<template>
  <TheHeader class="absolute top-0 z-10 w-full" />

  <main class="min-h-screen pt-16 md:pt-28 bg-primary/20">
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
          <h1 class="text-2xl">Hi, welcome to Agendapp</h1>

          <p>Fill out the form and start using Agendapp.</p>
        </div>

        <RegisterUser
          @user:registered="userRegisteredHandler"
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
        <Line
          :chart-options="{
            responsive: true,
          }"
          :chart-data="chartData"
          chart-id="illustration-line-chart"
          dataset-id-key="label"
          css-classes="md:w-2/3p w-fullp"
          class="bg-white rounded-md"
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
              },
            }"
            src="@/assets/images/illustrations/blob-2.svg"
            alt="blob"
            class="absolute -bottom-24 -left-16 w-28 z-[-1]"
          />

          <caption
            class="text-center text-black w-full mt-7 text-lg inline-block"
          >
            Overview per year with dynamic chart
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
import RegisterUser from "@/components/users/RegisterUser.vue";

import { ref } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement
);

const reset = ref(false);

const userRegisteredHandler = () => {
  reset.value = true;
};

const resettledHandler = () => {
  reset.value = false;
};

const chartData = {
  labels: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
  datasets: [
    {
      label: "Completed",
      backgroundColor: "green",
      borderColor: "rgb(0, 197, 105)",
      data: [10, 12, 9, 7, 15, 10, 5, 3, 3, 0, 0, 0],
      tension: 0.1,
    },
    {
      label: "Failed",
      backgroundColor: "red",
      borderColor: "rgb(255, 10, 84)",
      data: [2, 3, 5, 0, 0, 2, 0, 1, 0, 0, 0, 0],
      tension: 0.1,
    },
    {
      label: "Pending",
      backgroundColor: "blue",
      borderColor: "rgb(13, 117, 248)",
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 6, 6],
      tension: 0.1,
    },
  ],
};
</script>

<style scoped>
</style>