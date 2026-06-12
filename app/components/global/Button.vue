<template>
  <button :class="[type]" :disabled>
    {{ label }}
  </button>
</template>
<script setup lang="ts">
import type { ButtonProps } from "../components";
const props = withDefaults(defineProps<ButtonProps>(), {
  type: "primary",
  disabled: false,
});
</script>
<style scoped>
button {
  @apply text-sm border border-gray-700 rounded-lg px-4 py-1.5 transition-colors;
}

.primary {
  @apply text-xs text-gray-500 hover:text-gray-300 px-3;
}

.secondary {
  @apply text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-full py-2;
}

.tertiary {
  @apply text-white font-medium bg-purple-600 hover:bg-purple-500 flex-shrink-0 disabled:bg-gray-700 disabled:text-gray-500 border-none;
}
</style>
