<template>
  <div class="overflow-hidden">
    <div class="space-y-3">
      <div
        v-for="student in students"
        :key="student.id"
        class="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900 rounded-lg border-l-4 border-red-400"
      >
        <div class="flex items-center space-x-3">
          <img
            class="h-8 w-8 rounded-full"
            :src="
              student.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                student.name
              )}&background=ef4444&color=fff`
            "
            :alt="student.name"
          />
          <div>
            <div class="text-sm font-medium text-gray-900 dark:text-white">
              {{ student.name }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              Grade {{ student.grade }} • {{ getRiskReason(student) }}
            </div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm font-semibold text-red-600 dark:text-red-400">
            {{ student.overallProgress }}%
          </div>
          <span
            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200"
          >
            {{ student.status.replace("-", " ").toUpperCase() }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDistanceToNow } from "date-fns";
import type { Student } from "@/types";

interface Props {
  students: Student[];
}

defineProps<Props>();

const getRiskReason = (student: Student) => {
  if (student.status === "at-risk") return "At risk status";
  if (student.overallProgress < 60) return "Low progress";
  const daysSinceActivity = Math.floor(
    (Date.now() - student.lastActivity.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceActivity > 7) return "Inactive";
  return "Requires attention";
};
</script>
