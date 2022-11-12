import { watch } from "vue";

export function useDefaultReset(defaultValue, cbs = []) {
  const resetDefaultHandler = (newValue) => cbs.forEach((cb) => cb(newValue));

  watch(defaultValue, resetDefaultHandler, {
    immediate: true,
  });
}
