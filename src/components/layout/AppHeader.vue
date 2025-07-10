<template>
  <header class="bg-white shadow-sm dark:bg-[#0d0d0d]">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between">
        <!-- Left side -->
        <div class="flex items-center">
          <button
            type="button"
            class="text-gray-500 hover:text-gray-600 lg:hidden"
            @click="$emit('toggleSidebar')"
          >
            <Bars3Icon class="h-6 w-6" />
          </button>

          <div class="ml-4 lg:ml-0">
            <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ pageTitle }}
            </h1>
          </div>
        </div>

        <!-- Right side -->
        <div class="flex items-center space-x-4">
          <!-- Theme toggle -->
          <button
            @click="uiStore.toggleDarkMode()"
            class="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-[#101010] dark:hover:text-gray-300"
          >
            <SunIcon v-if="uiStore.isDarkMode" class="h-5 w-5" />
            <MoonIcon v-else class="h-5 w-5" />
          </button>

          <!-- Notifications -->
          <button
            class="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-[#101010] dark:hover:text-gray-300"
          >
            <BellIcon class="h-5 w-5" />
          </button>

          <!-- User menu -->
          <Menu as="div" class="relative">
            <MenuButton
              class="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:bg-[#0d0d0d]"
            >
              <img
                class="h-8 w-8 rounded-full"
                :src="
                  authStore.user?.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    authStore.user?.name
                  )}&background=${
                    uiStore.isDarkMode ? '1f2937' : '000000'
                  }&color=${uiStore.isDarkMode ? 'ffffff' : 'ffffff'}`
                "
                :alt="authStore.user?.name"
              />
            </MenuButton>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-[#101010]"
              >
                <MenuItem v-slot="{}">
                  <div
                    class="px-4 py-2 text-sm text-gray-700 dark:text-gray-200"
                  >
                    <div class="font-medium">{{ authStore.user?.name }}</div>
                    <div class="text-gray-500 dark:text-gray-400">
                      {{ authStore.user?.email }}
                    </div>
                  </div>
                </MenuItem>

                <MenuItem v-slot="{ active }">
                  <button
                    @click="
                      authStore.logout();
                      $router.push('/login');
                    "
                    :class="[
                      active ? 'bg-gray-100 dark:bg-[#2a2a2a]' : '',
                      'block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200',
                    ]"
                  >
                    Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import {
  Bars3Icon,
  BellIcon,
  SunIcon,
  MoonIcon,
} from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";

defineEmits<{
  toggleSidebar: [];
}>();

const route = useRoute();
const authStore = useAuthStore();
const uiStore = useUIStore();

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    dashboard: "Dashboard",
    students: "Students",
    analytics: "Analytics",
    assignments: "Assignments",
  };
  return titles[route.name as string] || "Student Progress Tracker";
});
</script>
