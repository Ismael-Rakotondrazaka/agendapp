<template>
  <li class="list-disc list-inside text-white ml-2 footer-link-item">
    <router-link
      :to="props.to"
      class="text-xl hover:text-primary hover:underline underline-offset-4"
    >
      <slot />
    </router-link>
  </li>
</template>

<script setup>
const props = defineProps({
  to: {
    required: true,
  },
});
</script>

<style scoped>
.footer-link-item .router-link-exact-active {
  color: rgb(var(--color-primary));
  text-decoration: underline;
  text-underline-offset: 4px;
}
</style>