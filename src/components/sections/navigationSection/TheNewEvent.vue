<template>
  <ExpandItem
    :showContent="showContent"
    @closed="closeContent"
    @opened="openContent"
  >
    <template #header>
      <span>
        <i class="mr-3">
          <fa-icon icon="calendar-plus" />
        </i>
        New event
      </span>
    </template>

    <CreateEvent
      class="w-full p-3 bg-white"
      @event:created="eventCreatedHandler"
      :reset="reset"
      @resettled="resettledHandler"
    />
  </ExpandItem>
</template>

<script setup>
import ExpandItem from "@/components/common/ExpandItem.vue";
import CreateEvent from "@/components/events/CreateEvent.vue";

import { ref } from "vue";

const showContent = ref(false);
const openContent = () => (showContent.value = true);
const closeContent = () => (showContent.value = false);

const reset = ref(false);
const eventCreatedHandler = () => {
  reset.value = true;
};

const resettledHandler = () => {
  reset.value = false;
  closeContent();
};
</script>

<style scoped>
</style>