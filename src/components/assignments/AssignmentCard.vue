<!-- AssignmentCard.vue -->
<template>
  <div
    class="bg-white dark:bg-black rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
  >
    <!-- Card Header -->
    <div class="p-6 pb-4">
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <h3
            class="text-lg font-semibold text-gray-900 dark:text-white truncate"
          >
            {{ assignment.title }}
          </h3>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {{ getSubjectName(assignment.subject) }}
          </p>
        </div>
        <div class="flex items-center space-x-2 ml-4">
          <!-- Type Badge -->
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="getTypeClasses(assignment.type)"
          >
            {{ assignment.type }}
          </span>
          <!-- Status Badge -->
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="getStatusClasses(assignment.isActive)"
          >
            {{ assignment.isActive ? "Active" : "Inactive" }}
          </span>
        </div>
      </div>
    </div>

    <!-- Card Content -->
    <div class="px-6 pb-4">
      <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {{ assignment.description }}
      </p>
    </div>

    <!-- Card Details -->
    <div class="px-6 pb-4 space-y-2">
      <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clip-rule="evenodd"
          />
        </svg>
        Due: {{ formatDate(assignment.dueDate) }}
      </div>
      <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        Max Score: {{ assignment.maxScore }} points
      </div>
      <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clip-rule="evenodd"
          />
        </svg>
        {{ assignment.teacher?.name || "Unknown Teacher" }}
      </div>
    </div>

    <!-- Submission Status for Students -->
    <div v-if="userRole === 'student'" class="px-6 pb-4">
      <div
        v-if="hasUserSubmitted"
        class="flex items-center text-sm text-green-600 dark:text-green-400"
      >
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        Submitted
      </div>
      <div
        v-else-if="isOverdue"
        class="flex items-center text-sm text-red-600 dark:text-red-400"
      >
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
        Overdue
      </div>
      <div
        v-else
        class="flex items-center text-sm text-yellow-600 dark:text-yellow-400"
      >
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        Pending
      </div>
    </div>

    <!-- Card Actions -->
    <div class="px-6 py-4 bg-gray-50 dark:bg-[#121212]/50 rounded-b-lg">
      <div class="flex items-center justify-between">
        <button
          @click="$emit('view', assignment)"
          class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors"
        >
          View Details
        </button>

        <div class="flex items-center space-x-3">
          <!-- Submit Button for Students -->
          <button
            v-if="userRole === 'student' && !hasUserSubmitted && !isOverdue"
            @click="$emit('submit', assignment)"
            class="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
          >
            <svg
              class="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Submit
          </button>

          <!-- Teacher Actions -->
          <template v-if="canEdit">
            <button
              @click="$emit('edit', assignment)"
              class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium transition-colors"
            >
              Edit
            </button>
            <button
              @click="$emit('delete', assignment)"
              class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium transition-colors"
            >
              Delete
            </button>
          </template>
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
  canEdit: boolean;
  userRole?: string;
  currentUserId?: string;
}

const props = defineProps<Props>();

defineEmits<{
  view: [assignment: Assignment];
  edit: [assignment: Assignment];
  delete: [assignment: Assignment];
  submit: [assignment: Assignment];
}>();

const hasUserSubmitted = computed(() => {
  if (!props.assignment.submissions || !props.currentUserId) return false;
  return props.assignment.submissions.some(
    (submission: any) =>
      submission.student?.id === props.currentUserId ||
      submission.student?._id === props.currentUserId
  );
});

const isOverdue = computed(() => {
  const now = new Date();
  const dueDate = new Date(props.assignment.dueDate);
  return now > dueDate;
});

const getSubjectName = (subject: any) => {
  return typeof subject === "string"
    ? subject
    : subject?.name || "Unknown Subject";
};

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

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
