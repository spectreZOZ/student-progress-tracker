<template>
  <AppLayout>
    <div class="">
      <!-- Header -->
      <div class="border-b border-gray-200 sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center py-6">
            <div>
              <h1 class="text-3xl font-bold">Subjects</h1>
              <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
                {{ roleBasedSubtitle }}
              </p>
            </div>

            <!-- Actions -->
            <div class="flex items-center space-x-4">
              <!-- Search -->
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search subjects..."
                  class="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  @input="debouncedSearch"
                />
                <svg
                  class="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <!-- Create Subject Button -->
              <button
                v-if="canCreateSubject"
                @click="openCreateModal"
                class="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                <svg
                  class="h-5 w-5"
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
                <span>New Subject</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Loading State -->
        <div
          v-if="subjectStore.loading"
          class="flex justify-center items-center py-12"
        >
          <div
            class="animate-spin rounded-full h-12 w-12 border-b-2 border-black"
          ></div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="subjectStore.error"
          class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
        >
          <p class="text-red-800">{{ subjectStore.error }}</p>
        </div>

        <!-- Subjects Grid -->
        <div
          v-else-if="subjectStore.subjects.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <SubjectCard
            v-for="subject in subjects"
            :key="subject.id"
            :subject="subject"
            :user-role="userRole"
            @view-details="openDetailsModal"
            @edit="openEditModal"
            @delete="openDeleteModal"
            @view-stats="openStatsModal"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            No subjects found
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            {{ emptyStateMessage }}
          </p>
          <div v-if="canCreateSubject" class="mt-6">
            <button
              @click="openCreateModal"
              class="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Create your first subject
            </button>
          </div>
        </div>

        <!-- Pagination -->
        <Pagination
          v-if="subjectStore.subjects.length > 0"
          :current-page="subjectStore.pagination.page"
          :total-pages="subjectStore.pagination.totalPages"
          :total-items="subjectStore.pagination.total"
          @page-change="handlePageChange"
        />
      </div>

      <!-- Modals -->
      <CreateSubjectModal
        :is-open="modals.create"
        @close="modals.create = false"
        @created="handleSubjectCreated"
      />

      <EditSubjectModal
        :is-open="modals.edit"
        :subject="selectedSubject"
        @close="modals.edit = false"
        @updated="handleSubjectUpdated"
      />

      <SubjectDetailsModal
        :is-open="modals.details"
        :subject="selectedSubject"
        :user-role="userRole"
        @close="modals.details = false"
        @enroll-student="openEnrollModal"
        @update-progress="openProgressModal"
      />

      <DeleteConfirmModal
        :is-open="modals.delete"
        :subject="selectedSubject"
        @close="modals.delete = false"
        @confirmed="handleSubjectDeleted"
      />

      <SubjectStatsModal
        :is-open="modals.stats"
        :subject="selectedSubject"
        @close="modals.stats = false"
      />

      <EnrollStudentModal
        :is-open="modals.enroll"
        :subject="selectedSubject"
        @close="modals.enroll = false"
        @enrolled="handleStudentEnrolled"
      />

      <UpdateProgressModal
        :is-open="modals.progress"
        :subject="selectedSubject"
        :student="selectedStudent"
        @close="modals.progress = false"
        @updated="handleProgressUpdated"
      /></div
  ></AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useSubjectStore, type SubjectProp } from "@/stores/subjectStore";
import { useAuthStore } from "@/stores/auth"; // Assuming you have an auth store
import { debounce } from "lodash-es";

// Components
import SubjectCard from "@/components/subjects/SubjectCard.vue";
import Pagination from "@/components/common/Pagination.vue";
import CreateSubjectModal from "@/components/subjects/modals/CreateSubjectModal.vue";
import EditSubjectModal from "@/components/subjects/modals/EditSubjectModal.vue";
import SubjectDetailsModal from "@/components/subjects/modals/SubjectDetailsModal.vue";
import DeleteConfirmModal from "@/components/subjects/modals/DeletSubjectModal.vue";
import SubjectStatsModal from "@/components/subjects/modals/SubjectStatsModal.vue";
import EnrollStudentModal from "@/components/subjects/modals/EnrollStudentModal.vue";
import UpdateProgressModal from "@/components/subjects/modals/UpdateProgressModal.vue";
import AppLayout from "@/components/layout/AppLayout.vue";

