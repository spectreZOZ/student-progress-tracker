<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Comprehensive insights into student performance and platform usage
          </p>
        </div>
        <div class="mt-4 sm:mt-0">
          <select v-model="selectedPeriod" class="input">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div v-for="metric in keyMetrics" :key="metric.title" class="card">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <component :is="metric.icon" class="h-8 w-8 text-primary-600" />
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt
                  class="text-sm font-medium text-gray-500 truncate dark:text-gray-400"
                >
                  {{ metric.title }}
                </dt>
                <dd class="flex items-baseline">
                  <div
                    class="text-2xl font-semibold text-gray-900 dark:text-white"
                  >
                    {{ metric.value }}
                  </div>
                  <div
                    class="ml-2 flex items-baseline text-sm font-semibold"
                    :class="
                      metric.trend === 'up'
                        ? 'text-green-600'
                        : metric.trend === 'down'
                        ? 'text-red-600'
                        : 'text-gray-500'
                    "
                  >
                    <ArrowTrendingUpIcon
                      v-if="metric.trend === 'up'"
                      class="h-4 w-4 flex-shrink-0"
                    />
                    <ArrowTrendingDownIcon
                      v-else-if="metric.trend === 'down'"
                      class="h-4 w-4 flex-shrink-0"
                    />
                    <span>{{ metric.change }}</span>
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Student Progress Distribution -->
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Progress Distribution
          </h3>
          <ProgressDistributionChart :data="progressDistributionData" />
        </div>

        <!-- Platform Usage -->
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Platform Usage
          </h3>
          <PlatformUsageChart :data="platformUsageData" />
        </div>

        <!-- Engagement Over Time -->
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Student Engagement Trends
          </h3>
          <EngagementChart :data="engagementData" />
        </div>

        <!-- Subject Performance -->
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Subject Performance Comparison
          </h3>
          <SubjectPerformanceChart :data="subjectPerformanceData" />
        </div>
      </div>

      <!-- Performance Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Performers -->
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Top Performers
          </h3>
          <TopPerformersTable :students="topPerformers" />
        </div>

        <!-- At-Risk Students -->
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Students Requiring Attention
          </h3>
          <AtRiskStudentsTable :students="atRiskStudents" />
        </div>
      </div>

      <!-- Detailed Analytics -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Detailed Analytics
          </h3>
          <button class="btn btn-secondary">
            <DocumentArrowDownIcon class="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
        <DetailedAnalyticsTable />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  UsersIcon,
  AcademicCapIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentArrowDownIcon,
} from "@heroicons/vue/24/outline";
import AppLayout from "@/components/layout/AppLayout.vue";
import ProgressDistributionChart from "@/components/analytics/ProgressDistributionChart.vue";
import PlatformUsageChart from "@/components/analytics/PlatformUsageChart.vue";
import EngagementChart from "@/components/analytics/EngagementChart.vue";
import SubjectPerformanceChart from "@/components/analytics/SubjectPerformanceChart.vue";
import TopPerformersTable from "@/components/analytics/TopPerformersTable.vue";
import AtRiskStudentsTable from "@/components/analytics/AtRiskStudentsTable.vue";
import DetailedAnalyticsTable from "@/components/analytics/DetailedAnalyticsTable.vue";
import { useStudentsStore } from "@/stores/students";

const studentsStore = useStudentsStore();
const selectedPeriod = ref("30d");

const keyMetrics = computed(() => [
  {
    title: "Total Students",
    value: studentsStore.students.length.toString(),
    change: "+12%",
    trend: "up",
    icon: UsersIcon,
  },
  {
    title: "Average Progress",
    value: `${Math.round(
      studentsStore.students.reduce((acc, s) => acc + s.overallProgress, 0) /
        studentsStore.students.length || 0
    )}%`,
    change: "+5.2%",
    trend: "up",
    icon: AcademicCapIcon,
  },
  {
    title: "Total Study Time",
    value: "1,247h",
    change: "+8.1%",
    trend: "up",
    icon: ClockIcon,
  },
  {
    title: "Completion Rate",
    value: "78%",
    change: "-2.3%",
    trend: "down",
    icon: ChartBarIcon,
  },
]);

const topPerformers = computed(() =>
  [...studentsStore.students]
    .sort((a, b) => b.overallProgress - a.overallProgress)
    .slice(0, 5)
);

const atRiskStudents = computed(() =>
  studentsStore.students.filter(
    (s) => s.status === "at-risk" || s.overallProgress < 60
  )
);

const progressDistributionData = computed(() => ({
  labels: ["0-20%", "21-40%", "41-60%", "61-80%", "81-100%"],
  datasets: [
    {
      data: [
        studentsStore.students.filter((s) => s.overallProgress <= 20).length,
        studentsStore.students.filter(
          (s) => s.overallProgress > 20 && s.overallProgress <= 40
        ).length,
        studentsStore.students.filter(
          (s) => s.overallProgress > 40 && s.overallProgress <= 60
        ).length,
        studentsStore.students.filter(
          (s) => s.overallProgress > 60 && s.overallProgress <= 80
        ).length,
        studentsStore.students.filter((s) => s.overallProgress > 80).length,
      ],
      backgroundColor: [
        "rgba(239, 68, 68, 0.8)",
        "rgba(245, 158, 11, 0.8)",
        "rgba(59, 130, 246, 0.8)",
        "rgba(16, 185, 129, 0.8)",
        "rgba(34, 197, 94, 0.8)",
      ],
    },
  ],
}));

const platformUsageData = computed(() => ({
  labels: ["MathPlatform", "ScienceLab", "LiteratureHub", "HistoryPortal"],
  datasets: [
    {
      data: [35, 25, 20, 20],
      backgroundColor: [
        "rgba(59, 130, 246, 0.8)",
        "rgba(16, 185, 129, 0.8)",
        "rgba(245, 158, 11, 0.8)",
        "rgba(139, 92, 246, 0.8)",
      ],
    },
  ],
}));

const engagementData = computed(() => ({
  labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
  datasets: [
    {
      label: "Active Students",
      data: [45, 52, 48, 61, 58, 67],
      borderColor: "rgb(59, 130, 246)",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      tension: 0.1,
    },
    {
      label: "Average Session Time (min)",
      data: [25, 28, 22, 35, 32, 38],
      borderColor: "rgb(16, 185, 129)",
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      tension: 0.1,
    },
  ],
}));

const subjectPerformanceData = computed(() => {
  const subjects = ["Mathematics", "Science", "Literature", "History"];
  return {
    labels: subjects,
    datasets: [
      {
        label: "Average Score",
        data: subjects.map((subject) => {
          const subjectData = studentsStore.students.flatMap((s) =>
            s.subjects.filter((sub) => sub.name === subject)
          );
          return subjectData.length > 0
            ? Math.round(
                subjectData.reduce((acc, sub) => acc + sub.progress, 0) /
                  subjectData.length
              )
            : 0;
        }),
        backgroundColor: "rgba(59, 130, 246, 0.8)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  };
});

onMounted(() => {
  studentsStore.fetchStudents();
});
</script>
