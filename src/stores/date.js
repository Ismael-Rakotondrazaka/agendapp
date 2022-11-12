import { defineStore } from "pinia";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { isSameDay } from "@/utils/dates";

// const _date = ref(new Date());

export const useDateStore = defineStore("date", () => {
  const _date = ref(new Date());

  const isFuture = computed(
    () => (date) => date.getTime() > _date.value.getTime()
  );

  const isToday = computed(() => (date) => isSameDay(_date.value, date));

  const isYesterday = computed(
    () => (date) =>
      date.getFullYear() === _date.value.getFullYear() &&
      date.getMonth() ===
        new Date(_date.value.getTime() - 24 * 60 * 60 * 1000).getMonth() &&
      date.getDate() ===
        new Date(_date.value.getTime() - 24 * 60 * 60 * 1000).getDate()
  );

  const isSummaryPeriod = computed(() => _date.value.getHours() < 1);

  const isInSummaryPeriod = computed(
    () => (date) => isSummaryPeriod.value && isYesterday.value(date)
  );

  const resetStore = () => {
    _date.value = new Date();
  };

  const intervalId = ref(-1);

  onMounted(() => {
    intervalId.value = setInterval(() => {
      _date.value = new Date();
    }, 5000);
  });

  onUnmounted(() => {
    clearInterval(intervalId.value);
  });

  return {
    date: _date,
    isSummaryPeriod,
    isInSummaryPeriod,
    isToday,
    isYesterday,
    isFuture,
    resetStore,
  };
});
