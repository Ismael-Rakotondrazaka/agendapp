import { defineStore } from "pinia";
import { ref } from "vue";

export const useOverviewStore = defineStore("overview", () => {
  const page = ref({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });

  const resetStore = () => {
    page.value = {
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    };
  };

  return {
    page,
    resetStore,
  };
});
