<template>
  <div
    class="p-3 border-2 rounded-lg ring hover:border-white"
    :class="[cardClass]"
  >
    <button @click="toggleExpanded" class="w-full">
      <div class="flex flex-row items-baseline justify-between">
        <p>{{ formattedTimes.startAt }} to {{ formattedTimes.endAt }}</p>
        <p>{{ interval }}</p>
      </div>
      <div class="flex flex-row items-start justify-between">
        <div>
          <h2 class="text-xl font-bold text-left">
            {{ props.event.title }}
          </h2>

          <p v-if="isExpanded" class="mb-5 text-left">
            {{ props.event.description }}
          </p>
        </div>
        <div v-if="props.event.level === 'important'">
          <i class="inline-block ml-2 -mr-1 text-2xl">
            <fa-icon icon="star" />
          </i>
        </div>
      </div>

      <div
        v-if="
          isExpanded &&
          ['completed', 'failed', 'pending'].includes(props.event.status)
        "
        class="flex flex-row flex-wrap items-start gap-3 mb-3"
      >
        <div class="w-full">
          <p class="mb-2 font-bold text-left">
            <span class="inline-block mr-2 font-normal underline">Level:</span>
            {{ props.event.level }}
            <i
              v-if="props.event.level === 'important'"
              class="inline-block ml-2 font-normal"
            >
              <fa-icon icon="star" />
            </i>
          </p>
          <p class="mb-2 font-bold text-left">
            <span class="inline-block mr-2 font-normal underline">Status:</span>
            {{ statusText }}
            <i class="inline-block ml-2 font-normal">
              <fa-icon :icon="statusIcon" />
            </i>
          </p>
        </div>

        <MarkCompletedEvent
          v-if="canMark"
          @completing="markingCompletedEventHandler"
          @completed="markedCompletedEventHandler"
          @cancelled="cancelledMarkCompletedEventHandler"
          :event="props.event"
          :hasConcurrentProcess="generalProcessing"
          class="w-full justify-center"
        />

        <MarkFailedEvent
          v-if="canMark"
          @failing="markingFailedEventHandler"
          @failed="markedFailedEventHandler"
          @cancelled="cancelledMarkFailedEventHandler"
          :event="props.event"
          :hasConcurrentProcess="generalProcessing"
          class="w-full justify-center"
        />
      </div>
    </button>

    <div
      v-if="isExpanded"
      class="border-t border-white"
      :class="[expandedClass]"
    >
      <button
        @click="toggleShowMore"
        class="
          w-full
          py-3
          pl-3
          font-bold
          text-left
          hover:underline
          underline-offset-4
        "
        :class="[showMoreClass]"
      >
        {{ showMoreText }}
      </button>

      <div v-if="isShowMore" class="pb-3">
        <div class="pl-3" :class="[props.event.status === 'pending' && 'mb-5']">
          <p class="mb-2 font-bold text-left">
            <span class="inline-block mr-2 font-normal underline">
              Created on:
            </span>
            {{ formattedDateTimes.createdAt }}
          </p>

          <p class="mb-2 font-bold text-left">
            <span class="inline-block mr-2 font-normal underline">
              Updated on:
            </span>
            {{ formattedDateTimes.updatedAt }}
          </p>
        </div>

        <div
          v-if="
            !isUpdating &&
            !isDeleting &&
            props.event.status === 'pending' &&
            props.event.startAt.getTime() > dateStore.date.getTime()
          "
          class="flex flex-row items-baseline gap-5 ml-3"
          :class="[editClass]"
        >
          <ButtonUI variant="solid" color="primary" @click="openUpdating">
            <i>
              <fa-icon icon="pen-to-square" class="inline-block mr-2" />
            </i>
            Edit
          </ButtonUI>

          <ButtonUI @click="openDeleting" variant="solid" color="danger">
            <i>
              <fa-icon icon="trash" class="inline-block mr-2" />
            </i>
            Delete
          </ButtonUI>
        </div>

        <div
          v-if="isUpdating && props.event.status === 'pending'"
          class="pb-3 ml-3 border-t border-l"
        >
          <button
            @click="toggleUpdating"
            class="
              w-full
              py-3
              pl-3
              mb-3
              font-bold
              text-left
              underline underline-offset-4
              bg-white/20
            "
          >
            Editing
          </button>

          <EditEvent
            @updated="updatedEventHandler"
            @updating="updatingEventHandler"
            @cancelled="cancelledUpdateEventHandler"
            @resettled="resettledEventHandler"
            :reset="reset"
            :event="props.event"
            :hasConcurrentProcess="generalProcessing"
            class="pl-3"
          />
        </div>

        <div v-else-if="isDeleting" class="pb-3 ml-3 border-t border-l">
          <button
            @click="toggleDeleting"
            class="
              w-full
              py-3
              pl-3
              mb-3
              font-bold
              text-left
              underline underline-offset-4
              bg-white/20
            "
          >
            Deleting
          </button>

          <DeleteEvent
            @deleted="deletedEventHandler"
            @deleting="deletingEventHandler"
            @cancelled="cancelledDeleteEventHandler"
            :event="props.event"
            :hasConcurrentProcess="generalProcessing"
            class="pl-3"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ButtonUI from "@/components/ui/ButtonUI.vue";
