<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header with actions -->
      <div class="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Students
          </h1>
          <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage and track student progress across all learning platforms
          </p>
        </div>
        <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <div class="flex space-x-3">
            <!-- Bulk Actions -->
            <button
              v-if="uiStore.selectedStudents.size > 0"
              class="btn btn-secondary"
            >
              Actions ({{ uiStore.selectedStudents.size }})
            </button>

            <!-- Export Dropdown -->
            <div
              class="relative inline-block text-left"
              ref="exportDropdownRef"
            >
              <button
                @click="showExportMenu = !showExportMenu"
                :disabled="studentsStore.isExporting"
                class="btn btn-secondary flex items-center"
              >
                <ArrowDownTrayIcon class="h-4 w-4 mr-2" />
                <span v-if="studentsStore.isExporting">Exporting...</span>
                <span v-else>Export</span>
                <ChevronDownIcon class="h-4 w-4 ml-1" />
              </button>

              <!-- Export Menu -->
              <div
                v-if="showExportMenu"
                class="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800"
              >
                <div class="py-1">
                  <button
                    @click="handleExportCurrentView"
                    :disabled="studentsStore.isExporting"
                    class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <DocumentArrowDownIcon class="h-4 w-4 mr-3" />
                    Export Current View ({{ filteredStudents.length }} students)
                  </button>
                  <button
                    @click="handleExportAll"
                    :disabled="studentsStore.isExporting"
                    class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <DocumentArrowDownIcon class="h-4 w-4 mr-3" />
                    Export All Students
                  </button>
                  <button
                    @click="
                      showCustomExportModal = true;
                      showExportMenu = false;
                    "
                    :disabled="studentsStore.isExporting"
                    class="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    <AdjustmentsHorizontalIcon class="h-4 w-4 mr-3" />
                    Custom Export
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Export Success/Error Messages -->
      <div
        v-if="exportMessage.show"
        :class="[
          'rounded-md p-4',
          exportMessage.type === 'success'
            ? 'bg-green-50 dark:bg-green-900/20'
            : 'bg-red-50 dark:bg-red-900/20',
        ]"
      >
        <div class="flex">
          <CheckCircleIcon
            v-if="exportMessage.type === 'success'"
            class="h-5 w-5 text-green-400"
          />
          <ExclamationTriangleIcon v-else class="h-5 w-5 text-red-400" />
          <div class="ml-3">
            <h3
              :class="[
                'text-sm font-medium',
                exportMessage.type === 'success'
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200',
              ]"
            >
              {{
                exportMessage.type === "success"
                  ? "Export Successful"
                  : "Export Failed"
              }}
            </h3>
            <div
              :class="[
                'mt-2 text-sm',
                exportMessage.type === 'success'
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-700 dark:text-red-300',
              ]"
            >
              {{ exportMessage.message }}
            </div>
            <div class="mt-4">
              <button
                @click="clearExportMessage"
                :class="[
                  'text-sm font-medium hover:opacity-75',
                  exportMessage.type === 'success'
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-red-800 dark:text-red-200',
                ]"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <StudentFilters />

      <!-- Loading State -->
      <div v-if="studentsStore.isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading students..." />
      </div>

      <!-- Error State -->
      <div v-else-if="studentsStore.error" class="text-center py-12">
        <ExclamationTriangleIcon class="mx-auto h-12 w-12 text-red-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
          Error loading students
        </h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ studentsStore.error }}
        </p>
        <div class="mt-6">
          <button
            @click="studentsStore.fetchStudents()"
            class="btn btn-primary"
          >
            Try again
          </button>
        </div>
      </div>

      <!-- Content when loaded successfully -->
      <template v-else>
        <!-- Students List - Only show if there are filtered students -->
        <div v-if="filteredStudents.length > 0">
          <StudentsTable v-if="uiStore.viewMode === 'table'" />

          <!-- Pagination -->
          <div
            v-if="studentsStore.total > studentsStore.filters.limit"
            class="mt-6 flex justify-center"
          >
            <nav
              class="inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                @click="
                  studentsStore.changePage(studentsStore.filters.page - 1)
                "
                :disabled="studentsStore.filters.page === 1"
                class="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 dark:bg-[#0d0d0d] dark:text-gray-300"
              >
                Previous
              </button>
              <button
                v-for="page in Math.ceil(
                  studentsStore.total / studentsStore.filters.limit
                )"
                :key="page"
                @click="studentsStore.changePage(page)"
                :class="[
                  'relative inline-flex items-center px-3 py-2 border text-sm font-medium',
                  page === studentsStore.filters.page
                    ? 'bg-primary-600 text-white border-primary-600'
                    : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50 dark:bg-[#0d0d0d] dark:text-gray-300',
                ]"
              >
                {{ page }}
              </button>
              <button
                @click="
                  studentsStore.changePage(studentsStore.filters.page + 1)
                "
                :disabled="
                  studentsStore.filters.page >=
                  Math.ceil(studentsStore.total / studentsStore.filters.limit)
                "
                class="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium text-gray-500 bg-white hover:bg-gray-50 dark:bg-[#0d0d0d] dark:text-gray-300"
              >
                Next
              </button>
            </nav>
          </div>
        </div>

        <!-- Empty State - Only show when no students match filters -->
        <EmptyState
          v-else
          title="No students found"
          description="No students match your current filters. Try adjusting your search criteria."
        >
          <template #action>
            <button
              @click="studentsStore.clearFilters()"
              class="btn btn-primary"
            >
              Clear filters
            </button>
          </template>
        </EmptyState>
      </template>

      <!-- Student Detail Modal -->
      <StudentDetailModal />

      <!-- Custom Export Modal -->
      <CustomExportModal
        v-if="showCustomExportModal"
        @close="showCustomExportModal = false"
        @export="handleCustomExport"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, onUnmounted } from "vue";
