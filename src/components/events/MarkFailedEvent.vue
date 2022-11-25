<template>
  <ButtonUI
    @click.stop="markFailed"
    variant="outlined"
    color="danger"
    class="!px-11"
    :isProcessing="markFailedProcessing"
    :hasError="props.hasConcurrentProcess"
  >
    <i>
      <fa-icon icon="calendar-xmark" class="inline-block mr-2" />
    </i>
    {{ markFailedText }}
  </ButtonUI>
</template>

<script setup>
import ButtonUI from "@/components/ui/ButtonUI.vue";
import { useEventStore } from "@/stores/event.js";

import { ref, computed, watch } from "vue";

const eventStore = useEventStore();

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

const emit = defineEmits(["failing", "failed", "cancelled"]);

const markFailedState = ref("none");
const markFailedText = computed(() => {
  const failedStateText = {
    none: "Mark as failed",
    confirm: "Confirm and mark as failed",
  };
  return failedStateText[markFailedState.value];
});
const resetMarkFailedState = () => {
  markFailedState.value = "none";
  markFailedProcessing.value = false;
};
const markFailedProcessing = ref(false);

const markFailed = async () => {
  if (!props.hasConcurrentProcess) {
    if (markFailedState.value === "none") {
      markFailedState.value = "confirm";
    } else if (markFailedState.value === "confirm") {
      try {
        markFailedProcessing.value = true;

        const data = {
          title: props.event.title,
          description: props.event.description,
          level: props.event.level,
          status: "failed",
          startAt: props.event.startAt,
          endAt: props.event.endAt,
          timezoneOffset: new Date().getTimezoneOffset(),
        };

        await eventStore.updateEvent(props.event._id, data);

        resetMarkFailedState();
        emit("failed");
      } catch (error) {
        resetMarkFailedState();
        emit("cancelled");
      }
    }
  }
};

watch(markFailedProcessing, (newValue) => {
  if (newValue) {
    emit("failing");
  }
});

const shouldReset = computed(
  () => props.hasConcurrentProcess && !markFailedProcessing.value
);

watch(shouldReset, (newValue) => {
  if (newValue) {
    resetMarkFailedState();
  }
});
</script>

<style scoped>
</style>