import EditEvent from "@/components/events/EditEvent.vue";
import DeleteEvent from "@/components/events/DeleteEvent.vue";
import MarkCompletedEvent from "@/components/events/MarkCompletedEvent.vue";
import MarkFailedEvent from "@/components/events/MarkFailedEvent.vue";
import { formatTime, formatDateTime } from "@/utils/dates";
import { useEventStore } from "@/stores/event.js";
import { useDateStore } from "@/stores/date.js";

import { ref, computed, watch } from "vue";

const eventStore = useEventStore();
const dateStore = useDateStore();

const cardClass = computed(() => {
  const cardStatusClass = {
    pending:
      "ring-info/40 border-info/5 bg-info/70 hover:bg-info/75 hover:ring-info-75 text-white",
    failed:
      "ring-danger/40 border-danger/5 bg-danger/70 hover:bg-danger/75 hover:ring-danger/75 text-white",
    completed:
      "ring-success/40 border-success/5 bg-success/70 hover:bg-success/75 hover:ring-success/75 text-white",
  };

  return cardStatusClass[props.event.status];
});

const props = defineProps({
  event: {
    type: Object,
    required: true,
    default: null,
  },
});

const isExpanded = ref(false);
const openExpanded = () => (isExpanded.value = true);
const closeExpanded = () => {
  isExpanded.value = false;

  if (isShowMore.value) {
    closeShowMore();
  }
};
const toggleExpanded = () =>
  isExpanded.value ? closeExpanded() : openExpanded();
const expandedClass = computed(() => (isShowMore.value ? " border-l" : ""));

const isShowMore = ref(false);
const showMoreClass = computed(() =>
  isShowMore.value ? "bg-white/20 underline mb-3" : "hover:bg-white/20"
);
const showMoreText = computed(() =>
  isShowMore.value ? "Show less" : "Show more"
);
const openShowMore = () => (isShowMore.value = true);
const closeShowMore = () => {
  isShowMore.value = false;

  if (isUpdating.value) {
    closeUpdating();
  }

  if (isDeleting.value) {
    closeDeleting();
  }
};
const toggleShowMore = () =>
  isShowMore.value ? closeShowMore() : openShowMore();

const isUpdating = ref(false);
const openUpdating = () => (isUpdating.value = true);
const closeUpdating = () => (isUpdating.value = false);
const toggleUpdating = () =>
  isUpdating.value ? closeUpdating() : openUpdating();

const updateProcessing = ref(false);
const updatingEventHandler = () => {
  updateProcessing.value = true;
};
const updatedEventHandler = () => {
  updateProcessing.value = false;
  closeUpdating();
};
const cancelledUpdateEventHandler = () => {
  // reset.value = true;
  updateProcessing.value = false;
  // closeUpdating();
};
const reset = ref(false);
const resettledEventHandler = () => {
  reset.value = false;
};

const isDeleting = ref(false);
const openDeleting = () => (isDeleting.value = true);
const closeDeleting = () => (isDeleting.value = false);
const toggleDeleting = () =>
  isDeleting.value ? closeDeleting() : openDeleting();
