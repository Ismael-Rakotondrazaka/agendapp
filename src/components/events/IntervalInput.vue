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

        <div class="text-center border-2 py-3 border-slate-200 rounded-md">
          <p class="mb-2">{{ intervalFormatted.startAt }}</p>

          <select
            v-model="startAtHours"
            class="px-2 py-2 rounded-md text-black"
          >
            <option
              v-for="startHoursOption in startHoursOptions"
              :key="startHoursOption"
            >
              {{ startHoursOption }}
            </option>
          </select>
          :
          <select
            v-model="startAtMinutes"
            class="px-2 py-2 rounded-md text-black"
          >
            <option
              v-for="startMinutesOption in startMinutesOptions"
              :key="startMinutesOption"
            >
              {{ startMinutesOption }}
            </option>
          </select>
        </div>
      </div>

      <div class="w-full">
        <label for="" class="inline-block mb-1">Select the ending time:</label>

        <div class="text-center border-2 py-3 border-slate-200 rounded-md">
          <p class="mb-2">{{ intervalFormatted.endAt }}</p>

          <select v-model="endAtHours" class="px-2 py-2 rounded-md text-black">
            <option
              v-for="endHoursOption in endHoursOptions"
              :key="endHoursOption"
            >
              {{ endHoursOption }}
            </option>
          </select>
          :
          <select
            v-model="endAtMinutes"
            class="px-2 py-2 rounded-md text-black"
          >
            <option
              v-for="endMinutesOption in endMinutesOptions"
              :key="endMinutesOption"
            >
              {{ endMinutesOption }}
            </option>
          </select>
        </div>
      </div>

      <div
        v-if="isDefaultChanged.startAt || isDefaultChanged.endAt"
        class="mt-2"
      >
        <p class="f">
          * The interval is corrected because the event was created in different
          timezone.
        </p>
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
import { isSameDay, formatTime, isInConflict, formatDate } from "@/utils/dates";
import { useEventStore } from "@/stores/event.js";
import { useDateStore } from "@/stores/date.js";
import { useReset, useDefaultReset, useValidation } from "@/utils/composables";

import { ref, computed, watch } from "vue";

const eventStore = useEventStore();
const dateStore = useDateStore();

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
    default: null,
  },
});

const emit = defineEmits(["interval:valid", "interval:invalid", "resettled"]);

const isDefaultChanged = ref({
  startAt: false,
  endAt: false,
});

const defaultInterval = computed(() => {
  let result = {
    startAt: props.default.startAt,
    endAt: props.default.endAt,
  };

  // => the event is NOT created in the same timezone as now, so we round
  if (
    props.reason === "edit" &&
    !isSameDay(props.default.startAt, props.default.endAt) &&
    props.default.startAt.getHours() !== 0 &&
    props.default.endAt.getHours() !== 0
  ) {
    let newEndAt = new Date(props.default.endAt);
    newEndAt.setHours(0, 0, 0, 0);

    let diffByEndMn =
      (newEndAt.getTime() - props.default.startAt.getTime()) / 6000;

    if (diffByEndMn < 15) {
      let newStartAt = new Date(props.default.endAt);
      newStartAt.setHours(0, 0, 0, 0);

      let diffByStartMn =
        (props.default.endAt.getTime() - newStartAt.getTime()) / 6000;

      if (diffByStartMn >= 15) {
        result.startAt = newStartAt;
        isDefaultChanged.value.startAt = true;
      }
    } else {
      result.endAt = newEndAt;
      isDefaultChanged.value.endAt = true;
    }
  }

  return result;
});

