<template>
  <div class="overflow-hidden">
    <div class="space-y-3">
      <div
        v-for="(student, index) in students"
        :key="student.id"
        class="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#101010] rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <span
              class="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary-100 text-primary-800 text-sm font-medium dark:bg-primary-900 dark:text-primary-200"
            >
              {{ index + 1 }}
            </span>
          </div>
          <div class="flex items-center space-x-3">
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
            <div>
              <div class="text-sm font-medium text-gray-900 dark:text-white">
                {{ student.name }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Grade {{ student.grade }}
              </div>
            </div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ student.overallProgress }}%
          </div>
          <div class="text-xs text-gray-500 dark:text-gray-400">
            {{ student.subjects.length }} subjects
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Student } from "@/types";

interface Props {
  students: Student[];
}

defineProps<Props>();
</script>
