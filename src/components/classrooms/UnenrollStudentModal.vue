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
                    Unenroll Student from Classroom
                  </DialogTitle>
  
                  <!-- Student Info -->
                  <div v-if="student" class="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {{ getInitials(student.name) }}
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ student.name }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">
                          {{ student.email }} | Grade {{ student.grade }}
                        </p>
                      </div>
                    </div>
                  </div>
  
                  <!-- Enrolled Classrooms -->
                  <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Select Classroom to Unenroll From
                    </label>
                    
                    <div v-if="loading" class="text-center py-4">
                      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading enrolled classrooms...</p>
                    </div>
  
                    <div v-else-if="enrolledClassrooms.length === 0" class="text-center py-4">
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        This student is not enrolled in any classrooms.
                      </p>
                    </div>
  
                    <div v-else class="space-y-2 max-h-48 overflow-y-auto">
                      <div
                        v-for="classroom in enrolledClassrooms"
                        :key="classroom.id"
                        class="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div>
                          <p class="text-sm font-medium text-gray-900 dark:text-white">
                            {{ classroom.name }}
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                            Code: {{ classroom.code }} | Grade {{ classroom.grade }} | {{ classroom.academicYear }}
                          </p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">
                            Teacher: {{ classroom.teacher?.name || 'Not assigned' }}
                          </p>
                        </div>
                        <button
                          @click="unenrollFromClassroom(classroom)"
                          :disabled="unenrolling === classroom.id"
                          class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          <svg
                            v-if="unenrolling === classroom.id"
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
                          {{ unenrolling === classroom.id ? 'Unenrolling...' : 'Unenroll' }}
                        </button>
                      </div>
                    </div>
                  </div>
  
                  <!-- Error Message -->
                  <div v-if="error" class="mb-4">
                    <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <div class="flex">
                        <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                        </svg>
                        <div class="ml-3">
                          <p class="text-sm text-red-800 dark:text-red-200">{{ error }}</p>
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
import { inject, ref, watch } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { useClassroomStore } from "@/stores/classroomStore";
import { Classroom } from "@/types";

interface Props {
  isOpen: boolean;
  student: any;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  unenrolled: [];
}>();

const classroomStore = useClassroomStore();

const enrolledClassrooms = ref<Classroom[]>([]);
const loading = ref(false);
const unenrolling = ref<string | null>(null);
const error = ref<string | null>(null);
  const toastRef = inject("toast");

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const fetchEnrolledClassrooms = async () => {
  if (!props.student) return;

  loading.value = true;
  error.value = null;

  try {
    // Fetch all classrooms and filter by student enrollment
    await classroomStore.fetchClassrooms({ limit: 100 });
    
    // Filter classrooms where this student is enrolled
    enrolledClassrooms.value = classroomStore.classrooms.filter(classroom => 
      classroom.students?.some(student => 
        student.id === props.student._id || student._id === props.student._id
      )
    );


  } catch (err) {
    error.value = "Failed to load enrolled classrooms";
  } finally {
    loading.value = false;
  }
};

const unenrollFromClassroom = async (classroom: any) => {
  if (!props.student) return;

  unenrolling.value = classroom.id;
  error.value = null;

  try {
    const res = await classroomStore.unenrollStudent(classroom.id, props.student._id);
    
    // Remove from local list
    enrolledClassrooms.value = enrolledClassrooms.value.filter(
      c => c?.id !== classroom.id
    );
    // @ts-expect-error: Unreachable code error
    toastRef?.value?.addToast({
      status: "success",
      title: res.message,
    });
    emit("unenrolled");
  } catch (err: any) {
    error.value = err.message || "Failed to unenroll student";
  } finally {
    unenrolling.value = null;
  }
};

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    enrolledClassrooms.value = [];
    error.value = null;
    fetchEnrolledClassrooms();
  }
});
</script>                  <button