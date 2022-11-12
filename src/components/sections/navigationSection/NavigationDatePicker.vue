<template>
  <div class="w-full text-center section border border-slate-400 rounded-md shadow-md">
    <div>
      <button
        class="
          w-full
          py-3
          font-bold
          text-slate-8
          bg-primary
          text-white
          hover:underline
          underline-offset-4
          rounded-t-md
        "
        @click="jumpToTodayHandler"
      >
        Jump to today
      </button>
    </div>

    <v-date-picker
      v-model="selectionStore.date"
      :attributes="attributes"
      color="purple"
      show-weeknumbers
      is-expanded
      class="border-0 custom-date-picker"
      ref="customDatePicker"
    ></v-date-picker>
  </div>
</template>

<script setup>
import { useEventStore } from "@/stores/event.js";
import { useSelectionStore } from "@/stores/selection.js";
import { useDateStore } from "@/stores/date.js";

import { ref, computed } from "vue";

const statusDates = computed(() => {
  const result = {
    completed: [],
    failed: [],
    pending: [],
  };

  const keyExcluded = ["failedCount", "pendingCount", "completedCount"];

  for (const yearKey in eventStore.sortedEvents) {
    if (
      !keyExcluded.includes(yearKey) &&
      Object.hasOwnProperty.call(eventStore.sortedEvents, yearKey)
    ) {
      for (const monthKey in eventStore.sortedEvents[yearKey]) {
        if (
          !keyExcluded.includes(monthKey) &&
          Object.hasOwnProperty.call(eventStore.sortedEvents[yearKey], monthKey)
        ) {
          for (const dateKey in eventStore.sortedEvents[yearKey][monthKey]) {
            if (
              !keyExcluded.includes(dateKey) &&
              Object.hasOwnProperty.call(
                eventStore.sortedEvents[yearKey][monthKey],
                dateKey
              )
            ) {
              const countKeyResultKey = {
                failedCount: "failed",
                completedCount: "completed",
                pendingCount: "pending",
              };

              for (const countKey in countKeyResultKey) {
                if (Object.hasOwnProperty.call(countKeyResultKey, countKey)) {
                  if (
                    eventStore.sortedEvents[yearKey][monthKey][dateKey][
                      countKey
                    ] > 0
                  ) {
                    const dateArgs = dateKey.split("-");

                    result[countKeyResultKey[countKey]].push(
                      new Date(dateArgs[0], dateArgs[1] - 1, dateArgs[2])
                    );
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return result;
});

const attributes = computed(() => [
  {
    dot: {
      style: {
        "background-color": "rgb(var(--color-success))",
        border: "2px solid white",
        "box-sizing": "content-box",
      },
    },
    dates: statusDates.value.completed,
  },
  {
    dot: {
      style: {
        "background-color": "rgb(var(--color-danger))",
        border: "2px solid white",
        "box-sizing": "content-box",
      },
    },
    dates: statusDates.value.failed,
  },
  {
    dot: {
      style: {
        "background-color": "rgb(var(--color-info))",
        border: "2px solid white",
        "box-sizing": "content-box",
      },
    },
    dates: statusDates.value.pending,
  },
]);

const eventStore = useEventStore();
const selectionStore = useSelectionStore();
const dateStore = useDateStore();

const customDatePicker = ref(null);

async function jumpToTodayHandler() {
  await customDatePicker.value?.focusDate(dateStore.date); // ! seems it doesn't focus on date, so we change it manually in the following line
  selectionStore.date = new Date(dateStore.date);
}
</script>

<style lang="postcss" scoped>
:deep() .custom-date-picker.vc-container {
  border-radius: 0 0 0.375rem 0.375rem;
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