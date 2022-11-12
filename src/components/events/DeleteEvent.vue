<template>
  <div>
    <ErrorMessage v-if="fatalError" :error="fatalError" class="mb-3" />

    <p class="mb-5 text-lg">Are you sure you want to delete this event?</p>

    <div class="flex flex-row items-baseline gap-5">
      <ButtonUI
        variant="solid"
        color="danger"
        @click="deleteEventHandler"
        :isProcessing="deleteProcessing"
        :hasError="props.hasConcurrentProcess"
        class="!px-11"
      >
        <i>
          <fa-icon icon="trash" class="inline-block mr-2" />
        </i>
        Confirm and delete
      </ButtonUI>

      <ButtonUI
        @click="cancelDeleteHandler"
        variant="outlined"
        color="disabled"
        :hasError="props.hasConcurrentProcess"
      >
        Cancel
      </ButtonUI>
    </div>
  </div>
</template>

<script setup>
import ButtonUI from "@/components/ui/ButtonUI.vue";
import ErrorMessage from "@/components/common/ErrorMessage.vue";
import { useEventStore } from "@/stores/event.js";

import { ref, watch } from "vue";

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

const emit = defineEmits(["deleted", "deleting", "cancelled"]);

const eventStore = useEventStore();

const deleteProcessing = ref(false);

const fatalError = ref(null);

const deleteEventHandler = async () => {
  if (!props.hasConcurrentProcess) {
    try {
      fatalError.value = null;
      deleteProcessing.value = true;

      await eventStore.destroyEvent(props.event._id);

      deleteProcessing.value = false;
      emit("deleted");
    } catch (error) {
      emit("cancelled");
      deleteProcessing.value = false;
      fatalError.value = error;
    }
  }
};

watch(deleteProcessing, (newValue) => {
  if (newValue) {
    emit("deleting");
  }
});

const cancelDeleteHandler = () => {
  if (!props.hasConcurrentProcess) {
    emit("deleted");
  }
};
</script>

<style scoped>
</style>