<template>
  <ExpandItem
    :showContent="showContent"
    @closed="closeContent"
    @opened="openContent"
  >
    <template #header>
      <i class="mr-3">
        <fa-icon icon="user" />
      </i>
      Account
    </template>

    <div class="p-3 bg-white">
      <ul>
        <li class="mb-2 last:mb-0">
          <span class="mr-2 text-black underline">Full name: </span>
          <span class="font-rubik-bold text-primary">{{
            userStore.user?.fullName
          }}</span>
        </li>
        <li class="mb-2 last:mb-0">
          <span class="mr-2 text-black underline">Email address: </span>
          <span class="font-rubik-bold text-primary">
            {{ userStore.user?.email }}
          </span>
        </li>
        <li class="mb-2 last:mb-0">
          <span class="mr-2 text-black underline">Member since: </span>
          <span class="font-rubik-bold text-primary">
            {{ formattedCreatedAt }}
          </span>
        </li>
      </ul>
    </div>
  </ExpandItem>
</template>

<script setup>
import ExpandItem from "@/components/common/ExpandItem.vue";
import { useUserStore } from "@/stores/user.js";
import { formatDate } from "@/utils/dates";

import { ref, computed } from "vue";

const showContent = ref(false);
const openContent = () => (showContent.value = true);
const closeContent = () => (showContent.value = false);
const userStore = useUserStore();

const formattedCreatedAt = computed(() =>
  userStore.user ? formatDate(userStore.user.createdAt) : ""
);
</script>

<style scoped>
</style>
