<template>
  <main class="flex flex-row items-start h-screen bg-primary/20">
    <Teleport to="body" :isDisabled="move">
      <div :class="modalClass" class="z-20 bg-slate-30"></div>

      <div
        class="
          absolute
          top-0
          bottom-0
          left-0
          z-30
          overflow-y-auto
          transition-all
          duration-500
          bg-gray-5
        "
        :class="[navigationSectionClass]"
      >
        <div class="block w-full p-3 pb-0 lg:hidden">
          <div class="bg-white border border-slate-400 rounded-md shadow-md">
            <button
              @click="openCore"
              class="
                w-full
                p-3
                text-lg
                font-nunito-bold
                text-left
                border-b
                bg-red-40
                rounded-t-md
                hover:text-white hover:bg-primary
              "
            >
              <i class="mr-3">
                <fa-icon icon="list-check" />
              </i>
              Events section
            </button>
            <button
              @click="openOverview"
              class="
                w-full
                p-3
                text-lg
                font-nunito-bold
                text-left
                bg-red-40
                rounded-b-md
                hover:text-white hover:bg-primary
              "
            >
              <i class="mr-3">
                <fa-icon icon="chart-pie" />
              </i>
              Overview section
            </button>
          </div>
        </div>

        <div class="p-3 pb-0 w-full hidden xl:block">
          <NavigationDatePicker />
        </div>

        <NavigationSection class="p-3 transition-none" />
      </div>
    </Teleport>

    <Teleport to="body">
      <div class="fixed z-40 top-0 right-0 xl:hidden block bg-red-300/7">
        <button
          @click.stop="toggleSlide"
          class="
            px-3
            py-1
            text-2xl text-white
            bg-primary
            border-l-2 border-b-2
            rounded-bl-md
            border-white
            ring ring-primary
          "
        >
          <fa-icon :icon="menuIcon" />
        </button>
      </div>
    </Teleport>

    <div
      class="
        hidden3
        absolute
        left-0
        xl:left-1/4
        px-3
        md:px-[15%]
        lg:px-3
        w-full
        lg:w-1/2
        xl:w-[35%]
        top-0
        bottom-0
        py-3
        overflow-y-auto
      "
      :class="[coreClass, blurClass]"
      id="core-section-container"
    >
      <NavigationDatePicker class="mb-3 xl:hidden block" />
      <CoreSection />
    </div>

    <div
      class="
        hidden4
        absolute
        right-0
        px-3
        md:px-[15%]
        lg:px-3
        py-3
        w-full
        lg:w-1/2
        xl:w-[40%]
        top-0
        bottom-0
        bg-sky400
        overflow-y-auto
      "
      :class="[overviewClass, blurClass]"
    >
      <OverviewSection />
    </div>
  </main>
</template>

<script setup>
import NavigationSection from "@/components/sections/navigationSection/NavigationSection.vue";
import CoreSection from "@/components/sections/coreSection/CoreSection.vue";
import OverviewSection from "@/components/sections/overviewSection/OverviewSection.vue";
import NavigationDatePicker from "@/components/sections/navigationSection/NavigationDatePicker.vue";
import { useUserStore } from "@/stores/user";
import { useEventStore } from "@/stores/event";
import { useSocketStore } from "@/stores/socket";

import { ref, computed, onMounted, onUnmounted } from "vue";

const userStore = useUserStore();
const eventStore = useEventStore();
const socketStore = useSocketStore();

const move = ref(false);

const showSlide = ref(false);

const openSlide = () => move.value && (showSlide.value = true);
const closeSlide = () => move.value && (showSlide.value = false);
const toggleSlide = () => (showSlide.value ? closeSlide() : openSlide());

const coreClass = ref("");
const overviewClass = ref("");

const openOverview = () => {
  if (move.value) {
    coreClass.value = "hidden";
    overviewClass.value = "";
    closeSlide();
  }
};

const openCore = () => {
  if (move.value) {
    overviewClass.value = "hidden";
    coreClass.value = "";
    closeSlide();
  }
};

const navigationSectionClass = computed(() => {
  let result = "";

  if (move.value) {
    if (showSlide.value) {
      result = "w-full xl:w-1/4 translate-x-0 bg-primary/20 px-0 md:px-[15%]";
    } else {
      result =
        "w-full xl:w-1/4 -translate-x-[100%] bg-primary/20 px-0 md:px-[15%]";
    }
  } else {
    result = "w-1/2 xl:w-1/4 translate-x-[100%";
  }

  return result;
});

const modalClass = computed(() => {
  return showSlide.value ? "absolute inset-0 blur-s" : "";
});

const blurClass = computed(() => {
  return showSlide.value ? "blur-sm" : "";
});

const resizeHandler = () => {
  if (window.innerWidth < 1280) {
    move.value = true;

    if (window.innerWidth < 1024) {
      if (overviewClass.value === coreClass.value) {
        overviewClass.value = "hidden";
        coreClass.value = "";
      }
    } else {
      overviewClass.value = "";
      coreClass.value = "";
    }
  } else {
    closeSlide();
    move.value = false;
  }
};

const menuIcon = computed(() => (showSlide.value ? "xmark" : "bars"));

onMounted(async () => {
  resizeHandler();
  window.addEventListener("resize", resizeHandler);

  await userStore.fetchUser();
  await eventStore.fetchEvents();

  socketStore.connect();
});

onUnmounted(() => {
  // ! TypeError: EventTarget.removeEventListener: At least 2 arguments required, but only 1 passed
  window.removeEventListener("resize", resizeHandler);
});
</script>

<style scoped>
</style>