import {
  ArrowDownTrayIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  DocumentArrowDownIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
} from "@heroicons/vue/24/outline";
import AppLayout from "@/components/layout/AppLayout.vue";
import StudentFilters from "@/components/students/StudentFilters.vue";
import StudentsTable from "@/components/students/StudentsTable.vue";
import StudentDetailModal from "@/components/students/StudentDetailModal.vue";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import EmptyState from "@/components/ui/EmptyState.vue";
import { useStudentsStore } from "@/stores/students";
import { useUIStore } from "@/stores/ui";
import CustomExportModal from "@/components/students/CustomExportModal.vue";
import exportService from "@/services/exportService";

const studentsStore = useStudentsStore();
const uiStore = useUIStore();

const showExportMenu = ref(false);
const showCustomExportModal = ref(false);
const exportDropdownRef = ref<HTMLDivElement | null>(null);

// Export message state
const exportMessage = ref({
  show: false,
  type: "success" as "success" | "error",
  message: "",
});

const filteredStudents = computed(() => studentsStore.filteredStudents);

// Export handlers
const handleExportCurrentView = async () => {
  showExportMenu.value = false;
  try {
    const result = await studentsStore.exportCurrentView();
    if (result.success) {
      showExportMessage(
        "success",
        "Students exported successfully with current filters applied."
      );
    } else {
      showExportMessage(
        "error",
        result.message || "Failed to export students."
      );
    }
  } catch (error) {
    showExportMessage("error", "An unexpected error occurred during export.");
  }
};

const handleExportAll = async () => {
  showExportMenu.value = false;
  try {
    // const result = await studentsStore.exportAllStudents();
    const result = await exportService.exportStudents();
    if (result.success) {
      showExportMessage("success", "All students exported successfully.");
    } else {
      showExportMessage(
        "error",
        result.message || "Failed to export all students."
      );
    }
  } catch (error) {
    showExportMessage("error", "An unexpected error occurred during export.");
  }
};

const handleCustomExport = async (filters: any) => {
  showCustomExportModal.value = false;
  try {
    const result = await exportService.exportUsers(filters);
    if (result.success) {
      showExportMessage(
        "success",
        "Students exported successfully with custom filters."
      );
    } else {
      showExportMessage(
        "error",
        result.message || "Failed to export students with custom filters."
      );
    }
  } catch (error) {
    showExportMessage("error", "An unexpected error occurred during export.");
  }
};

// Message helpers
const showExportMessage = (type: "success" | "error", message: string) => {
  exportMessage.value = {
    show: true,
    type,
    message,
  };

  // Auto-hide success messages after 5 seconds
  if (type === "success") {
    setTimeout(() => {
      clearExportMessage();
    }, 5000);
  }
};

const clearExportMessage = () => {
  exportMessage.value.show = false;
};

// Close export menu when clicking outside
const handleClickOutside = (event: Event) => {
  if (
    exportDropdownRef.value &&
    !exportDropdownRef.value.contains(event.target as Node)
  ) {
    showExportMenu.value = false;
  }
};

onMounted(() => {
  studentsStore.fetchStudents();
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});

console.log("StudentsView mounted", studentsStore);
console.log("studentsStore mounted", studentsStore.filteredStudents);
</script>
