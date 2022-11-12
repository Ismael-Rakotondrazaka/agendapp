import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useDateStore } from "./date";

export const useSelectionStore = defineStore("selection", () => {
  const dateStore = useDateStore();

  const date = ref(new Date());

  const hasSelection = computed(() => (date.value ? true : false));

  const isToday = computed(() =>
    hasSelection.value ? dateStore.isToday(date.value) : false
  );

  const resetStore = () => {
    date.value = new Date();
  };

  return {
    date,
    hasSelection,
    isToday,
    resetStore,
  };
});
