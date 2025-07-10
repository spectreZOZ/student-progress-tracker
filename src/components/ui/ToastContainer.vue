<!-- components/ToastContainer.vue -->
<template>
  <div class="fixed top-4 right-4 z-50 space-y-3">
    <TransitionGroup name="toast" tag="div">
      <Toast v-for="toast in toasts" :key="toast.id" v-bind="toast" />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Toast, { ToastOptions } from "./Toast.vue";

type ToastWithId = ToastOptions & { id: number };

const toasts = ref<ToastWithId[]>([]);

function addToast(toast: ToastOptions) {
  const id = Date.now();
  toasts.value.push({ ...toast, id });

  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }, 4000);
}

defineExpose({ addToast });
</script>
