<template>
  <ButtonUI
    @click.stop="markCompleted"
    variant="solid"
    color="primary"
    class="border-white !px-11"
    :isProcessing="markCompletedProcessing"
    :hasError="props.hasConcurrentProcess"
  >
    <i>
      <fa-icon icon="calendar-check" class="inline-block mr-2" />
    </i>
    {{ markCompletedText }}
  </ButtonUI>
</template>

<script setup>
import ButtonUI from "@/components/ui/ButtonUI.vue";
import { useEventStore } from "@/stores/event.js";

import { ref, computed, watch } from "vue";

const props = defineProps({
  event: {
    type: Object,
    required: true,
  },
  hasConcurrentProcess: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["completing", "completed", "cancelled"]);

const eventStore = useEventStore();

const markCompletedState = ref("none");
const markCompletedText = computed(() => {
  const completedStateText = {
    none: "Mark as completed",
    confirm: "Confirm and mark as completed",
  };
  return completedStateText[markCompletedState.value];
});
const markCompletedProcessing = ref(false);
const resetMarkCompletedState = () => {
  markCompletedState.value = "none";
  markCompletedProcessing.value = false;
};
const markCompleted = async () => {
  if (!props.hasConcurrentProcess) {
    if (markCompletedState.value === "none") {
      markCompletedState.value = "confirm";
    } else if (markCompletedState.value === "confirm") {
      try {
        markCompletedProcessing.value = true;

        const data = {
          title: props.event.title,
          description: props.event.description,
          level: props.event.level,
          status: "completed",
          startAt: props.event.startAt,
          endAt: props.event.endAt,
        };

        await eventStore.updateEvent(props.event._id, data);

        resetMarkCompletedState();

        emit("completed");
      } catch (error) {
        resetMarkCompletedState();
        emit("cancelled");
      }
    }
  }
};

watch(markCompletedProcessing, (newValue) => {
  if (newValue) {
    emit("completing");
  }
});

const shouldReset = computed(
  () => props.hasConcurrentProcess && !markCompletedProcessing.value
);

watch(shouldReset, (newValue) => {
  if (newValue) {
    resetMarkCompletedState();
  }
});
</script>

<style setup>
</style>