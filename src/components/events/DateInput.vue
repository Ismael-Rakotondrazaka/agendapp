<template>
  <div class="relative w-full mb-9">
    <label for="" class="inline-block mb-1">Select the day:</label>
    <div class="border-2 rounded-md" :class="[datePickerClass]">
      <v-date-picker
        is-expanded
        v-model="date"
        :min-date="minDate"
        :disabledDates="eventStore.daysFull"
        class="custom-date-picker-for-new-event"
      >
      </v-date-picker>
    </div>
    <div
      class="absolute w-full border-2 border-t-0 rounded-md rounded-t-none"
      :class="[datePickerMessageClass]"
      v-if="error"
    >
      <p class="flex flex-row items-center px-3 py-1 text-xs text-red-700">
        <i class="mr-2">
          <fa-icon icon="warning" />
        </i>
        <span class="whitespace-pre-wrap">
          {{ error }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useReset, useDefaultReset, useValidation } from "@/utils/composables";
import { useEventStore } from "@/stores/event.js";

import { ref, computed } from "vue";

const props = defineProps({
  default: {
    type: [Date, null],
    required: false,
    default: null,
  },
  minDate: {
    type: [Date, null],
    required: false,
    default: null,
  },
  customValidators: {
    type: Array,
    required: false,
    default: () => [],
  },
  reset: {
    type: Boolean,
    required: false,
  },
});

const eventStore = useEventStore();

const emit = defineEmits(["date:valid", "date:invalid", "resettled"]);

const date = ref(props.default);

const defaultValidator = (newValue) => {
  let result = true;

  if (!newValue) {
    result = "Date is required.";
  }

  return result;
};

const { error } = useValidation(
  date,
  [...props.customValidators, defaultValidator],
  emit,
  {
    valid: "date:valid",
    invalid: "date:invalid",
  }
);

const resetData = () => (date.value = props.default);

useDefaultReset(() => props.default, [resetData]);

useReset(() => props.reset, [resetData], emit);

const datePickerClass = computed(() =>
  date.value
    ? "border-green-500 rounded-md"
    : "border-red-500 rounded-md rounded-b-none"
);

const datePickerMessageClass = computed(() =>
  date.value ? "bg-white" : "bg-red-100 border-red-300"
);
</script>

<style lang="postcss" scoped>
.custom-date-picker-for-new-event {
  border: 0;
}
</style>