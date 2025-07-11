<template>
  <div class="flex h-full flex-col">
    <!-- Logo -->
    <div class="flex h-16 items-center justify-between px-4">
      <div class="flex items-center">
        <AcademicCapIcon class="h-8 w-8 text-primary-600" />
        <span class="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
          EduTracker
        </span>
      </div>
      <button
        @click="$emit('close')"
        class="text-gray-500 hover:text-gray-600 lg:hidden"
      >
        <XMarkIcon class="h-6 w-6" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-1 px-2 py-4">
      <router-link
        v-for="item in filteredNavItems"
        :key="item.name"
        :to="item.href"
        :class="[
          isActive(item.href)
            ? 'bg-primary-100 border-r-4 border-primary-600 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-[#101010] dark:hover:text-white',
          'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
        ]"
      >
        <component
          :is="item.icon"
          :class="[
            isActive(item.href)
              ? 'text-primary-600 dark:text-primary-200'
              : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300',
            'mr-3 h-6 w-6',
          ]"
        />
        {{ item.name }}
      </router-link>
    </nav>

    <!-- Footer -->
    <div class="p-4">
      <div class="rounded-lg bg-gray-50 p-3 dark:bg-[#101010]">
        <div class="flex items-center">
          <div class="flex-shrink-0">
            <img
              class="h-8 w-8 rounded-full"
              :src="
                authStore.user?.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  authStore.user?.name || ''
                )}&background=${
                  uiStore.isDarkMode ? '1f2937' : '000000'
                }&color=${uiStore.isDarkMode ? 'ffffff' : 'ffffff'}`
              "
              :alt="authStore.user?.name"
            />
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-200">
              {{ authStore.user?.name }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {{ authStore.user?.role }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import {
  AcademicCapIcon,
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  XMarkIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/vue/24/outline";
import { useAuthStore } from "@/stores/auth";
import { useUIStore } from "@/stores/ui";

// Define user roles for better type safety
type UserRole = "admin" | "teacher" | "student";

defineEmits<{
  close: [];
}>();

const route = useRoute();
const authStore = useAuthStore();
const uiStore = useUIStore();

// Get current user role with type safety
const userRole = computed<UserRole>(
  () => (authStore.user?.role as UserRole) || "student"
);

// Define all navigation items with their role requirements
const navigationItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: HomeIcon,
    roles: ["admin", "teacher"],
  },
  {
    name: "Students",
    href: "/students",
    icon: UsersIcon,
    roles: ["admin", "teacher"],
  },
  {
    name: "Assignments",
    href: "/assignments",
    icon: ClipboardDocumentListIcon,
    roles: ["teacher", "student", "admin"],
  },

  {
    name: "Classrooms",
    href: "/classrooms",
    icon: AcademicCapIcon,
    roles: ["teacher", "student", "admin"],
  },
  {
    name: "Subjects",
    href: "/subjects",
    icon: BookOpenIcon, // or a different icon
    roles: ["teacher", "student", "admin"],
  },
];

// Filter navigation items based on user role
const filteredNavItems = computed(() => {
  return navigationItems.filter((item) => {
    const hasAccess = item.roles.includes(userRole.value);

    return hasAccess;
  });
});

// Check if a route is active (keep your existing logic)
const isActive = (href: string) => {
  if (href === "/") {
    return route.path === "/";
  }
  return route.path.startsWith(href);
};
</script>
