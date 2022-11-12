<template>
  <div class="pb-10 bg-white border rounded-md border-slate-400 pt-7 shadow-md">
    <h2 class="px-3 text-lg font-bold text-center mb-7 text-slate-800">
      {{ title }}
    </h2>

    <Line
      :chart-options="chartOptions"
      :chart-data="chartData"
      chart-id="custom-bar-chart"
      dataset-id-key="label"
      css-classes="w-full"
    />
  </div>
</template>

<script setup>
import { useOverviewStore } from "@/stores/overview.js";
import { useEventStore } from "@/stores/event.js";

import { ref, computed } from "vue";

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

const title = computed(() => `Overview of the year ${overviewStore.page.year}`);

const statusData = computed(() => {
  let result = {
    completed: new Array(12).fill(0),
    failed: new Array(12).fill(0),
    pending: new Array(12).fill(0),
  };

  const yearKey = `${overviewStore.page.year}`;

  if (eventStore.sortedEvents?.[yearKey]) {
    for (let i = 0; i < 12; i++) {
      const monthKey = `${yearKey}-${(i + 1).toString().padStart(2, "0")}`;

      if (eventStore.sortedEvents[yearKey][monthKey]) {
        const resultKeyMonthKey = {
          completed: "completedCount",
          failed: "failedCount",
          pending: "pendingCount",
        };

        for (const resultKey in resultKeyMonthKey) {
          if (Object.hasOwnProperty.call(resultKeyMonthKey, resultKey)) {
            result[resultKey][i] =
              eventStore.sortedEvents[yearKey][monthKey][
                resultKeyMonthKey[resultKey]
              ];
          }
        }
      }
    }
  } else {
    result = {
      completed: [],
      failed: [],
      pending: [],
    };
  }

  return result;
});

const chartData = computed(() => ({
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
      data: statusData.value.completed,
      tension: 0.1,
    },
    {
      label: "Failed",
      backgroundColor: "red",
      borderColor: "rgb(255, 10, 84)",
      data: statusData.value.failed,
      tension: 0.1,
    },
    {
      label: "Pending",
      backgroundColor: "blue",
      borderColor: "rgb(13, 117, 248)",
      data: statusData.value.pending,
      tension: 0.1,
    },
  ],
}));

const overviewStore = useOverviewStore();
const eventStore = useEventStore();

const chartOptions = ref({
  responsive: true,
});
</script>

<style scoped>
</style>