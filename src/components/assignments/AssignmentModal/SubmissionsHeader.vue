<template>
  <div class="flex items-center justify-between">
    <h4 class="text-lg font-medium text-black dark:text-white">
      Student Submissions ({{ submissionCount }})
    </h4>
    <div class="text-sm text-neutral-500 dark:text-neutral-400">
      {{ stats }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  submissionCount: number;
  stats: string;
}

defineProps<Props>();
</script>
