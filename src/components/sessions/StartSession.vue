<template>
  <form @submit.prevent="startSessionHandler" action="" method="POST">
    <EmailInput
      v-motion
      :initial="{
        opacity: 0,
        x: -150,
      }"
      :enter="{
        opacity: 1,
        x: 0,
        transition: {
          duration: 500,
          delay: 400,
        },
      }"
      @email:valid="validEmailHandler"
      @email:invalid="invalidEmailHandler"
      :reset="props.reset"
    />

    <PasswordInput
      v-motion
      :initial="{
        opacity: 0,
        x: -150,
      }"
      :enter="{
        opacity: 1,
        x: 0,
        transition: {
          duration: 500,
          delay: 600,
        },
      }"
      @password:valid="validPasswordHandler"
      @password:invalid="invalidPasswordHandler"
      @password:visible="visiblePasswordHandler"
      @password:invisible="invisiblePasswordHandler"
      :showPassword="showPassword"
      :reset="props.reset"
      class="!mb-12"
    />

    <transition
      @leave="(el, done) => motions.startSessionErrorMessage?.leave(done)"
    >
      <ErrorMessage
        v-motion="'startSessionErrorMessage'"
        :initial="{
          scale: 0,
          opacity: 1,
        }"
        :enter="{
          scale: 1,
          opacity: 1,
          transition: {
            type: 'spring',
            stiffness: 250,
            damping: 25,
            mass: 2,
          },
        }"
        :leave="{
          scale: 0,
          opacity: 0,
          transition: {
            type: 'spring',
            delay: 200,
            stiffness: 250,
            damping: 50,
            mass: 2,
          },
        }"
        v-if="fatalError"
        :error="fatalError"
        class="mb-7"
      />
    </transition>

    <ButtonUI
      v-motion
      :initial="{
        opacity: 0,
        x: -150,
      }"
      :enter="{
        opacity: 1,
        x: 0,
        transition: {
          duration: 500,
          delay: 800,
        },
      }"
      :isProcessing="startSessionProcessing"
      :hasError="hasError"
      type="submit"
      class="w-full text-center inline-block"
    >
      <span> Login </span>
    </ButtonUI>
  </form>
</template>

<script setup>
import EmailInput from "@/components/users/EmailInput.vue";
import PasswordInput from "@/components/users/PasswordInput.vue";
import ButtonUI from "@/components/ui/ButtonUI.vue";
import ErrorMessage from "@/components/common/ErrorMessage.vue";
import { useSessionStore } from "@/stores/session.js";
import { useReset } from "@/utils/composables";
import { useMotions } from "@vueuse/motion";

import { ref, computed, watch } from "vue";

const props = defineProps({
  reset: {
    type: Boolean,
    required: false,
  },
});

const sessionStore = useSessionStore();
const motions = useMotions();

const email = ref("");
const validEmailHandler = (newValue) => {
  errors.value.email = null;
  email.value = newValue;
};
const invalidEmailHandler = (errorMessage) => {
  errors.value.email = errorMessage;
};

const password = ref("");
const validPasswordHandler = (newValue) => {
  errors.value.password = null;
  password.value = newValue;
};
const invalidPasswordHandler = (errorMessage) => {
  errors.value.password = errorMessage;
};
const showPassword = ref(false);
const visiblePasswordHandler = () => {
  showPassword.value = true;
};
const invisiblePasswordHandler = () => {
  showPassword.value = false;
};

const emit = defineEmits([
  "session:starting",
  "session:started",
  "resettled",
  "cancelled",
]);

const startSessionProcessing = ref(false);

const errors = ref({
  email: null,
  password: null,
});

const resetData = () => {
  email.value = "";
  password.value = "";
};

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

const fatalError = ref(null);

const startSessionHandler = async () => {
  if (!startSessionProcessing.value && !hasError.value) {
    try {
      fatalError.value = null;
      startSessionProcessing.value = true;
      emit("session:starting");

      await sessionStore.startSession({
        email: email.value,
        password: password.value,
      });

      startSessionProcessing.value = false;
      emit("session:started");
    } catch (error) {
      fatalError.value = error;
      startSessionProcessing.value = false;
      emit("cancelled");
    }
  }
};

watch([email, password], () => {
  fatalError.value = null;
});

useReset(() => props.reset, [resetData], emit);
</script>

<style scoped>
</style>