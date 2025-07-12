<template>
  <Modal
    :is-open="isOpen"
    @close="$emit('close')"
    :title="`${subject?.name} - Statistics`"
    size="large"
  >
    <div v-if="subject" class="space-y-6">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"
        ></div>
      </div>

      <!-- Stats Content -->
      <div v-else-if="stats" class="space-y-6">
        <!-- Overview Cards -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-gray-50 dark:bg-[#121212] rounded-lg p-4">
            <div class="text-2xl font-bold text-black dark:text-white">
              {{ stats.totalStudents || subject.students.length }}
            </div>
            <div class="text-sm text-gray-400">Total Students</div>
          </div>
          <div class="bg-gray-50 dark:bg-[#121212] rounded-lg p-4">
            <div class="text-2xl font-bold text-black dark:text-white">
              {{ stats.averageProgress || calculateAverageProgress() }}%
            </div>
            <div class="text-sm text-gray-400">Avg Progress</div>
          </div>
          <div class="bg-gray-50 dark:bg-[#121212] rounded-lg p-4">
            <div class="text-2xl font-bold text-black dark:text-white">
              {{ stats.averageGrade || calculateAverageGrade() }}
            </div>
            <div class="text-sm text-gray-400">Avg Grade</div>
          </div>
          <div class="bg-gray-50 dark:bg-[#121212] rounded-lg p-4">
            <div class="text-2xl font-bold text-black dark:text-white">
              {{ stats.averageEngagement || calculateAverageEngagement() }}
            </div>
            <div class="text-sm text-gray-400">Avg Engagement</div>
          </div>
        </div>

        <!-- Grade Distribution -->
        <!-- <div class="bg-white border border-gray-200 rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Grade Distribution
          </h3>
          <div class="space-y-3">
            <div
              v-for="(count, grade) in gradeDistribution"
              :key="grade"
              class="flex items-center"
            >
              <div class="w-12 text-sm font-medium text-gray-700">
                {{ grade }}
              </div>
              <div class="flex-1 mx-4">
                <div class="bg-gray-200 rounded-full h-4">
                  <div
                    class="bg-black h-4 rounded-full transition-all duration-300"
                    :style="{
                      width: `${(count / subject.students.length) * 100}%`,
                    }"
                  ></div>
                </div>
              </div>
              <div class="w-12 text-sm text-gray-500 text-right">
                {{ count }}
              </div>
            </div>
          </div>
        </div> -->

        <!-- Progress Distribution -->
        <div
          class="bg-gray-50 dark:bg-[#121212] border border-gray-200 rounded-lg p-6"
        >
          <h3 class="text-lg font-medium text-black dark:text-white mb-4">
            Progress Distribution
          </h3>
          <div class="space-y-3">
            <div
              v-for="range in progressRanges"
              :key="range.label"
              class="flex items-center"
            >
              <div
                class="w-20 text-sm font-medium text-[#121212] dark:text-gray-400"
              >
                {{ range.label }}
              </div>
              <div class="flex-1 mx-4">
                <div class="bg-green-100 rounded-full h-4">
                  <div
                    class="bg-green-700 h-4 rounded-full transition-all duration-300"
                    :style="{
                      width: `${
                        (range.count / subject.students.length) * 100
                      }%`,
                    }"
                  ></div>
                </div>
              </div>
              <div class="w-12 text-sm text-gray-500 text-right">
                {{ range.count }}
              </div>
            </div>
          </div>
        </div>

        <!-- Top Performers -->
        <div
          class="bg-gray-50 dark:bg-[#121212] border border-gray-200 rounded-lg p-6"
        >
          <h3 class="text-lg font-medium text-black dark:text-white mb-4">
            Top Performers
          </h3>
          <div class="space-y-3">
            <div
              v-for="student in topPerformers"
              :key="student.student?._id"
              class="flex items-center justify-between p-3 bg-gray-50 shadow-lg rounded-lg"
            >
              <div>
                <div class="font-medium text-gray-900">
                  {{ student.student.name }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ student.progress }}% progress
                </div>
              </div>
              <div class="text-right">
                <div class="font-medium text-gray-900">{{ student.grade }}</div>
                <div class="text-sm text-gray-500">
                  {{ student.engagementScore }}/100 engagement
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div
          class="bg-gray-50 dark:bg-[#121212] border border-gray-200 rounded-lg p-6"
        >
          <h3 class="text-lg font-medium text-black dark:text-white mb-4">
            Recent Activity
          </h3>
          <div class="space-y-3">
            <div
              v-for="student in recentActivity"
              :key="student.student?._id"
              class="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
            >
              <div>
                <div class="font-medium text-[#121212] dark:text-gray-300">
                  {{ student.student.name }}
                </div>
                <div class="text-sm text-gray-500">
                  Last accessed {{ formatDate(student.lastAccessed) }}
                </div>
              </div>
              <div class="text-sm text-gray-500">
                {{ formatTime(student.timeSpent) }} total
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <svg
          class="mx-auto h-12 w-12 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          Failed to load statistics
        </h3>
        <p class="mt-1 text-sm text-gray-500">{{ error }}</p>
        <button
          @click="fetchStats"
          class="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useSubjectStore, type SubjectProp } from "@/stores/subjectStore";
