<template>
  <button
    class="
      relative
      w-full
      p-3
      text-lg
      font-bold
      text-left
      bg-red-40
      rounded-b-md
      hover:text-white hover:bg-primary
    "
    @click="endSessionHandler"
    :class="[buttonClass]"
  >
    <i class="mr-3">
      <fa-icon icon="arrow-right-from-bracket" />
    </i>
    Logout

    <i v-if="endSessionProcessing" class="absolute right-0 mr-3 animate-spin">
      <fa-icon icon="spinner" />
    </i>
  </button>
</template>

<script setup>
import { useSessionStore } from "@/stores/session.js";

import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const sessionStore = useSessionStore();

const router = useRouter();

const endSessionProcessing = ref(false);

const fatalError = ref(null);

const endSessionHandler = async () => {
  if (!endSessionProcessing.value) {
    try {
      fatalError.value = null;
      endSessionProcessing.value = true;

      await sessionStore.endSession();

      endSessionProcessing.value = false;

      router.push({
        name: "home",
      });
    } catch (error) {
      fatalError.value = error;
      endSessionProcessing.value = false;
    }
  }
};

const buttonClass = computed(() =>
  endSessionProcessing.value
    ? "bg-primary text-white cursor-not-allowed"
    : "bg-white text text-slate-800 cursor-pointer"
);
</script>

<style scoped>
</style>