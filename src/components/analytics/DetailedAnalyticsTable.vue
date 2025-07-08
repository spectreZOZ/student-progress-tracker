<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead class="bg-gray-50 dark:bg-[#121212]">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
          >
            Student
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
          >
            Grade
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
          >
            Progress
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
          >
            Time Spent
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
          >
            Subjects
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
          >
            Last Activity
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300"
          >
            Status
          </th>
        </tr>
      </thead>
      <tbody
        class="bg-white divide-y divide-gray-200 dark:bg-[#0d0d0d] dark:divide-gray-700"
      >
        <tr
          v-for="student in studentsStore.students"
          :key="student.id"
          class="hover:bg-gray-50 dark:hover:bg-[#101010]"
        >
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <img
                class="h-8 w-8 rounded-full"
                :src="
                  student.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    student.name
                  )}&background=3b82f6&color=fff`
                "
                :alt="student.name"
              />
              <div class="ml-3">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ student.name }}
                </div>
              </div>
            </div>
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
          >
            {{ student.grade }}
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
          >
            {{ student.overallProgress }}%
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
          >
            {{ getTotalTimeSpent(student) }}min
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
          >
            {{ student.subjects.length }}
          </td>
          <td
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400"
          >
            {{ formatDistanceToNow(student.lastActivity, { addSuffix: true }) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getStatusColor(student.status)"
            >
              {{ student.status.replace("-", " ").toUpperCase() }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { formatDistanceToNow } from "date-fns";
import { useStudentsStore } from "@/stores/students";
import type { Student } from "@/types";

const studentsStore = useStudentsStore();

const getTotalTimeSpent = (student: Student) => {
  return student.subjects.reduce(
    (total, subject) => total + subject.timeSpent,
    0
  );
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
