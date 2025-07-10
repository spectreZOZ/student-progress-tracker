<template>
  <div class="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
    <div>
      <span class="text-neutral-500 dark:text-neutral-400">Submitted:</span>
      <p class="text-black dark:text-white">
        {{ formatDate(submission.submittedAt || submission.createdAt) }}
      </p>
    </div>

    <div v-if="submission.gradedAt">
      <span class="text-neutral-500 dark:text-neutral-400">Graded:</span>
      <p class="text-black dark:text-white">
        {{ formatDate(submission.gradedAt) }}
      </p>
    </div>

    <div v-if="submission.attachments?.length">
      <span class="text-neutral-500 dark:text-neutral-400">Attachments:</span>
      <p class="text-black dark:text-white">
        {{ submission.attachments.length }} file(s)
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  submission: any;
}

defineProps<Props>();

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
