<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="space-y-4">
      <InfoItem label="Subject" :value="getSubjectName(assignment.subject)" />
      <InfoItem label="Due Date" :value="formatDate(assignment.dueDate)" />
      <InfoItem label="Max Score" :value="`${assignment.maxScore} points`" />
    </div>

    <div class="space-y-4">
      <InfoItem
        label="Completion Rate"
        :value="`${assignment.completionRate || 0}%`"
      />
      <InfoItem
        v-if="assignment.averageScore !== undefined"
        label="Average Score"
        :value="`${assignment.averageScore || 0} / ${assignment.maxScore}`"
      />
      <InfoItem label="Created" :value="formatDate(assignment.createdAt)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Assignment } from "@/types";
import InfoItem from "./InfoItem.vue";

interface Props {
  assignment: Assignment;
}

defineProps<Props>();

const getSubjectName = (subject: any) => {
  return typeof subject === "string"
    ? subject
    : subject?.name || "Unknown Subject";
};

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>
