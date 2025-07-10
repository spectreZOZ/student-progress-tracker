<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-[#121212]">
    <ToastContainer ref="toastRef" />
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";
import ToastContainer from "@/components/ui/ToastContainer.vue";

const authStore = useAuthStore();
const uiStore = useUIStore();

const toastRef = ref();
provide("toast", toastRef);

onMounted(() => {
  authStore.init();
  uiStore.initializeDarkMode();
});
</script>
