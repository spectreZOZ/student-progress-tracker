<template>
  <div class="flex items-center p-4 bg-neutral-100 dark:bg-white/5 rounded-lg">
    <div class="flex-shrink-0">
      <div
        class="w-10 h-10 bg-black text-white dark:bg-white dark:text-black rounded-full flex items-center justify-center text-sm font-medium"
      >
        {{ getInitials(teacher?.name || "Unknown") }}
      </div>
    </div>
    <div class="ml-4 flex-1 min-w-0">
      <p class="text-base font-medium text-black dark:text-white truncate">
        {{ teacher?.name || "Unknown Teacher" }}
      </p>
      <p class="text-sm text-neutral-600 dark:text-neutral-400 truncate">
        {{ teacher?.email || "No email" }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Teacher {
  name?: string;
  email?: string;
}

interface Props {
  teacher?: Teacher;
}

defineProps<Props>();

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
</script>
