<template>
  <div class="mb-6">
    <nav class="flex space-x-8" aria-label="Tabs">
      <button
        @click="$emit('update:activeTab', 'overview')"
        :class="[
          activeTab === 'overview'
            ? '!border-black dark:!border-white text-black dark:text-white'
            : '!border-transparent text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:!border-neutral-300 dark:hover:!border-neutral-600',
          'whitespace-nowrap cursor-pointer py-2 px-1 border-b-2 font-medium text-sm transition-colors',
        ]"
      >
        Overview
      </button>
      <button
        v-if="userRole === 'teacher'"
        @click="$emit('update:activeTab', 'submissions')"
        :class="[
          activeTab === 'submissions'
            ? '!border-black dark:!border-white text-black dark:text-white'
            : '!border-transparent text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:!border-neutral-300 dark:hover:!border-neutral-600',
          'whitespace-nowrap cursor-pointer py-2 px-1 border-b-2 font-medium text-sm transition-colors',
        ]"
      >
        Submissions
        <span
          v-if="assignment?.submissions?.length"
          class="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
        >
          {{ assignment.submissions.length }}
        </span>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import type { Assignment } from "@/types";

interface Props {
  activeTab: "overview" | "submissions";
  assignment: Assignment;
  userRole: string | undefined;
}

defineProps<Props>();
defineEmits<{
  "update:activeTab": [tab: "overview" | "submissions"];
}>();
</script>
