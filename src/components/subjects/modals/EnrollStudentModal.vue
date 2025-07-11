<template>
  <Modal :is-open="isOpen" @close="$emit('close')" title="Enroll Student">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Student Selection -->
      <div>
        <label
          for="student-select"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Select Student *
        </label>
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search students..."
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
            @input="debouncedSearch"
            @focus="showDropdown = true"
          />

          <!-- Dropdown -->
          <div
            v-if="showDropdown"
            class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden"
          >
            <!-- Loading State -->
            <div
              v-if="studentStore.isLoading"
              class="p-4 text-center text-gray-500"
            >
              <div
                class="animate-spin rounded-full h-6 w-6 border-b-2 border-black mx-auto"
              ></div>
              <p class="mt-2 text-sm">Searching students...</p>
            </div>

            <!-- Error State -->
            <div
              v-else-if="studentStore.error"
              class="p-4 text-center text-red-500"
            >
              <p class="text-sm">{{ studentStore.error }}</p>
              <button
                @click="searchStudents"
                class="mt-2 text-xs text-blue-600 hover:text-blue-800"
              >
                Try again
              </button>
            </div>

            <!-- Students List -->
            <div
              v-else-if="availableStudents.length > 0"
              class="max-h-60 overflow-y-auto"
            >
              <button
                v-for="student in availableStudents"
                :key="student.id"
                type="button"
                @click="selectStudent(student)"
                class="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
              >
                <div class="flex items-center space-x-3">
                  <img
                    :src="
                      student.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        student.name
                      )}&background=000000&color=ffffff`
                    "
                    :alt="student.name"
                    class="h-8 w-8 rounded-full"
                  />
                  <div>
                    <div class="font-medium text-gray-900">
                      {{ student.name }}
                    </div>
                    <div class="text-sm text-gray-500">{{ student.email }}</div>
                    <div v-if="student.studentId" class="text-xs text-gray-400">
                      ID: {{ student.studentId }}
                    </div>
                  </div>
                </div>
              </button>

              <!-- Load More Button -->
              <div v-if="hasMoreStudents" class="p-2 border-t border-gray-200">
                <button
                  @click="loadMoreStudents"
                  :disabled="studentStore.isLoading"
                  class="w-full px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors disabled:opacity-50"
                >
                  {{
                    studentStore.isLoading
                      ? "Loading..."
                      : `Load more (${remainingCount} remaining)`
                  }}
                </button>
              </div>
            </div>

            <!-- No Results -->
            <div v-else class="p-4 text-center text-gray-500">
              <svg
                class="mx-auto h-8 w-8 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <p class="text-sm">
                {{
                  searchQuery
                    ? "No students found matching your search"
                    : "No available students to enroll"
                }}
              </p>
            </div>
          </div>
        </div>

        <!-- Selected Student -->
        <div v-if="selectedStudent" class="mt-3 p-3 bg-gray-50 rounded-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <img
                :src="
                  selectedStudent.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    selectedStudent.name
                  )}&background=000000&color=ffffff`
                "
                :alt="selectedStudent.name"
                class="h-10 w-10 rounded-full"
              />
              <div>
                <div class="font-medium text-gray-900">
                  {{ selectedStudent.name }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ selectedStudent.email }}
                </div>
                <div
                  v-if="selectedStudent.studentId"
                  class="text-xs text-gray-400"
                >
                  ID: {{ selectedStudent.studentId }}
                </div>
              </div>
            </div>
            <button
              type="button"
              @click="clearSelection"
              class="text-gray-400 hover:text-gray-600"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <p v-if="errors.student" class="mt-1 text-sm text-red-600">
          {{ errors.student }}
        </p>
      </div>

      <!-- Search Stats -->
      <div
        v-if="searchQuery && !studentStore.isLoading"
        class="text-xs text-gray-500"
      >
        {{ availableStudents.length }} of {{ studentStore.total }} students
        shown
        {{ searchQuery ? `(filtered by "${searchQuery}")` : "" }}
      </div>

      <!-- Already Enrolled Students Warning -->
      <div
        v-if="subject && subject.students.length > 0"
        class="bg-blue-50 border border-blue-200 rounded-lg p-4"
      >
        <h4 class="text-sm font-medium text-blue-800 mb-2">
          Currently Enrolled Students ({{ subject.students.length }}):
        </h4>
        <div class="text-sm text-blue-700 max-h-20 overflow-y-auto">
          <div
            v-for="(student, index) in subject.students"
            :key="student.student"
            class="inline-block"
          >
            {{ student.student
            }}{{ index < subject.students.length - 1 ? ", " : "" }}
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          @click="$emit('close')"
          class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="loading || !selectedStudent"
          class="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <span
            v-if="loading"
            class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
          ></span>
          <span>{{ loading ? "Enrolling..." : "Enroll Student" }}</span>
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from "vue";
import { useSubjectStore, type SubjectProp } from "@/stores/subjectStore";
import { useStudentsStore } from "@/stores/students"; // Assuming you have this
import { debounce } from "lodash-es";
import Modal from "@/components/common/Modal.vue";

