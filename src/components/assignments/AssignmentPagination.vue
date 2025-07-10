<!-- components/assignments/AssignmentPagination.vue -->
<template>
  <div
    v-if="pagination.totalPages > 0"
    class="flex items-center justify-between bg-white dark:bg-black px-4 py-3 border border-neutral-200 dark:border-white/10 rounded-lg"
  >
    <!-- Mobile Pagination -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="$emit('page-change', pagination.page - 1)"
        :disabled="pagination.page <= 1"
        class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-black dark:text-white bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-white/20 rounded-md hover:bg-neutral-100 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      <button
        @click="$emit('page-change', pagination.page + 1)"
        :disabled="pagination.page >= pagination.totalPages"
        class="relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium text-black dark:text-white bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-white/20 rounded-md hover:bg-neutral-100 dark:hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>

    <!-- Desktop Pagination -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-black dark:text-white">
          Page
          <span class="font-medium">{{ pagination.page }}</span>
          of
          <span class="font-medium">{{ pagination.totalPages }}</span>
          pages
        </p>
      </div>
      <div>
        <nav
          class="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <!-- Previous button -->
          <button
            @click="$emit('page-change', pagination.page - 1)"
            :disabled="pagination.page <= 1"
            class="relative inline-flex items-center rounded-l-md px-2 py-2 text-neutral-500 dark:text-neutral-400 ring-1 ring-inset ring-neutral-300 dark:ring-white/20 hover:bg-neutral-100 dark:hover:bg-white/10 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <!-- Page numbers -->
          <template v-for="page in visiblePages" :key="page">
            <button
              v-if="page !== '...'"
              @click="$emit('page-change', page as number)"
              :class="[
                page === pagination.page
                  ? 'relative z-10 inline-flex items-center bg-black dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-black focus:z-20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black dark:focus-visible:outline-white'
                  : 'relative inline-flex items-center px-4 py-2 text-sm font-semibold text-black dark:text-white ring-1 ring-inset ring-neutral-300 dark:ring-white/20 hover:bg-neutral-100 dark:hover:bg-white/10 focus:z-20 focus:outline-offset-0',
              ]"
            >
              {{ page }}
            </button>
            <span
              v-else
              class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-neutral-500 dark:text-neutral-400 ring-1 ring-inset ring-neutral-300 dark:ring-white/20 focus:outline-offset-0"
            >
              ...
            </span>
          </template>

          <!-- Next button -->
          <button
            @click="$emit('page-change', pagination.page + 1)"
            :disabled="pagination.page >= pagination.totalPages"
            class="relative inline-flex items-center rounded-r-md px-2 py-2 text-neutral-500 dark:text-neutral-400 ring-1 ring-inset ring-neutral-300 dark:ring-white/20 hover:bg-neutral-100 dark:hover:bg-white/10 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Pagination {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

interface Props {
  pagination: Pagination;
}

const props = defineProps<Props>();

defineEmits<{
  "page-change": [page: number];
}>();

const visiblePages = computed(() => {
  const current = props.pagination.page;
  const total = props.pagination.totalPages;
  const pages: (number | string)[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = total - 4; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i);
      }
      pages.push("...");
      pages.push(total);
    }
  }

  return pages;
});
</script>
