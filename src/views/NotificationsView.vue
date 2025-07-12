<template>
  <AppLayout>
    <div class="notifications-page">
      <!-- Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Stay updated with your latest activities
          </p>
        </div>

        <!-- Actions -->
        <div class="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
          <button
            @click="refresh"
            :disabled="loading"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-[#2a2a2a] dark:text-gray-300 dark:border-gray-600 dark:hover:bg-[#414141]"
          >
            <ArrowPathIcon
              class="h-4 w-4 mr-2"
              :class="{ 'animate-spin': loading }"
            />
            Refresh
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          class="bg-white dark:bg-[#0e0e0e] overflow-hidden shadow rounded-lg"
        >
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <BellIcon class="h-6 w-6 text-gray-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate"
                  >
                    Total
                  </dt>
                  <dd class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ notifications.length }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-[#0e0e0e] overflow-hidden shadow rounded-lg"
        >
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ExclamationCircleIcon class="h-6 w-6 text-red-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate"
                  >
                    Unread
                  </dt>
                  <dd class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ unreadCount }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-[#0e0e0e] overflow-hidden shadow rounded-lg"
        >
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <CheckCircleIcon class="h-6 w-6 text-green-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate"
                  >
                    Read
                  </dt>
                  <dd class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ readNotifications.length }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div
          class="bg-white dark:bg-[#0e0e0e] overflow-hidden shadow rounded-lg"
        >
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <ClockIcon class="h-6 w-6 text-blue-400" />
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 truncate"
                  >
                    Today
                  </dt>
                  <dd class="text-lg font-medium text-gray-900 dark:text-white">
                    {{ todayNotifications.length }}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications List -->
      <div
        class="bg-white dark:bg-bg-[#0e0e0e] shadow rounded-lg overflow-hidden"
      >
        <!-- Loading State -->
        <div
          v-if="loading && notifications.length === 0"
          class="p-8 text-center"
        >
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto"
          ></div>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Loading notifications...
          </p>
        </div>

        <!-- Empty State -->
        <div
          v-else-if="!loading && notifications.length === 0"
          class="p-8 text-center"
        >
          <BellSlashIcon class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            No notifications
          </h3>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You're all caught up! No notifications to show.
          </p>
        </div>

        <!-- Notifications -->
        <div v-else class="divide-y divide-gray-200 dark:divide-gray-700">
          <div
            v-for="notification in notifications"
            :key="notification._id"
            :class="[
              'p-4 hover:bg-gray-50 dark:hover:bg-[#101010fa] transition-colors duration-150',
              !notification.read
                ? 'bg-blue-50 dark:bg-[#101010]'
                : 'bg-white dark:bg-[#0e0e0eec]',
            ]"
          >
            <div class="flex items-start space-x-3">
              <!-- Icon -->
              <div class="flex-shrink-0">
                <div
                  :class="[
                    'w-8 h-8 rounded-full flex items-center justify-center',
                    getNotificationIconClass(notification.type),
                  ]"
                >
                  <component
                    :is="getNotificationIcon(notification.type)"
                    class="h-4 w-4"
                  />
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <p
                    :class="[
                      'text-sm font-medium truncate',
                      !notification.read
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-600 dark:text-gray-300',
                    ]"
                  >
                    {{ notification.title }}
                  </p>
                  <div class="flex items-center space-x-2">
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {{ formatTime(notification.createdAt) }}
                    </span>
                    <div
                      v-if="!notification.read"
                      class="w-2 h-2 bg-blue-600 rounded-full"
                    ></div>
                  </div>
                </div>

                <p
                  :class="[
                    'mt-1 text-sm',
                    !notification.read
                      ? 'text-gray-700 dark:text-gray-200'
                      : 'text-gray-500 dark:text-gray-400',
                  ]"
                >
                  {{ notification.message }}
                </p>

                <!-- Notification Data -->
                <div
                  v-if="
                    notification.data &&
                    Object.keys(notification.data).length > 0
                  "
                  class="mt-2"
                >
                  <div
                    class="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 text-xs"
                  >
                    <div
                      v-if="
                        notification.type === 'assignment' &&
                        notification.data.assignmentTitle
                      "
                      class="space-y-1"
                    >
                      <p>
                        <span class="font-medium">Assignment:</span>
                        {{ notification.data.assignmentTitle }}
                      </p>
                      <p v-if="notification.data.subjectName">
                        <span class="font-medium">Subject:</span>
                        {{ notification.data.subjectName }}
                      </p>
                      <p v-if="notification.data.studentName">
                        <span class="font-medium">Student:</span>
                        {{ notification.data.studentName }}
                      </p>
                    </div>

                    <div
                      v-else-if="
                        notification.type === 'grade' &&
                        notification.data.score !== undefined
                      "
                      class="space-y-1"
                    >
                      <p>
                        <span class="font-medium">Assignment:</span>
                        {{ notification.data.assignmentTitle }}
                      </p>
                      <p>
                        <span class="font-medium">Score:</span>
                        {{ notification.data.score }}/{{
                          notification.data.maxScore
                        }}
                        ({{ notification.data.percentage }}%)
                      </p>
                      <p v-if="notification.data.feedback">
                        <span class="font-medium">Feedback:</span>
                        {{ notification.data.feedback }}
                      </p>
                      <p v-if="notification.data.teacherName">
                        <span class="font-medium">Graded by:</span>
                        {{ notification.data.teacherName }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Actions -->
                <div class="mt-3 flex items-center space-x-4">
                  <button
                    v-if="!notification.read"
                    @click="markAsRead(notification._id)"
                    class="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Mark as read
                  </button>
                  <button
                    v-else
                    @click="markAsUnread(notification._id)"
                    class="text-xs text-gray-600 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    Mark as unread
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More -->
        <div
          v-if="hasMore && !loading"
          class="p-4 border-t border-gray-200 dark:border-gray-700"
        >
          <button
            @click="loadMore"
            class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            Load More
          </button>
        </div>

        <!-- Loading More -->
        <div
          v-if="loading && notifications.length > 0"
          class="p-4 border-t border-gray-200 dark:border-gray-700 text-center"
        >
          <div
            class="animate-spin rounded-full h-6 w-6 border-b-2 border-black dark:border-white mx-auto"
          ></div>
          <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Loading more...
          </p>
        </div>
      </div>

      <!-- Pagination -->
      <Pagination
        v-if="notifications.length > 0"
        :current-page="notificationStore.pagination.page"
        :total-pages="notificationStore.pagination.pages"
        :total-items="notificationStore.pagination.total"
        @page-change="handlePageChange"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useNotificationStore } from "@/stores/notifications";
