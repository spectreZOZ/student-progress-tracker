<template>
  <div class="space-y-4">
    <EmptySubmissions v-if="!assignment.submissions?.length" />

    <div v-else class="space-y-4">
      <!-- Submissions Header -->
      <SubmissionsHeader
        :submissionCount="assignment.submissions.length"
        :stats="getSubmissionStats()"
      />

      <!-- Submissions List -->
      <SubmissionsList
        :submissions="assignment.submissions"
        :assignment="assignment"
        :canEditAssignment="canEditAssignment"
        @grade-submission="$emit('grade-submission', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Assignment } from "@/types";
import EmptySubmissions from "./EmptySubmissions.vue";
import SubmissionsHeader from "./SubmissionsHeader.vue";
import SubmissionsList from "./SubmissionsList.vue";

interface Props {
  assignment: Assignment;
  canEditAssignment: boolean;
}

const props = defineProps<Props>();
defineEmits<{
  "grade-submission": [submission: any];
}>();

const getSubmissionStats = () => {
  if (!props.assignment.submissions?.length) return "";

  const total = props.assignment.submissions.length;
  const graded = props.assignment.submissions.filter(
    (s) => s.gradedAt || s.score !== undefined
  ).length;
  const pending = total - graded;

  return `${graded} graded, ${pending} pending`;
};
</script>
