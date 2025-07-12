<template>
  <div
    class="flex justify-end space-x-3 pt-6 border-t border-neutral-200 dark:border-white/10"
  >
    <button
      @click="$emit('close')"
      class="px-4 py-2 text-sm font-medium text-black dark:text-white bg-neutral-100 dark:bg-white/10 border border-neutral-300 dark:border-white/10 rounded hover:bg-neutral-200 dark:hover:bg-white/20 transition-colors"
    >
      Close
    </button>

    <div v-if="canEditAssignment" class="flex space-x-3">
      <button
        @click="$emit('edit')"
        class="px-4 py-2 text-sm font-medium text-black dark:text-white bg-neutral-100 dark:bg-white/10 rounded hover:bg-neutral-200 dark:hover:bg-white/20 transition-colors"
      >
        Edit Assignment
      </button>
      <button
        @click="$emit('delete')"
        class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
      >
        Delete Assignment
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  canEditAssignment: boolean;
  userRole: string;
}

defineProps<Props>();
defineEmits<{
  close: [];
  edit: [];
  delete: [];
}>();
</script>