import Modal from "@/components/common/Modal.vue";

interface Props {
  isOpen: boolean;
  subject: SubjectProp | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
}>();

const subjectStore = useSubjectStore();
const loading = ref(false);
const error = ref<string | null>(null);
const stats = ref<any>(null);

const gradeDistribution = computed(() => {
  if (!props.subject) return {};

  const distribution: Record<string, number> = {};
  props.subject.students.forEach((student) => {
    const gradeKey = student?.grade || "Unknown";
    distribution[gradeKey] = (distribution[gradeKey] || 0) + 1;
  });

  return distribution;
});

const progressRanges = computed(() => {
  if (!props.subject) return [];

  const ranges = [
    { label: "0-25%", min: 0, max: 25, count: 0 },
    { label: "26-50%", min: 26, max: 50, count: 0 },
    { label: "51-75%", min: 51, max: 75, count: 0 },
    { label: "76-100%", min: 76, max: 100, count: 0 },
  ];

  props.subject.students.forEach((student) => {
    const range = ranges.find(
      (r) => student.progress >= r.min && student.progress <= r.max
    );
    if (range) range.count++;
  });

  return ranges;
});

const topPerformers = computed(() => {
  if (!props.subject) return [];

  return [...props.subject.students]
    .sort((a, b) => {
      // Sort by grade first, then by progress
      const gradeOrder = {
        "A+": 10,
        A: 9,
        "B+": 8,
        B: 7,
        "C+": 6,
        C: 5,
        "D+": 4,
        D: 3,
        F: 2,
      };
      const gradeA = gradeOrder[a?.grade] || 0;
      const gradeB = gradeOrder[b?.grade] || 0;

      if (gradeA !== gradeB) return gradeB - gradeA;
      return b.progress - a.progress;
    })
    .slice(0, 5);
});

const recentActivity = computed(() => {
  if (!props.subject) return [];

  return [...props.subject.students]
    .sort((a, b) => String(b?.lastAccessed) - String(a?.lastAccessed))
    .slice(0, 5);
});

console.log("Top performers:", topPerformers.value);
console.log("Recent activity:", recentActivity.value);

const calculateAverageProgress = () => {
  if (!props.subject?.students.length) return 0;
  const total = props.subject.students.reduce(
    (sum, student) => sum + student.progress,
    0
  );
  return Math.round(total / props.subject.students.length);
};

const calculateAverageGrade = () => {
  if (!props.subject?.students.length) return "N/A";

  const gradeValues: Record<string, number> = {
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
    (sum, student) =>
      sum + (gradeValues[student?.grade as unknown as string] || 0),
    0
  );

  return (total / props.subject.students.length).toFixed(1);
};

const calculateAverageEngagement = () => {
  if (!props.subject?.students.length) return 0;
  const total = props.subject.students.reduce(
    (sum, student) => sum + student.engagementScore,
    0
  );
  return Math.round(total / props.subject.students.length);
};

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const formatDate = (timestamp: string | number | Date) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

const fetchStats = async () => {
  if (!props.subject) return;

  loading.value = true;
  error.value = null;

  try {
    const result = await subjectStore.getSubjectStats(props.subject.id);
    stats.value = result;
  } catch (err) {
    error.value = "Failed to load statistics";
    console.error("Failed to fetch stats:", err);
  } finally {
    loading.value = false;
  }
};

// Fetch stats when modal opens
watch(
  () => [props.isOpen, props.subject],
  ([isOpen, subject]) => {
    if (isOpen && subject) {
      fetchStats();
    }
  }
);
</script>
