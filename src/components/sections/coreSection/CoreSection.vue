<template>
  <div>
    <p
      class="
        p-3
        mb-3
        text-lg
        border border-slate-400
        shadow-md
        bg-white
        rounded-md
      "
    >
      <span class="font-bold">
        {{ title }}
      </span>
    </p>

    <EventList :events="sortedEvents" />
  </div>
</template>

<script setup>
import EventList from "@/components/events/EventList.vue";
import { formatDate } from "@/utils/dates";
import { useEventStore } from "@/stores/event.js";
import { useSelectionStore } from "@/stores/selection.js";

import { computed } from "vue";

const eventStore = useEventStore();
const selectionStore = useSelectionStore();

const formattedDaySelected = computed(() => formatDate(selectionStore.date));

const title = computed(() => {
  let result = "";

  if (selectionStore.hasSelection) {
    if (eventStore.eventsOnDaySelected.length > 0) {
      result = selectionStore.isToday
        ? "Today's events:"
        : `Events of ${formattedDaySelected.value}:`;
    } else {
      result = selectionStore.isToday
        ? "No events today."
        : `No events on ${formattedDaySelected.value}.`;
    }
  } else {
    result = "Select a date to list the events.";
  }

  return result;
});

const sortedEvents = computed(() => {
  const result = [...eventStore.eventsOnDaySelected];
  result.sort((a, b) => a.startAt.getTime() - b.startAt.getTime());
  return result;
});
</script>

<style scoped>
</style>