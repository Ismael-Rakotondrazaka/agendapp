<template>
  <button
    class="
      py-2
      px-4
      font-medium
      rounded-sm
      border-2 border-transparent
      ring
      duration-150
      relative
      flex
      items-center
      text-center
      justify-center
    "
    :class="[mainClass, cursorClass]"
  >
    <slot />
    <span v-if="props.isProcessing" class="absolute right-3 animate-spin">
      <fa-icon icon="spinner" />
    </span>
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  variant: {
    type: String,
    required: false,
    default: "solid",
    validator(value) {
      return ["outlined", "solid"].includes(value);
    },
  },
  color: {
    type: String,
    required: false,
    default: "primary",
    validator(value) {
      return [
        "primary",
        "info",
        "warning",
        "danger",
        "success",
        "disabled",
      ].includes(value);
    },
  },
  isProcessing: {
    type: Boolean,
    required: false,
    default: false,
  },
  hasError: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const mainClass = computed(() => {
  const classVariant = {
    outlined: {
      primary:
        "bg-white text-primary ring-primary hover:border-primary active:bg-primary active:text-white",
      danger:
        "bg-white text-danger ring-danger hover:border-danger active:bg-danger active:text-white",
      warning:
        "bg-white text-warning ring-warning hover:border-warning active:bg-warning active:text-white",
      info: "bg-white text-info ring-info hover:border-info active:bg-info active:text-white",
      success:
        "bg-white text-success ring-success hover:border-success active:bg-success active:text-white",
      disabled:
        "bg-none text-white ring-white hover:border-white active:bg-white active:text-black",
    },
    solid: {
      primary:
        "bg-primary text-white ring-primary hover:border-white active:border-primary",
      danger:
        "bg-danger text-white ring-danger hover:border-white active:border-danger",
      warning:
        "bg-warning text-white ring-warning hover:border-white  active:bg-warning/90",
      info: "bg-info text-white ring-info hover:border-white active:bg-info/90",
      success:
        "bg-success text-white ring-success hover:border-white active:border-success",
      disabled:
        "bg-white text-black ring-white hover:border-sky-500 active:border-white",
    },
  };

  return classVariant[props.variant][props.color];
});

const cursorClass = computed(() =>
  props.hasError || props.isProcessing
    ? "hover:cursor-not-allowed"
    : "hover:cursor-pointer"
);
</script>

<style scoped></style>
