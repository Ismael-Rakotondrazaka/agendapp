<template>
  <CustomRadioInput
    :values="['normal', 'important']"
    :labels="['Normal', 'Important']"
    prefix="update-event"
    @update:modelValue="(newValue) => (level = newValue)"
    label="Select level:"
    :default="props.default"
  />
</template>

<script setup>
import CustomRadioInput from "@/components/common/CustomRadioInput.vue";
import { useReset, useDefaultReset, useValidation } from "@/utils/composables";

import { ref } from "vue";

const props = defineProps({
  default: {
    type: String,
    required: false,
    default: "normal",
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

const emit = defineEmits(["level:valid", "level:invalid", "resettled"]);

const level = ref(props.default);

const defaultValidator = () => {
  return true;
};

const resetData = () => (level.value = props.default);

const { error } = useValidation(
  level,
  [...props.customValidators, defaultValidator],
  emit,
  {
    valid: "level:valid",
    invalid: "level:invalid",
  }
);

useDefaultReset(() => props.default, [resetData]);
useReset(() => props.reset, [resetData], emit);
</script>

<style scoped>
</style>