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
                  Add Subject to Classroom
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

                <!-- Subject Search -->
                <div class="mb-4">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Search Subjects
                  </label>
                  <div class="relative">
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Search subjects by name or code..."
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                      @input="handleSearch"
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

                <!-- Available Subjects -->
                <div class="mb-4">
                  <!-- Loading State -->
                  <div v-if="loading" class="text-center py-8">
                    <div
                      class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
                    ></div>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Loading subjects...
                    </p>
                  </div>

                  <!-- Error State -->
                  <div v-else-if="error" class="text-center py-8">
                    <p class="text-sm text-red-600 dark:text-red-400">
                      {{ error }}
                    </p>
                    <button
                      @click="fetchSubjects"
                      class="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-2"
                    >
                      Try again
                    </button>
                  </div>

                  <!-- Subjects List -->
                  <div
                    v-else-if="availableSubjects.length > 0"
                    class="space-y-2 max-h-64 overflow-y-auto"
                  >
                    <div
                      v-for="subject in availableSubjects"
                      :key="subject.id"
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
                        @click="addSubject(subject)"
                        :disabled="addingSubjectId === subject.id"
                        class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        <svg
                          v-if="addingSubjectId === subject.id"
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
                          addingSubjectId === subject.id ? "Adding..." : "Add"
                        }}
                      </button>
                    </div>
                  </div>

                  <!-- Empty State -->
                  <div v-else class="text-center py-8">
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
                    <h3
                      class="mt-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      No subjects found
                    </h3>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {{
                        searchQuery
                          ? "Try adjusting your search terms."
                          : "All available subjects are already added to this classroom."
                      }}
                    </p>
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
import { ref, computed, watch } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { useClassroomStore } from "@/stores/classroomStore";
import { SubjectProp, useSubjectStore } from "@/stores/subjectStore"; // Assuming you have a subjects store
import { debounce } from "lodash-es";

interface Props {
  isOpen: boolean;
  classroom: any;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  added: [];
}>();

const classroomStore = useClassroomStore();
const subjectsStore = useSubjectStore(); // You'll need to create this

const searchQuery = ref("");
const loading = ref(false);
const error = ref<string | null>(null);
const addingSubjectId = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const allSubjects = ref<SubjectProp[]>([]);

const availableSubjects = computed(() => {
  const classroomSubjectIds =
    props.classroom?.subjects?.map((s: any) => s.id || s._id) || [];

  console.log(classroomSubjectIds, "classroomSubjectIds");

  return allSubjects.value.filter(
    (subject: any) => !classroomSubjectIds.includes(subject.id || subject._id)
  );
});

console.log("availableSubjects", availableSubjects.value);

const fetchSubjects = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Fetch all subjects - you'll need to implement this in your subjects store
    await subjectsStore.fetchSubjects({
      limit: 100,
      search: searchQuery.value,
    });
    allSubjects.value = subjectsStore.subjects;
  } catch (err) {
    error.value = "Failed to load subjects";
  } finally {
    loading.value = false;
  }
};

const debouncedSearch = debounce(() => {
  fetchSubjects();
}, 300);

const handleSearch = () => {
  debouncedSearch();
};

const addSubject = async (subject: any) => {
  addingSubjectId.value = subject.id;
  error.value = null;
  successMessage.value = null;

  try {
    await classroomStore.addSubjectToClassroom(props.classroom.id, {
      subjectId: subject.id,
    });

    successMessage.value = `${subject.name} has been added to the classroom.`;

    // Remove from available subjects list
    allSubjects.value = allSubjects.value.filter(
      (s: any) => s.id !== subject.id
    );

    emit("added");
  } catch (err: any) {
    error.value = err.message || "Failed to add subject";
  } finally {
    addingSubjectId.value = null;
  }
};

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      searchQuery.value = "";
      error.value = null;
      successMessage.value = null;
      fetchSubjects();
    }
  }
);
</script>
