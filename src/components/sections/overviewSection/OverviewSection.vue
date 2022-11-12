<template>
  <div>
    <div class="mb-3 rounded-md border border-slate-400 shadow-md">
      <CustomCalendar class="border-b border-slate-400" />

      <CustomPie class="rounded-b-md" />
    </div>

    <CustomLines />
  </div>
</template>

<script setup>
import CustomCalendar from "@/components/common/CustomCalendar.vue";
import CustomPie from "@/components/common/CustomPie.vue";
import CustomLines from "@/components/common/CustomLines.vue";
</script>

<style scoped>
</style>