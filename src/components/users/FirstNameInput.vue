<template>
  <CustomInput
    :modelValue="firstName"
    @update:modelValue="
      (newValue) => {
        firstName = newValue.trim();
      }
    "
    label="First name:"
    class="w-full"
    placeholder="John"
    :status="firstNameStatus"
    :message="error"
    icon="a"
  />
</template>

<script setup>
import CustomInput from "@/components/common/CustomInput.vue";
import userConfig from "@/configs/userConfig.json";
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

const emit = defineEmits(["firstName:valid", "firstName:invalid", "resettled"]);

const firstName = ref(props.default);

const defaultValidator = (newValue) => {
  let result = true;

  if (newValue.length === 0) {
    result = "First name is required.";
  } else if (newValue.length > userConfig.FIRST_NAME_MAX_LENGTH) {
    result = `First name too long. ${userConfig.FIRST_NAME_MAX_LENGTH} characters is the maximum allowed.`;
  } else if (newValue.length < userConfig.FIRST_NAME_MIN_LENGTH) {
    result = `First name too short. ${userConfig.FIRST_NAME_MAX_LENGTH} characters is the minimum allowed.`;
  }

  return result;
};

const resetData = () => {
  firstName.value = props.default;
};

const { error } = useValidation(
  firstName,
  [...props.customValidators, defaultValidator],
  emit,
  {
    valid: "firstName:valid",
    invalid: "firstName:invalid",
  }
);
useDefaultReset(() => props.default, [resetData]);
useReset(() => props.reset, [resetData], emit);

const firstNameStatus = computed(() => (error.value ? "danger" : "success"));
</script>

<style scoped>
</style>