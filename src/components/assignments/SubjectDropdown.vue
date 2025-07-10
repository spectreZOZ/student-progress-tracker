<!-- components/assignments/SubjectDropdown.vue -->
<template>
  <div>
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    <div class="relative">
      <select
        :id="id"
        :value="modelValue"
        @input="
          $emit('update:modelValue', ($event.target as HTMLSelectElement).value)
        "
        :required="required"
        :disabled="subjectStore.loading"
        class="input"
        :class="{ 'pr-10': subjectStore.loading }"
      >
        <option value="">
          {{ subjectStore.loading ? "Loading subjects..." : placeholder }}
        </option>
        <option
          v-for="subject in activeSubjects"
          :key="subject.id"
          :value="subject.id"
        >
          {{ subject.name }} ({{ subject.code }})
        </option>
      </select>

      <!-- Loading indicator -->
      <div
        v-if="subjectStore.loading"
        class="absolute inset-y-0 right-0 flex items-center pr-8"
      >
        <svg
          class="animate-spin h-4 w-4 text-gray-400"
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
      </div>
    </div>

    <!-- Subject error -->
    <div
      v-if="subjectStore.error"
      class="mt-1 text-sm text-red-600 dark:text-red-400"
    >
      Failed to load subjects.
      <button
        type="button"
        @click="retryLoadSubjects"
        class="underline hover:no-underline focus:outline-none"
      >
        Try again
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useSubjectStore } from "@/stores/subjectStore";

interface Props {
  modelValue: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  id?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Select subject",
  id: "subject-dropdown",
});

defineEmits<{
  "update:modelValue": [value: string];
}>();

const subjectStore = useSubjectStore();

// Filter only active subjects
const activeSubjects = computed(() => {
  return subjectStore.subjects.filter((subject) => subject.isActive);
});

const retryLoadSubjects = async () => {
  await subjectStore.fetchSubjects();
};

// Load subjects on component mount
onMounted(() => {
  if (subjectStore.subjects.length === 0) {
    subjectStore.fetchSubjects();
  }
});
</script>
