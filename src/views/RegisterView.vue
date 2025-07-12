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
          Create your EduTracker account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Sign up and start tracking student progress
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="name" class="sr-only">Full Name</label>
            <input
              id="name"
              v-model="form.name"
              name="name"
              type="text"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-[#0d0d0d] dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              placeholder="Full name"
            />
          </div>
          <div>
            <label for="email" class="sr-only">Email address</label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-[#0d0d0d] dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
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
              required
              class="relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-[#0d0d0d] dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              placeholder="Password"
            />
          </div>
        </div>

        <div v-if="form.role === 'student'">
          <label
            for="grade"
            class="block text-sm font-medium text-gray-700 dark:text-white"
            >Grade</label
          >
          <input
            id="grade"
            v-model.number="form.grade"
            type="number"
            min="1"
            max="12"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-[#0d0d0d] dark:border-gray-600 dark:text-white"
            placeholder="e.g. 9"
          />
        </div>

        <div>
          <label class="text-base font-medium text-gray-900 dark:text-white"
            >Role</label
          >
          <fieldset class="mt-4 space-y-4">
            <div class="flex items-center">
              <input
                id="student"
                v-model="form.role"
                name="role"
                type="radio"
                value="student"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <label
                for="student"
                class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Student
              </label>
            </div>
            <div class="flex items-center">
              <input
                id="teacher"
                v-model="form.role"
                name="role"
                type="radio"
                value="teacher"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
              />
              <label
                for="teacher"
                class="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Teacher
              </label>
            </div>
          </fieldset>
        </div>

        <div v-if="error" class="rounded-md bg-red-50 p-4 dark:bg-red-900">
          <div class="text-sm text-red-700 dark:text-red-200">
            {{ error ?? "Registration failed" }}
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
            {{ loading ? "Registering..." : "Sign up" }}
          </button>

          <p
            class="mt-4 text-sm text-gray-600 dark:text-gray-400 w-fit mx-auto"
          >
            Already have an account?
            <RouterLink
              to="/login"
              class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-500 dark:hover:text-primary-400"
            >
              Log in
            </RouterLink>
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
import { storeToRefs } from "pinia";
import LoadingSpinner from "@/components/ui/LoadingSpinner.vue";

const router = useRouter();
const authStore = useAuthStore();
const { loading, error } = storeToRefs(authStore);

const form = ref({
  name: "",
  email: "",
  password: "",
  role: "student" as "student" | "teacher",
  grade: 9,
});

const handleRegister = async () => {
  const success = await authStore.register({
    ...form.value,
    grade: form.value.role === "student" ? form.value.grade : undefined,
  });

  if (success) {
    router.push("/"); // Redirect after registration
  }
};
</script>
