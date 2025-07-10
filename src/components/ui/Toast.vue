<!-- components/Toast.vue -->
<template>
  <div
    class="flex items-start gap-3 w-full max-w-sm p-4 rounded-xl shadow-md text-white"
    :class="bgColor"
  >
    <component :is="Icon" class="h-6 w-6 mt-0.5" />

    <div class="flex-1">
      <p class="font-semibold">{{ title }}</p>
      <p v-if="description" class="text-sm text-white/90 mt-0.5">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps } from "vue";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/solid";

const props = defineProps<ToastOptions>();

type ToastStatus = "success" | "error" | "info" | "warning";

export interface ToastOptions {
  status: ToastStatus;
  title: string;
  description?: string;
}

const Icon = computed(() => toastIconMap[props.status]);

const toastIconMap = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  info: InformationCircleIcon,
  warning: ExclamationTriangleIcon,
};

const bgColor = computed(() => {
  return {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
    warning: "bg-yellow-500 text-black",
  }[props.status];
});
</script>
