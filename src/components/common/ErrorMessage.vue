<template>
  <div class="bg-red-100 text-center px-3 py-5 border-l-4 border-red-400">
    <i class="text-red-700 text-4xl mb-2 inline-block">
      <fa-icon icon="exclamation-circle" />
    </i>

    <h3 class="text-red-700 font-bold">Oups ! An error occurred.</h3>

    <p class="text-red-700">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup>
import { AxiosError } from "axios";
import { computed } from "vue";

const props = defineProps({
  error: {
    type: Error,
    required: true,
  },
});

const errorMessage = computed(() => {
  let result = "Something is not working properly. \nPlease try again.";

  if (props.error instanceof AxiosError) {
    if (props.error.response.data?.error.message) {
      result = props.error.response.data?.error.message;
    } else if (props.error?.response.status) {
      const statusMessage = {
        400: "Sorry, the request can not be processed. Please, try again.",
        401: "Sorry, you must be authenticated to access this resource. Please, log in.",
        404: "Sorry, the resource is not found.",
        403: "Sorry, you don't have the right permission to access this resource.",
        409: "Sorry, the action is in conflict with our records. Please, try again.",
        500: "Sorry, the server encountered an error. We are trying to fix that.",
      };

      result = statusMessage[props.error.response.status];
    }
  }

  return result;
});
</script>

<style scoped>
</style>