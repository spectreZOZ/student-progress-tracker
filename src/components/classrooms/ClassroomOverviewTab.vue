<template>
  <div class="space-y-6">
    <!-- Classroom Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div>
          <h4
            class="text-sm font-medium text-neutral-500 dark:text-neutral-400"
          >
            Classroom Code
          </h4>
          <p class="mt-1 text-sm text-black dark:text-white font-mono">
            {{ classroom.code }}
          </p>
        </div>
        <div>
          <h4
            class="text-sm font-medium text-neutral-500 dark:text-neutral-400"
          >
            Academic Year
          </h4>
          <p class="mt-1 text-sm text-black dark:text-white">
            {{ classroom.academicYear }}
          </p>
        </div>
        <div>
          <h4
            class="text-sm font-medium text-neutral-500 dark:text-neutral-400"
          >
            Teacher
          </h4>
          <p class="mt-1 text-sm text-black dark:text-white">
            {{ classroom.teacher?.name || "Not assigned" }}
          </p>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <h4
            class="text-sm font-medium text-neutral-500 dark:text-neutral-400"
          >
            Total Students
          </h4>
          <p class="mt-1 text-sm text-black dark:text-white">
            {{ classroom.students?.length || 0 }}
          </p>
        </div>
        <div>
          <h4
            class="text-sm font-medium text-neutral-500 dark:text-neutral-400"
          >
            Total Subjects
          </h4>
          <p class="mt-1 text-sm text-black dark:text-white">
            {{ classroom.subjects?.length || 0 }}
          </p>
        </div>
        <div>
          <h4
            class="text-sm font-medium text-neutral-500 dark:text-neutral-400"
          >
            Created
          </h4>
          <p class="mt-1 text-sm text-black dark:text-white">
            {{ formatDate(classroom.createdAt) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div>
      <h4
        class="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2"
      >
        Description
      </h4>
      <div class="bg-neutral-100 dark:bg-white/5 rounded-lg p-4">
        <p class="text-sm text-black dark:text-white whitespace-pre-wrap">
          {{ classroom.description || "No description provided" }}
        </p>
      </div>
    </div>

    <!-- Students Section -->
    <div v-if="classroom.students?.length">
      <h4
        class="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-3"
      >
        Students ({{ classroom.students.length }})
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="student in classroom.students"
          :key="student.id || student._id"
          class="flex items-center p-3 bg-neutral-100 dark:bg-white/5 rounded-lg"
        >
          <div
            class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3"
          >
            {{ getInitials(student.name) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-black dark:text-white truncate">
              {{ student.name }}
            </p>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {{ student.email }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Subjects Section -->
    <div v-if="classroom.subjects?.length">
      <h4
        class="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-3"
      >
        Subjects ({{ classroom.subjects.length }})
      </h4>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-for="subject in classroom.subjects"
          :key="subject.id || subject._id"
          class="p-3 bg-neutral-100 dark:bg-white/5 rounded-lg"
        >
          <p class="text-sm font-medium text-black dark:text-white">
            {{ subject.name }}
          </p>
          <p class="text-xs text-neutral-500 dark:text-neutral-400">
            Code: {{ subject.code }}
          </p>
        </div>
      </div>
      <div
        v-if="canManage"
        class="mt-4 w-full flex items-center flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3"
      >
        <!-- Subject Management Buttons -->
        <button
          @click="addSubjectModal"
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
          @click="removeSubjectModal"
          :disabled="!classroom?.subjects?.length"
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

    <!-- Empty States -->
    <div v-if="!classroom.students?.length && !classroom.subjects?.length">
      <div class="text-center py-8 bg-neutral-50 dark:bg-white/5 rounded-lg">
        <svg
          class="mx-auto h-12 w-12 text-neutral-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <h3
          class="mt-2 text-sm font-medium text-neutral-900 dark:text-neutral-100"
        >
          No students or subjects yet
        </h3>
        <p class="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          Students and subjects can be added to this classroom.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Classroom } from "@/types";

interface Props {
  classroom: Classroom;
  canManage: boolean;
  addSubjectModal: () => void;
  removeSubjectModal: () => void;
}

defineProps<Props>();

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
