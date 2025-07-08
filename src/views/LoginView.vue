<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#121212] py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <div
          class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900"
        >
          <AcademicCapIcon
            class="h-8 w-8 text-primary-600 dark:text-primary-400"
          />
        </div>
        <h2
          class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white"
        >
          Sign in to EduTracker
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Track student progress across learning platforms
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-[#0d0d0d] dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              placeholder="Email address"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Password</label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-[#0d0d0d] dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              placeholder="Password"
            />
          </div>
        </div>

        <div v-if="error" class="rounded-md bg-red-50 p-4 dark:bg-red-900">
          <div class="text-sm text-red-700 dark:text-red-200">
            {{ error ?? "Login failed" }}
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span
              v-if="loading"
              class="absolute left-0 inset-y-0 flex items-center pl-3"
            >
              <LoadingSpinner size="sm" />
            </span>
            {{ loading ? "Signing in..." : "Sign in" }}
          </button>
          <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?
            <router-link
              to="/register"
              class="font-medium text-primary-600 hover:text-primary-500"
            >
              Sign up
            </router-link>
          </p>
        </div>

        <div class="text-sm text-center">
          <p class="text-gray-600 dark:text-gray-400">Demo credentials:</p>
          <p class="text-gray-500 dark:text-gray-500">
            Email: any@email.com | Password: any
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { AcademicCapIcon } from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/stores/auth";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";
import { storeToRefs } from "pinia";

const router = useRouter();
const authStore = useAuthStore();
const { loading, error } = storeToRefs(authStore);

const form = ref({
  email: "",
  password: "",
});

const handleLogin = async () => {
  const success = await authStore.login({
    email: form.value.email,
    password: form.value.password,
  });

  if (success) {
    router.push("/"); // Redirect after registration
  }
};
</script>
