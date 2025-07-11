<template>
  <Modal
    :is-open="isOpen"
    @close="$emit('close')"
    title="Delete Subject"
    size="small"
  >
    <div v-if="subject" class="space-y-4">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          <svg
            class="h-10 w-10 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-medium text-black dark:text-white">
            Delete Subject
          </h3>
          <p class="text-sm text-gray-700 dark:text-gray-400">
            Are you sure you want to delete "{{ subject.name }}"? This action
            cannot be undone.
          </p>
        </div>
      </div>

      <div
        v-if="subject.students.length > 0"
        class="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
      >
        <div class="flex">
          <svg
            class="h-5 w-5 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">Warning</h3>
            <p class="mt-1 text-sm text-yellow-700">
              This subject has {{ subject.students.length }} enrolled student{{
                subject.students.length !== 1 ? "s" : ""
              }}. Deleting this subject will remove all student enrollments and
              progress data.
            </p>
          </div>
        </div>
      </div>

      <div class="bg-[#121212] rounded-lg p-4">
        <h4 class="text-sm font-medium text-black dark:text-white mb-2">
          Subject Details:
        </h4>
        <dl class="space-y-1">
          <div class="flex justify-between text-sm">
            <dt class="text-gray-700 dark:text-gray-400">Code:</dt>
            <dd class="text-black dark:text-white">
              {{ subject.code || "N/A" }}
            </dd>
          </div>
          <div class="flex justify-between text-sm">
            <dt class="text-gray-700 dark:text-gray-400">Teacher:</dt>
            <dd class="text-black dark:text-white">
              {{ subject.teacher.name }}
            </dd>
          </div>
          <div class="flex justify-between text-sm">
            <dt class="text-gray-700 dark:text-gray-400">Students:</dt>
            <dd class="text-black dark:text-white">
              {{ subject.students.length }}
            </dd>
          </div>
        </dl>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="handleDelete"
          :disabled="loading"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <span
            v-if="loading"
            class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
          ></span>
          <span>{{ loading ? "Deleting..." : "Delete Subject" }}</span>
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSubjectStore, type SubjectProp } from "@/stores/subjectStore";
import Modal from "@/components/common/Modal.vue";

interface Props {
  isOpen: boolean;
  subject: SubjectProp | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  confirmed: [];
}>();

const subjectStore = useSubjectStore();
const loading = ref(false);

const handleDelete = async () => {
  if (!props.subject) return;

  loading.value = true;
  try {
    await subjectStore.deleteSubject(props.subject.id);
    emit("confirmed");
  } catch (error) {
    console.error("Failed to delete subject:", error);
  } finally {
    loading.value = false;
  }
};
</script>
