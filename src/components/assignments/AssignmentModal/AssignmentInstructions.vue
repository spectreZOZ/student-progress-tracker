<template>
  <div>
    <h4 class="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
      Instructions
    </h4>
    <div
      class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
    >
      <p class="text-sm text-blue-900 dark:text-blue-200 whitespace-pre-wrap">
        {{ instructions }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  instructions: string;
}

defineProps<Props>();
</script>