interface Props {
  isOpen: boolean;
  subject: SubjectProp | null;
}

interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  studentId?: string;
  role?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  enrolled: [];
}>();

const subjectStore = useSubjectStore();
const studentStore = useStudentsStore();

const loading = ref(false);
const searchQuery = ref("");
const showDropdown = ref(false);
const selectedStudent = ref<Student | null>(null);
const currentPage = ref(1);
const pageSize = 10;

const errors = reactive({
  student: "",
});

// Computed properties
const availableStudents = computed(() => {
  return studentStore.students.filter((student) => {
    // Filter out already enrolled students
    const isEnrolled = props.subject?.students.some(
      (s) => s.student === student.id || s.student === student.name
    );
    // Only show students (filter out teachers/admins if needed)
    const isStudent = !student.role || student.role === "student";
    return !isEnrolled && isStudent;
  });
});

const hasMoreStudents = computed(() => {
  return studentStore.students.length < studentStore.total;
});

const remainingCount = computed(() => {
  return Math.max(0, studentStore.total - studentStore.students.length);
});

// Methods
const searchStudents = async (resetPage = true) => {
  if (resetPage) {
    currentPage.value = 1;
  }

  try {
    // Update the student store filters
    studentStore.filters = {
      ...studentStore.filters,
      search: searchQuery.value.trim(),
      page: currentPage.value,
      limit: pageSize,
      role: "student", // Only fetch students
    };

    await studentStore.fetchStudents();
  } catch (error) {
    console.error("Failed to search students:", error);
  }
};

const loadMoreStudents = async () => {
  currentPage.value++;
  await searchStudents(false);
};

const debouncedSearch = debounce(() => {
  searchStudents(true);
}, 300);

const selectStudent = (student: Student) => {
  selectedStudent.value = student;
  searchQuery.value = student.name;
  showDropdown.value = false;
  errors.student = "";
};

const clearSelection = () => {
  selectedStudent.value = null;
  searchQuery.value = "";
  errors.student = "";
  showDropdown.value = false;
};

const validateForm = () => {
  errors.student = "";

  if (!selectedStudent.value) {
    errors.student = "Please select a student";
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (!validateForm() || !props.subject || !selectedStudent.value) return;

  loading.value = true;
  try {
    await subjectStore.enrollStudentInSubject(props.subject.id, {
      studentId: selectedStudent.value.id,
    });

    emit("enrolled");
    resetForm();
  } catch (error) {
    console.error("Failed to enroll student:", error);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  selectedStudent.value = null;
  searchQuery.value = "";
  showDropdown.value = false;
  currentPage.value = 1;
  errors.student = "";

  // Reset student store filters
  studentStore.filters = {
    ...studentStore.filters,
    search: "",
    page: 1,
    limit: pageSize,
  };
};

// Close dropdown when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as Element;
  if (!target?.closest(".relative")) {
    showDropdown.value = false;
  }
};

// Watchers
watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen) {
      // Load initial students when modal opens
      await searchStudents(true);
      document.addEventListener("click", handleClickOutside);
    } else {
      resetForm();
      document.removeEventListener("click", handleClickOutside);
    }
  }
);

// Focus management
watch(showDropdown, (show) => {
  if (show && !searchQuery.value) {
    // Load students when dropdown opens without search
    searchStudents(true);
  }
});

// Cleanup
onMounted(() => {
  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
});
</script>