// Stores
const subjectStore = useSubjectStore();
const authStore = useAuthStore();
const isTeacher = computed(() => authStore.isTeacher).value;
const isStudent = computed(() => authStore.isStudent).value;
const user = computed(() => authStore.user);

// Reactive data
const searchQuery = ref("");
const selectedSubject = ref<SubjectProp | null>(null);
const selectedStudent = ref<any>(null);

const modals = ref({
  create: false,
  edit: false,
  details: false,
  delete: false,
  stats: false,
  enroll: false,
  progress: false,
});

// Computed properties
const userRole = user?.value?.role || "student";

const canCreateSubject = computed(() =>
  ["admin", "teacher"].includes(userRole)
);

const roleBasedSubtitle = computed(() => {
  switch (userRole.value) {
    case "admin":
      return "Manage all subjects in the system";
    case "teacher":
      return "Manage your assigned subjects";
    case "student":
      return "View your enrolled subjects";
    default:
      return "Subject management";
  }
});

const emptyStateMessage = computed(() => {
  switch (userRole.value) {
    case "admin":
      return "Get started by creating the first subject";
    case "teacher":
      return "No subjects assigned to you yet";
    case "student":
      return "You are not enrolled in any subjects yet";
    default:
      return "No subjects available";
  }
});
console.log(selectedSubject, "selectedSubject");

const subjects = computed(() => {
  if (!subjectStore.subjects || subjectStore.subjects.length === 0) {
    return [];
  }

  if (isStudent) {
    const filteredSubjects = subjectStore.subjects.filter((subject) => {
      const isEnrolled = subject.students.some((student) => {
        const match = student.student?._id === user?.value?._id;

        return match;
      });
      return isEnrolled;
    });

    return filteredSubjects;
  }

  return subjectStore.subjects;
});

// Methods
const fetchSubjects = async (params = {}) => {
  try {
    await subjectStore.fetchSubjects({
      page: subjectStore.pagination.page,
      limit: subjectStore.pagination.limit,
      search: searchQuery.value || undefined,
      teacher: isTeacher ? authStore.user?._id : null,
      ...params,
    });
  } catch (error) {
    console.error("Failed to fetch subjects:", error);
  }
};

// Watch for changes in user authentication
watch(
  user,
  async (newUser) => {
    if (newUser && subjectStore.subjects.length === 0) {
      console.log("User loaded, fetching subjects...");
      await fetchSubjects();
    }
  },
  { immediate: true }
);

const debouncedSearch = debounce(() => {
  subjectStore.pagination.page = 1;
  fetchSubjects();
}, 300);

const handlePageChange = (page: number) => {
  subjectStore.pagination.page = page;
  fetchSubjects();
};

// Modal handlers
const openCreateModal = () => {
  modals.value.create = true;
};

const openEditModal = (subject: SubjectProp) => {
  selectedSubject.value = subject;
  modals.value.edit = true;
};

const openDetailsModal = (subject: SubjectProp) => {
  selectedSubject.value = subject;
  modals.value.details = true;
};

const openDeleteModal = (subject: SubjectProp) => {
  selectedSubject.value = subject;
  modals.value.delete = true;
};

const openStatsModal = (subject: SubjectProp) => {
  selectedSubject.value = subject;
  modals.value.stats = true;
};

const openEnrollModal = (subject: SubjectProp) => {
  selectedSubject.value = subject;
  modals.value.enroll = true;
};

const openProgressModal = (subject: SubjectProp, student: any) => {
  selectedSubject.value = subject;
  selectedStudent.value = student;
  modals.value.progress = true;
};

// Event handlers
const handleSubjectCreated = () => {
  fetchSubjects();
  modals.value.create = false;
};

const handleSubjectUpdated = () => {
  fetchSubjects();
  modals.value.edit = false;
};

const handleSubjectDeleted = () => {
  fetchSubjects();
  modals.value.delete = false;
};

const handleStudentEnrolled = () => {
  fetchSubjects();
  modals.value.enroll = false;
};

const handleProgressUpdated = () => {
  fetchSubjects();
  modals.value.progress = false;
};

// Lifecycle
onMounted(() => {
  fetchSubjects();
});

// Watch for search changes
watch(searchQuery, () => {
  debouncedSearch();
});
</script>
