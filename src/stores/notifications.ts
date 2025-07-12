import api from "@/api/axios";
import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notifications", {
  state: () => ({
    notifications: [] as any[],
    loading: false,
    error: null as string | null,
    unreadCount: 0,
    pagination: null as any,
    currentPage: 1,
    hasMore: true,
  }),

  getters: {
    unreadNotifications: (state) => state.notifications.filter((n) => !n.read),
    readNotifications: (state) => state.notifications.filter((n) => n.read),
  },

  actions: {
    async fetchNotifications({ page = 1, limit = 20 }) {
      try {
        this.loading = true;
        this.error = null;

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        const res = await api.get(`/notifications?${params.toString()}`);

        if (page === 1) {
          this.notifications = res.data.data || [];
        } else {
          this.notifications.push(...(res.data.data || []));
        }

        this.pagination = res.data.pagination;
        this.currentPage = page;
        this.hasMore = res.data.pagination?.hasNextPage || false;
      } catch (err: any) {
        this.error =
          err.response?.data?.message || "Failed to fetch notifications";
      } finally {
        this.loading = false;
      }
    },

    async markAsRead(id: string) {
      try {
        await api.patch(`/notifications/${id}/read`);
        const notification = this.notifications.find((n) => n._id === id);
        if (notification && !notification.read) {
          notification.read = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
      } catch (err: any) {
        console.error("Error marking as read:", err);
      }
    },

    async markAsUnread(id: string) {
      try {
        await api.patch(`/notifications/${id}/unread`);
        const notification = this.notifications.find((n) => n._id === id);
        if (notification && notification.read) {
          notification.read = false;
          this.unreadCount++;
        }
      } catch (err: any) {
        console.error("Error marking as unread:", err);
      }
    },

    // Handle Socket.IO notifications with duplicate prevention
    addSocketNotification(socketNotification: any) {
      // Check for duplicates based on title, message, and timestamp
      const exists = this.notifications.some(
        (n) =>
          n.title === socketNotification.title &&
          n.message === socketNotification.message &&
          Math.abs(
            new Date(n.createdAt).getTime() -
              new Date(
                socketNotification.timestamp ||
                  socketNotification.data.submittedAt
              ).getTime()
          ) < 5000
      );

      if (!exists) {
        const notification = {
          _id: `temp_${Date.now()}`,
          type: socketNotification.type,
          title: socketNotification.title,
          message: socketNotification.message,
          data: socketNotification.data || {},
          read: false,
          createdAt:
            socketNotification.timestamp ||
            socketNotification.data.submittedAt ||
            new Date().toISOString(),
        };

        // Add to beginning of notifications array
        this.notifications.unshift(notification);
        this.unreadCount++;

        // Sync with backend after a short delay to get the real notification
        setTimeout(() => {
          this.syncLatestNotifications();
        }, 1000);
      }
    },

    // Sync latest notifications to replace temporary ones with real database entries
    async syncLatestNotifications() {
      try {
        const res = await api.get("/notifications?page=1&limit=5");
        const latestNotifications = res.data.data || [];

        latestNotifications.forEach((realNotification: any) => {
          // Find and replace temporary notification
          const tempIndex = this.notifications.findIndex(
            (n) =>
              n._id.startsWith("temp_") &&
              n.title === realNotification.title &&
              n.message === realNotification.message &&
              Math.abs(
                new Date(n.createdAt).getTime() -
                  new Date(realNotification.createdAt).getTime()
              ) < 10000
          );

          if (tempIndex !== -1) {
            this.notifications[tempIndex] = realNotification;
          } else {
            // Check if this is a new notification not in our list
            const existsIndex = this.notifications.findIndex(
              (n) => n._id === realNotification._id
            );
            if (existsIndex === -1) {
              this.notifications.unshift(realNotification);
              if (!realNotification.read) {
                this.unreadCount++;
              }
            }
          }
        });

        // Clean up old temporary notifications
        this.notifications = this.notifications.filter((n) => {
          if (n._id.startsWith("temp_")) {
            const age = Date.now() - new Date(n.createdAt).getTime();
            return age < 30000; // Keep temp notifications for max 30 seconds
          }
          return true;
        });
      } catch (err) {
        console.error("Sync latest notifications error:", err);
      }
    },

    // Load more notifications for pagination
    async loadMore() {
      if (this.hasMore && !this.loading) {
        await this.fetchNotifications({ page: this.currentPage + 1 });
      }
    },

    // Refresh notifications
    async refresh() {
      await Promise.all([this.fetchNotifications({ page: 1 })]);
    },

    // Clear all notifications from store
    clearNotifications() {
      this.notifications = [];
      this.unreadCount = 0;
      this.pagination = null;
      this.currentPage = 1;
      this.hasMore = true;
    },
  },
});
