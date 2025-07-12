<template>
  <div
    class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
  >
    <div class="flex items-center justify-between">
      <div>
        <h3 class="text-sm font-medium text-blue-900 dark:text-blue-200">
          {{ hasSubmitted ? "Assignment Submitted" : "Submit Assignment" }}
        </h3>
        <p class="mt-1 text-sm text-blue-700 dark:text-blue-300">
          {{
            hasSubmitted
              ? `You submitted this assignment on ${formatSubmissionDate()}`
              : "Click the button below to submit your work for this assignment."
          }}
        </p>
      </div>
      <div class="flex items-center space-x-3">
        <button
          v-if="!hasSubmitted"
          @click="$emit('submit-assignment')"
          :disabled="isOverdue"
          :class="[
            isOverdue
              ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white',
            'px-4 py-2 text-sm font-medium rounded transition-colors',
          ]"
        >
          {{ isOverdue ? "Overdue" : "Submit Work" }}
        </button>
        <div
          v-else
          class="flex items-center text-green-600 dark:text-green-400"
        >
          <svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-sm font-medium">Submitted</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Assignment } from "@/types";
import { useAuthStore } from "@/stores/auth";

interface Props {
  assignment: Assignment;
}

const props = defineProps<Props>();
defineEmits<{
  "submit-assignment": [];
}>();

const authStore = useAuthStore();
const currentUserId = computed(() => authStore.user?._id);

const hasSubmitted = computed(() => {
  return props.assignment.submissions?.some(
    (submission: any) =>
      (submission.student?.id === currentUserId.value ||
        submission.student?._id === currentUserId.value) &&
      submission?.status === "submitted"
  );
});

const isOverdue = computed(() => {
  const now = new Date();
  const dueDate = new Date(props.assignment.dueDate);
  return now > dueDate;
});

const formatSubmissionDate = () => {
  const submission = props.assignment.submissions?.find(
    (s: any) =>
      s.student?.id === currentUserId.value ||
      s.student?._id === currentUserId.value
  );

  if (submission) {
    return new Date(
      submission.submittedAt || submission.createdAt
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return "";
};
</script>