import { useSocket } from "@/composables/useSocket";
import {
  BellIcon,
  BellSlashIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  AcademicCapIcon,
} from "@heroicons/vue/24/outline";
import AppLayout from "@/components/layout/AppLayout.vue";

const notificationStore = useNotificationStore();
const { notifications: socketNotifications } = useSocket();

// Computed properties
const notifications = computed(() => notificationStore.notifications);
const loading = computed(() => notificationStore.loading);
const unreadCount = computed(
  () => notificationStore.unreadNotifications.length
);
const hasMore = computed(() => notificationStore.hasMore);

const readNotifications = computed(() =>
  notifications.value.filter((n) => n.read)
);

const todayNotifications = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return notifications.value.filter((n) => new Date(n.createdAt) >= today);
});

// Methods
const getNotificationIcon = (type: string) => {
  const icons = {
    assignment: DocumentTextIcon,
    grade: AcademicCapIcon,
  };
  return icons[type as keyof typeof icons] || BellIcon;
};

const getNotificationIconClass = (type: string) => {
  const classes = {
    assignment: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
    grade: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400",
  };
  return (
    classes[type as keyof typeof classes] ||
    "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-400"
  );
};

const fetchNotifications = async () => {
  try {
    await notificationStore.fetchNotifications({
      page: notificationStore.pagination.page,
      limit: notificationStore.pagination.limit,
    });
  } catch (error) {
    console.error("Failed to fetch subjects:", error);
  }
};

const handlePageChange = (page: number) => {
  notificationStore.pagination.page = page;
  fetchNotifications();
};

const formatTime = (timestamp: string) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInMinutes = Math.floor(
    (now.getTime() - time.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
  return time.toLocaleDateString();
};

const markAsRead = async (id: string) => {
  await notificationStore.markAsRead(id);
};

const markAsUnread = async (id: string) => {
  await notificationStore.markAsUnread(id);
};

const loadMore = async () => {
  await notificationStore.loadMore();
};

const refresh = async () => {
  await notificationStore.refresh();
};

// Watch for new socket notifications
watch(
  socketNotifications,
  (newNotifications, oldNotifications) => {
    if (newNotifications.length > (oldNotifications?.length || 0)) {
      const latestNotification = newNotifications[0];
      notificationStore.addSocketNotification(latestNotification);
    }
  },
  { deep: true }
);

// Lifecycle
onMounted(async () => {
  await notificationStore.refresh();
});
</script>

<style scoped>
/* Custom scrollbar for notifications list */
.notifications-list {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.notifications-list::-webkit-scrollbar {
  width: 6px;
}

.notifications-list::-webkit-scrollbar-track {
  background: #f7fafc;
}

.notifications-list::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 3px;
}

.notifications-list::-webkit-scrollbar-thumb:hover {
  background-color: #a0aec0;
}

/* Dark mode scrollbar */
.dark .notifications-list {
  scrollbar-color: #4a5568 #2d3748;
}

.dark .notifications-list::-webkit-scrollbar-track {
  background: #2d3748;
}

.dark .notifications-list::-webkit-scrollbar-thumb {
  background-color: #4a5568;
}

.dark .notifications-list::-webkit-scrollbar-thumb:hover {
  background-color: #718096;
}
</style>
