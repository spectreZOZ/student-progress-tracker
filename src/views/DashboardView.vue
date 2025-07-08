<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="stat in stats" :key="stat.name" class="card">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <component :is="stat.icon" class="h-6 w-6 text-gray-400" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt
                  class="text-sm font-medium text-gray-500 truncate dark:text-gray-400"
                >
                  {{ stat.name }}
                </dt>
                <dd class="flex items-baseline">
                  <div
                    class="text-2xl font-semibold text-gray-900 dark:text-white"
                  >
                    {{ stat.value }}
                  </div>
                  <div
                    class="ml-2 flex items-baseline text-sm font-semibold"
                    :class="
                      stat.changeType === 'increase'
                        ? 'text-green-600'
                        : 'text-red-600'
                    "
                  >
                    <ArrowUpIcon
                      v-if="stat.changeType === 'increase'"
                      class="h-4 w-4 flex-shrink-0"
                    />
                    <ArrowDownIcon v-else class="h-4 w-4 flex-shrink-0" />
                    {{ stat.change }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Progress Chart -->
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Student Progress Overview
          </h3>
          <ProgressChart :data="progressChartData" />
        </div>

        <!-- Activity Chart -->
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Weekly Activity
          </h3>
          <ActivityChart :data="activityChartData" />
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Recent Student Activity
          </h3>
          <router-link
            to="/students"
            class="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            View all
          </router-link>
        </div>
        <RecentActivity :activities="recentActivities" />
      </div>

      <!-- At-Risk Students Alert -->
      <div
        v-if="atRiskStudents.length > 0"
        class="card border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <ExclamationTriangleIcon class="h-5 w-5 text-yellow-400" />
          </div>
          <div class="ml-3">
            <h3
              class="text-sm font-medium text-yellow-800 dark:text-yellow-200"
            >
              Students Requiring Attention
            </h3>
            <div class="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
              <p>
                {{ atRiskStudents.length }} students are showing signs of
                disengagement or falling behind.
              </p>
            </div>
            <div class="mt-4">
              <div class="-mx-2 -my-1.5 flex">
                <router-link
                  to="/students?status=at-risk"
                  class="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-200 dark:hover:bg-yellow-700"
                >
                  View students
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import {
  UsersIcon,
  AcademicCapIcon,
  ClockIcon,
  TrophyIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/outline";
import AppLayout from "@/components/layout/AppLayout.vue";
import ProgressChart from "@/components/dashboard/ProgressChart.vue";
import ActivityChart from "@/components/dashboard/ActivityChart.vue";
import RecentActivity from "@/components/dashboard/RecentActivity.vue";
import { useStudentsStore } from "@/stores/students";
import { useAuthStore } from "@/stores/auth";

const studentsStore = useStudentsStore();
const authStore = useAuthStore();

const stats = computed(() => [
  {
    name: "Total Students",
    value: studentsStore.students.length,
    change: "+4.75%",
    changeType: "increase",
    icon: UsersIcon,
  },
  {
    name: "Average Progress",
    value: `${Math.round(
      studentsStore.students.reduce((acc, s) => acc + s.overallProgress, 0) /
        studentsStore.students.length || 0
    )}%`,
    change: "+2.3%",
    changeType: "increase",
    icon: AcademicCapIcon,
  },
  {
    name: "Active This Week",
    value: studentsStore.students.filter((s) => s.status === "active").length,
    change: "+1.2%",
    changeType: "increase",
    icon: ClockIcon,
  },
  {
    name: "Completed Assignments",
    value: "156",
    change: "-3.1%",
    changeType: "decrease",
    icon: TrophyIcon,
  },
]);

const atRiskStudents = computed(() =>
  studentsStore.students.filter((s) => s.status === "at-risk")
);

const recentActivities = computed(() => studentsStore.activities.slice(0, 5));

const progressChartData = computed(() => ({
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    {
      label: "Average Progress",
      data: [65, 72, 78, 85],
      borderColor: "rgb(59, 130, 246)",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      tension: 0.1,
    },
  ],
}));

const activityChartData = computed(() => ({
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Active Students",
      data: [12, 19, 15, 25, 22, 8, 5],
      backgroundColor: "rgba(59, 130, 246, 0.5)",
      borderColor: "rgb(59, 130, 246)",
      borderWidth: 1,
    },
  ],
}));

onMounted(() => {
  studentsStore.fetchStudents();
  studentsStore.fetchActivities();
});
</script>
