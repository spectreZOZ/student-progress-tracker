<!-- pages/AssignmentsPage.vue -->
<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Assignments
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            {{
              userRole === "teacher"
                ? "Manage your assignments"
                : "View your assignments"
            }}
          </p>
        </div>

        <button
          v-if="userRole === 'teacher'"
          @click="openCreateModal"
          class="inline-flex items-center px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
        >
          <svg
            class="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Assignment
        </button>
      </div>

      <!-- Filters -->
      <AssignmentFilters
        :filters="filters"
        :current-count="assignmentStore.assignments.length"
        :total-count="assignmentStore.pagination.total"
        @update:filters="updateFilters"
        @search="handleSearch"
        @clear="clearFilters"
      />

      <!-- Assignments Grid -->
      <AssignmentGrid
        :assignments="assignmentStore.assignments"
        :loading="assignmentStore.loading"
        :error="assignmentStore.error as string | null"
        :empty-message="getEmptyMessage()"
        :current-user-id="currentUserId"
        :user-role="userRole"
        @view="openViewModal"
        @edit="openEditModal"
        @delete="confirmDelete"
        @submit="openSubmitModal"
      />

      <!-- Pagination -->
      <AssignmentPagination
        :pagination="assignmentStore.pagination"
        @page-change="goToPage"
      />

      <!-- Modals -->
      <AssignmentCreateModal
        :is-open="showCreateModal"
        @close="closeCreateModal"
        @created="handleAssignmentCreated"
      />

      <AssignmentEditModal
        :is-open="showEditModal"
        :assignment="selectedAssignment"
        @close="closeEditModal"
        @updated="handleAssignmentUpdated"
      />

      <AssignmentViewModal
        :is-open="showViewModal"
        :assignment="selectedAssignment"
        @close="closeViewModal"
        @edit="openEditModalFromView"
        @delete="confirmDeleteFromView"
        @submit="openSubmitModalFromView"
      />

      <ConfirmDeleteModal
        :is-open="showDeleteModal"
        :assignment="selectedAssignment"
        @close="closeDeleteModal"
        @confirmed="handleDeleteConfirmed"
      />

      <!-- Submit Assignment Modal -->
      <SubmitAssignmentModal
        :isOpen="showSubmitModal"
        :assignment="selectedAssignment"
        @close="closeSubmitModal"
        @submitted="handleSubmissionSuccess"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import { useAssignmentStore } from "@/stores/assignmentStore";
import type { Assignment } from "@/types";
import AssignmentCreateModal from "@/components/assignments/AssignmentCreateModal.vue";
import AssignmentEditModal from "@/components/assignments/AssignmentEditModal.vue";
import AssignmentViewModal from "@/components/assignments/AssignmentViewModal.vue";
import ConfirmDeleteModal from "@/components/assignments/ConfirmDeleteModal.vue";
import SubmitAssignmentModal from "@/components/assignments/AssignmentModal/SubmitAssignmentModal.vue";
import AssignmentFilters from "@/components/assignments/AssignmentFilters.vue";
import AssignmentGrid from "@/components/assignments/AssignmentGrid.vue";
import AssignmentPagination from "@/components/assignments/AssignmentPagination.vue";
import { useAuthStore } from "@/stores/auth";
import AppLayout from "@/components/layout/AppLayout.vue";

const assignmentStore = useAssignmentStore();
const authStore = useAuthStore();

const userRole = computed(() => authStore.user?.role);
const currentUserId = computed(() => authStore.user?._id);

// Filter states
const filters = reactive({
  search: "",
  type: "",
  subject: "",
  isActive: "" as "" | boolean,
});

// Modal states
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showViewModal = ref(false);
const showDeleteModal = ref(false);
const showSubmitModal = ref(false);
const selectedAssignment = ref<Assignment | null>(null);

// Computed properties
const hasActiveFilters = computed(() => {
  return (
    filters.search || filters.type || filters.subject || filters.isActive !== ""
  );
});

// Methods
const updateFilters = (newFilters: typeof filters) => {
  Object.assign(filters, newFilters);
  if (newFilters.search === filters.search) {
    // If it's not a search update, apply filters immediately
    applyFilters();
  }
};

const handleSearch = () => {
  applyFilters();
};

const applyFilters = () => {
  const params = {
    page: 1,
    limit: assignmentStore.pagination.limit || 10,
    ...(filters.search && { search: filters.search }),
    ...(filters.type && { type: filters.type }),
    ...(filters.subject && { subject: filters.subject }),
    ...(filters.isActive !== "" && { isActive: filters.isActive }),
  };

  assignmentStore.fetchAssignments(params);
};

const clearFilters = () => {
  filters.search = "";
  filters.type = "";
  filters.subject = "";
  filters.isActive = "";
  applyFilters();
};

const goToPage = (page: number) => {
  if (page < 1 || page > assignmentStore.pagination.totalPages) return;

  const params = {
    page,
    limit: assignmentStore.pagination.limit || 10,
    ...(filters.search && { search: filters.search }),
    ...(filters.type && { type: filters.type }),
    ...(filters.subject && { subject: filters.subject }),
    ...(filters.isActive !== "" && { isActive: filters.isActive }),
  };

  assignmentStore.fetchAssignments(params);
};

const getEmptyMessage = () => {
  if (hasActiveFilters.value) {
    return "Try adjusting your filters.";
  }
  return userRole.value === "teacher"
    ? "Get started by creating a new assignment."
    : "No assignments have been created yet.";
};

onMounted(() => {
  assignmentStore.fetchAssignments({
    page: 1,
    limit: 10,
  });
});

// Modal handlers
const openCreateModal = () => {
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

const openEditModal = (assignment: Assignment) => {
  selectedAssignment.value = assignment;
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedAssignment.value = null;
};

const openViewModal = (assignment: Assignment) => {
  selectedAssignment.value = assignment;
  showViewModal.value = true;
};

const closeViewModal = () => {
  showViewModal.value = false;
  selectedAssignment.value = null;
};

const openEditModalFromView = () => {
  showViewModal.value = false;
  showEditModal.value = true;
};

const openSubmitModal = (assignment: Assignment) => {
  selectedAssignment.value = assignment;
  showSubmitModal.value = true;
};

const openSubmitModalFromView = () => {
  showViewModal.value = false;
  showSubmitModal.value = true;
};

const closeSubmitModal = () => {
  showSubmitModal.value = false;
  selectedAssignment.value = null;
};

const confirmDelete = (assignment: Assignment) => {
  selectedAssignment.value = assignment;
  showDeleteModal.value = true;
};

const confirmDeleteFromView = () => {
  showViewModal.value = false;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedAssignment.value = null;
};

// Event handlers
const handleAssignmentCreated = () => {
  closeCreateModal();
  applyFilters(); // Refresh with current filters
};

const handleAssignmentUpdated = () => {
  closeEditModal();
  applyFilters(); // Refresh with current filters
};

const handleDeleteConfirmed = async () => {
  if (selectedAssignment.value) {
    await assignmentStore.removeAssignment(selectedAssignment.value.id);
    closeDeleteModal();
    applyFilters(); // Refresh with current filters
  }
};

const handleSubmissionSuccess = () => {
  closeSubmitModal();
  applyFilters(); // Refresh to show updated submission status
};
</script>
