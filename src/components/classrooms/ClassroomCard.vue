<template>
  <div
    class="bg-white dark:bg-[#121212] rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow duration-200"
  >
    <div
      class="px-4 py-3 bg-[#1E1E1E]/90 text-white font-bold uppercase text-sm"
    >
      <h2>#{{ index + 1 }} - Classroom</h2>
    </div>

    <!-- Card Header -->
    <div class="p-6 pb-4">
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <h3
            class="text-lg font-semibold text-gray-900 dark:text-white truncate"
          >
            {{ classroom.name }}
          </h3>
          <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Code: {{ classroom.code }}
          </p>
        </div>
        <div class="ml-4">
          <span
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
          >
            Grade {{ classroom.grade }}
          </span>
        </div>
      </div>
    </div>

    <!-- Card Content -->
    <div class="px-6 pb-4">
      <p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
        {{ classroom.description }}
      </p>
    </div>

    <!-- Card Details -->
    <div class="px-6 pb-4 space-y-2">
      <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clip-rule="evenodd"
          />
        </svg>
        Teacher: {{ classroom.teacher?.name || "Not assigned" }}
      </div>
      <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
            clip-rule="evenodd"
          />
        </svg>
        Academic Year: {{ classroom.academicYear }}
      </div>
      <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
          />
        </svg>
        Students: {{ classroom.students?.length || 0 }}
      </div>
      <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clip-rule="evenodd"
          />
        </svg>
        Subjects: {{ classroom.subjects?.length || 0 }}
      </div>
    </div>

    <!-- Card Actions -->
    <div class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg">
      <div class="flex items-center justify-between">
        <button
          @click="$emit('view', classroom)"
          class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors"
        >
          View Details
        </button>

        <div v-if="canManage" class="flex items-center space-x-3">
          <button
            @click="$emit('edit', classroom)"
            class="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium transition-colors"
          >
            Edit
          </button>
          <button
            @click="$emit('delete', classroom)"
            class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      <div
        v-if="canManage"
        class="mt-4 w-full flex items-center flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
      >
        <!-- Subject Management Buttons -->
        <button
          @click="openAddSubjectModal"
          class="inline-flex items-center gap-2 w-full px-2 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors"
          title="Add Subject"
        >
          <svg
            class="w-5 h-5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Subject
        </button>

        <button
          @click="openRemoveSubjectModal"
          :disabled="!classroom.subjects?.length"
          class="inline-flex items-center gap-2 w-full px-2 py-1.5 bg-red-600 text-white text-xs font-medium rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Remove Subject"
        >
          <svg
            class="w-5 h-5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 12H4"
            />
          </svg>
          Remove Subject
        </button>
      </div>
    </div>

    <!-- Add Subject Modal -->
    <AddSubjectModal
      :is-open="showAddSubjectModal"
      :classroom="classroom"
      @close="closeAddSubjectModal"
      @added="handleSubjectAdded"
    />

    <!-- Remove Subject Modal -->
    <RemoveSubjectModal
      :is-open="showRemoveSubjectModal"
      :classroom="classroom"
      @close="closeRemoveSubjectModal"
      @removed="handleSubjectRemoved"
    />
  </div>
</template>

<script setup lang="ts">
import type { Classroom } from "@/types";
import { ref } from "vue";
import AddSubjectModal from "@/components/classrooms/subjects/AddSubjectModal.vue";
import RemoveSubjectModal from "@/components/classrooms/subjects/RemoveSubjectModal.vue";

interface Props {
  classroom: Classroom;
  canManage: boolean;
  index: number;
}

defineProps<Props>();

defineEmits<{
  view: [classroom: Classroom];
  edit: [classroom: Classroom];
  delete: [classroom: Classroom];
}>();

// Modal state
const showAddSubjectModal = ref(false);
const showRemoveSubjectModal = ref(false);

// Modal handlers
const openAddSubjectModal = () => {
  showAddSubjectModal.value = true;
};

const closeAddSubjectModal = () => {
  showAddSubjectModal.value = false;
};

const openRemoveSubjectModal = () => {
  showRemoveSubjectModal.value = true;
};

const closeRemoveSubjectModal = () => {
  showRemoveSubjectModal.value = false;
};

const handleSubjectAdded = () => {
  closeAddSubjectModal();
  // Optionally emit an event to refresh classroom data
};

const handleSubjectRemoved = () => {
  closeRemoveSubjectModal();
  // Optionally emit an event to refresh classroom data
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
