<template>
  <div
    class="min-h-screen bg-gray-50 dark:bg-[#121212] flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <div class="text-center">
        <div class="mx-auto h-24 w-24 text-gray-400">
          <ExclamationTriangleIcon class="h-24 w-24" />
        </div>
        <h1 class="mt-6 text-6xl font-bold text-gray-900 dark:text-white">
          404
        </h1>
        <h2
          class="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white"
        >
          Page not found
        </h2>
        <p class="mt-2 text-base text-gray-500 dark:text-gray-400">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div class="mt-6 flex items-center justify-center gap-x-6">
          <router-link to="/" class="btn-primary">
            <HomeIcon class="h-4 w-4 mr-2" />
            Go back home
          </router-link>
          <button @click="$router.go(-1)" class="btn btn-secondary">
            <ArrowLeftIcon class="h-4 w-4 mr-2" />
            Go back
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ExclamationTriangleIcon,
  HomeIcon,
  ArrowLeftIcon,
} from "@heroicons/vue/24/outline";
</script>
