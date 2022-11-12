<template>
  <div class="relative mb-10">
    <div class="p-2 border-2 rounded-md" :class="[intervalClass]">
      <div v-if="canHaveConflict" class="mb-2">
        <p>
          The interval should be different of the ones in the list below and
          doesn't superpose any of them:
        </p>

        <ul>
          <li
            v-for="(interval, index) in intervalsFormattedTimeOnThisDay"
            :key="index"
            class="
              inline-block
              p-1
              mb-1
              mr-1
              text-xs
              border
              rounded-md
              bg-sky-100
              text-black
            "
          >
            {{ `${interval.startAt} to ${interval.endAt}` }}
          </li>
        </ul>
      </div>

      <div class="w-full mb-5">
        <label for="" class="inline-block mb-1">
          Select the starting time:
        </label>

        <v-date-picker
          is-expanded
          mode="time"
          class="mb-2 custom-time-picker"
          v-model="startAtDate"
          :minute-increment="15"
        ></v-date-picker>
      </div>

      <div class="w-full">
        <label for="" class="inline-block mb-1">Select the ending time:</label>

        <v-date-picker
          is-expanded
          mode="time"
          class="mb-2 custom-time-picker"
          v-model="endAtDate"
          :minute-increment="15"
        ></v-date-picker>
      </div>
    </div>

    <div
      class="absolute w-full border-2 border-t-0 rounded-md rounded-t-none"
      :class="[intervalMessageClass]"
      v-if="error"
    >
      <p class="flex flex-row items-center px-3 py-1 text-xs text-red-700">
        <i class="mr-2">
          <fa-icon icon="warning" />
        </i>

        <span class="whitespace-pre-wrap">
          {{ error }}
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { isSameDay, formatTime, isInConflict } from "@/utils/dates";
import { useEventStore } from "@/stores/event.js";
import { useReset, useDefaultReset, useValidation } from "@/utils/composables";

import { ref, computed } from "vue";

const eventStore = useEventStore();

const props = defineProps({
  default: {
    type: Object,
    required: false,
    default: () => ({
      startAt: null,
      endAt: null,
    }),
  },
  customValidators: {
    type: Array,
    required: false,
    default: () => [],
  },
  day: {
    type: [Date, null],
    required: true,
  },
  reason: {
    type: String,
    required: true,
    default: "create",
    validator(value) {
      return ["create", "edit"].includes(value);
    },
  },
  reset: {
    type: Boolean,
    required: false,
  },
  actualEvent: {
    type: [Object, null],
    required: false,
    default: null
  }
});

const emit = defineEmits(["interval:valid", "interval:invalid", "resettled"]);

const startAtDate = ref(props.default.startAt);

const endAtDate = ref(props.default.endAt);

const interval = computed(() => ({
  startAt: startAtDate.value,
  endAt: endAtDate.value,
}));

const eventsOnThisDay = computed(() =>
  props.day
    ? eventStore.events.filter((event) => isSameDay(event.startAt, props.day))
    : []
);

const intervalsOnThisDay = computed(() =>
  eventsOnThisDay.value.map((event) => ({
    startAt: event.startAt,
    endAt: event.endAt,
  }))
);

/* 
  remove the actual interval from the list if the actual usage is an edit
*/
const intervalsClearedOnThisDay = computed(() =>
  props.reason === "edit"
    ? intervalsOnThisDay.value.filter((interval) => {
        return (
          interval.startAt.getTime() !== props.actualEvent?.startAt?.getTime() &&
          interval.endAt.getTime() !== props.actualEvent?.endAt?.getTime()
        );
      })
    : intervalsOnThisDay.value
);

const canHaveConflict = computed(
  () => intervalsClearedOnThisDay.value.length > 0
);

const intervalsFormattedTimeOnThisDay = computed(() =>
  intervalsClearedOnThisDay.value.map((interval) => ({
    startAt: formatTime(interval.startAt),
    endAt: formatTime(interval.endAt),
  }))
);

const intervalsTimestampOnThisDay = computed(() =>
  intervalsClearedOnThisDay.value.map((interval) => ({
    start: interval.startAt.getTime(),
    end: interval.endAt.getTime(),
  }))
);

const defaultValidator = (newValue) => {
  let result = true;

  if (newValue.startAt && newValue.endAt) {
    if (newValue.startAt.getTime() >= newValue.endAt.getTime()) {
      result = "The ending time should be after the starting time.";
    } else if (
      isInConflict(
        newValue.startAt.getTime(),
        newValue.endAt.getTime(),
        intervalsTimestampOnThisDay.value
      )
    ) {
      result = "Conflict interval.";
    }
  } else {
    result = "Interval is required.";
  }

  return result;
};

const resetData = () => {
  startAtDate.value = props.default.startAt;
  endAtDate.value = props.default.endAt;
};

const { error } = useValidation(
  interval,
  [...props.customValidators, defaultValidator],
  emit,
  {
    valid: "interval:valid",
    invalid: "interval:invalid",
  }
);

useDefaultReset(() => props.default, [resetData]);

useReset(() => props.reset, [resetData], emit);

const intervalClass = computed(() =>
  startAtDate.value && endAtDate.value && !error.value
    ? "border-green-500"
    : "border-red-500 rounded-b-none"
);

const intervalMessageClass = computed(() =>
  error.value ? "bg-red-100 border-red-300" : "bg-white"
);
</script>

<style scoped>
.custom-time-picker {
  width: 100%;
  justify-content: center;
}
</style>