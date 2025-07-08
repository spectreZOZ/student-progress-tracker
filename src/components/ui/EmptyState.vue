<template>
  <div class="text-center py-12">
    <component :is="icon" class="mx-auto h-12 w-12 text-gray-400" />
    <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
      {{ title }}
    </h3>
    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {{ description }}
    </p>
    <div v-if="$slots.action" class="mt-6">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { UsersIcon } from "@heroicons/vue/24/outline";

interface Props {
  icon?: any;
  title: string;
  description: string;
}

withDefaults(defineProps<Props>(), {
  icon: UsersIcon,
});
</script>
