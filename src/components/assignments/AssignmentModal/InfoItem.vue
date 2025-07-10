<template>
  <div>
    <h4 class="text-sm font-medium text-neutral-500 dark:text-neutral-400">
      {{ label }}
    </h4>
    <p class="mt-1 text-sm text-black dark:text-white">
      {{ value }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  value: string;
}

defineProps<Props>();
</script>
