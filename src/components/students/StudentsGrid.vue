<template>
  <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
    <div
      v-for="student in studentsStore.filteredStudents"
      :key="student.id"
      @click="uiStore.openStudentDetail(student.id)"
      class="card hover:shadow-md transition-shadow cursor-pointer relative"
    >
      <!-- Selection checkbox -->
      <div class="absolute top-4 left-4 z-10" @click.stop>
        <input
          type="checkbox"
          :checked="uiStore.selectedStudents.has(student.id)"
          @change="uiStore.toggleStudentSelection(student.id)"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
      </div>

      <!-- Student Avatar -->
      <div class="flex justify-center mb-4">
        <img
          class="h-20 w-20 rounded-full"
          :src="
            student.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(
              student.name
            )}&background=3b82f6&color=fff`
          "
          :alt="student.name"
        />
      </div>

      <!-- Student Info -->
      <div class="text-center mb-4">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white">
          {{ student.name }}
        </h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Grade {{ student.grade }} • {{ student.email }}
        </p>
      </div>

      <!-- Progress -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300"
            >Overall Progress</span
          >
          <span class="text-sm font-semibold text-gray-900 dark:text-white"
            >{{ student.overallProgress }}%</span
          >
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 dark:bg-[#101010]">
          <div
            class="h-2 rounded-full transition-all duration-300"
            :class="getProgressColor(student.overallProgress)"
            :style="{ width: `${student.overallProgress}%` }"
          ></div>
        </div>
      </div>

      <!-- Subjects -->
      <div class="mb-4">
        <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Subjects
        </h4>
        <div class="space-y-2">
          <div
            v-for="subject in student.subjects.slice(0, 3)"
            :key="subject.id"
            class="flex justify-between items-center"
          >
            <span class="text-sm text-gray-600 dark:text-gray-400">{{
              subject.name
            }}</span>
            <span class="text-sm font-medium text-gray-900 dark:text-white"
              >{{ subject.progress }}%</span
            >
          </div>
          <div
            v-if="student.subjects.length > 3"
            class="text-sm text-gray-500 dark:text-gray-400"
          >
            +{{ student.subjects.length - 3 }} more
          </div>
        </div>
      </div>

      <!-- Status and Last Activity -->
      <div class="flex justify-between items-center">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="getStatusColor(student.status)"
        >
          {{ student.status.replace("-", " ").toUpperCase() }}
        </span>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          {{ formatDistanceToNow(student.lastActivity, { addSuffix: true }) }}
        </span>
      </div>

      <!-- Quick Actions -->
      <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div class="flex justify-between" @click.stop>
          <button
            class="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            View Details
          </button>
          <button
            class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Message
          </button>
          <button
            class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Report
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStudentsStore } from "@/stores/students";
import { useUIStore } from "@/stores/ui";
import { formatDistanceToNow } from "date-fns";
import type { Student } from "@/types";

const studentsStore = useStudentsStore();
const uiStore = useUIStore();

const getProgressColor = (progress: number) => {
  if (progress >= 80) return "bg-green-500";
  if (progress >= 60) return "bg-yellow-500";
  return "bg-red-500";
};

const getStatusColor = (status: Student["status"]) => {
  const colors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    inactive: "bg-gray-100 text-gray-800 dark:bg-[#101010] dark:text-gray-300",
    "at-risk": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return colors[status];
};
</script>
