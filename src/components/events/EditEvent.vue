<template>
  <form @submit.prevent="updateEventHandler" class="">
    <TitleInput
      @title:valid="validTitleHandler"
      @title:invalid="invalidTitleHandler"
      :default="props.event.title"
    />

    <DescriptionInput
      @description:valid="validDescriptionHandler"
      @description:invalid="invalidDescriptionHandler"
      :default="props.event.description"
    />

    <LevelRadioInput
      @level:valid="validLevelHandler"
      @level:invalid="invalidLevelHandler"
      :default="props.event.level"
    />

    <IntervalInput
      @interval:valid="validIntervalHandler"
      @interval:invalid="invalidIntervalHandler"
      :default="defaultInterval"
      :day="props.event.startAt"
      :actualEvent="props.event"
      reason="edit"
    />

    <ErrorMessage v-if="fatalError" :error="fatalError" class="mb-5" />

    <div class="flex flex-row items-baseline gap-5">
      <ButtonUI
        variant="solid"
        color="primary"
        type="submit"
        class="!px-11"
        :hasError="!canUpdate"
        :isProcessing="updateProcessing"
      >
        <i>
          <fa-icon icon="floppy-disk" class="inline-block mr-2" />
        </i>
        Save
      </ButtonUI>

      <ButtonUI
        @click="cancelUpdateHandler"
        variant="outlined"
        color="disabled"
        :hasError="props.hasConcurrentProcess"
      >
        Cancel
      </ButtonUI>
    </div>
  </form>
</template>

<script setup>
import ButtonUI from "@/components/ui/ButtonUI.vue";
import ErrorMessage from "@/components/common/ErrorMessage.vue";
import TitleInput from "@/components/events/TitleInput.vue";
import DescriptionInput from "@/components/events/DescriptionInput.vue";
import LevelRadioInput from "@/components/events/LevelRadioInput.vue";
import IntervalInput from "@/components/events/IntervalInput.vue";
import { useEventStore } from "@/stores/event.js";
import { useDefaultReset, useReset } from "@/utils/composables";

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
  reset: {
    type: Boolean,
    required: false,
  },
});

const emit = defineEmits(["updating", "updated", "cancelled", "resettled"]);

const eventStore = useEventStore();

const updateProcessing = ref(false);

const title = ref(props.event.title);
const validTitleHandler = (newValue) => {
  title.value = newValue;
  errors.value.title = null;
};
const invalidTitleHandler = (errorMessage) => {
  errors.value.title = errorMessage;
};

const description = ref(props.event.description);
const validDescriptionHandler = (newValue) => {
  description.value = newValue;
  errors.value.description = null;
};
const invalidDescriptionHandler = (errorMessage) => {
  errors.value.description = errorMessage;
};

const level = ref(props.event.level);
const validLevelHandler = (newValue) => {
  level.value = newValue;
  errors.value.level = null;
};
const invalidLevelHandler = (errorMessage) => {
  errors.value.level = errorMessage;
};

const startAtDate = ref(props.event.startAt);
const endAtDate = ref(props.event.endAt);
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

const hasChange = computed(
  () =>
    title.value !== props.event.title ||
    description.value !== props.event.description ||
    level.value != props.event.level ||
    startAtDate.value.getTime() !== props.event.startAt.getTime() ||
    endAtDate.value.getTime() !== props.event.endAt.getTime()
);
const resetUpdates = () => {
  title.value = props.event.title;
  description.value = props.event.description;
  startAtDate.value = props.event.startAt;
  endAtDate.value = props.event.endAt;
  level.value = props.event.level;
};
const fatalError = ref(null);
const errors = ref({
  title: null,
  description: null,
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

const canUpdate = computed(
  () => !props.hasConcurrentProcess && hasChange.value && !hasError.value
);

const updateEventHandler = async () => {
  if (canUpdate.value) {
    try {
      updateProcessing.value = true;

      const data = {
        title: title.value,
        description: description.value,
        level: level.value,
        status: props.event.status,
        startAt: startAtDate.value,
        endAt: endAtDate.value,
      };

      await eventStore.updateEvent(props.event._id, data);

      updateProcessing.value = false;

      emit("updated");
    } catch (error) {
      updateProcessing.value = false;
      fatalError.value = error;
      emit("cancelled");
    }
  }
};

useDefaultReset(() => props.event, [resetUpdates]);
useReset(() => props.reset, [resetUpdates], emit);

watch(updateProcessing, (newValue) => {
  if (newValue) {
    emit("updating");
  }
});

const cancelUpdateHandler = () => {
  if (!props.hasConcurrentProcess) {
    emit("updated"); // ! we emit "updated" because we want to close the update view
  }
};
</script>

<style scoped>
</style>