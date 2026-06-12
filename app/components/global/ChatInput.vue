<template>
  <div class="p-4 border-t border-gray-800 bg-gray-900">
    <div
      class="flex items-center gap-2 items-end bg-gray-800 rounded-xl px-4 py-3 focus-within:ring-1 focus-within:ring-gray-600"
    >
      <textarea
        :value="modelValue"
        ref="inputRef"
        @keydown.enter.exact.prevent="emit('send')"
        @input="onInput"
        rows="1"
        :placeholder="placeholder"
        class="flex-1 bg-transparent resize-none outline-none text-sm placeholder-gray-500 max-h-32 leading-relaxed"
      ></textarea>
      <Button
        @click="emit('send')"
        :disabled="!modelValue.trim() || disabled"
        label="Enviar"
        type="tertiary"
      />
    </div>
    <p class="text-xs text-gray-600 text-center mt-2">
      Enter para enviar · Shift+Enter para nueva línea
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ChatInputProps } from "../components";

const props = withDefaults(defineProps<ChatInputProps>(), {
  disabled: false,
  placeholder: "",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
  send: [];
}>();

const inputRef = ref<HTMLTextAreaElement | null>(null);

const onInput = (e: Event) => {
  const el = e.target as HTMLTextAreaElement;
  emit("update:modelValue", el.value);
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight, 128) + "px";
};

watch(
  () => props.modelValue,
  (val) => {
    if (val === "" && inputRef.value) inputRef.value.style.height = "auto";
  },
);

defineExpose({ focus: () => inputRef.value?.focus() });
</script>

<style scoped>
textarea {
  field-sizing: content;
}
</style>
