<template>
  <div class="flex items-center justify-between mb-6">
    <div class="flex items-center space-x-3">
      <DialogTitle
        as="h3"
        class="text-xl font-semibold leading-6 text-black dark:text-white"
      >
        {{ assignment?.title }}
      </DialogTitle>
      <span
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        :class="getTypeClasses(assignment?.type || '')"
      >
        {{ assignment?.type }}
      </span>
      <span
        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        :class="getStatusClasses(assignment?.isActive || false)"
      >
        {{ assignment?.isActive ? "Active" : "Inactive" }}
      </span>
    </div>
    <button
      @click="$emit('close')"
      class="rounded-md text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
    >
      <svg
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { DialogTitle } from "@headlessui/vue";
import type { Assignment } from "@/types";

interface Props {
  assignment: Assignment;
}

defineProps<Props>();
defineEmits<{
  close: [];
}>();

const getTypeClasses = (type: string) => {
  switch (type) {
    case "homework":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "quiz":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    case "project":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "exam":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  }
};

const getStatusClasses = (isActive: boolean) => {
  return isActive
    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
};
</script>
