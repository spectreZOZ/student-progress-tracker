<template>
  <div>
    <h4 class="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
      Description
    </h4>
    <div class="bg-neutral-100 dark:bg-white/5 rounded-lg p-4">
      <p class="text-sm text-black dark:text-white whitespace-pre-wrap">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  description: string;
}

defineProps<Props>();
</script>
