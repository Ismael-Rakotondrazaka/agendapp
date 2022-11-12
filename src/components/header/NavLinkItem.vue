<template>
  <li class="nav-link-item">
    <router-link
      :to="props.to"
      class="
        font-bold
        text-slate-800 text-xl
        hover:underline hover:underline-offset-4
      "
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
.nav-link-item .router-link-exact-active {
  color: rgb(var(--color-primary));
  text-decoration: underline;
  text-underline-offset: 4px;
}
</style>