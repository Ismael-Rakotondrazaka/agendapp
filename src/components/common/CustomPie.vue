<template>
  <div
    class="
      bg-white
      border-del
      flex flex-col
      items-center
      justify-center
      border-slate-400-del
      pt-7
      pb-10
    "
  >
    <h2 class="mb-7 px-3 text-lg text-slate-800 font-rubik-bold">{{ title }}</h2>
    <Pie
      :chart-options="chartOptions"
      :chart-data="chartData"
      chart-id="custom-pie-chart"
      dataset-id-key="label"
      css-classes="md:w-2/3 w-full"
    />
  </div>
</template>

<script setup>
import { useOverviewStore } from "@/stores/overview.js";
import { useEventStore } from "@/stores/event.js";

import { ref, computed } from "vue";

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

const overviewStore = useOverviewStore();
const eventStore = useEventStore();

const title = computed(() => {
  const months = [
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
  ];

  return `Overview of the month of ${months[overviewStore.page.month - 1]} ${
    overviewStore.page.year
  }`;
});

const chartData = computed(() => {
  const yearKey = `${overviewStore.page.year}`;
  const monthKey = `${overviewStore.page.year}-${overviewStore.page.month
    .toString()
    .padStart(2, "0")}`;

  let result;

  if (eventStore.sortedEvents?.[yearKey]?.[monthKey]) {
    result = {
      labels: ["Completed", "Failed", "Pending"],
      datasets: [
        {
          backgroundColor: [
            "rgb(0, 197, 105)",
            "rgb(255, 10, 84)",
            "rgb(13, 117, 248)",
            // "white",
          ],
          borderColor: ["white"],
          data: [
            eventStore.sortedEvents[yearKey][monthKey].completedCount,
            eventStore.sortedEvents[yearKey][monthKey].failedCount,
            eventStore.sortedEvents[yearKey][monthKey].pendingCount,
            // 0,
          ],
        },
      ],
    };
  } else {
    result = {
      labels: ["Empty"],
      datasets: [
        {
          backgroundColor: ["white"],
          borderColor: ["black"],
          data: [1],
        },
      ],
    };
  }

  return result;
});

const chartOptions = ref({
  responsive: true,
});
</script>

<style scoped>
</style>