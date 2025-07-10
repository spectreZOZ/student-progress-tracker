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
              <form @submit.prevent="handleSubmit">
                <div>
                  <DialogTitle
                    as="h3"
                    class="text-lg font-semibold leading-6 text-black dark:text-white mb-4"
                  >
                    Edit Classroom
                  </DialogTitle>

                  <div class="space-y-4">
                    <!-- Name -->
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Classroom Name *
                      </label>
                      <input
                        v-model="form.name"
                        type="text"
                        required
                        class="input"
                        placeholder="Enter classroom name"
                      />
                    </div>

                    <!-- Code -->
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Classroom Code *
                      </label>
                      <input
                        v-model="form.code"
                        type="text"
                        required
                        class="input"
                        placeholder="Enter unique classroom code"
                      />
                    </div>

                    <!-- Teacher Selection -->
                    <TeacherSelect
                      v-model="form.teacherId"
                      required
                      @teacher-selected="handleTeacherSelected"
                    />

                    <!-- Description -->
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Description
                      </label>
                      <textarea
                        v-model="form.description"
                        rows="3"
                        class="input"
                        placeholder="Enter classroom description"
                      />
                    </div>

                    <!-- Grade -->
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Grade *
                      </label>
                      <select v-model="form.grade" required class="input">
                        <option value="">Select Grade</option>
                        <option
                          v-for="grade in grades"
                          :key="grade"
                          :value="grade"
                        >
                          Grade {{ grade }}
                        </option>
                      </select>
                    </div>

                    <!-- Academic Year -->
                    <div>
                      <label
                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                      >
                        Academic Year *
                      </label>
                      <select
                        v-model="form.academicYear"
                        required
                        class="input"
                      >
                        <option value="">Select Academic Year</option>
                        <option
                          v-for="year in academicYears"
                          :key="year"
                          :value="year"
                        >
                          {{ year }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- Error Message -->
                  <div v-if="error" class="mt-4">
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
                </div>

                <div class="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    @click="$emit('close')"
                    :disabled="loading"
                    class="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    :disabled="loading"
                    class="btn btn-primary"
                  >
                    <svg
                      v-if="loading"
                      class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    {{ loading ? "Updating..." : "Update Classroom" }}
                  </button>
                </div>
              </form>
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
import { useClassroomStore } from "@/stores/classroomStore";
import TeacherSelect from "@/components/common/TeacherSelect.vue";
import type { Classroom } from "@/types";

interface Props {
  isOpen: boolean;
  classroom: Classroom | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  updated: [];
}>();

const classroomStore = useClassroomStore();

const loading = ref(false);
const error = ref<string | null>(null);
const selectedTeacher = ref<any>(null);

const form = reactive({
  name: "",
  code: "",
  description: "",
  grade: 0,
  academicYear: "",
  teacherId: null as string | null,
});

const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const academicYears = ["2023-2024", "2024-2025", "2025-2026", "2026-2027"];

const isFormValid = computed(() => {
  return (
    form.name.trim() &&
    form.code.trim() &&
    form.grade > 0 &&
    form.academicYear &&
    form.teacherId
  );
});

const handleTeacherSelected = (teacher: any) => {
  selectedTeacher.value = teacher;
};

const populateForm = () => {
  if (props.classroom) {
    form.name = props.classroom.name;
    form.code = props.classroom.code;
    form.description = props.classroom.description;
    form.grade = props.classroom.grade;
    form.academicYear = props.classroom.academicYear;
    form.teacherId =
      props.classroom.teacher?.id || props.classroom.teacher?._id || null;
  }
};

const resetForm = () => {
  form.name = "";
  form.code = "";
  form.description = "";
  form.grade = 0;
  form.academicYear = "";
  form.teacherId = null;
  selectedTeacher.value = null;
  error.value = null;
};

const handleSubmit = async () => {
  if (!props.classroom || !isFormValid.value) return;

  loading.value = true;
  error.value = null;

  try {
    const formData = {
      name: form.name,
      code: form.code,
      description: form.description,
      grade: form.grade,
      academicYear: form.academicYear,
      teacherId: form.teacherId,
    };

    await classroomStore.editClassroom(props.classroom.id, formData);
    emit("updated");
  } catch (err: any) {
    error.value = err.message || "Failed to update classroom";
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen && props.classroom) {
      populateForm();
    } else if (!isOpen) {
      resetForm();
    }
  }
);

watch(
  () => props.classroom,
  (classroom) => {
    if (classroom && props.isOpen) {
      populateForm();
    }
  }
);
</script>
