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
              class="relative transform overflow-hidden rounded-lg bg-white dark:bg-[#121212] px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
            >
              <div>
                <div class="flex items-center justify-between mb-6">
                  <DialogTitle
                    as="h3"
                    class="text-lg font-semibold leading-6 text-gray-900 dark:text-white"
                  >
                    Create New Assignment
                  </DialogTitle>
                  <button
                    @click="$emit('close')"
                    class="rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <svg
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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

                <form @submit.prevent="handleSubmit" class="space-y-4">
                  <!-- Title -->
                  <div>
                    <label
                      for="title"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Title *
                    </label>
                    <input
                      id="title"
                      v-model="form.title"
                      type="text"
                      required
                      class="input"
                      placeholder="Enter assignment title"
                    />
                  </div>

                  <!-- Subject -->
                  <div>
                    <SubjectSelect
                      v-model="form.subject"
                      label="Subject"
                      placeholder="Select a subject"
                      required
                      id="subject"
                    />
                  </div>

                  <!-- Type -->
                  <div>
                    <label
                      for="type"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Type *
                    </label>
                    <select
                      id="type"
                      v-model="form.type"
                      required
                      class="input"
                    >
                      <option value="">Select type</option>
                      <option value="homework">Homework</option>
                      <option value="quiz">Quiz</option>
                      <option value="project">Project</option>
                      <option value="exam">Exam</option>
                    </select>
                  </div>

                  <!-- Description -->
                  <div>
                    <label
                      for="description"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Description *
                    </label>
                    <textarea
                      id="description"
                      v-model="form.description"
                      rows="4"
                      required
                      class="input min-h-20"
                      placeholder="Enter assignment description"
                    />
                  </div>

                  <!-- Instructions -->
                  <div>
                    <label
                      for="instructions"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Instructions
                    </label>
                    <textarea
                      id="instructions"
                      v-model="form.instructions"
                      rows="3"
                      class="input min-h-20"
                      placeholder="Enter detailed instructions (optional)"
                    />
                  </div>

                  <!-- Due Date -->
                  <div>
                    <label
                      for="dueDate"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Due Date *
                    </label>
                    <input
                      id="dueDate"
                      v-model="form.dueDate"
                      type="datetime-local"
                      required
                      class="input"
                      :min="minDateTime"
                      :class="{
                        'border-red-500 dark:border-red-400': dueDateError,
                      }"
                    />

                    <p
                      v-if="dueDateError"
                      class="mt-1 text-xs text-red-600 dark:text-red-400"
                    >
                      {{ dueDateError }}
                    </p>
                  </div>

                  <!-- Max Score -->
                  <div>
                    <label
                      for="maxScore"
                      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Max Score *
                    </label>
                    <input
                      id="maxScore"
                      v-model.number="form.maxScore"
                      type="number"
                      min="1"
                      required
                      class="input"
                      placeholder="Enter maximum score"
                    />
                  </div>

                  <!-- Error Message -->
                  <div
                    v-if="error"
                    class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3"
                  >
                    <p class="text-sm text-red-600 dark:text-red-400">
                      {{ error }}
                    </p>
                  </div>

                  <!-- Actions -->
                  <div class="flex justify-end space-x-3 pt-4">
                    <button type="button" @click="$emit('close')" class="btn">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      :disabled="loading"
                      class="px-4 py-2 text-sm font-medium text-white bg-black dark:bg-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span v-if="loading" class="flex items-center">
                        <svg
                          class="animate-spin -ml-1 mr-2 h-4 w-4"
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
                          ></circle>
                          <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating...
                      </span>
                      <span v-else>Create Assignment</span>
                    </button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { useAssignmentStore } from "@/stores/assignmentStore";
import type { Assignment, CreateAssignmentData } from "@/types";
import SubjectSelect from "@/components/assignments/SubjectDropdown.vue";
import { storeToRefs } from "pinia";

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  created: [];
}>();

const assignmentStore = useAssignmentStore();

// const loading = ref(false);
// const error = ref<string | null>(null);

const form = reactive({
  title: "",
  subject: "",
  type: "" as Assignment["type"] | "",
  description: "",
  instructions: "",
  dueDate: "",
  maxScore: 100,
});

const dueDateError = ref<string | null>(null);

const validateDueDate = () => {
  const selectedDate = new Date(form.dueDate);
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  if (selectedDate <= today) {
    dueDateError.value = "Due date must be at least one day from today";
    return false;
  }
  dueDateError.value = null;
  return true;
};

// Calculate minimum date (tomorrow at 00:00)
const minDateTime = computed(() => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString().slice(0, 16);
});

const resetForm = () => {
  form.title = "";
  form.subject = "";
  form.type = "";
  form.description = "";
  form.instructions = "";
  form.dueDate = "";
  form.maxScore = 100;
};
const { loading, error } = storeToRefs(assignmentStore);

const handleSubmit = async () => {
  const assignmentData: CreateAssignmentData = {
    title: form.title,
    subject: form.subject,
    type: form.type as Assignment["type"],
    description: form.description,
    instructions: form.instructions || undefined,
    dueDate: new Date(form.dueDate),
    maxScore: form.maxScore,
  };

  const success = await assignmentStore.addAssignment(assignmentData);

  if (success) {
    emit("created");
    resetForm();
  }
};

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      resetForm();
    }
  }
);

// Watch for due date changes
watch(
  () => form.dueDate,
  () => {
    if (form.dueDate) {
      validateDueDate();
    }
  }
);
</script>
