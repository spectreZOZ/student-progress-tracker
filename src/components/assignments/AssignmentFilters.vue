<template>
  <div
    class="bg-white dark:bg-black rounded-lg border border-neutral-200 dark:border-white/10 p-4"
  >
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Search -->
      <div>
        <label
          class="block text-sm font-medium text-black dark:text-white mb-1"
        >
          Search
        </label>
        <input
          v-model="searchInput"
          @input="handleSearchInput"
          type="text"
          placeholder="Search assignments..."
          class="input"
        />
      </div>

      <!-- Type Filter -->
      <div>
        <label
          class="block text-sm font-medium text-black dark:text-white mb-1"
        >
          Type
        </label>
        <select
          :value="filters.type"
          @change="
            updateFilter('type', ($event.target as HTMLSelectElement).value)
          "
          class="input"
        >
          <option value="">All Types</option>
          <option value="homework">Homework</option>
          <option value="quiz">Quiz</option>
          <option value="project">Project</option>
          <option value="exam">Exam</option>
        </select>
      </div>

      <!-- Subject Filter -->
      <div>
        <label
          class="block text-sm font-medium text-black dark:text-white mb-1"
        >
          Subject
        </label>
        <SubjectDropdown
          :model-value="filters.subject"
          @update:model-value="updateFilter('subject', $event)"
          placeholder="All Subjects"
        />
      </div>

      <!-- Status Filter -->
      <div>
        <label
          class="block text-sm font-medium text-black dark:text-white mb-1"
        >
          Status
        </label>
        <select
          :value="filters.isActive"
          @change="
            updateFilter('isActive', ($event.target as HTMLSelectElement).value)
          "
          class="input"
        >
          <option value="">All Status</option>
          <option :value="true">Active</option>
          <option :value="false">Inactive</option>
        </select>
      </div>
    </div>

    <!-- Filter Actions -->
    <div
      class="flex justify-between items-center mt-4 pt-4 border-t border-neutral-200 dark:border-white/10"
    >
      <div class="text-sm text-neutral-600 dark:text-neutral-400">
        Showing {{ currentCount }} of {{ totalCount }} assignments
      </div>
      <button
        @click="clearAllFilters"
        class="text-sm text-black/70 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
      >
        Clear Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import SubjectDropdown from "./SubjectDropdown.vue";

interface Filters {
  search: string;
  type: string;
  subject: string;
  isActive: "" | boolean;
}

interface Props {
  filters: Filters;
  currentCount: number;
  totalCount: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:filters": [filters: Filters];
  search: [query: string];
  clear: [];
}>();

// Local search input state
const searchInput = ref(props.filters.search);

// Debounced search
let searchTimeout: NodeJS.Timeout;

const handleSearchInput = () => {
  // Clear the previous timeout
  clearTimeout(searchTimeout);

  // Set a new timeout
  searchTimeout = setTimeout(() => {
    // Update the filters with the debounced search value
    updateFilter("search", searchInput.value);
  }, 800); // Wait 800ms after user stops typing
};

const updateFilter = (key: keyof Filters, value: any) => {
  const newFilters = { ...props.filters, [key]: value };
  emit("update:filters", newFilters);

  // Only emit search event for search filter
  if (key === "search") {
    emit("search", value);
  }
};

const clearAllFilters = () => {
  searchInput.value = ""; // Clear local search input
  emit("clear");
};

// Watch for external changes to search filter (like when clearing filters)
watch(
  () => props.filters.search,
  (newValue) => {
    if (newValue !== searchInput.value) {
      searchInput.value = newValue;
    }
  }
);
</script>
