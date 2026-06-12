<template>
  <div class="avatar-container">
    <p class="avatar-text">{{ avatarPlaceholder }}</p>
  </div>
</template>
<script setup lang="ts">
import type { AvatarProps } from "../components";
const props = defineProps<AvatarProps>();

const avatarPlaceholder = computed(() => {
  const words = props.name?.trim().split(/\s+/) ?? [];

  if (!words.length) return "";

  return [words[0]![0], words.length > 1 ? words.at(-1)?.[0] : ""]
    .join("")
    .toUpperCase();
});
</script>
<style scoped>
.avatar-container {
  @apply w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center;
}
.avatar-text {
  @apply text-sm font-bold;
}
</style>
