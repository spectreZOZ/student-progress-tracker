<template>
  <TransitionRoot as="template" :show="uiStore.isStudentDetailOpen">
    <Dialog as="div" class="relative z-50" @close="uiStore.closeStudentDetail">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-[#41414167] bg-opacity-75 transition-opacity"
        />
      </TransitionChild>
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white dark:bg-[#0d0d0d] px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl sm:p-6"
            >
              <!-- Loading State -->
              <div v-if="isLoadingStudent" class="flex justify-center py-12">
                <div class="text-center">
                  <div
                    class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"
                  ></div>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    Loading student details...
                  </p>
                </div>
              </div>
              <!-- Error State -->
              <div v-else-if="studentError" class="text-center py-12">
                <div class="text-red-500 mb-4">
                  <svg
                    class="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-9.08 4.92a10 10 0 1 1 18.16 0M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2z"
                    />
                  </svg>
                </div>
                <h3
                  class="text-lg font-medium text-gray-900 dark:text-white mb-2"
                >
                  Error loading student
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  {{ studentError }}
                </p>
                <button @click="loadStudentData" class="btn btn-primary">
                  Try again
                </button>
              </div>
              <!-- Student Details -->
              <div v-else-if="student" class="space-y-6">
                <!-- Header -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <img
                      class="h-16 w-16 rounded-full"
                      :src="
                        student.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          student.name ||
                            student.firstName + ' ' + student.lastName
                        )}&background=3b82f6&color=fff`
                      "
                      :alt="
                        student.name ||
                        student.firstName + ' ' + student.lastName
                      "
                    />
                    <div>
                      <DialogTitle
                        as="h3"
                        class="text-2xl font-semibold leading-6 text-gray-900 dark:text-white"
                      >
                        {{
                          student.name ||
                          `${student.firstName} ${student.lastName}`
                        }}
                      </DialogTitle>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        <span v-if="student.grade"
                          >Grade {{ student.grade }} • </span
                        >{{ student.email }}
                      </p>
                      <span
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1"
                        :class="
                          getStatusColor(
                            student.status ||
                              (student.isActive ? 'active' : 'inactive')
                          )
                        "
                      >
                        {{
                          (
                            student.status ||
                            (student.isActive ? "active" : "inactive")
                          )
                            .replace("-", " ")
                            .toUpperCase()
                        }}
                      </span>
                    </div>
                  </div>
                  <button
                    @click="uiStore.closeStudentDetail"
                    class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <XMarkIcon class="h-6 w-6" />
                  </button>
                </div>
                <!-- Tabs -->
                <div class="border-b border-gray-200 dark:border-gray-600">
                  <nav class="-mb-px flex space-x-8">
                    <button
                      v-for="tab in tabs"
                      :key="tab.id"
                      @click="activeTab = tab.id"
                      :class="[
                        activeTab === tab.id
                          ? '!border-white text-black dark:text-white'
                          : '!border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300',
                        'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
                      ]"
                    >
                      {{ tab.name }}
                    </button>
                  </nav>
                </div>
                <!-- Tab Content -->
                <div class="min-h-96">
                  <!-- Overview Tab -->
                  <div v-if="activeTab === 'overview'" class="space-y-6">
                    <!-- Basic Info -->
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div class="bg-gray-50 dark:bg-[#101010] rounded-lg p-4">
                        <h4
                          class="text-lg font-medium text-gray-900 dark:text-white mb-4"
                        >
                          Student Information
                        </h4>
                        <div class="space-y-3">
                          <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span class="text-gray-500 dark:text-gray-400"
                                >Name</span
                              >
                              <div
                                class="font-medium text-gray-900 dark:text-white"
                              >
                                {{
                                  student.name ||
                                  `${student.firstName} ${student.lastName}`
                                }}
                              </div>
                            </div>
                            <div>
                              <span class="text-gray-500 dark:text-gray-400"
                                >Email</span
                              >
                              <div
                                class="font-medium text-gray-900 dark:text-white"
                              >
                                {{ student.email }}
                              </div>
                            </div>
                            <div v-if="student.grade">
                              <span class="text-gray-500 dark:text-gray-400"
                                >Grade</span
                              >
                              <div
                                class="font-medium text-gray-900 dark:text-white"
                              >
                                {{ student.grade }}
                              </div>
                            </div>
                            <div v-if="student.createdAt">
                              <span class="text-gray-500 dark:text-gray-400"
                                >Joined</span
                              >
                              <div
                                class="font-medium text-gray-900 dark:text-white"
                              >
                                {{
                                  new Date(
                                    student.createdAt
                                  ).toLocaleDateString()
                                }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="bg-gray-50 dark:bg-[#101010] rounded-lg p-4">
                        <h4
                          class="text-lg font-medium text-gray-900 dark:text-white mb-4"
                        >
                          Recent Activity
                        </h4>
                        <div
                          v-if="isLoadingActivities"
                          class="text-center py-4"
                        >
                          <div
                            class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"
                          ></div>
                          <p class="text-sm text-gray-500 mt-2">
                            Loading activities...
                          </p>
                        </div>
                        <div
                          v-else-if="studentActivities.length > 0"
                          class="space-y-3"
                        >
                          <div
                            v-for="activity in studentActivities.slice(0, 5)"
                            :key="activity.id"
                            class="flex justify-between items-start"
                          >
                            <div class="flex-1">
                              <div
                                class="font-medium text-gray-900 dark:text-white text-sm"
                              >
                                {{
                                  activity.description ||
                                  activity.action ||
                                  activity.type
                                }}
                              </div>
                              <div
                                class="text-xs text-gray-500 dark:text-gray-400"
                              >
                                {{
                                  formatDistanceToNow(
                                    new Date(activity.createdAt),
                                    { addSuffix: true }
                                  )
                                }}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-else class="text-center py-4">
                          <p class="text-sm text-gray-500 dark:text-gray-400">
                            No recent activities
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!-- Activity Tab -->
                  <div v-if="activeTab === 'activity'" class="space-y-6">
                    <!-- Activity Filters -->
                    <div class="bg-gray-50 dark:bg-[#101010] rounded-lg p-4">
                      <h4
                        class="text-lg font-medium text-gray-900 dark:text-white mb-4"
                      >
                        Filter Activities
                      </h4>
                      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <!-- Activity Type Filter -->
                        <div>
                          <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Activity Type
                          </label>
                          <select
                            v-model="activityTypeFilter"
                            @change="applyActivityFilters"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-[#0d0d0d] dark:border-gray-600 dark:text-white"
                          >
                            <option value="">All Types</option>
                            <option value="login">Login</option>
                            <option value="assignment_submit">
                              Assignment Submit
                            </option>
                            <option value="quiz_complete">Quiz Complete</option>
                            <option value="lesson_view">Lesson View</option>
                            <option value="forum_post">Forum Post</option>
                            <option value="file_download">File Download</option>
                          </select>
                        </div>
                        <!-- Subject Filter with Debounce -->
                        <div>
                          <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            Subject
                          </label>
                          <div class="relative">
                            <input
                              v-model="subjectFilterInput"
                              type="text"
                              placeholder="Enter subject"
                              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-[#0d0d0d] dark:border-gray-600 dark:text-white"
                            />
                            <!-- Loading indicator for debounced input -->
                            <div
                              v-if="isSubjectFilterPending"
                              class="absolute right-3 top-1/2 transform -translate-y-1/2"
                            >
                              <div
                                class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"
                              ></div>
                            </div>
                          </div>
                        </div>
                        <!-- Start Date Filter -->
                        <div>
                          <label
                            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                          >
                            From Date
                          </label>
                          <input
                            v-model="startDateFilter"
                            @change="applyActivityFilters"
                            type="date"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-[#0d0d0d] dark:border-gray-600 dark:text-white"
                          />
                        </div>
                        <!-- Clear Filters -->
                        <div class="flex items-end">
                          <button
                            @click="clearActivityFilters"
                            class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-[#0d0d0d] dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800"
                          >
                            Clear Filters
                          </button>
                        </div>
                      </div>
                    </div>
                    <!-- Activities List -->
                    <div v-if="isLoadingActivities" class="text-center py-12">
                      <div
                        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"
                      ></div>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        Loading activities...
                      </p>
                    </div>
                    <div
                      v-else-if="studentActivities.length > 0"
                      class="space-y-4"
                    >
                      <div class="flex justify-between items-center">
                        <h4
                          class="text-lg font-medium text-gray-900 dark:text-white"
                        >
                          Activities ({{ studentsStore.activitiesTotal }})
                        </h4>
                      </div>
                      <div
                        v-for="activity in studentActivities"
                        :key="activity.id"
                        class="bg-gray-50 dark:bg-[#101010] rounded-lg p-4"
                      >
                        <div class="flex justify-between items-start">
                          <div class="flex-1">
                            <div class="flex items-center space-x-2 mb-2">
                              <span
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              >
                                {{ activity.type || "Activity" }}
                              </span>
                              <span
                                v-if="activity.subject"
                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                              >
                                {{ activity.subject }}
                              </span>
                            </div>
                            <div
                              class="font-medium text-gray-900 dark:text-white"
                            >
                              {{
                                activity.description ||
                                activity.action ||
                                activity.type
                              }}
                            </div>
                            <div
                              class="text-sm text-gray-500 dark:text-gray-400 mt-1"
                            >
                              {{
                                formatDistanceToNow(
                                  new Date(activity.createdAt),
                                  { addSuffix: true }
                                )
                              }}
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- Activities Pagination -->
                      <div
                        v-if="
                          studentsStore.activitiesTotal >
                          studentsStore.activitiesFilters.limit
                        "
                        class="flex justify-center mt-6"
                      >
                        <nav
                          class="inline-flex rounded-md shadow-sm -space-x-px"
                        >
                          <button
                            @click="
                              changeActivitiesPage(
                                studentsStore.activitiesFilters.page - 1
                              )
                            "
                            :disabled="
                              studentsStore.activitiesFilters.page === 1
                            "
                            class="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 dark:bg-[#0d0d0d] dark:text-gray-300 disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <button
                            v-for="page in Math.ceil(
                              studentsStore.activitiesTotal /
                                studentsStore.activitiesFilters.limit
                            )"
                            :key="page"
                            @click="changeActivitiesPage(page)"
                            :class="[
                              'relative inline-flex items-center px-3 py-2 border text-sm font-medium',
                              page === studentsStore.activitiesFilters.page
                                ? 'bg-primary-600 text-white border-primary-600'
                                : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50 dark:bg-[#0d0d0d] dark:text-gray-300',
                            ]"
                          >
                            {{ page }}
                          </button>
                          <button
                            @click="
                              changeActivitiesPage(
                                studentsStore.activitiesFilters.page + 1
                              )
                            "
                            :disabled="
                              studentsStore.activitiesFilters.page >=
                              Math.ceil(
                                studentsStore.activitiesTotal /
                                  studentsStore.activitiesFilters.limit
                              )
                            "
                            class="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 dark:bg-[#0d0d0d] dark:text-gray-300 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    </div>
                    <div v-else class="text-center py-12">
                      <p class="text-gray-500 dark:text-gray-400">
                        No activities found
                      </p>
                    </div>
                  </div>
                </div>
                <!-- Actions -->
                <div
                  class="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600"
                >
                  <button
                    type="button"
                    class="btn btn-secondary"
                    @click="uiStore.closeStudentDetail"
                  >
                    Close
                  </button>
                  <!-- <button type="button" class="btn btn-primary">
                    Send Message
                  </button> -->
                  <button
                    type="button"
                    @click="exportStudent(student?._id || student?.id)"
                    :disabled="isExportDisabled || isExporting"
                    :class="[
                      'btn',
                      isExportDisabled || isExporting
                        ? 'btn-disabled opacity-50 cursor-not-allowed'
                        : 'btn-primary',
                    ]"
                  >
                    <span v-if="isExporting" class="flex items-center">
                      <div
                        class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                      ></div>
                      Generating...
                    </span>
                    <span v-else-if="isExportDisabled">
                      Generate Report ({{
                        formatCooldownTime(cooldownTimeLeft)
                      }})
                    </span>
                    <span v-else> Generate Report </span>
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import { useStudentsStore } from "@/stores/students";
import { useUIStore } from "@/stores/ui";
import { formatDistanceToNow } from "date-fns";
import exportService from "@/services/exportService";

const studentsStore = useStudentsStore();
const uiStore = useUIStore();

const activeTab = ref("overview");
const tabs = [
  { id: "overview", name: "Overview" },
  { id: "activity", name: "Activity" },
];

// Activity filters
const activityTypeFilter = ref("");
const subjectFilter = ref(""); // This will be the actual filter value sent to API
const subjectFilterInput = ref(""); // This is what the user types
const startDateFilter = ref("");
const isSubjectFilterPending = ref(false);

// Export cooldown state
const isExporting = ref(false);
const isExportDisabled = ref(false);
const cooldownTimeLeft = ref(0);
const cooldownInterval = ref<NodeJS.Timeout | null>(null);

// Debounce timeout
let subjectDebounceTimeout: NodeJS.Timeout | null = null;

const student = computed(() => studentsStore.selectedStudent);
const studentActivities = computed(() => studentsStore.studentActivities);
const isLoadingStudent = computed(() => studentsStore.isLoadingStudent);
const isLoadingActivities = computed(() => studentsStore.isLoadingActivities);
const studentError = computed(() => studentsStore.studentError);

const getStatusColor = (status: string) => {
  const colors = {
    active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    inactive: "bg-gray-100 text-gray-800 dark:bg-[#101010] dark:text-gray-300",
    "at-risk": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return colors[status as keyof typeof colors] || colors.inactive;
};

const loadStudentData = () => {
  if (uiStore.selectedStudentId) {
    studentsStore.fetchStudentById(uiStore.selectedStudentId);
    studentsStore.fetchStudentActivities(uiStore.selectedStudentId);
  }
};

const applyActivityFilters = () => {
  if (uiStore.selectedStudentId) {
    const filters = {
      type: activityTypeFilter.value || null,
      subject: subjectFilter.value || null,
      startDate: startDateFilter.value || null,
      page: 1, // Reset to first page when filtering
    };
    studentsStore.updateActivitiesFilter(uiStore.selectedStudentId, filters);
  }
};

// Debounced subject filter function
const debouncedSubjectFilter = (value: string) => {
  // Clear existing timeout
  if (subjectDebounceTimeout) {
    clearTimeout(subjectDebounceTimeout);
  }
  // Show pending state
  isSubjectFilterPending.value = true;
  // Set new timeout
  subjectDebounceTimeout = setTimeout(() => {
    subjectFilter.value = value;
    isSubjectFilterPending.value = false;
    applyActivityFilters();
  }, 500); // 500ms delay - you can adjust this
};

const clearActivityFilters = () => {
  activityTypeFilter.value = "";
  subjectFilter.value = "";
  subjectFilterInput.value = "";
  startDateFilter.value = "";

  // Clear any pending debounce
  if (subjectDebounceTimeout) {
    clearTimeout(subjectDebounceTimeout);
    subjectDebounceTimeout = null;
  }
  isSubjectFilterPending.value = false;

  if (uiStore.selectedStudentId) {
    studentsStore.clearActivitiesFilters(uiStore.selectedStudentId);
  }
};

const changeActivitiesPage = (page: number) => {
  if (uiStore.selectedStudentId) {
    studentsStore.changeActivitiesPage(uiStore.selectedStudentId, page);
  }
};

// Format cooldown time to MM:SS
const formatCooldownTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

// Start cooldown timer
const startCooldown = () => {
  isExportDisabled.value = true;
  cooldownTimeLeft.value = 120; // 2 minutes in seconds

  cooldownInterval.value = setInterval(() => {
    cooldownTimeLeft.value--;

    if (cooldownTimeLeft.value <= 0) {
      clearCooldown();
    }
  }, 1000);
};

// Clear cooldown timer
const clearCooldown = () => {
  isExportDisabled.value = false;
  cooldownTimeLeft.value = 0;

  if (cooldownInterval.value) {
    clearInterval(cooldownInterval.value);
    cooldownInterval.value = null;
  }
};

// Export a single student
const exportStudent = async (studentId: string) => {
  if (isExportDisabled.value || isExporting.value || !studentId) {
    return;
  }

  try {
    isExporting.value = true;

    const result = await exportService.exportSingleUser(studentId);

    if (result.success) {
      console.log("Student exported successfully");
      // Start the 2-minute cooldown
      startCooldown();

      // You can show a success message here if needed
      // showSuccessMessage("Report generated successfully!");
    } else {
      console.error("Export failed:", result.message);
      // You can show an error message here if needed
      // showErrorMessage(result.message);
    }
  } catch (error) {
    console.error("Unexpected error during export:", error);
    // showErrorMessage("An unexpected error occurred during export");
  } finally {
    isExporting.value = false;
  }
};

// Watch for changes in subject input and apply debounce
watch(subjectFilterInput, (newValue) => {
  debouncedSubjectFilter(newValue);
});

// Watch for modal opening and load student data
watch(
  () => uiStore.selectedStudentId,
  (studentId) => {
    if (studentId) {
      activeTab.value = "overview";
      // Reset filters
      activityTypeFilter.value = "";
      subjectFilter.value = "";
      subjectFilterInput.value = "";
      startDateFilter.value = "";

      // Clear any pending debounce
      if (subjectDebounceTimeout) {
        clearTimeout(subjectDebounceTimeout);
        subjectDebounceTimeout = null;
      }
      isSubjectFilterPending.value = false;

      loadStudentData();
    }
  },
  { immediate: true }
);

// Watch for modal closing to clear cooldown
watch(
  () => uiStore.isStudentDetailOpen,
  (isOpen) => {
    if (!isOpen) {
      // Clear cooldown when modal closes (optional)
      // Remove this if you want cooldown to persist across modal opens/closes
      // clearCooldown();
    }
  }
);

// Cleanup on component unmount
onUnmounted(() => {
  if (subjectDebounceTimeout) {
    clearTimeout(subjectDebounceTimeout);
  }
  clearCooldown();
});
</script>
