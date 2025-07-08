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
                    v-if="stat.change"
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

      <!-- Activity Statistics -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Activity Stats -->
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Activity Statistics
          </h3>
          <div v-if="isLoadingStats" class="flex justify-center py-8">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
            ></div>
          </div>
          <div v-else-if="activityStats" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ activityStats.totalActivities }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  Total Activities
                </div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ Object.keys(activityStats.activitiesByType || {}).length }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  Activity Types
                </div>
              </div>
            </div>

            <!-- Top Activity Types -->
            <div v-if="activityStats.activitiesByType">
              <h4
                class="text-sm font-medium text-gray-900 dark:text-white mb-2"
              >
                Top Activity Types
              </h4>
              <div class="space-y-2">
                <div
                  v-for="[type, count] in Object.entries(
                    activityStats.activitiesByType
                  ).slice(0, 5)"
                  :key="type"
                  class="flex justify-between items-center"
                >
                  <span
                    class="text-sm text-gray-600 dark:text-gray-300 capitalize"
                  >
                    {{ type.replace("_", " ") }}
                  </span>
                  <span
                    class="text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {{ count }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Active Students -->
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Most Active Students
          </h3>
          <div v-if="isLoadingStats" class="flex justify-center py-8">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
            ></div>
          </div>
          <div v-else-if="activityStats?.topStudents" class="space-y-3">
            <div
              v-for="student in activityStats.topStudents.slice(0, 5)"
              :key="student.studentId"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-3">
                <img
                  class="h-8 w-8 rounded-full"
                  :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    student.studentName
                  )}&background=3b82f6&color=fff`"
                  :alt="student.studentName"
                />
                <span class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ student.studentName }}
                </span>
              </div>
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ student.activityCount }} activities
              </span>
            </div>
          </div>
          <div v-else class="text-center py-8">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              No activity data available
            </p>
          </div>
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

        <div v-if="isLoadingActivities" class="flex justify-center py-8">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"
          ></div>
        </div>

        <div v-else-if="recentActivities.length > 0" class="space-y-4">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
          >
            <div class="flex items-center space-x-3">
              <div class="flex-shrink-0">
                <div
                  class="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
                >
                  <component
                    :is="getActivityIcon(activity.type)"
                    class="h-4 w-4 text-primary-600 dark:text-primary-400"
                  />
                </div>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ activity.description || activity.action || activity.type }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{
                    formatDistanceToNow(new Date(activity.createdAt), {
                      addSuffix: true,
                    })
                  }}
                </p>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <span
                v-if="activity.subject"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
              >
                {{ activity.subject }}
              </span>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {{ activity.type }}
              </span>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            No recent activities
          </p>
        </div>
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
import { computed, onMounted, ref } from "vue";
import {
  UsersIcon,
  AcademicCapIcon,
  ClockIcon,
  TrophyIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ExclamationTriangleIcon,
  BookOpenIcon,
  PlayIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  ArrowDownTrayIcon,
} from "@heroicons/vue/24/outline";
import { formatDistanceToNow } from "date-fns";
import AppLayout from "@/components/layout/AppLayout.vue";
import { useStudentsStore } from "@/stores/students";
import { useAuthStore } from "@/stores/auth";
import activitiesService, {
  type ActivityStats,
  type Activity,
} from "@/services/activitiesService";

const studentsStore = useStudentsStore();
const authStore = useAuthStore();

// Reactive state
const activityStats = ref<ActivityStats | null>(null);
const recentActivities = ref<Activity[]>([]);
const isLoadingStats = ref(false);
const isLoadingActivities = ref(false);

const calculateChange = (newNumber: number, prevNumber: number): number => {
  // If previous number is 0
  if (prevNumber === 0) {
    // If new number is also 0, return 0% change
    if (newNumber === 0) return 0;
    // If new number is not 0, return 100% increase
    return 100;
  }

  const change = ((newNumber - prevNumber) / prevNumber) * 100;
  return Math.round(change);
};

const stats = computed(() => [
  {
    name: "Total Students",
    value: studentsStore.students.length,
    change: `${calculateChange(studentsStore.count, studentsStore.prevCount)}%`,
    changeType:
      studentsStore.count > studentsStore.prevCount ? "increase" : "decrease",
    icon: UsersIcon,
  },
  {
    name: "Average Progress",
    value: `${Math.round(
      studentsStore.students.reduce(
        (acc, s) => acc + (s.overallProgress || 0),
        0
      ) / studentsStore.students.length || 0
    )}%`,
    // change: "+2.3%",
    changeType: "increase",
    icon: AcademicCapIcon,
  },
  {
    name: "Active This Week",
    value: studentsStore.students.filter((s) => s.status === "active").length,
    // change: "+1.2%",
    changeType: "increase",
    icon: ClockIcon,
  },
  {
    name: "Total Activities",
    value: activityStats.value?.totalActivities || 0,
    change: null,
    changeType: "increase",
    icon: TrophyIcon,
  },
]);

const atRiskStudents = computed(() =>
  studentsStore.students.filter((s) => s.status === "at-risk")
);

// Get appropriate icon for activity type
const getActivityIcon = (type: string) => {
  const iconMap: Record<string, any> = {
    login: UsersIcon,
    assignment_submit: DocumentTextIcon,
    quiz_complete: AcademicCapIcon,
    lesson_view: BookOpenIcon,
    forum_post: ChatBubbleLeftIcon,
    file_download: ArrowDownTrayIcon,
  };
  return iconMap[type] || PlayIcon;
};

// Fetch activity statistics
const fetchActivityStats = async () => {
  isLoadingStats.value = true;
  try {
    const result = await activitiesService.getActivityStats({
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // Last 30 days
    });

    if (result.success && result.data) {
      activityStats.value = result.data;
    }
  } catch (error) {
    console.error("Error fetching activity stats:", error);
  } finally {
    isLoadingStats.value = false;
  }
};

// Fetch recent activities
const fetchRecentActivities = async () => {
  isLoadingActivities.value = true;
  try {
    const result = await activitiesService.getActivities({
      page: 1,
      limit: 10,
    });

    if (result.success && result.data) {
      recentActivities.value = result.data.data || [];
    }
  } catch (error) {
    console.error("Error fetching recent activities:", error);
  } finally {
    isLoadingActivities.value = false;
  }
};

const allowedRoles = ["admin", "teacher"];

onMounted(() => {
  if (allowedRoles.includes(authStore?.user?.role)) {
    studentsStore.fetchStudents();
    fetchActivityStats();
    fetchRecentActivities();
  }
});
</script>
