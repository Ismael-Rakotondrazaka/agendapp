<template>
  <div class="w-full border rounded-md">
    <TheNewEvent expandClass="rounded-t-md border-b" />

    <TheAccount class="border-b" />

    <button
      class="
        relative
        w-full
        p-3
        text-lg
        font-rubik-bold
        text-left
        border-b
        hover:text-white hover:bg-primary
      "
      @click="goHomeHandler"
      :class="[goHomeButtonClass]"
    >
      <i class="mr-3">
        <fa-icon icon="home" />
      </i>
      Home

      <i v-if="goHomeProcessing" class="absolute right-0 mr-3 animate-spin">
        <fa-icon icon="spinner" />
      </i>
    </button>

    <EndSession />
  </div>
</template>

<script setup>
import TheNewEvent from "@/components/sections/navigationSection/TheNewEvent.vue";
import TheAccount from "@/components/sections/navigationSection/TheAccount.vue";
import EndSession from "@/components/sessions/EndSession.vue";
import router from "@/router";

import { ref, computed } from "vue";

const goHomeProcessing = ref(false);

const goHomeHandler = () => {
  goHomeProcessing.value = true;
  router.push({
    name: "home",
  });
  goHomeProcessing.value = false;
};

const goHomeButtonClass = computed(() =>
  goHomeProcessing.value
    ? "bg-primary text-white cursor-not-allowed"
    : "bg-white text text-slate-800 cursor-pointer"
);
</script>

<style scoped>
</style>