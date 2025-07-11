<template>
  <Modal :is-open="isOpen" @close="$emit('close')" title="Edit Subject">
    <form v-if="subject" @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Subject Name -->
      <div>
        <label
          for="edit-name"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Subject Name *
        </label>
        <input
          id="edit-name"
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
          for="edit-code"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Subject Code
        </label>
        <input
          id="edit-code"
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
          for="edit-description"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Description
        </label>
        <textarea
          id="edit-description"
          v-model="form.description"
          rows="4"
          class="input min-h-24"
          placeholder="Enter subject description"
        ></textarea>
        <p v-if="errors.description" class="mt-1 text-sm text-red-600">
          {{ errors.description }}
        </p>
      </div>

      <!-- Teacher (Admin only) -->
      <div v-if="userRole === 'admin'">
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

      <!-- Status -->
      <div>
        <label class="flex items-center">
          <input
            v-model="form.isActive"
            type="checkbox"
            class="rounded border-gray-300 text-black focus:ring-black"
          />
          <span class="ml-2 text-sm text-gray-700 dark:text-gray-300"
            >Subject is active</span
          >
        </label>
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
          <span>{{ loading ? "Updating..." : "Update Subject" }}</span>
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from "vue";
import { useSubjectStore, type SubjectProp } from "@/stores/subjectStore";
import { useAuthStore } from "@/stores/auth";
import Modal from "@/components/common/Modal.vue";
import TeacherSelect from "@/components/common/TeacherSelect.vue";

interface Props {
  isOpen: boolean;
  subject: SubjectProp | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  updated: [];
}>();

const subjectStore = useSubjectStore();
const authStore = useAuthStore();

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
  isActive: true,
});

type ErrorKey = "name" | "code" | "description" | "teacher";

const errors: Record<ErrorKey, string> = reactive({
  name: "",
  code: "",
  description: "",
  teacher: "",
});

const userRole = computed(() => authStore.user?.role || "student");

const resetForm = () => {
  if (props.subject) {
    form.name = props.subject.name;
    form.code = props.subject.code || "";
    form.description = props.subject.description || "";
    form.teacher = props.subject.teacher._id || "";
    form.isActive = props.subject.isActive;
    selectedTeacher.value = null;
  }

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
  if (userRole.value === "admin" && !form.teacher) {
    errors.teacher = "Teacher is required";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm() || !props.subject) return;

  loading.value = true;
  try {
    const updateData = {
      name: form.name.trim(),
      code: form.code.trim() || undefined,
      description: form.description.trim() || undefined,
      teacher: form.teacher || selectedTeacher.value,
      isActive: form.isActive,
    };

    await subjectStore.updateSubject(props.subject.id, updateData);
    emit("updated");
  } catch (error) {
    console.error("Failed to update subject:", error);
  } finally {
    loading.value = false;
  }
};

// Reset form when modal opens with new subject
watch(
  () => [props.isOpen, props.subject],
  ([isOpen, subject]) => {
    if (isOpen && subject) {
      resetForm();
    }
  }
);

// Fetch teachers when component mounts (you'll need to implement this)
// onMounted(async () => {
//   try {
//     const response = await api.get('/teachers')
//     teachers.value = response.data
//   } catch (error) {
//     console.error('Failed to fetch teachers:', error)
//   }
// })
</script>
