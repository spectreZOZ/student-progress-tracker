<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            Classrooms
          </h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            {{ getHeaderDescription() }}
          </p>
        </div>

        <button
          v-if="canManageClassrooms"
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
          Create Classroom
        </button>
      </div>

      <!-- Content for Authorized Users -->
      <!-- Filters -->
      <ClassroomFilters
        :filters="filters"
        :current-count="classroomStore.classrooms.length"
        :total-count="classroomStore.pagination.total"
        @update:filters="updateFilters"
        @search="handleSearch"
        @clear="clearFilters"
      />

      <!-- Classrooms Grid -->
      <ClassroomGrid
        :classrooms="classroomStore.classrooms"
        :loading="classroomStore.loading"
        :error="classroomStore.error as string | null"
        :empty-message="getEmptyMessage()"
        :can-manage="canManageClassrooms"
        @view="openViewModal"
        @edit="openEditModal"
        @delete="confirmDelete"
      />

      <!-- Pagination -->
      <ClassroomPagination
        :pagination="classroomStore.pagination"
        @page-change="goToPage"
      />

      <!-- Modals -->
      <ClassroomCreateModal
        :is-open="showCreateModal"
        @close="closeCreateModal"
        @created="handleClassroomCreated"
      />

      <ClassroomEditModal
        :is-open="showEditModal"
        :classroom="selectedClassroom"
        @close="closeEditModal"
        @updated="handleClassroomUpdated"
      />

      <ClassroomViewModal
        :is-open="showViewModal"
        :classroom="selectedClassroom"
        :can-manage="canManageClassrooms"
        @close="closeViewModal"
        @edit="openEditModalFromView"
        @delete="confirmDeleteFromView"
      />

      <ConfirmDeleteModal
        :is-open="showDeleteModal"
        :classroom="selectedClassroom"
        @close="closeDeleteModal"
        @confirmed="handleDeleteConfirmed"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from "vue";
import { useClassroomStore } from "@/stores/classroomStore";
import { useAuthStore } from "@/stores/auth";
import type { Classroom } from "@/types";

// Components
import AppLayout from "@/components/layout/AppLayout.vue";
import ClassroomFilters from "@/components/classrooms/ClassroomFilters.vue";
import ClassroomGrid from "@/components/classrooms/ClassroomGrid.vue";
import ClassroomPagination from "@/components/classrooms/ClassroomPagination.vue";
import ClassroomCreateModal from "@/components/classrooms/ClassroomCreateModal.vue";
import ClassroomEditModal from "@/components/classrooms/ClassroomEditModal.vue";
import ClassroomViewModal from "@/components/classrooms/ClassroomViewModal.vue";
import ConfirmDeleteModal from "@/components/classrooms/ConfirmDeleteModal.vue";

const classroomStore = useClassroomStore();
const authStore = useAuthStore();

// Computed properties for role-based access
const userRole = computed(() => authStore.user?.role);
const canManageClassrooms = computed(() => userRole.value === "admin");

// Filter states
const filters = reactive({
  search: "",
  grade: "",
  academicYear: "",
  teacher: "",
});

// Modal states
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showViewModal = ref(false);
const showDeleteModal = ref(false);
const selectedClassroom = ref<Classroom | null>(null);

// Computed properties
const hasActiveFilters = computed(() => {
  return (
    filters.search || filters.grade || filters.academicYear || filters.teacher
  );
});

// Methods
const getHeaderDescription = () => {
  return canManageClassrooms.value
    ? "Manage classrooms, students, and subjects"
    : "View classroom information";
};

const updateFilters = (newFilters: typeof filters) => {
  Object.assign(filters, newFilters);
  if (newFilters.search === filters.search) {
    applyFilters();
  }
};

const handleSearch = () => {
  applyFilters();
};

const applyFilters = () => {
  const params = {
    page: 1,
    limit: classroomStore.pagination.limit || 12,
    ...(filters.search && { search: filters.search }),
    ...(filters.grade && { grade: parseInt(filters.grade) }),
    ...(filters.academicYear && { academicYear: filters.academicYear }),
    ...(filters.teacher && { teacher: filters.teacher }),
  };

  classroomStore.fetchClassrooms(params);
};

const clearFilters = () => {
  filters.search = "";
  filters.grade = "";
  filters.academicYear = "";
  filters.teacher = "";
  applyFilters();
};

const goToPage = (page: number) => {
  if (page < 1 || page > classroomStore.pagination.totalPages) return;

  const params = {
    page,
    limit: classroomStore.pagination.limit || 12,
    ...(filters.search && { search: filters.search }),
    ...(filters.grade && { grade: parseInt(filters.grade) }),
    ...(filters.academicYear && { academicYear: filters.academicYear }),
    ...(filters.teacher && { teacher: filters.teacher }),
  };

  classroomStore.fetchClassrooms(params);
};

const getEmptyMessage = () => {
  if (hasActiveFilters.value) {
    return "Try adjusting your filters.";
  }
  return canManageClassrooms.value
    ? "Get started by creating a new classroom."
    : "No classrooms have been created yet.";
};

// Modal handlers
const openCreateModal = () => {
  showCreateModal.value = true;
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

const openEditModal = (classroom: Classroom) => {
  selectedClassroom.value = classroom;
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedClassroom.value = null;
};

const openViewModal = (classroom: Classroom) => {
  selectedClassroom.value = classroom;
  showViewModal.value = true;
};

const closeViewModal = () => {
  showViewModal.value = false;
  selectedClassroom.value = null;
};

const openEditModalFromView = () => {
  showViewModal.value = false;
  showEditModal.value = true;
};

const confirmDelete = (classroom: Classroom) => {
  selectedClassroom.value = classroom;
  showDeleteModal.value = true;
};

const confirmDeleteFromView = () => {
  showViewModal.value = false;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  selectedClassroom.value = null;
};

// Event handlers
const handleClassroomCreated = () => {
  closeCreateModal();
  applyFilters();
};

const handleClassroomUpdated = () => {
  closeEditModal();
  applyFilters();
};

const handleDeleteConfirmed = async () => {
  if (selectedClassroom.value) {
    await classroomStore.removeClassroom(selectedClassroom.value.id);
    closeDeleteModal();
    applyFilters();
  }
};

// Initialize data
onMounted(() => {
  classroomStore.fetchClassrooms({
    page: 1,
    limit: 12,
  });
});
</script>
