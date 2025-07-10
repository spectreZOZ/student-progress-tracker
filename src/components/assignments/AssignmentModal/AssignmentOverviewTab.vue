<template>
  <div class="space-y-6">
    <!-- Student Submit Section (only for students) -->
    <StudentSubmitSection
      v-if="userRole === 'student'"
      :assignment="assignment"
      @submit-assignment="$emit('submit-assignment')"
    />

    <!-- Teacher Info -->
    <TeacherInfoCard :teacher="assignment.teacher" />

    <!-- Assignment Info Grid -->
    <AssignmentInfoGrid :assignment="assignment" />

    <!-- Description -->
    <AssignmentDescription :description="assignment.description" />

    <!-- Instructions -->
    <AssignmentInstructions
      v-if="assignment.instructions"
      :instructions="assignment.instructions"
    />

    <!-- Warnings -->
    <AssignmentWarnings :assignment="assignment" />
  </div>
</template>

<script setup lang="ts">
import type { Assignment } from "@/types";

// Import sub-components
import StudentSubmitSection from "./StudentSubmitSection.vue";
import TeacherInfoCard from "./TeacherInfoCard.vue";
import AssignmentInfoGrid from "./AssignmentInfoGrid.vue";
import AssignmentDescription from "./AssignmentDescription.vue";
import AssignmentInstructions from "./AssignmentInstructions.vue";
import AssignmentWarnings from "./AssignmentWarnings.vue";

interface Props {
  assignment: Assignment;
  userRole?: string;
}

defineProps<Props>();
defineEmits<{
  "submit-assignment": [];
}>();
</script>
