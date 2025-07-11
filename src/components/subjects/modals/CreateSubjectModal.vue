<template>
  <Modal :is-open="isOpen" @close="$emit('close')" title="Create New Subject">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Subject Name -->
      <div>
        <label
          for="name"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Subject Name *
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          required
          class="input"
          placeholder="Enter subject name"
        />
        <p v-if="errors.name" class="mt-1 text-sm text-red-600">
          {{ errors.name }}
        </p>
      </div>

      <!-- Subject Code -->
      <div>
        <label
          for="code"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Subject Code
        </label>
        <input
          id="code"
          v-model="form.code"
          type="text"
          class="input"
          pattern="^[A-Z]{2,6}\d{3}$"
          placeholder="e.g., MATH101"
        />
        <p v-if="errors.code" class="mt-1 text-sm text-red-600">
          {{ errors.code }}
        </p>
      </div>

      <!-- Description -->
      <div>
        <label
          for="description"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          v-model="form.description"
          rows="4"
          class="input min-h-24"
          placeholder="Enter subject description"
        ></textarea>
        <p v-if="errors.description" class="mt-1 text-sm text-red-600">
          {{ errors.description }}
        </p>
      </div>

      <div v-if="isAdmin">
        <!-- Teacher Selection -->
        <TeacherSelect
          v-model="form.teacher"
          required
          @teacher-selected="handleTeacherSelected"
        />
        <p v-if="errors.teacher" class="mt-1 text-sm text-red-600">
          {{ errors.teacher }}
        </p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="subjectStore.error"
        class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
      >
        <p class="text-red-800">{{ subjectStore.error }}</p>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button type="button" @click="$emit('close')" class="btn btn-ghost">
          Cancel
        </button>
        <button type="submit" :disabled="loading" class="btn btn-primary">
          <span
            v-if="loading"
            class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
          ></span>
          <span>{{ loading ? "Creating..." : "Create Subject" }}</span>
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, inject } from "vue";
import { useSubjectStore } from "@/stores/subjectStore";
import Modal from "@/components/common/Modal.vue";
import TeacherSelect from "@/components/common/TeacherSelect.vue";
import { useAuthStore } from "@/stores/auth";
import { errorAPIMessage } from "@/utils/validation";

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  created: [];
}>();

const subjectStore = useSubjectStore();
const authStore = useAuthStore();

const isAdmin = computed(() => authStore.isAdmin).value;
const toastRef = inject("toast");

const loading = ref(false);
const selectedTeacher = ref<any>(null);

const handleTeacherSelected = (teacher: any) => {
  selectedTeacher.value = teacher;
};

const form = reactive({
  name: "",
  code: "",
  description: "",
  teacher: "",
});

type ErrorKey = "name" | "code" | "description" | "teacher";
const errors: Record<ErrorKey, string> = reactive({
  name: "",
  code: "",
  description: "",
  teacher: "",
});

const resetForm = () => {
  form.name = "";
  form.code = "";
  form.description = "";
  form.teacher = "";
  selectedTeacher.value = null;

  Object.keys(errors).forEach((key) => {
    errors[key as ErrorKey] = "";
  });
};

const validateForm = () => {
  let isValid = true;

  // Reset errors
  Object.keys(errors).forEach((key) => {
    errors[key as ErrorKey] = "";
  });

  // Validate name
  if (!form.name.trim()) {
    errors.name = "Subject name is required";
    isValid = false;
  } else if (form.name.length < 3) {
    errors.name = "Subject name must be at least 3 characters";
    isValid = false;
  }

  // Validate code (if provided)
  if (form.code && form.code.length < 2) {
    errors.code = "Subject code must be at least 2 characters";
    isValid = false;
  }

  // Validate teacher (admin only)
  if (isAdmin && !form.teacher) {
    errors.teacher = "Teacher is required";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;
  try {
    const res = await subjectStore.createSubject({
      name: form.name.trim(),
      code: form.code.trim() || undefined,
      description: form.description.trim() || undefined,
      teacher: form.teacher || selectedTeacher.value,
    });

    // @ts-expect-error: Unreachable code error
    toastRef?.value?.addToast({
      status: "success",
      title: res.message,
    });
    emit("created");
    resetForm();
    loading.value = false;
  } catch (error) {
    const errorMessage = errorAPIMessage(error, "Failed to create subject");
    console.error("Failed to create subject:", error);
    // @ts-expect-error: Unreachable code error
    toastRef?.value?.addToast({
      status: "error",
      title: "Failed to create subject",
      description: errorMessage,
    });
  } finally {
    loading.value = false;
  }
};

// Reset form when modal closes
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      resetForm();
    }
  }
);
</script>
