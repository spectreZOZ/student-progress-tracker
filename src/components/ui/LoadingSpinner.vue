<template>
  <div class="flex items-center justify-center" :class="containerClass">
    <div
      class="animate-spin rounded-full border-2 border-gray-300 border-t-primary-600"
      :class="spinnerClass"
    ></div>
    <span v-if="text" class="ml-2 text-sm text-gray-600 dark:text-gray-400">
      {{ text }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  size?: "sm" | "md" | "lg";
  text?: string;
  fullScreen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: "md",
  fullScreen: false,
});

const containerClass = computed(() => ({
  "fixed inset-0 bg-white bg-opacity-75 z-50": props.fullScreen,
  "p-4": !props.fullScreen,
}));

const spinnerClass = computed(() => ({
  "h-4 w-4": props.size === "sm",
  "h-8 w-8": props.size === "md",
  "h-12 w-12": props.size === "lg",
}));
</script>
