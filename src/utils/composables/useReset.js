import { watch } from "vue";

export function useReset(source, cbs = [], emit) {
  const resetHandler = (newValue) => {
    if (newValue) {
      cbs.forEach((cb) => cb());
      emit("resettled");
    }
  };

  watch(
    source,
    resetHandler /* {
    immediate: true,
  } */
  );
}