const deleteProcessing = ref(false);
const deletingEventHandler = () => {
  deleteProcessing.value = true;
};
const deletedEventHandler = () => {
  deleteProcessing.value = false;
  closeDeleting();
};
const cancelledDeleteEventHandler = () => {
  deleteProcessing.value = false;
  // closeDeleting();
};

const editClass = computed(() =>
  !isDeleting.value && !isUpdating.value ? "" : "mb-3"
);

const generalProcessing = computed(
  () =>
    markCompletedProcessing.value ||
    markFailedProcessing.value ||
    deleteProcessing.value ||
    updateProcessing.value
);

const markCompletedProcessing = ref(false);

const markingCompletedEventHandler = () => {
  markCompletedProcessing.value = true;
};
const markedCompletedEventHandler = () => {
  markCompletedProcessing.value = false;
};
const cancelledMarkCompletedEventHandler = () => {
  markCompletedProcessing.value = false;
};

const markFailedProcessing = ref(false);
const markingFailedEventHandler = () => {
  markFailedProcessing.value = true;
};
const markedFailedEventHandler = () => {
  markFailedProcessing.value = false;
};
const cancelledMarkFailedEventHandler = () => {
  markFailedProcessing.value = false;
};

const formattedTimes = computed(() => {
  const timeKeys = ["startAt", "endAt", "createdAt", "updatedAt"];

  const result = {};

  timeKeys.forEach((key) => {
    result[key] = formatTime(props.event[key]);
  });

  return result;
});

const formattedDateTimes = computed(() => {
  const timeKeys = ["startAt", "endAt", "createdAt", "updatedAt"];

  const result = {};

  timeKeys.forEach((key) => {
    result[key] = formatDateTime(props.event[key]);
  });

  return result;
});

const interval = computed(() => {
  const diffTime = props.event.endAt.getTime() - props.event.startAt.getTime();

  let seconds = diffTime / 1000;
  const hours = parseInt(seconds / 3600); // 3600s == 1h
  seconds = seconds % 3600; // seconds remaining
  const minutes = parseInt(seconds / 60); // 60s == 1mn
  seconds = seconds % 60;

  let result = "";

  if (hours > 0) {
    result = `${result}${hours.toString()}h`;
  }

  if (minutes > 0) {
    result = `${result} ${minutes.toString()}mn`;
  }

  return result;
});

const statusText = computed(() => {
  const statusTextObj = {
    failed: "failed",
    completed: "completed",
    pending: "pending",
  };

  return statusTextObj[props.event.status];
});

const statusIcon = computed(() => {
  const statusIconObj = {
    failed: "calendar-xmark",
    completed: "calendar-check",
    pending: "clock",
  };

  return statusIconObj[props.event.status];
});

const canMark = computed(() => {
  let result = false;

  if (
    props.event.status === "pending" &&
    ((dateStore.isToday(props.event.startAt) &&
      props.event.startAt.getTime() <= dateStore.date.getTime()) ||
      dateStore.isInSummaryPeriod(props.event.startAt))
  ) {
    result = true;
  }

  return result;
});

// should be marked as failed automatically, but prefer a fetch to confirm
watch(
  () =>
    props.event.status === "pending" &&
    props.event.startAt.getTime() < dateStore.date.getTime() &&
    !dateStore.isToday(props.event.startAt) &&
    !dateStore.isInSummaryPeriod(props.event.startAt),
  async (newValue) => {
    if (newValue) {
      try {
        const axiosResponseData = (await eventStore.showEvent(props.event._id))
          .data;

        const updatedEvent = {
          ...axiosResponseData.data.event,
          startAt: new Date(axiosResponseData.data.event.startAt),
          endAt: new Date(axiosResponseData.data.event.endAt),
          createdAt: new Date(axiosResponseData.data.event.createdAt),
          updatedAt: new Date(axiosResponseData.data.event.updatedAt),
        };

        eventStore.addOrUpdateEvent(updatedEvent);
      } catch (error) {
        // console.log(error);
      }
    }
  }
);
</script>

<style scoped>
</style>