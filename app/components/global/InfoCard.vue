<template>
  <div class="card-container" :class="{ 'opacity-50': disabled }">
    <p v-if="title" class="card-title">
      {{ title }}
    </p>
    <p v-if="subtitle" class="card-subtitle">
      {{ subtitle }}
    </p>
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
import type { InfoCardProps } from "../components";
const props = defineProps<InfoCardProps>();
</script>
<style scoped>
.card-container {
  @apply bg-gray-800 rounded-lg p-3 space-y-2;
}
.card-title {
  @apply text-sm font-medium;
}
.card-subtitle {
  @apply text-xs text-gray-400;
}
</style>
