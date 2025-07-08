<template>
  <div class="bg-[#2a2a2a] rounded-lg p-6 space-y-6 flex flex-col">
    <div class="flex flex-wrap justify-between">
      <!-- Role Filter -->
      <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
        <label for="role" class="block text-sm font-medium text-gray-300 mb-2">
          Filter by user role
        </label>
        <select id="role" v-model="localFilter.role" class="input">
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <!-- Grade Filter -->
      <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
        <label for="grade" class="block text-sm font-medium text-gray-300 mb-2">
          Filter by grade (for students)
        </label>
        <input
          id="grade"
          v-model="localFilter.grade"
          type="number"
          min="1"
          max="12"
          placeholder="Grade"
          class="input"
        />
      </div>

      <!-- Search Filter -->
      <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
        <label
          for="search"
          class="block text-sm font-medium text-gray-300 mb-2"
        >
          Search in name and email
        </label>
        <div class="relative">
          <input
            id="search"
            v-model="localFilter.search"
            type="text"
            placeholder="Search"
            class="input pr-10"
          />
          <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <MagnifyingGlassIcon class="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <!-- Account Status Filter -->
      <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
        <label
          for="isActive"
          class="block text-sm font-medium text-gray-300 mb-2"
        >
          Filter by account status
        </label>
        <select id="isActive" v-model="localFilter.isActive" class="input">
          <option :value="null">--</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
    </div>

    <div class="flex justify-end gap-2">
      <button @click="clearFilters" class="btn btn-ghost text-sm">
        Clear filters
      </button>
      <button @click="applyFilters" class="btn btn-primary text-sm">
        Apply filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline";
import { useStudentsStore } from "@/stores/students";
import type { Filter } from "@/types";

const studentsStore = useStudentsStore();

const localFilter = ref<Filter>({
  role: "student",
  grade: null,
  search: "",
  isActive: null,
});

const applyFilters = () => {
  studentsStore.updateFilter({
    ...localFilter.value,
    page: studentsStore.filters.page,
    limit: studentsStore.filters.limit,
    role: localFilter.value.role || "student",
  });
};

const clearFilters = () => {
  localFilter.value = {
    role: "student",
    grade: null,
    search: "",
    isActive: null,
  };
  applyFilters();
};
</script>
