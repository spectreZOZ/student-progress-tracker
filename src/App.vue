<template>
  <div id="app" class="min-h-screen bg-gray-50 dark:bg-[#121212]">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";

const authStore = useAuthStore();
const uiStore = useUIStore();

onMounted(() => {
  authStore.init();
  uiStore.initializeDarkMode();
});
</script>
