<template>
  <router-link
    :to="to"
    class="
      py-2
      px-4
      font-medium
      rounded-sm
      border-2 border-transparent
      ring
      duration-150
      inline-block
    "
    :class="getClass()"
  >
    <slot />
  </router-link>
</template>

<script setup>
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
      return ["primary", "secondary", "tertiary"].includes(value);
    },
  },
  to: {
    required: true,
  },
});

const getClass = () => {
  let result;
  switch (props.variant) {
    case "outlined":
      switch (props.color) {
        case "primary":
          result =
            "bg-white text-primary ring-primary hover:border-primary active:bg-primary/10";
          break;

        case "secondary":
          result =
            "bg-white text-secondary ring-secondary hover:border-secondary active:bg-secondary/10";
          break;

        case "tertiary":
          result =
            "bg-white text-tertiary ring-tertiary hover:border-tertiary active:bg-tertiary/10";
          break;
      }
      break;

    case "solid":
      switch (props.color) {
        case "primary":
          result =
            "bg-primary text-white ring-primary hover:border-white active:bg-primary/90";
          break;

        case "secondary":
          result =
            "bg-secondary text-white ring-secondary hover:border-white active:bg-secondary/90";
          break;

        case "tertiary":
          result =
            "bg-tertiary text-white ring-tertiary hover:border-white  active:bg-tertiary/90";
          break;
      }
      break;
  }

  return result;
};
</script>

<style scoped></style>
