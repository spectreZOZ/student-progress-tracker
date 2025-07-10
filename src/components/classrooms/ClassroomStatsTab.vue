<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
      ></div>
      <p class="ml-3 text-sm text-gray-500 dark:text-gray-400">
        Loading statistics...
      </p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <div
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
              Error loading statistics
            </h3>
            <p class="mt-1 text-sm text-red-700 dark:text-red-300">
              {{ error }}
            </p>
            <button
              @click="fetchStats"
              class="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Statistics Content -->
    <div v-else-if="stats" class="space-y-6">
      <!-- Key Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg
                class="h-8 w-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt
                  class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate"
                >
                  Total Students
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ stats.totalStudents }}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg
                class="h-8 w-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt
                  class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate"
                >
                  Total Subjects
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ stats.totalSubjects }}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg
                class="h-8 w-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt
                  class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate"
                >
                  Average Progress
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ stats.averageProgress }}%
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg
                class="h-8 w-8 text-purple-600"
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
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt
                  class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate"
                >
                  Classroom Grade
                </dt>
                <dd class="text-lg font-medium text-gray-900 dark:text-white">
                  Grade {{ stats.classroomInfo.grade }}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Grade Distribution Chart -->
        <!-- <div
          class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Grade Distribution
          </h3>
          <div v-if="Object.keys(stats.gradeDistribution).length > 0">
            <canvas ref="gradeChart" width="400" height="200"></canvas>
          </div>
          <div v-else class="text-center py-8">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              No grade data available
            </p>
          </div>
        </div> -->

        <!-- Performance Breakdown Chart -->
        <!-- <div
          class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Performance Breakdown
          </h3>
          <div v-if="hasPerformanceData">
            <canvas ref="performanceChart" width="400" height="200"></canvas>
          </div>
          <div v-else class="text-center py-8">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              No performance data available
            </p>
          </div>
        </div> -->
      </div>

      <!-- Performance Details -->
      <div
        class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Performance Details
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
          >
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ stats.performanceBreakdown.highPerformers }}
            </div>
            <div class="text-sm text-green-800 dark:text-green-300">
              High Performers
            </div>
            <div class="text-xs text-green-600 dark:text-green-400">
              80%+ Progress
            </div>
          </div>
          <div
            class="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
          >
            <div
              class="text-2xl font-bold text-yellow-600 dark:text-yellow-400"
            >
              {{ stats.performanceBreakdown.averagePerformers }}
            </div>
            <div class="text-sm text-yellow-800 dark:text-yellow-300">
              Average Performers
            </div>
            <div class="text-xs text-yellow-600 dark:text-yellow-400">
              50-79% Progress
            </div>
          </div>
          <div class="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <div class="text-2xl font-bold text-red-600 dark:text-red-400">
              {{ stats.performanceBreakdown.lowPerformers }}
            </div>
            <div class="text-sm text-red-800 dark:text-red-300">
              Low Performers
            </div>
            <div class="text-xs text-red-600 dark:text-red-400">
              Below 50% Progress
            </div>
          </div>
        </div>
      </div>

      <!-- Classroom Information Summary -->
      <div
        class="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Classroom Information
        </h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Name
            </dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ stats.classroomInfo.name }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Code
            </dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white font-mono">
              {{ stats.classroomInfo.code }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Grade
            </dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              Grade {{ stats.classroomInfo.grade }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
              Academic Year
            </dt>
            <dd class="mt-1 text-sm text-gray-900 dark:text-white">
              {{ stats.classroomInfo.academicYear }}
            </dd>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useClassroomStore } from "@/stores/classroomStore";

interface Props {
  classroom: any;
}

const props = defineProps<Props>();

const classroomStore = useClassroomStore();

const loading = ref(false);
const error = ref<string | null>(null);
const stats = ref<any>(null);

const fetchStats = async () => {
  if (!props.classroom?.id) return;

  loading.value = true;
  error.value = null;

  try {
    const response = await classroomStore.fetchClassroomStats(
      props.classroom.id
    );
    stats.value = response;
  } catch (err: any) {
    error.value = err.message || "Failed to load classroom statistics";
  } finally {
    loading.value = false;
  }
};

// Watch for classroom changes
watch(
  () => props.classroom?.id,
  (newId) => {
    if (newId) {
      fetchStats();
    }
  }
);

onMounted(() => {
  if (props.classroom?.id) {
    fetchStats();
  }
});
</script>
