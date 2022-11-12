import { ref, watch } from "vue";

export function useValidation(
  source,
  cbs = [],
  emit,
  events = {
    valid: "valid",
    invalid: "invalid",
  }
) {
  const error = ref(null);

  const validationHandler = (newValue) => {
    let result = true;

    for (let i = 0; i < cbs.length; i++) {
      const validOrErrorMessage = cbs[i](newValue);

      // get an error message
      if (validOrErrorMessage !== true) {
        result = validOrErrorMessage;
        break;
      }
    }

    if (result === true) {
      emit(events.valid, newValue);
      error.value = null;
    } else {
      emit(events.invalid, result);
      error.value = result;
    }
  };

  watch(source, validationHandler, {
    immediate: true,
  });

  return {
    error,
  };
}