const startAtDate = ref(defaultInterval.value.startAt);
const startHoursOptions = ref(
  "00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23".split(
    " "
  )
);
const startAtHours = ref(
  startAtDate.value?.getHours()?.toString()?.padStart(2, "0") || "00"
);
watch(startAtHours, (newValue) => {
  if (newValue && startAtDate.value) {
    const newDate = new Date(startAtDate.value);
    newDate.setHours(+newValue); // turn newValue into number
    startAtDate.value = newDate;
  }
});
const startMinutesOptions = ref("00 15 30 45".split(" "));
const startAtMinutes = ref(
  startAtDate.value?.getMinutes()?.toString()?.padStart(2, "0") || "00"
);
watch(startAtMinutes, (newValue) => {
  if (newValue && startAtDate.value) {
    const newDate = new Date(startAtDate.value);
    newDate.setMinutes(+newValue); // turn newValue into number
    startAtDate.value = newDate;
  }
});

const endAtDate = ref(defaultInterval.value.endAt);
const endHoursOptions = ref(
  "00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19 20 21 22 23"
    .split(" ")
    .concat("00 (of next day)")
);
const endAtHours = ref(
  (() => {
    let result = "00";
    if (endAtDate.value) {
      if (startAtDate.value && !isSameDay(endAtDate.value, startAtDate.value)) {
        result = "00 (of next day)";
      } else {
        result = endAtDate.value.getHours().toString().padStart(2, "0");
      }
    }

    return result;
  })()
);
const endMinutesOptions = ref(
  (() => {
    let result = "00 15 30 45".split(" ");

    if (endAtDate.value) {
      if (startAtDate.value && !isSameDay(endAtDate.value, startAtDate.value)) {
        result = ["00"];
      }
    }

    return result;
  })()
);
const endAtMinutes = ref(
  endAtDate.value?.getMinutes()?.toString()?.padStart(2, "0") || "00"
);
watch(endAtHours, (newValue) => {
  if (startAtDate.value && endAtDate.value) {
    if (newValue === "00 (of next day)") {
      const changedDate = new Date(
        startAtDate.value.getTime() + 24 * 60 * 60 * 1000
      );
      changedDate.setHours(0, 0, 0, 0);
      endAtDate.value = changedDate;

      endMinutesOptions.value = ["00"];
      endAtMinutes.value = "00";
    } else {
      const sameDayAsStartAt = new Date(startAtDate.value);
      sameDayAsStartAt.setHours(+newValue);
      endAtDate.value = sameDayAsStartAt;

      endMinutesOptions.value = ["00", "15", "30", "45"];
    }
  }
});
watch(endAtMinutes, (newValue) => {
  if (newValue && endAtDate.value) {
    const newDate = new Date(endAtDate.value);
    newDate.setMinutes(+newValue);
    endAtDate.value = newDate; // turn newValue into number
  }
});

const interval = computed(() => ({
  startAt: startAtDate.value,
  endAt: endAtDate.value,
}));

const intervalFormatted = computed(() => {
  let result = {
    startAt: "",
    endAt: "",
  };

  if (startAtDate.value) {
    result.startAt = formatDate(startAtDate.value);
  }

  if (endAtDate.value) {
    result.endAt = formatDate(endAtDate.value);
  }

  return result;
});

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
          interval.startAt.getTime() !==
            props.actualEvent?.startAt?.getTime() &&
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

  if (
    newValue.startAt &&
    dateStore.date.getTime() > newValue.startAt.getTime()
  ) {
    result = "The starting time should be in the future.";
  }

  return result;
};

const resetData = () => {
  startAtDate.value = defaultInterval.value.startAt;
  endAtDate.value = defaultInterval.value.endAt;
};

watch(
  () => props.day,
  (newValue) => {
    // expect a null to fullfil the condition
    if (!newValue) {
      startAtHours.value = "00";
      endAtHours.value = "00";
      startAtMinutes.value = "00";
      endAtMinutes.value = "00";
    }
  }
);

const { error } = useValidation(
  interval,
  [...props.customValidators, defaultValidator],
  emit,
  {
    valid: "interval:valid",
    invalid: "interval:invalid",
  }
);

useDefaultReset(defaultInterval, [resetData]);

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