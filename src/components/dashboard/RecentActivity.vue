<template>
  <div class="flow-root">
    <ul role="list" class="-mb-8">
      <li v-for="(activity, activityIdx) in activities" :key="activity.id">
        <div class="relative pb-8">
          <span
            v-if="activityIdx !== activities.length - 1"
            class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-[#2a2a2a]"
            aria-hidden="true"
          />
          <div class="relative flex space-x-3">
            <div>
              <span
                class="h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800"
                :class="getActivityColor(activity.type)"
              >
                <component
                  :is="getActivityIcon(activity.type)"
                  class="h-4 w-4"
                />
              </span>
            </div>
            <div class="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ activity.description }}
                  <span class="font-medium text-gray-900 dark:text-white">
                    {{ getStudentName(activity.studentId) }}
                  </span>
                </p>
              </div>
              <div
                class="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400"
              >
                <time :datetime="activity.timestamp.toISOString()">
                  {{ formatRelativeTime(activity.timestamp) }}
                </time>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {
  UserIcon,
  DocumentTextIcon,
  ClockIcon,
  AcademicCapIcon,
} from "@heroicons/vue/24/solid";
import type { Activity } from "@/types";
import { useStudentsStore } from "@/stores/students";
import { formatDistanceToNow } from "date-fns";

interface Props {
  activities: Activity[];
}

defineProps<Props>();

const studentsStore = useStudentsStore();

const getActivityIcon = (type: Activity["type"]) => {
  const icons = {
    login: UserIcon,
    assignment_submit: DocumentTextIcon,
    quiz_complete: AcademicCapIcon,
    lesson_view: ClockIcon,
  };
  return icons[type] || ClockIcon;
};

const getActivityColor = (type: Activity["type"]) => {
  const colors = {
    login: "bg-blue-500",
    assignment_submit: "bg-green-500",
    quiz_complete: "bg-purple-500",
    lesson_view: "bg-yellow-500",
  };
  return colors[type] || "bg-[#414141]";
};

const getStudentName = (studentId: string) => {
  const student = studentsStore.getStudentById(studentId);
  return student?.name || "Unknown Student";
};

const formatRelativeTime = (date: Date) => {
  return formatDistanceToNow(date, { addSuffix: true });
};
</script>
