<template>
  <Modal
    :is-open="isOpen"
    @close="$emit('close')"
    title="Update Student Progress"
  >
    <form v-if="student" @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Student Info -->
      <div class="bg-gray-50 dark:bg-[#121212] rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-400">Student</h3>
        <p class="mt-1 text-lg font-medium text-black dark:text-white">
          {{ student.student.name }}
        </p>
        <p class="text-sm text-gray-300">{{ subject?.name }}</p>
      </div>

      <!-- Progress -->
      <div>
        <label
          for="progress"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Progress (0-100%) *
        </label>
        <div class="relative">
          <input
            id="progress"
            v-model.number="form.progress"
            type="number"
            min="0"
            max="100"
            required
            class="input"
            placeholder="Enter progress percentage"
          />
        </div>
        <div class="mt-2 bg-gray-200 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all duration-300"
            :class="getProgressColor(form.progress || 0)"
            :style="{
              width: `${Math.min(Math.max(form.progress || 0, 0), 100)}%`,
            }"
          ></div>
        </div>
        <p v-if="errors.progress" class="mt-1 text-sm text-red-600">
          {{ errors.progress }}
        </p>
      </div>

      <!-- Grade -->
      <div>
        <label
          for="grade"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Grade *
        </label>
        <select id="grade" v-model="form.grade" required class="input">
          <option value="">Select a grade</option>
          <option value="A+">A+ (Excellent)</option>
          <option value="A">A (Very Good)</option>
          <option value="B+">B+ (Good Plus)</option>
          <option value="B">B (Good)</option>
          <option value="C+">C+ (Satisfactory Plus)</option>
          <option value="C">C (Satisfactory)</option>
          <option value="D+">D+ (Below Average Plus)</option>
          <option value="D">D (Below Average)</option>
          <option value="F">F (Fail)</option>
        </select>
        <p v-if="errors.grade" class="mt-1 text-sm text-red-600">
          {{ errors.grade }}
        </p>
      </div>

      <!-- Engagement Score -->
      <div>
        <label
          for="engagement"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Engagement Score (0-100) *
        </label>
        <div class="relative">
          <input
            id="engagement"
            v-model.number="form.engagementScore"
            type="number"
            min="0"
            max="100"
            required
            class="input"
            placeholder="Enter engagement score"
          />
        </div>
        <div class="mt-2 bg-gray-200 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all duration-300"
            :class="getProgressColor(form.progress || 0)"
            :style="{
              width: `${Math.min(
                Math.max(form.engagementScore || 0, 0),
                100
              )}%`,
            }"
          ></div>
        </div>
        <p class="mt-1 text-xs text-[#717171]">
          Engagement score reflects student participation and interaction with
          course materials
        </p>
        <p v-if="errors.engagementScore" class="mt-1 text-sm text-red-600">
          {{ errors.engagementScore }}
        </p>
      </div>

      <!-- Current Values Display -->
      <div
        class="bg-gray-50 dark:bg-[#121212] border border-blue-200 rounded-lg p-4"
      >
        <h4 class="text-sm font-medium text-white mb-2">Current Values:</h4>
        <div class="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span class="text-gray-400">Progress:</span>
            <span class="ml-1 font-medium">{{ student.progress }}%</span>
          </div>
          <div>
            <span class="text-gray-400">Grade:</span>
            <span class="ml-1 font-medium">{{ student.grade }}</span>
          </div>
          <div>
            <span class="text-gray-400">Engagement:</span>
            <span class="ml-1 font-medium"
              >{{ student.engagementScore }}/100</span
            >
          </div>
        </div>
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
          <span>{{ loading ? "Updating..." : "Update Progress" }}</span>
        </button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import { useSubjectStore, type SubjectProp } from "@/stores/subjectStore";
import Modal from "@/components/common/Modal.vue";

interface Props {
  isOpen: boolean;
  subject: SubjectProp | null;
  student: any | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  updated: [];
}>();

const subjectStore = useSubjectStore();

const loading = ref(false);
const form = reactive({
  progress: 0,
  grade: "",
  engagementScore: 0,
});

const errors = reactive({
  progress: "",
  grade: "",
  engagementScore: "",
});

const resetForm = () => {
  if (props.student) {
    form.progress = props.student.progress;
    form.grade = props.student.grade;
    form.engagementScore = props.student.engagementScore;
  }

  (Object.keys(errors) as Array<keyof typeof errors>).forEach((key) => {
    errors[key] = "";
  });
};

const getProgressColor = (progress: number) => {
  if (progress < 50) return "bg-red-700";
  if (progress < 80) return "bg-yellow-500";
  return "bg-green-700";
};

const validateForm = () => {
  let isValid = true;

  // Reset errors
  (Object.keys(errors) as Array<keyof typeof errors>).forEach((key) => {
    errors[key] = "";
  });

  // Validate progress
  if (form.progress < 0 || form.progress > 100) {
    errors.progress = "Progress must be between 0 and 100";
    isValid = false;
  }

  // Validate grade
  if (!form.grade) {
    errors.grade = "Grade is required";
    isValid = false;
  }

  // Validate engagement score
  if (form.engagementScore < 0 || form.engagementScore > 100) {
    errors.engagementScore = "Engagement score must be between 0 and 100";
    isValid = false;
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm() || !props.subject || !props.student) return;

  loading.value = true;
  try {
    await subjectStore.updateStudentProgress(
      props.subject.id,
      props.student.student.id,
      {
        progress: form.progress,
        grade: form.grade,
        engagementScore: form.engagementScore,
      }
    );

    emit("updated");
  } catch (error) {
    console.error("Failed to update student progress:", error);
  } finally {
    loading.value = false;
  }
};

// Reset form when modal opens with new data
watch(
  () => [props.isOpen, props.student],
  ([isOpen, student]) => {
    if (isOpen && student) {
      resetForm();
    }
  }
);
</script>
