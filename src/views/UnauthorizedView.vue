<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <ShieldExclamationIcon class="mx-auto h-24 w-24 text-red-500" />
        <h2 class="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
          Access Denied
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
          You don't have permission to access this page.
        </p>

        <div
          v-if="requiredRoles"
          class="mt-4 p-4 bg-red-50 dark:bg-red-900 rounded-md"
        >
          <p class="text-sm text-red-800 dark:text-red-200">
            <strong>Required roles:</strong> {{ requiredRoles }}
          </p>
          <p class="text-sm text-red-800 dark:text-red-200 mt-1">
            <strong>Your role:</strong> {{ userRole }}
          </p>
        </div>

        <div class="mt-6 space-y-4">
          <button
            @click="goBack"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Go Back
          </button>

          <router-link
            to="/"
            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Go to Dashboard
          </router-link>

          <button
            @click="logout"
            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ShieldExclamationIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const requiredRoles = computed(() => {
  const roles = route.query.required as string;
  return roles ? roles.split(",").join(", ") : null;
});

const userRole = computed(() => authStore.user?.role || "Unknown");

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push("/");
  }
};

const logout = async () => {
  await authStore.logout();
  router.push("/login");
};
</script>
