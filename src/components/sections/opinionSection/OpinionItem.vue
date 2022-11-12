<template>
  <CardUI
    class="
      flex flex-col
      items-center
      border-2 border-white
      hover:bg-primary
      group
    "
  >
    <div class="w-1/2 mb-3">
      <img
        :src="props.profileImage"
        alt=""
        class="
          rounded-full
          border-4 border-white
          ring-2 ring-primary
          group-hover:border-primary group-hover:ring-white
          object-cover
        "
      />
    </div>

    <div>
      <p
        class="
          text-xl text-center
          font-bold
          text-primary
          group-hover:text-white
        "
      >
        {{ props.fullName }}
      </p>

      <p class="text-center mb-4">
        <span v-for="n in props.star" :key="n">
          <fa-icon icon="star" class="text-yellow-400" />
        </span>
      </p>

      <p
        class="
          text-slate-800
          border-l-4 border-primary
          p-3
          bg-primary/20
          group-hover:text-white
          group-hover:bg-white/20
          group-hover:border-white
        "
      >
        "{{ props.opinion }}"
      </p>
    </div>
  </CardUI>
</template>

<script setup>
import CardUI from "@/components/ui/CardUI.vue";

const props = defineProps({
  profileImage: {
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  star: {
    type: Number,
    required: true,
  },
  opinion: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
</style>