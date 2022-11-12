<template>
  <form @submit.prevent="createEventHandler" class="">
    <TitleInput
      @title:valid="validTitleHandler"
      @title:invalid="invalidTitleHandler"
      :reset="props.reset"
    />

    <DescriptionInput
      @description:valid="validDescriptionHandler"
      @description:invalid="invalidDescriptionHandler"
      :reset="props.reset"
    />

    <LevelRadioInput
      @level:valid="validLevelHandler"
      @level:invalid="invalidLevelHandler"
      :reset="props.reset"
    />

    <DateInput
      @date:valid="validDateHandler"
      @date:invalid="invalidDateHandler"
      :minDate="dateStore.date"
      :reset="props.reset"
    />

    <IntervalInput
      @interval:valid="validIntervalHandler"
      @interval:invalid="invalidIntervalHandler"
      :default="defaultInterval"
      :day="date"
      reason="create"
      :reset="props.reset"
    />

    <ErrorMessage v-if="fatalError" :error="fatalError" class="mb-5" />

    <div class="flex flex-row items-baseline gap-5">
      <ButtonUI
        variant="solid"
        color="primary"
        class="!px-11 w-full"
        type="submit"
        :hasError="!canCreated"
        :isProcessing="createProcessing"
      >
        <i>
          <fa-icon icon="floppy-disk" class="inline-block mr-2" />
        </i>
        Create event
      </ButtonUI>
    </div>
  </form>
</template>

<script setup>
import ButtonUI from "@/components/ui/ButtonUI.vue";
import ErrorMessage from "@/components/common/ErrorMessage.vue";
import TitleInput from "@/components/events/TitleInput.vue";
import DescriptionInput from "@/components/events/DescriptionInput.vue";
import DateInput from "@/components/events/DateInput.vue";
import LevelRadioInput from "@/components/events/LevelRadioInput.vue";
import IntervalInput from "@/components/events/IntervalInput.vue";

import { useReset } from "@/utils/composables";
import { useEventStore } from "@/stores/event.js";
import { useDateStore } from "@/stores/date.js";

import { ref, computed, watch } from "vue";

const props = defineProps({
  hasConcurrentProcess: {
    type: Boolean,
    required: false,
    default: false,
  },
  reset: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits([
  "event:creating",
  "event:created",
  "cancelled",
  "resettled",
]);

const eventStore = useEventStore();
const dateStore = useDateStore();

const createProcessing = ref(false);

const title = ref();
const validTitleHandler = (newValue) => {
  title.value = newValue;
  errors.value.title = null;
};
const invalidTitleHandler = (errorMessage) => {
  errors.value.title = errorMessage;
};

const description = ref();
const validDescriptionHandler = (newValue) => {
  description.value = newValue;
  errors.value.description = null;
};
const invalidDescriptionHandler = (errorMessage) => {
  errors.value.description = errorMessage;
};

const level = ref();
const validLevelHandler = (newValue) => {
  level.value = newValue;
  errors.value.level = null;
};
const invalidLevelHandler = (errorMessage) => {
  errors.value.level = errorMessage;
};

const date = ref(null);
const validDateHandler = (newValue) => {
  date.value = newValue;
  errors.value.date = null;

  startAtDate.value = new Date(
    date.value.getFullYear(),
    date.value.getMonth(),
    date.value.getDate()
  );

  endAtDate.value = new Date(
    date.value.getFullYear(),
    date.value.getMonth(),
    date.value.getDate()
  );
};
const invalidDateHandler = (errorMessage) => {
  errors.value.date = errorMessage;
  startAtDate.value = null;
  endAtDate.value = null;
};

const startAtDate = ref(null);
const endAtDate = ref(null);
const defaultInterval = computed(() => ({
  startAt: startAtDate.value,
  endAt: endAtDate.value,
}));
const validIntervalHandler = (newValue) => {
  startAtDate.value = newValue.startAt;
  endAtDate.value = newValue.endAt;
  errors.value.interval = null;
};
const invalidIntervalHandler = (errorMessage) => {
  errors.value.interval = errorMessage;
};

const resetData = () => {
  title.value = "";
  description.value = "";
  date.value = null;
  startAtDate.value = null;
  endAtDate.value = null;
  level.value = "normal";
};

const fatalError = ref(null);

const errors = ref({
  title: null,
  description: null,
  date: null,
  interval: null,
  level: null,
});

const hasError = computed(() => {
  let result = false;

  for (const key in errors.value) {
    if (Object.hasOwnProperty.call(errors.value, key)) {
      if (errors.value[key]) {
        result = true;
        break;
      }
    }
  }

  return result;
});

const canCreated = computed(
  () => !props.hasConcurrentProcess && !hasError.value
);

const createEventHandler = async () => {
  if (canCreated.value) {
    try {
      createProcessing.value = true;

      const data = {
        title: title.value,
        description: description.value,
        level: level.value,
        startAt: startAtDate.value,
        endAt: endAtDate.value,
      };

      await eventStore.storeEvent(data);

      createProcessing.value = false;
      emit("event:created");
    } catch (error) {
      createProcessing.value = false;
      fatalError.value = error;
      emit("cancelled");
    }
  }
};

watch(createProcessing, (newValue) => {
  if (newValue) {
    emit("event:creating");
  }
});

useReset(() => props.reset, [resetData], emit);
</script>

<style scoped>
</style>