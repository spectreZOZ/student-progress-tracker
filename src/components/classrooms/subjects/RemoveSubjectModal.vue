<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-white/10 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div>
                <DialogTitle
                  as="h3"
                  class="text-lg font-semibold leading-6 text-black dark:text-white mb-4"
                >
                  Remove Subject from Classroom
                </DialogTitle>

                <!-- Classroom Info -->
                <div class="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ classroom.name }}
                  </h4>
                  <p class="text-xs text-gray-500 dark:text-gray-400">
                    Code: {{ classroom.code }} | Grade {{ classroom.grade }}
                  </p>
                </div>

                <!-- Current Subjects -->
                <div class="mb-4">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Current Subjects
                  </label>

                  <div
                    v-if="!classroom.subjects?.length"
                    class="text-center py-8"
                  >
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
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      No subjects are currently assigned to this classroom.
                    </p>
                  </div>

                  <div v-else class="space-y-2 max-h-64 overflow-y-auto">
                    <div
                      v-for="subject in classroom.subjects"
                      :key="subject.id || subject._id"
                      class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <div>
                        <p
                          class="text-sm font-medium text-gray-900 dark:text-white"
                        >
                          {{ subject.name }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          Code: {{ subject.code }}
                        </p>
                        <p
                          v-if="subject.description"
                          class="text-xs text-gray-500 dark:text-gray-400"
                        >
                          {{ subject.description }}
                        </p>
                      </div>
                      <button
                        @click="removeSubject(subject)"
                        :disabled="
                          removingSubjectId === (subject.id || subject._id)
                        "
                        class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        <svg
                          v-if="
                            removingSubjectId === (subject.id || subject._id)
                          "
                          class="animate-spin -ml-1 mr-1 h-3 w-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                          />
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        {{
                          removingSubjectId === (subject.id || subject._id)
                            ? "Removing..."
                            : "Remove"
                        }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="mb-4">
                  <div
                    class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
                  >
                    <div class="flex">
                      <svg
                        class="w-5 h-5 text-red-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <div class="ml-3">
                        <p class="text-sm text-red-800 dark:text-red-200">
                          {{ error }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Success Message -->
                <div v-if="successMessage" class="mb-4">
                  <div
                    class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4"
                  >
                    <div class="flex">
                      <svg
                        class="w-5 h-5 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clip-rule="evenodd"
                        />
                      </svg>
                      <div class="ml-3">
                        <p class="text-sm text-green-800 dark:text-green-200">
                          {{ successMessage }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="mt-6 flex justify-end">
                <button
                  @click="$emit('close')"
                  class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { useClassroomStore } from "@/stores/classroomStore";

interface Props {
  isOpen: boolean;
  classroom: any;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  removed: [];
}>();

const classroomStore = useClassroomStore();

const removingSubjectId = ref<string | null>(null);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);

const removeSubject = async (subject: any) => {
  const subjectId = subject.id || subject._id;
  removingSubjectId.value = subjectId;
  error.value = null;
  successMessage.value = null;

  try {
    await classroomStore.removeSubjectFromClassroom(
      props.classroom.id,
      subjectId
    );

    successMessage.value = `${subject.name} has been removed from the classroom.`;

    emit("removed");
  } catch (err: any) {
    error.value = err.message || "Failed to remove subject";
  } finally {
    removingSubjectId.value = null;
  }
};

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      error.value = null;
      successMessage.value = null;
    }
  }
);
</script>
