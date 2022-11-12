<template>
  <CustomInput
    :modelValue="title"
    @update:modelValue="
      (newValue) => {
        title = newValue.trim();
      }
    "
    label="Title:"
    class="w-full"
    placeholder="A title"
    :status="titleStatus"
    :message="error"
  />
</template>

<script setup>
import CustomInput from "@/components/common/CustomInput.vue";
import eventConfig from "@/configs/eventConfig.json";
import { useReset, useDefaultReset, useValidation } from "@/utils/composables";

import { ref, computed } from "vue";

const props = defineProps({
  default: {
    type: String,
    required: false,
    default: "",
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

const emit = defineEmits(["title:valid", "title:invalid", "resettled"]);

const title = ref(props.default);

const defaultValidator = (newValue) => {
  let result = true;

  if (newValue.length === 0) {
    result = "Title is required.";
  } else if (newValue.length > eventConfig.EVENT_TITLE_MAX_LENGTH) {
    result = `Title too long. ${eventConfig.EVENT_TITLE_MAX_LENGTH} characters is the maximum allowed.`;
  } else if (newValue.length < eventConfig.EVENT_TITLE_MIN_LENGTH) {
    result = `Title too short. ${eventConfig.EVENT_TITLE_MAX_LENGTH} characters is the minimum allowed.`;
  }

  return result;
};

const resetData = () => {
  title.value = props.default;
};

const { error } = useValidation(
  title,
  [...props.customValidators, defaultValidator],
  emit,
  {
    valid: "title:valid",
    invalid: "title:invalid",
  }
);
useDefaultReset(() => props.default, [resetData]);
useReset(() => props.reset, [resetData], emit);

const titleStatus = computed(() => (error.value ? "danger" : "success"));
</script>

<style scoped>
</style>