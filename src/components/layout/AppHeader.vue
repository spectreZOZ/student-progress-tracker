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
            class="relative rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 dark:text-gray-400 dark:hover:bg-[#101010] dark:hover:text-gray-300"
            @click="toggleNotifications"
          >
            <BellIcon class="h-5 w-5" />
            <!-- Notification badge -->
            <span
              v-if="unreadCount > 0"
              class="absolute top-2 right-1 inline-flex items-center justify-center px-1 pt-0.5 pb-1 text-[10px] font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full"
            >
              {{ unreadCount > 99 ? "99+" : unreadCount }}
            </span>
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

    <!-- Notifications dropdown (if you want to show them here) -->
    <div
      v-if="showNotifications"
      class="absolute right-4 top-16 z-50 w-80 bg-white dark:bg-[#101010] rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <div class="p-4">
        <h3 class="text-lg font-semibold mb-2">Notifications</h3>
        <div
          v-if="notifications.length === 0"
          class="text-gray-500 text-center py-4"
        >
          No notifications
        </div>
        <div v-else class="space-y-2 max-h-64 overflow-y-auto">
          <div
            v-for="(notification, index) in notifications.slice(0, 8)"
            :key="index"
            class="group p-4 border border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 rounded-lg"
          >
            <div class="flex items-start gap-3">
              <div class="mt-1">
                <svg
                  class="w-5 h-5 text-blue-500 group-hover:text-blue-600 dark:text-blue-400 dark:group-hover:text-blue-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9V5h2v4H9zm0 2h2v2H9v-2z"
                  />
                </svg>
              </div>

              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ notification.title }}
                </p>
                <p class="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {{ notification.message }}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {{
                    formatTime(
                      notification.timestamp || notification.data?.submittedAt
                    )
                  }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="notifications.length > 5" class="text-center pt-2">
          <button
            @click="$router.push('/notifications')"
            class="text-blue-500 text-sm hover:underline"
          >
            View all notifications
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue"; // Add watch import
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
import { useSocket } from "@/composables/useSocket";
import { useNotificationStore } from "@/stores/notifications";

defineEmits<{
  toggleSidebar: [];
}>();

const route = useRoute();
const authStore = useAuthStore();
const uiStore = useUIStore();
const notificationStore = useNotificationStore();
const showNotifications = ref(false);

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    dashboard: "Dashboard",
    students: "Students",
    analytics: "Analytics",
    assignments: "Assignments",
    notifications: "Notifications",
    subjects: "Subjects",
  };
  return titles[route.name as string] || "Student Progress Tracker";
});

const {
  connect,
  isConnected,
  notifications: socketNotifications,
  joinUserRoom,
  identify,
  connectionError,
} = useSocket();

const notifications = computed(() => {
  return notificationStore.notifications;
});

const unreadCount = computed(() => {
  return notifications.value.filter((n) => !n.read).length;
});

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const formatTime = (timestamp: Date) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor(
    (now.getTime() - time.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return time.toLocaleDateString();
};

// Handle new socket notifications
const handleNewNotification = (notification: any) => {
  console.log("🔔 New socket notification received:", notification);

  // Add to notification store (with duplicate checking)
  notificationStore.addSocketNotification(notification);
};

onMounted(async () => {
  if (authStore.user) {
    console.log("🔌 Connecting socket for user:", authStore.user._id);

    // Fetch initial notifications and unread count
    await Promise.all([
      notificationStore.fetchNotifications({ page: 1, limit: 8 }),
    ]);
    // Connect to socket first
    connect();
  }
});

// Watch for connection changes and identify user
watch(isConnected, (connected) => {
  if (connected && authStore.user) {
    console.log("🔌 Socket connected, identifying user and joining room");
    // Use both identify and joinUserRoom for redundancy
    identify(authStore.user._id);
    setTimeout(() => {
      joinUserRoom(authStore.user?._id);
    }, 500);
  }
});

// Watch for new socket notifications
watch(
  socketNotifications,
  (newNotifications, oldNotifications) => {
    if (newNotifications.length > (oldNotifications?.length || 0)) {
      const latestNotification = newNotifications[0];
      handleNewNotification(latestNotification);
    }
  },
  { deep: true }
);

console.log("🔍 Debug - notifications:", notifications.value);
console.log("🔍 Debug - isConnected:", isConnected.value);
console.log("🔍 Debug - connectionError:", connectionError?.value);
</script>
