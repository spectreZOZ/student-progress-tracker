<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"
      ></div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
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
            Error loading assignments
          </h3>
          <p class="mt-1 text-sm text-red-700 dark:text-red-300">
            {{ error }}
          </p>
        </div>
      </div>
    </div>

    <!-- Assignments Grid -->
    <div
      v-else-if="assignments.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <AssignmentCard
        v-for="assignment in assignments"
        :key="assignment.id"
        :assignment="assignment"
        :can-edit="canEditAssignment(assignment)"
        :user-role="userRole"
        :current-user-id="currentUserId"
        @view="$emit('view', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @submit="$emit('submit', $event)"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
        No assignments found
      </h3>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ emptyMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Assignment } from "@/types";
import AssignmentCard from "./AssignmentCard.vue";

interface Props {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
  emptyMessage: string;
  currentUserId?: string;
  userRole?: string;
}

const props = defineProps<Props>();

defineEmits<{
  view: [assignment: Assignment];
  edit: [assignment: Assignment];
  delete: [assignment: Assignment];
  submit: [assignment: Assignment];
}>();

const canEditAssignment = (assignment: Assignment) => {
  if (props.userRole !== "teacher") return false;
  return (
    assignment.teacher?.id === props.currentUserId ||
    assignment.teacher?._id === props.currentUserId
  );
};
</script>
