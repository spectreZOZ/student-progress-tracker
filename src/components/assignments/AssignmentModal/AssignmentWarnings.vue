<template>
  <div class="space-y-4">
    <!-- Due Soon Warning -->
    <div
      v-if="isDueSoon"
      class="rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
    >
      <div class="flex">
        <svg
          class="w-5 h-5 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Assignment Due Soon
          </h3>
          <p class="mt-1 text-sm text-yellow-700 dark:text-yellow-300">
            This assignment is due {{ getTimeUntilDue() }}.
          </p>
        </div>
      </div>
    </div>

    <!-- Overdue Warning -->
    <div
      v-if="isOverdue"
      class="rounded-lg p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
    >
      <div class="flex">
        <svg
          class="w-5 h-5 text-red-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800 dark:text-red-200">
            Assignment Overdue
          </h3>
          <p class="mt-1 text-sm text-red-700 dark:text-red-300">
            This assignment was due {{ getOverdueTime() }} ago.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Assignment } from "@/types";

interface Props {
  assignment: Assignment;
}

const props = defineProps<Props>();

const isDueSoon = computed(() => {
  const now = new Date();
  const dueDate = new Date(props.assignment.dueDate);
  const timeDiff = dueDate.getTime() - now.getTime();
  const daysDiff = timeDiff / (1000 * 3600 * 24);
  return daysDiff > 0 && daysDiff <= 3;
});

const isOverdue = computed(() => {
  const now = new Date();
  const dueDate = new Date(props.assignment.dueDate);
  return now > dueDate;
});

const getTimeUntilDue = () => {
  const now = new Date();
  const dueDate = new Date(props.assignment.dueDate);
  const timeDiff = dueDate.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (daysDiff === 1) return "tomorrow";
  if (daysDiff === 0) return "today";
  return `in ${daysDiff} days`;
};

const getOverdueTime = () => {
  const now = new Date();
  const dueDate = new Date(props.assignment.dueDate);
  const timeDiff = now.getTime() - dueDate.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

  if (daysDiff === 0) return "today";
  if (daysDiff === 1) return "1 day";
  return `${daysDiff} days`;
};
</script>
