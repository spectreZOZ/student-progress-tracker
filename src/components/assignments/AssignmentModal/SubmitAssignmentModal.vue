<!-- components/assignments/SubmitAssignmentModal.vue -->
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
              class="relative transform overflow-hidden rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-white/10 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6"
            >
              <div>
                <!-- Header -->
                <div class="flex items-center justify-between mb-6">
                  <DialogTitle
                    as="h3"
                    class="text-lg font-semibold leading-6 text-black dark:text-white"
                  >
                    Submit Assignment: {{ assignment?.title }}
                  </DialogTitle>
                  <button
                    @click="$emit('close')"
                    class="rounded-md text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
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

                <!-- Assignment Info -->
                <div class="mb-6 p-4 bg-neutral-100 dark:bg-white/5 rounded-lg">
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="text-neutral-500 dark:text-neutral-400"
                        >Due Date:</span
                      >
                      <p class="text-black dark:text-white font-medium">
                        {{ formatDate(assignment?.dueDate) }}
                      </p>
                    </div>
                    <div>
                      <span class="text-neutral-500 dark:text-neutral-400"
                        >Max Score:</span
                      >
                      <p class="text-black dark:text-white font-medium">
                        {{ assignment?.maxScore }} points
                      </p>
                    </div>
                  </div>
                </div>

                <!-- File Upload Section -->
                <div class="mb-6">
                  <label
                    class="block text-sm font-medium text-black dark:text-white mb-3"
                  >
                    Upload Files
                  </label>

                  <!-- File Drop Zone -->
                  <div
                    @drop="handleDrop"
                    @dragover.prevent
                    @dragenter.prevent="isDragging = true"
                    @dragleave.prevent="isDragging = false"
                    :class="[
                      isDragging
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-neutral-300 dark:border-white/20',
                      'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
                    ]"
                  >
                    <svg
                      class="mx-auto h-12 w-12 text-neutral-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <div class="mt-4">
                      <label class="cursor-pointer">
                        <span
                          class="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-500"
                        >
                          Upload files
                        </span>
                        <input
                          ref="fileInput"
                          type="file"
                          multiple
                          class="sr-only"
                          @change="handleFileSelect"
                          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip,.rar"
                        />
                      </label>
                      <span class="text-neutral-500 dark:text-neutral-400">
                        or drag and drop</span
                      >
                    </div>
                    <p
                      class="text-xs text-neutral-500 dark:text-neutral-400 mt-2"
                    >
                      PDF, DOC, DOCX, TXT, JPG, PNG, ZIP up to 10MB each
                    </p>
                  </div>

                  <!-- Selected Files List -->
                  <div v-if="selectedFiles.length" class="mt-4 space-y-2">
                    <h4 class="text-sm font-medium text-black dark:text-white">
                      Selected Files ({{ selectedFiles.length }})
                    </h4>
                    <div class="space-y-2">
                      <div
                        v-for="(file, index) in selectedFiles"
                        :key="index"
                        class="flex items-center justify-between p-3 bg-neutral-100 dark:bg-white/5 rounded border"
                      >
                        <div class="flex items-center space-x-3">
                          <svg
                            class="w-5 h-5 text-neutral-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                              clip-rule="evenodd"
                            />
                          </svg>
                          <div>
                            <p
                              class="text-sm font-medium text-black dark:text-white"
                            >
                              {{ file.name }}
                            </p>
                            <p
                              class="text-xs text-neutral-500 dark:text-neutral-400"
                            >
                              {{ formatFileSize(file.size) }}
                            </p>
                          </div>
                        </div>
                        <button
                          @click="removeFile(index)"
                          class="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clip-rule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="mb-6">
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
                <div v-if="successMessage" class="mb-6">
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

                <!-- Actions -->
                <div
                  class="flex justify-end space-x-3 pt-6 border-t border-neutral-200 dark:border-white/10"
                >
                  <button
                    @click="$emit('close')"
                    :disabled="isSubmitting"
                    class="px-4 py-2 text-sm font-medium text-black dark:text-white bg-neutral-100 dark:bg-white/10 border border-neutral-300 dark:border-white/10 rounded hover:bg-neutral-200 dark:hover:bg-white/20 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    @click="submitAssignment"
                    :disabled="isSubmitting || selectedFiles.length === 0"
                    class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <svg
                      v-if="isSubmitting"
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
                    {{ isSubmitting ? "Submitting..." : "Submit Assignment" }}
                  </button>
                </div>
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
import type { Assignment } from "@/types";
import { useAssignmentStore } from "@/stores/assignmentStore";

interface Props {
  isOpen: boolean;
  assignment: Assignment | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  submitted: [];
}>();

const assignmentStore = useAssignmentStore();

// State
const selectedFiles = ref<File[]>([]);
const isDragging = ref(false);
const isSubmitting = ref(false);
const error = ref<string | null>(null);
const successMessage = ref<string | null>(null);
const fileInput = ref<HTMLInputElement>();

// Constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "application/zip",
  "application/x-rar-compressed",
];

// File handling
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    addFiles(Array.from(target.files));
  }
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;

  if (event.dataTransfer?.files) {
    addFiles(Array.from(event.dataTransfer.files));
  }
};

const addFiles = (files: File[]) => {
  error.value = null;
  successMessage.value = null;

  for (const file of files) {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      error.value = `File "${file.name}" is too large. Maximum size is 10MB.`;
      continue;
    }

    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      error.value = `File "${file.name}" is not a supported format.`;
      continue;
    }

    // Check if file already exists
    if (
      selectedFiles.value.some(
        (f) => f.name === file.name && f.size === file.size
      )
    ) {
      error.value = `File "${file.name}" is already selected.`;
      continue;
    }

    selectedFiles.value.push(file);
  }
};

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1);
  error.value = null;
  successMessage.value = null;
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const formatDate = (date: Date | string | undefined) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// File upload simulation (replace with actual upload logic)
const uploadFile = async (
  file: File
): Promise<{ filename: string; url: string }> => {
  // Simulate file upload - replace with your actual upload implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate random upload failure for demo
      if (Math.random() > 0.9) {
        reject(new Error(`Failed to upload ${file.name}`));
      } else {
        resolve({
          filename: file.name,
          url: `https://example.com/uploads/${Date.now()}-${file.name}`, // Replace with actual URL
        });
      }
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  });
};

const submitAssignment = async () => {
  if (!props.assignment?.id || selectedFiles.value.length === 0) return;

  isSubmitting.value = true;
  error.value = null;
  successMessage.value = null;

  try {
    // Upload files first
    const uploadPromises = selectedFiles.value.map((file) => uploadFile(file));
    const attachments = await Promise.all(uploadPromises);

    // Submit assignment with attachments
    await assignmentStore.submitAssignment(props.assignment.id, attachments);

    // Show success message
    successMessage.value = "Assignment submitted successfully!";

    // Reset form after a delay
    setTimeout(() => {
      selectedFiles.value = [];
      successMessage.value = null;
      emit("submitted");
    }, 2000);
  } catch (err: any) {
    error.value =
      err.message || "Failed to submit assignment. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
};

// Reset form when modal opens/closes
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      selectedFiles.value = [];
      error.value = null;
      successMessage.value = null;
      isDragging.value = false;
      isSubmitting.value = false;
    }
  }
);
</script>
