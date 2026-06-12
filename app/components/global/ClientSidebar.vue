<template>
  <aside class="sidebar-container">
    <div>
      <h2 v-if="title" class="sidebar-title">{{ title }}</h2>
      <div v-if="name" class="sidebar-avatar">
        <Avatar :name="name" />
        <div>
          <p class="sidebar-avatar_name">{{ name }}</p>
        </div>
      </div>
    </div>
    <slot></slot>
    <div v-if="footerText" class="mt-auto">
      <p class="sidebar-footer_text">{{ footerText }}</p>
    </div>
  </aside>
</template>
<script setup lang="ts">
import type { SidebarProps } from "../components";
const props = defineProps<SidebarProps>();
</script>
<style scoped>
.sidebar-container {
  @apply w-64 bg-gray-900 p-4 border-r border-gray-800 flex flex-col gap-4;
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
