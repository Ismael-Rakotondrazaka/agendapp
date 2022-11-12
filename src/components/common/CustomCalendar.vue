<template>
  <div class="text-center rounded-md-del section ring-1-del ring-slate-400-del">
    <div>
      <button
        class="
          w-full
          py-3
          font-nunito-bold
          text-white text-slate-8
          bg-primary
          hover:underline
          underline-offset-4
          rounded-t-md
        "
        @click="moveCalendarTo(dateStore.date)"
      >
        Jump to this month
      </button>
    </div>
    <v-calendar
      class="max-w-full custom-calendar"
      :masks="masks"
      :attributes="attributes"
      is-expanded
      ref="calendar"
      @update:to-page="updatePageHandler"
    >
      <template v-slot:day-content="{ day, attributes }">
        <div class="z-10 flex flex-col h-full overflow-hidden">
          <span class="text-sm text-gray-900 day-label">{{ day.day }}</span>
          <div class="flex-grow h-10 overflow-x-auto overflow-y-auto">
            <p
              v-for="(attr, index) in attributes"
              :key="attr.key"
              class="
                p-1
                mt-0
                mb-1
                text-xs
                font-medium
                leading-tight
                text-white
                rounded-sm
              "
              v-motion
              :initial="{
                opacity: 0,
                scale: 0.5,
              }"
              :enter="{
                opacity: 1,
                scale: 1,
                transition: {
                  duration: 200,
                  delay: index * 200,
                },
              }"
              :class="attr.customData.class"
            >
              {{ attr.customData.title }}
            </p>
          </div>
        </div>
      </template>
    </v-calendar>
  </div>
</template>

<script setup>
import { useEventStore } from "@/stores/event.js";
import { useSelectionStore } from "@/stores/selection.js";
import { useDateStore } from "@/stores/date.js";
import { useOverviewStore } from "@/stores/overview.js";

import { computed, ref, onMounted } from "vue";

const eventStore = useEventStore();
const selectionStore = useSelectionStore();
const overviewStore = useOverviewStore();
const dateStore = useDateStore();

const calendar = ref(null);

const moveCalendarTo = async (next) => {
  calendar.value?.move(next);
};

onMounted(() => {
  selectionStore.$subscribe(async (mutation, state) => {
    if (state.date) {
      await moveCalendarTo(state.date);
    }
  });
});

const masks = ref({
  weekdays: "WWW",
});

const attributes = computed(() => {
  const statusBGColors = {
    completed: "bg-success/70",
    failed: "bg-danger/70",
    pending: "bg-info/70",
  };

  return eventStore.events.map((event, index) => ({
    key: event._id,
    customData: {
      title: event.title,
      class: statusBGColors[event.status],
    },
    dates: event.startAt,
    order: index,
  }));
});

const updatePageHandler = (page) => {
  overviewStore.page = page;
};
</script>

<style lang="postcss" scoped>
::-webkit-scrollbar {
  width: 0px;
}
::-webkit-scrollbar-track {
  display: none;
}
:deep() .custom-calendar.vc-container {
  --day-border: 1px solid #b8c2cc;
  --day-border-highlight: 1px solid #b8c2cc;
  --day-height: 90px;
  --weekday-bg: #f8fafc;
  --weekday-border: 1px solid #eaeaea;
  width: 100%;
  border-top: none;
  border-radius: 0 0 0.5rem 0.5rem;
  border: 0;
  & .vc-header {
    padding: 10px 0;
  }
  & .vc-weeks {
    padding: 0;
    overflow-x: auto;
  }
  & .vc-weekday {
    background-color: var(--weekday-bg);
    border-bottom: var(--weekday-border);
    border-top: var(--weekday-border);
    padding: 5px 0;
  }
  & .vc-day {
    padding: 0 5px 3px 5px;
    text-align: left;
    height: var(--day-height);
    min-height: var(--day-height);
    min-width: var(--day-width);
    background-color: white;
    &.weekday-1,
    &.weekday-7 {
      background-color: #f1f5f8;
    }
    &:not(.on-bottom) {
      border-bottom: var(--day-border);
      &.weekday-1 {
        border-bottom: var(--day-border-highlight);
      }
    }
    &:not(.on-right) {
      border-right: var(--day-border);
    }
  }
  & .is-today {
    background-color: rgb(var(--color-primary) / 0.3);
  }
  & .vc-day-dots {
    margin-bottom: 5px;
  }
}
</style>