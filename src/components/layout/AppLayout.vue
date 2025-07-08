<template>
  <div class="min-h-screen">
    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-[#0d0d0d] lg:translate-x-0"
      :class="{
        '-translate-x-full': !sidebarOpen,
        'translate-x-0': sidebarOpen,
      }"
    >
      <AppSidebar @close="sidebarOpen = false" />
    </div>

    <!-- Mobile sidebar overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-[#2a2a2a] bg-opacity-75 lg:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- Main content -->
    <div class="lg:pl-64">
      <AppHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="flex-1">
        <div class="py-6">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <slot />
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AppSidebar from "./AppSidebar.vue";
import AppHeader from "./AppHeader.vue";

const sidebarOpen = ref(false);
</script>
