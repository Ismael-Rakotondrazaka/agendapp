<template>
  <div class="relative inline-block group mb-7">
    <label v-if="props.label" class="inline-block mb-1" :class="[labelClass]">{{
      props.label
    }}</label>

    <div class="relative flex flex-col justify-center">
      <input
        class="
          border-2
          outline-none
          border-slate-400
          focus-visible:border-primary
          text-black
          peer
        "
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="props.placeholder"
        :value="props.modelValue"
        :type="computedType"
        :class="[inputBorderColor, inputBorderRadius, inputPadding, inputClass]"
      />

      <fa-icon
        v-if="props.icon"
        :icon="props.icon"
        class="
          absolute
          w-6
          h-6
          left-3
          peer-focus-visible:text-primar
          text-slate-400
        "
        :class="[textColor]"
      />
      <span
        v-else
        class="
          absolute
          w-6
          h-6
          left-3
          text-slate-400
          peer-focus-visible:text-primary
        "
        :class="[textColor]"
      >
        <slot name="icon" />
      </span>

      <button
        @click.prevent="togglePassword"
        class="absolute right-3 text-slate-400"
        :class="[textColor]"
      >
        <fa-icon v-if="isPassword" :icon="togglePasswordIcon" class="w-6 h-6" />
      </button>
    </div>

    <div
      v-if="props.message"
      class="absolute w-full border-2 border-t-0 rounded-md rounded-t-none z-10"
      :class="[messageBorderColor, messageBGColor]"
    >
      <p
        class="px-3 py-1 text-xs flex flex-row items-center"
        :class="[textColor]"
      >
        <i class="mr-2" v-if="messageIcon">
          <fa-icon :icon="messageIcon" />
        </i>
        <span class="whitespace-pre-wrap">
          {{ props.message }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { useDefaultReset } from "@/utils/composables";

import { computed, ref, watch } from "vue";

const props = defineProps({
  label: {
    type: String,
    required: false,
  },
  placeholder: {
    type: String,
    required: false,
  },
  modelValue: {
    required: false,
  },
  type: {
    type: String,
    required: false,
    default: "text",
  },
  status: {
    type: String,
    required: false,
    default: "none",
    validator(value) {
      return ["none", "danger", "warning", "info", "success"].includes(value);
    },
  },
  icon: {
    type: String,
    required: false,
  },
  message: {
    type: String,
    required: false,
    default: "",
  },
  labelClass: {
    type: String,
    required: false,
  },
  inputClass: {
    type: String,
    required: false,
  },
  showPassword: {
    type: Boolean,
    required: false,
  },
});

const textColor = computed(() => {
  const textColorStatus = {
    none: "!text-slate-700",
    danger: "!text-red-700",
    warning: "!text-yellow-700",
    info: "!text-sky-700",
    success: "!text-green-700",
  };

  return textColorStatus[props.status];
});

const inputBorderRadius = computed(() => {
  return props.message ? "rounded-md rounded-b-none" : "rounded-md";
});

const inputBorderColor = computed(() => {
  const inputBorderColorStatus = {
    none: "",
    danger: "!border-red-500",
    warning: "!border-yellow-500",
    success: "!border-green-500",
    info: "!border-sky-500",
  };

  return inputBorderColorStatus[props.status];
});

const inputPadding = computed(() => {
  let result = "py-3";

  result += isPassword.value ? " pr-12" : " pr-3";
  result += props.icon ? " pl-12" : " pl-3";

  return result;
});

const messageBorderColor = computed(() => {
  const messageBorderColorStatus = {
    none: "",
    danger: "border-red-300",
    warning: "border-yellow-300",
    success: "border-green-300",
    info: "border-sky-300",
  };

  return messageBorderColorStatus[props.status];
});

const messageBGColor = computed(() => {
  const messageBGColorStatus = {
    none: "bg-white",
    danger: "bg-red-100",
    warning: "bg-yellow-100",
    success: "bg-green-100",
    info: "bg-sky-100",
  };

  return messageBGColorStatus[props.status];
});

const isPassword = computed(() => {
  return props.type === "password";
});

const showPassword = ref(props.showPassword);

const emit = defineEmits([
  "password:invisible",
  "password:visible",
  "update:modelValue",
]);

watch(showPassword, (newValue) => {
  if (isPassword.value) {
    emit(newValue ? "password:visible" : "password:invisible");
  }
});

useDefaultReset(
  () => props.showPassword,
  [
    function (newValue) {
      if (isPassword.value) {
        showPassword.value = newValue;
      }
    },
  ],
  emit
);

const computedType = computed(() => {
  return isPassword.value && showPassword.value ? "text" : props.type;
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const togglePasswordIcon = computed(() =>
  showPassword.value ? "eye-slash" : "eye"
);

const messageIcon = computed(() => {
  const messageIconStatus = {
    none: "",
    danger: "warning",
    warning: "exclamation",
    success: "check",
    info: "info-circle",
  };

  return messageIconStatus[props.status];
});
</script>

<style scoped>
</style>
