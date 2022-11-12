<template>
  <div class="w-full">
    <button
      @click="toggleExpand"
      class="
        flex flex-row
        items-center
        justify-between
        w-full
        p-3
        text-lg
        font-bold
        hover:bg-primary hover:text-white
      "
      :class="[computedExpandClass, props.expandClass]"
    >
      <span>
        <slot name="header" />
      </span>
      <i>
        <fa-icon :icon="expandIcon" />
      </i>
    </button>
    <div v-if="props.showContent" class="border border-primary">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  expandClass: {
    type: String,
    required: false,
  },
  showContent: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const expandIcon = computed(() =>
  props.showContent ? "chevron-up" : "chevron-down"
);

const emit = defineEmits(["opened", "closed"]);

const toggleExpand = () => {
  emit(props.showContent ? "closed" : "opened");
};

const computedExpandClass = computed(() =>
  props.showContent ? "bg-primary text-white" : "bg-white text-slate-800"
);
</script>

<style scoped>
</style>