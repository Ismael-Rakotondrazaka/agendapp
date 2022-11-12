<template>
  <CustomInput
    :modelValue="lastName"
    @update:modelValue="
      (newValue) => {
        lastName = newValue.trim();
      }
    "
    label="Last name:"
    class="w-full"
    placeholder="Wilson"
    :status="lastNameStatus"
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

const emit = defineEmits(["lastName:valid", "lastName:invalid", "resettled"]);

const lastName = ref(props.default);

const defaultValidator = (newValue) => {
  let result = true;

  if (newValue.length === 0) {
    result = "Last name is required.";
  } else if (newValue.length > userConfig.LAST_NAME_MAX_LENGTH) {
    result = `Last name too long. ${userConfig.LAST_NAME_MAX_LENGTH} characters is the maximum allowed.`;
  } else if (newValue.length < userConfig.LAST_NAME_MIN_LENGTH) {
    result = `Last name too short. ${userConfig.LAST_NAME_MAX_LENGTH} characters is the minimum allowed.`;
  }

  return result;
};

const resetData = () => {
  lastName.value = props.default;
};

const { error } = useValidation(
  lastName,
  [...props.customValidators, defaultValidator],
  emit,
  {
    valid: "lastName:valid",
    invalid: "lastName:invalid",
  }
);
useDefaultReset(() => props.default, [resetData]);
useReset(() => props.reset, [resetData], emit);

const lastNameStatus = computed(() => (error.value ? "danger" : "success"));
</script>

<style scoped>
</style>