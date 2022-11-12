<template>
  <CardUI class=" text-slate-800 group hover:bg-primary">
    <h2
      class="
        text-primary text-center text-2xl
        mb-5
        font-bold
        underline underline-offset-8
        group-hover:text-white
      "
    >
      {{ props.title }}
    </h2>
    <img :src="imageUrl" alt="" class="w-full mb-3" />
    <p
      class="
        group-hover:text-white group-hover:border-white
        border-l-4 border-primary
        bg-primary/20
        group-hover:bg-white/10
        px-3
        py-2
      "
    >
      {{ props.description }}
    </p>
  </CardUI>
</template>

<script setup>
import CardUI from "@/components/ui/CardUI.vue";

const props = defineProps({
  description: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
</style>