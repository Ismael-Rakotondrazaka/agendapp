<template>
  <ul class="relative">
    <transition-group :css="false">
      <li
        v-for="(event, index) in props.events"
        :key="event._id"
        :event="event"
        class="mb-5 last:mb-0"
        v-motion="event._id"
        :initial="{
          opacity: 0,
          y: 100,
        }"
        :enter="{
          opacity: 1,
          y: 0,
          transition: {
            duration: 600,
            delay: index * 150,
          },
        }"
        :leave="{
          opacity: 0,
          position: 'absolute',
          width: '100%',
          transition: {
            duration: 600,
            delay: index * 150,
          },
        }"
        :id="event._id"
      >
        <EventItem :event="event" />
      </li>
    </transition-group>
  </ul>
</template>

<script setup>
import EventItem from "@/components/events/EventItem.vue";

const props = defineProps({
  events: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
</style>