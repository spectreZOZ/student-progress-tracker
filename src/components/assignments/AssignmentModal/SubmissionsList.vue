<template>
  <div class="space-y-3">
    <SubmissionCard
      v-for="submission in submissions"
      :key="submission.id || submission._id"
      :submission="submission"
      :assignment="assignment"
      :canEditAssignment="canEditAssignment"
      @grade-submission="$emit('grade-submission', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Assignment } from "@/types";
import SubmissionCard from "./SubmissionCard.vue";

interface Props {
  submissions: any[];
  assignment: Assignment;
  canEditAssignment: boolean;
}

defineProps<Props>();
defineEmits<{
  "grade-submission": [submission: any];
}>();
</script>
