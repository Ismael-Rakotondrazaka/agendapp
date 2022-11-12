<template>
  <li
    class="
      mb-1
      text-xl text-white
      hover:text-primary hover:underline
      underline-offset-4
    "
  >
    <a
      :href="props.href"
      class="inline-flex items-center flex-row gap-3"
      target="_blank"
    >
      <i>
        <fa-icon
          v-if="props.faIcon"
          :icon="props.faIcon"
          class="h-5 fill-white" />

        <img
          v-else-if="props.iconUrl"
          :src="props.iconUrl"
          alt=""
          class="h-5 fill-white"
      /></i>

      <span>{{ text }}</span>
    </a>
  </li>
</template>

<script setup>
const props = defineProps({
  href: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  faIcon: {
    type: String,
    required: false,
  },
  iconUrl: {
    type: String,
    required: false,
  },
});
</script>

<style scoped>
</style>