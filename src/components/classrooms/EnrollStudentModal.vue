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
                  Enroll Student in Classroom
                </DialogTitle>

                <!-- Student Info -->
                <div
                  v-if="student"
                  class="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium"
                    >
                      {{ getInitials(student.name) }}
                    </div>
                    <div>
                      <p
                        class="text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {{ student.name }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ student.email }} | Grade {{ student.grade }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Classroom Selection -->
                <div class="mb-4">
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Select Classroom
                  </label>
                  <select
                    v-model="selectedClassroomId"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Choose a classroom...</option>
                    <option
                      v-for="classroom in classrooms"
                      :key="classroom?.id"
                      :value="classroom?.id"
                    >
                      {{ classroom.name }} ({{ classroom.code }}) - Grade
                      {{ classroom.grade }}
                    </option>
                  </select>
                </div>

                <!-- Loading State -->
                <div v-if="classroomStore.loading" class="text-center py-4">
                  <div
                    class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"
                  ></div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Loading classrooms...
                  </p>
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
              </div>

              <div class="mt-6 flex justify-end space-x-3">
                <button
                  @click="$emit('close')"
                  :disabled="enrolling"
                  class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  @click="enrollStudent"
                  :disabled="enrolling || !selectedClassroomId"
                  class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
                >
                  <svg
                    v-if="enrolling"
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
                  {{ enrolling ? "Enrolling..." : "Enroll Student" }}
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
import { ref, watch, onMounted, inject } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { useClassroomStore } from "@/stores/classroomStore";
import { Classroom } from "@/types";
import { storeToRefs } from "pinia";

interface Props {
  isOpen: boolean;
  student: any;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  enrolled: [];
}>();

const classroomStore = useClassroomStore();

const selectedClassroomId = ref("");
const enrolling = ref(false);
const errorMessage = ref<string | null>(null);

const { error } = storeToRefs(classroomStore);

const classrooms = ref<Classroom[]>([]);

const toastRef = inject("toast");

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const fetchClassrooms = async () => {
  try {
    await classroomStore.fetchClassrooms({ limit: 100 });
    classrooms.value = classroomStore.classrooms;
  } catch (err) {
    errorMessage.value = "Failed to load classrooms";
  }
};

const enrollStudent = async () => {
  if (!selectedClassroomId.value || !props.student) return;

  enrolling.value = true;

  try {
    const res = await classroomStore.enrollStudent(selectedClassroomId.value, {
      studentId: props.student._id,
    });

    // @ts-expect-error: Unreachable code error
    toastRef?.value?.addToast({
      status: "success",
      title: res.message,
    });
    emit("enrolled");
  } catch (err: any) {
  } finally {
    enrolling.value = false;
  }
};

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      selectedClassroomId.value = "";
      errorMessage.value = null;
      fetchClassrooms();
    }
  }
);

onMounted(() => {
  if (props.isOpen) {
    fetchClassrooms();
  }
});
</script>
