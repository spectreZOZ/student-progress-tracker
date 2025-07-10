<template>
  <div
    class="border border-neutral-200 dark:border-white/10 rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <!-- Student Avatar -->
        <div
          class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium"
        >
          {{ getInitials(submission.student?.name || "Unknown") }}
        </div>

        <!-- Student Info -->
        <div>
          <p class="text-sm font-medium text-black dark:text-white">
            {{ submission.student?.name || "Unknown Student" }}
          </p>
          <p class="text-xs text-neutral-500 dark:text-neutral-400">
            {{ submission.student?.email || "No email" }}
          </p>
        </div>
      </div>

      <!-- Submission Status & Score -->
      <div class="flex items-center space-x-4">
        <!-- Score -->

        <div v-if="submission.score !== undefined" class="text-right">
          <p class="text-sm font-medium text-black dark:text-white">
            {{ submission.score }} / {{ assignment.maxScore }}
          </p>
          <p class="text-xs text-neutral-500 dark:text-neutral-400">
            {{ Math.round((submission.score / assignment.maxScore) * 100) }}%
          </p>
        </div>

        <!-- Status Badge -->
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="getSubmissionStatusClasses(submission)"
        >
          {{ getSubmissionStatus(submission) }}
        </span>
      </div>
    </div>

    <!-- Submission Details -->
    <SubmissionDetails :submission="submission" />

    <!-- Feedback -->

    <div v-if="submission.feedback" class="mt-3">
      <span class="text-neutral-500 dark:text-neutral-400 text-sm"
        >Feedback:</span
      >
      <div
        class="mt-1 p-3 bg-neutral-100 dark:bg-white/5 rounded text-sm text-black dark:text-white"
      >
        {{ submission.feedback || "No feedback" }}
      </div>
    </div>

    <!-- Attachments List -->

    <div v-if="submission.attachments?.length" class="mt-3">
      <span class="text-neutral-500 dark:text-neutral-400 text-sm">Files:</span>
      <div class="mt-1 flex flex-wrap gap-2">
        <a
          v-for="attachment in submission.attachments"
          :key="attachment.filename"
          :href="attachment.url"
          target="_blank"
          class="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
        >
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
          {{ attachment.filename }}
        </a>
      </div>
    </div>

    <!-- Actions for Teachers -->
    <div
      v-if="canEditAssignment && !submission.gradedAt"
      class="mt-3 flex justify-end"
    >
      <button
        @click="$emit('grade-submission', submission)"
        class="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
      >
        Grade Submission
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Assignment } from "@/types";
import SubmissionDetails from "./SubmissionDetails.vue";

interface Props {
  submission: any;
  assignment: Assignment;
  canEditAssignment: boolean;
}

defineProps<Props>();
defineEmits<{
  "grade-submission": [submission: any];
}>();

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getSubmissionStatus = (submission: any) => {
  if (submission.gradedAt || submission.score !== undefined) {
    return "Graded";
  }
  return "Pending";
};

const getSubmissionStatusClasses = (submission: any) => {
  if (submission.gradedAt || submission.score !== undefined) {
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
  }
  return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
};
</script>
