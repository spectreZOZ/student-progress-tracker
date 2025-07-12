<template>
  <div
    class="bg-white dark:bg-black/40 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
  >
    <!-- Card Header -->
    <div class="p-6 border-b border-gray-100">
      <div class="flex justify-between items-start">
        <div class="flex-1">
          <h3 class="text-lg font-semibold mb-1">
            {{ subject.name }}
          </h3>
          <p class="text-sm text-gray-400 mb-2">{{ subject.code }}</p>
          <p class="text-sm text-gray-500 line-clamp-2">
            {{ subject.description }}
          </p>
        </div>

        <!-- Status Badge -->
        <span
          :class="[
            'px-2 py-1 text-xs font-medium rounded-full',
            subject.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800',
          ]"
        >
          {{ subject.isActive ? "Active" : "Inactive" }}
        </span>
      </div>
    </div>

    <!-- Card Body -->
    <div class="p-6">
      <!-- Teacher Info -->
      <div class="flex items-center mb-4">
        <svg
          class="h-4 w-4 text-gray-400 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span class="text-sm text-gray-300">{{ subject.teacher.name }}</span>
      </div>

      <!-- Students Count -->
      <div class="flex items-center mb-4">
        <svg
          class="h-4 w-4 text-gray-400 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <span class="text-sm text-gray-300"
          >{{ subject.students.length }} students</span
        >
      </div>

      <!-- Average Grade (if student data exists) -->
      <div v-if="averageGrade" class="flex items-center mb-4">
        <svg
          class="h-4 w-4 text-gray-400 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        <span class="text-sm text-gray-300">Avg Grade: {{ averageGrade }}</span>
      </div>
    </div>

    <!-- Card Actions -->
    <div
      class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-100 rounded-b-lg"
    >
      <div class="flex justify-between items-center">
        <!-- Primary Action -->
        <button
          @click="$emit('view-details', subject)"
          class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors"
        >
          View Details
        </button>

        <!-- Action Menu -->
        <div class="flex items-center space-x-2">
          <!-- Stats Button (Teachers and Admins only) -->
          <button
            v-if="canViewStats"
            @click="$emit('view-stats', subject)"
            class="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
            title="View Statistics"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </button>

          <!-- Edit Button -->
          <button
            v-if="canEdit"
            @click="$emit('edit', subject)"
            class="p-2 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit Subject"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>

          <!-- Delete Button (Admin only) -->
          <button
            v-if="canDelete"
            @click="$emit('delete', subject)"
            class="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete Subject"
          >
            <svg
              class="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { SubjectProp } from "@/stores/subjectStore";
import { useAuthStore } from "@/stores/auth";

interface Props {
  subject: SubjectProp;
  userRole: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "view-details": [subject: SubjectProp];
  edit: [subject: SubjectProp];
  delete: [subject: SubjectProp];
  "view-stats": [subject: SubjectProp];
}>();

const authStore = useAuthStore();

const currentUser = computed(() => authStore.user);

const averageGrade = computed(() => {
  if (!props.subject.students.length) return null;

  const gradeValues = {
    "A+": 4.0,
    A: 4.0,
    "B+": 3.5,
    B: 3.0,
    "C+": 2.5,
    C: 2.0,
    "D+": 1.5,
    D: 1.0,
    F: 0.0,
  };

  const total = props.subject.students.reduce(
    (sum, student) => sum + (gradeValues[student.grade] || 0),
    0
  );

  return (total / props.subject.students.length).toFixed(1);
});

const canEdit = computed(
  () =>
    props.userRole === "admin" ||
    (props.userRole === "teacher" &&
      props.subject.teacher._id === currentUser?.value?._id) // You'll need to check against actual user
);

const canDelete = computed(() => props.userRole === "admin");

const canViewStats = computed(
  () =>
    props.userRole === "admin" ||
    (props.userRole === "teacher" &&
      props.subject.teacher._id === currentUser?.value?._id)
);
</script>
