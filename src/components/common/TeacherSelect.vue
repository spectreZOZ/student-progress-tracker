<template>
  <div class="relative">
    <label
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      Teacher *
    </label>

    <!-- Selected Teacher Display -->
    <div
      v-if="selectedTeacher"
      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white flex items-center justify-between"
    >
      <div class="flex items-center space-x-2">
        <div
          class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium"
        >
          {{ getInitials(selectedTeacher.name) }}
        </div>
        <div>
          <p class="text-sm font-medium">{{ selectedTeacher.name }}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ selectedTeacher.email }}
          </p>
        </div>
      </div>
      <button
        type="button"
        @click="clearSelection"
        class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <!-- Search Input -->
    <div v-else class="relative">
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        placeholder="Search and select a teacher..."
        class="input"
        @focus="showDropdown = true"
        @input="handleSearch"
        @keydown="handleKeydown"
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

    <!-- Dropdown -->
    <div
      v-if="showDropdown && !selectedTeacher"
      class="absolute z-50 w-full mt-1 bg-white dark:bg-[#121212] border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-hidden"
    >
      <!-- Loading State -->
      <div v-if="loading" class="p-4 text-center">
        <div
          class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"
        ></div>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Loading teachers...
        </p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-4 text-center">
        <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
        <button
          @click="fetchTeachers(1)"
          class="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
        >
          Try again
        </button>
      </div>

      <!-- Teachers List -->
      <div v-else-if="teachers.length > 0" class="max-h-48 overflow-y-auto">
        <div
          v-for="(teacher, index) in teachers"
          :key="teacher.id || teacher._id"
          :class="[
            'px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 border-b border-gray-100 dark:border-gray-700 last:border-b-0',
            highlightedIndex === index ? 'bg-blue-50 dark:bg-blue-900/20' : '',
          ]"
          @click="selectTeacher(teacher)"
          @mouseenter="highlightedIndex = index"
        >
          <div class="flex items-center space-x-3">
            <div
              class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium"
            >
              {{ getInitials(teacher.name) }}
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="text-sm font-medium text-gray-900 dark:text-white truncate"
              >
                {{ teacher.name }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ teacher.email }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="p-4 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{
            searchQuery
              ? "No teachers found matching your search."
              : "No teachers available."
          }}
        </p>
      </div>

      <!-- Pagination -->
      <div
        v-if="teachers.length > 0 && (hasNextPage || hasPrevPage)"
        class="border-t border-gray-200 dark:border-gray-600 p-2 flex items-center justify-between bg-gray-50 dark:bg-gray-700"
      >
        <button
          @click="loadPreviousPage"
          :disabled="!hasPrevPage || loading"
          class="text-xs px-2 py-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          @click="loadNextPage"
          :disabled="!hasNextPage || loading"
          class="text-xs px-2 py-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Click outside to close -->
    <div
      v-if="showDropdown"
      class="fixed inset-0 z-40"
      @click="showDropdown = false"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useUsersStore } from "@/stores/users";
import { debounce } from "lodash-es";

interface Teacher {
  id: string;
  _id?: string;
  name: string;
  email: string;
}

interface Props {
  modelValue?: string | null;
  required?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: string | null];
  "teacher-selected": [teacher: Teacher | null];
}>();

const usersStore = useUsersStore();

// State
const searchQuery = ref("");
const showDropdown = ref(false);
const selectedTeacher = ref<Teacher | null>(null);
const highlightedIndex = ref(-1);
const searchInput = ref<HTMLInputElement>();

// Pagination state
const currentPage = ref(1);
const pageSize = ref(10);
const totalTeachers = ref(0);

// Computed
const teachers = computed(() => usersStore.users as Teacher[]);
const loading = computed(() => usersStore.loading);
const error = computed(() => usersStore.error);

const totalPages = computed(() =>
  Math.ceil(totalTeachers.value / pageSize.value)
);
const hasNextPage = computed(() => currentPage.value < totalPages.value);
const hasPrevPage = computed(() => currentPage.value > 1);

// Methods
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const fetchTeachers = async (page: number = 1, search: string = "") => {
  currentPage.value = page;

  try {
    await usersStore.getAllUsers({
      page,
      limit: pageSize.value,
      role: "teacher",
      search: search || undefined,
      isActive: true,
    });

    totalTeachers.value = usersStore.total;
  } catch (err) {
    console.error("Failed to fetch teachers:", err);
  }
};

const debouncedSearch = debounce((searchTerm: string) => {
  fetchTeachers(1, searchTerm);
}, 300);

const handleSearch = () => {
  highlightedIndex.value = -1;
  if (searchQuery.value.trim()) {
    debouncedSearch(searchQuery.value.trim());
  } else {
    fetchTeachers(1);
  }
};

const selectTeacher = (teacher: Teacher) => {
  selectedTeacher.value = teacher;
  showDropdown.value = false;
  searchQuery.value = "";
  highlightedIndex.value = -1;

  const teacherId: string | null = teacher.id || teacher._id || null;
  emit("update:modelValue", teacherId);
  emit("teacher-selected", teacher);
};

const clearSelection = () => {
  selectedTeacher.value = null;
  emit("update:modelValue", null);
  emit("teacher-selected", null);

  nextTick(() => {
    searchInput.value?.focus();
  });
};

const loadNextPage = () => {
  if (hasNextPage.value && !loading.value) {
    fetchTeachers(currentPage.value + 1, searchQuery.value);
  }
};

const loadPreviousPage = () => {
  if (hasPrevPage.value && !loading.value) {
    fetchTeachers(currentPage.value - 1, searchQuery.value);
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!showDropdown.value || teachers.value.length === 0) return;

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault();
      highlightedIndex.value = Math.min(
        highlightedIndex.value + 1,
        teachers.value.length - 1
      );
      break;
    case "ArrowUp":
      event.preventDefault();
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1);
      break;
    case "Enter":
      event.preventDefault();
      if (
        highlightedIndex.value >= 0 &&
        highlightedIndex.value < teachers.value.length
      ) {
        selectTeacher(teachers.value[highlightedIndex.value]);
      }
      break;
    case "Escape":
      showDropdown.value = false;
      highlightedIndex.value = -1;
      break;
  }
};

// Watch for prop changes
watch(
  () => props.modelValue,
  async (newValue) => {
    if (newValue && !selectedTeacher.value) {
      // Find teacher by ID if not already selected
      const existingTeacher = teachers.value.find(
        (t) => (t.id || t._id) === newValue
      );

      if (existingTeacher) {
        selectedTeacher.value = existingTeacher;
      } else {
        // Fetch teacher details if not in current list
        try {
          await usersStore.getUserById(newValue);
          if (usersStore.user) {
            selectedTeacher.value = usersStore.user as Teacher;
          }
        } catch (err) {
          console.error("Failed to fetch teacher details:", err);
        }
      }
    } else if (!newValue) {
      selectedTeacher.value = null;
    }
  },
  { immediate: true }
);

// Initialize
onMounted(() => {
  fetchTeachers(1);
});
</script>
