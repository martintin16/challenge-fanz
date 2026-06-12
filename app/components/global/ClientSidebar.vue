<template>
  <div
    v-if="modelValue"
    class="sidebar-backdrop md:hidden"
    @click="emit('update:modelValue', false)"
  />
  <aside
    class="sidebar-container"
    :class="modelValue ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
  >
    <div class="flex items-start justify-between">
      <div>
        <h2 v-if="title" class="sidebar-title">{{ title }}</h2>
        <div v-if="name" class="sidebar-avatar">
          <Avatar :name="name" />
          <p class="sidebar-avatar_name">{{ name }}</p>
        </div>
      </div>
      <button
        class="md:hidden text-gray-400 hover:text-white p-1 -mt-0.5 -mr-0.5 flex-shrink-0"
        @click="emit('update:modelValue', false)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <slot></slot>
    <div v-if="footerText" class="mt-auto">
      <p class="sidebar-footer_text">{{ footerText }}</p>
    </div>
  </aside>
</template>
<script setup lang="ts">
import type { SidebarProps } from "../components";
const props = defineProps<SidebarProps & { modelValue?: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
</script>
<style scoped>
.sidebar-container {
  @apply fixed md:relative z-40 md:z-auto top-0 left-0 h-full w-72 md:w-64 bg-gray-900 p-4 border-r border-gray-800 flex flex-col gap-4 transition-transform duration-300 ease-in-out overflow-y-auto;
}
.sidebar-backdrop {
  @apply fixed inset-0 z-30 bg-black/60 backdrop-blur-sm;
}
.sidebar-title {
  @apply font-bold text-purple-400 mb-3;
}
.sidebar-avatar {
  @apply flex items-center gap-2 mb-3;
}
.sidebar-avatar_name {
  @apply text-sm font-medium;
}
.sidebar-footer_text {
  @apply text-xs text-gray-600 text-center;
}
</style>
