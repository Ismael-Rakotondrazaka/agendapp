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
      Interesting features
    </h1>

    <ul class="flex flex-row flex-wrap items-start gap-y-20 justify-evenly">
      <li
        v-motion="'feature-1'"
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
            delay: 1 * 150,
          },
        }"
        class="w-full px-3 sm:max-w-md"
      >
        <h2
          class="
            text-primary text-xl
            font-nunito-bold
            text-center
            underline underline-offset-4
            bg-white
            rounded-md
            p-3
            mb-3
          "
        >
          Quick navigation
        </h2>
        <v-calendar
          :attributes="attributes"
          class="!w-full custom-date-picker"
        />
      </li>
      <li
        v-motion="'feature-2'"
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
            delay: 2 * 150,
          },
        }"
        class="w-full px-3 sm:max-w-md"
      >
        <h2
          class="
            text-primary text-xl
            font-nunito-bold
            text-center
            underline underline-offset-4
            bg-white
            rounded-md
            p-3
            mb-3
          "
        >
          Overview per month
        </h2>
        <Pie
          :chart-options="{
            responsive: true,
          }"
          :chart-data="pieChartData"
          chart-id="illustration-custom-pie-chart"
          dataset-id-key="label"
          css-classes="!w-full bg-white rounded-md py-3"
        />
      </li>
      <li
        v-motion="'feature-3'"
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
            delay: 3 * 150,
          },
        }"
        class="w-full px-3 sm:max-w-md"
      >
        <h2
          class="
            text-primary text-xl
            font-nunito-bold
            text-center
            underline underline-offset-4
            bg-white
            rounded-md
            p-3
            mb-3
          "
        >
          Overview per year
        </h2>
        <Line
          :chart-options="{
            responsive: true,
          }"
          :chart-data="LineChartData"
          chart-id="illustration-custom-bar-chart"
          dataset-id-key="label"
          css-classes="!w-full bg-white rounded-md py-3"
        />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { Pie, Line } from "vue-chartjs";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PieController,
  ArcElement,
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
  PieController,
  ArcElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement
);

const attributes = [
  {
    dot: {
      style: {
        "background-color": "rgb(var(--color-success))",
        border: "2px solid white",
        "box-sizing": "content-box",
      },
    },
    dates: new Array(10)
      .fill(0)
      .map(
        () =>
          new Date(
            Date.now() +
              Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000 * -1
          )
      ),
  },
  {
    dot: {
      style: {
        "background-color": "rgb(var(--color-danger))",
        border: "2px solid white",
        "box-sizing": "content-box",
      },
    },
    dates: new Array(10)
      .fill(0)
      .map(
        () =>
          new Date(
            Date.now() +
              Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000 * -1
          )
      ),
  },
  {
    dot: {
      style: {
        "background-color": "rgb(var(--color-info))",
        border: "2px solid white",
        "box-sizing": "content-box",
      },
    },
    dates: new Array(10)
      .fill(0)
      .map(
        () =>
          new Date(
            Date.now() + Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000
          )
      ),
  },
];

const pieChartData = {
  labels: ["Completed", "Failed", "Pending"],
  datasets: [
    {
      backgroundColor: [
        "rgb(0, 197, 105)",
        "rgb(255, 10, 84)",
        "rgb(13, 117, 248)",
      ],
      borderColor: ["white"],
      data: [7, 2, 3],
    },
  ],
};

const LineChartData = {
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

<style lang="postcss" scoped>
:deep() .custom-date-picker.vc-container {
  border-radius: 0.375rem 0.375rem 0.375rem 0.375rem;
  border: 0;
  --weekday-bg: #f8fafc;
  --weekday-border: 1px solid #eaeaea;
  --day-border: 1px solid #b8c2cc;
  --day-border-highlight: 1px solid #b8c2cc;
  --weekday-bg: #f8fafc;
  --weekday-border: 1px solid #eaeaea;
  & .vc-header {
    padding: 10px 0;
  }
  & .vc-weeks {
    padding: 0;
  }
  & .vc-weekday {
    background-color: var(--weekday-bg);
    border-bottom: var(--weekday-border);
    border-top: var(--weekday-border);
    padding: 5px 0;
  }
  & .vc-day {
    padding: 5px 5px 5px 5px;
    text-align: left;
    height: var(--day-height);
    background-color: white;
    &.weekday-1,
    &.weekday-7 {
      background-color: #f1f5f8;
    }
  }
  & .is-today {
    background-color: rgb(var(--color-primary) / 0.2);
    border-radius: 0.375rem;
  }
  & .on-bottom.on-left {
    border-radius: 0 0 0 0.375rem;
  }
  & .on-bottom.on-right {
    border-radius: 0 0 0.375rem 0;
  }
}
</style>