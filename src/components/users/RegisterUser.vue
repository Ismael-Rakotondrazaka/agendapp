<template>
  <form @submit.prevent="" action="">
    <div
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
      class="flex flex-row gap-px"
    >
      <FirstNameInput
        @firstName:valid="validFirstNameHandler"
        @firstName:invalid="invalidFirstNameHandler"
        :reset="props.reset"
        class="!w-1/2"
      />

      <LastNameInput
        @lastName:valid="validLastNameHandler"
        @lastName:invalid="invalidLastNameHandler"
        :reset="props.reset"
        class="!w-1/2"
      />
    </div>

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
          delay: 600,
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
          delay: 800,
        },
      }"
      @password:valid="validPasswordHandler"
      @password:invalid="invalidPasswordHandler"
      @password:visible="visiblePasswordHandler"
      @password:invisible="invisiblePasswordHandler"
      :showPassword="showPassword"
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
          delay: 1000,
        },
      }"
      class="!mb-12"
      @password:valid="validPasswordConfirmationHandler"
      @password:invalid="invalidPasswordConfirmationHandler"
      :customValidators="[customPasswordConfirmationValidator]"
      @password:visible="visiblePasswordHandler"
      @password:invisible="invisiblePasswordHandler"
      :showPassword="showPassword"
      :reset="props.reset"
    />

    <transition
      @leave="(el, done) => motions.registerUserErrorMessage?.leave(done)"
    >
      <ErrorMessage
        v-motion="'registerUserErrorMessage'"
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
          delay: 1200,
        },
      }"
      @click="registerHandler"
      class="w-full"
      :isProcessing="registerProcessing"
      :hasError="hasError"
      type="submit"
    >
      Register and start
    </ButtonUI>
  </form>
</template>

<script setup>
import ButtonUI from "@/components/ui/ButtonUI.vue";
import ErrorMessage from "@/components/common/ErrorMessage.vue";
import FirstNameInput from "@/components/users/FirstNameInput.vue";
import LastNameInput from "@/components/users/LastNameInput.vue";
import EmailInput from "@/components/users/EmailInput.vue";
import PasswordInput from "@/components/users/PasswordInput.vue";

import { useReset } from "@/utils/composables";
import { useUserStore } from "@/stores/user.js";

import { ref, computed, watch } from "vue";
import { useMotions } from "@vueuse/motion";

const props = defineProps({
  reset: {
    type: Boolean,
    required: false,
  },
});

const userStore = useUserStore();

const motions = useMotions();

const emit = defineEmits([
  "user:registering",
  "user:registered",
  "resettled",
  "cancelled",
]);

const firstName = ref("");
const validFirstNameHandler = (newValue) => {
  errors.value.firstName = null;
  firstName.value = newValue;
};
const invalidFirstNameHandler = (errorMessage) => {
  errors.value.firstName = errorMessage;
};

const lastName = ref("");
const validLastNameHandler = (newValue) => {
  errors.value.lastName = null;
  lastName.value = newValue;
};
const invalidLastNameHandler = (errorMessage) => {
  errors.value.lastName = errorMessage;
};

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

const passwordConfirmation = ref("");
const customPasswordConfirmationValidator = (newValue) => {
  let result = true;

  if (newValue !== password.value) {
    result = "Password confirmation should be the same as the password.";
  }

  return result;
};
const validPasswordConfirmationHandler = (newValue) => {
  errors.value.passwordConfirmation = null;
  passwordConfirmation.value = newValue;
};
const invalidPasswordConfirmationHandler = (errorMessage) => {
  errors.value.passwordConfirmation = errorMessage;
};

const registerProcessing = ref(false);

const errors = ref({
  firstName: null,
  lastName: null,
  email: null,
  password: null,
  passwordConfirmation: null,
});

const resetData = () => {
  firstName.value = "";
  lastName.value = "";
  email.value = "";
  password.value = "";
  passwordConfirmation.value = "";
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

const registerHandler = async () => {
  if (!registerProcessing.value && !hasError.value) {
    try {
      registerProcessing.value = true;
      fatalError.value = null;
      emit("user:registering");

      const data = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
        passwordValidation: passwordConfirmation.value, // see the key
      };

      await userStore.registerUser(data);

      registerProcessing.value = false;
      emit("user:registered");
    } catch (error) {
      fatalError.value = error;
      registerProcessing.value = false;
      emit("cancelled");
    }
  }
};

watch([firstName, lastName, email, password, passwordConfirmation], () => {
  fatalError.value = null;
});

useReset(() => props.reset, [resetData], emit);
</script>

<style scoped>
</style>