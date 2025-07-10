<template>
  <div
    class="bg-white dark:bg-[#1E1E1E] rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Search -->
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Search
        </label>
        <div class="relative">
          <input
            v-model="localFilters.search"
            type="text"
            placeholder="Search classrooms..."
            class="input"
            @keyup.enter="$emit('search')"
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
      </div>

      <!-- Grade Filter -->
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Grade
        </label>
        <select v-model="localFilters.grade" class="input">
          <option value="">All Grades</option>
          <option v-for="grade in grades" :key="grade" :value="grade">
            Grade {{ grade }}
          </option>
        </select>
      </div>

      <!-- Academic Year Filter -->
      <div>
        <label
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Academic Year
        </label>
        <select v-model="localFilters.academicYear" class="input">
          <option value="">All Years</option>
          <option v-for="year in academicYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <!-- Actions -->
      <div class="flex items-end space-x-2">
        <button
          @click="$emit('search')"
          class="flex-1 px-4 py-2 bg-[#121212] text-white rounded-lg hover:bg-[#121212]/80 transition-colors"
        >
          Search
        </button>
        <button
          @click="clearFilters"
          class="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>

    <!-- Results Summary -->
    <div
      class="mt-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400"
    >
      <span> Showing {{ currentCount }} of {{ totalCount }} classrooms </span>
      <span v-if="hasActiveFilters" class="text-blue-600 dark:text-blue-400">
        Filters applied
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";

interface Props {
  filters: {
    search: string;
    grade: string;
    academicYear: string;
    teacher: string;
  };
  currentCount: number;
  totalCount: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:filters": [filters: typeof props.filters];
  search: [];
  clear: [];
}>();

// Local reactive copy of filters
const localFilters = computed({
  get: () => props.filters,
  set: (value) => emit("update:filters", value),
});

// Static data
const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const academicYears = ["2023-2024", "2024-2025", "2025-2026", "2026-2027"];

const hasActiveFilters = computed(() => {
  return (
    props.filters.search ||
    props.filters.grade ||
    props.filters.academicYear ||
    props.filters.teacher
  );
});

const clearFilters = () => {
  emit("clear");
};

// Watch for filter changes and emit updates
watch(
  () => localFilters.value,
  (newFilters) => {
    emit("update:filters", newFilters);
  },
  { deep: true }
);
</script>
