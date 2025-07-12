import { Socket, io } from "socket.io-client";
import { inject, onUnmounted, ref } from "vue";

interface NotificationData {
  type: "assignment" | "activity" | "grade" | "announcement";
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  read: boolean;
}

export function useSocket() {
  const socket = ref<Socket | null>(null);
  const isConnected = ref(false);
  const notifications = ref<NotificationData[]>([]);
  const toastRef = inject("toast");
  const connectionError = ref<string | null>(null);

  const connect = (serverUrl: string = "http://localhost:5000") => {
    socket.value = io(serverUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      timeout: 20000,
      forceNew: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socket.value.on("connect", () => {
      isConnected.value = true;
      console.log("🔌 Connected to server");
    });

    socket.value.on("disconnect", () => {
      isConnected.value = false;
      console.log("🔌 Disconnected from server");
    });

    socket.value.on("connect_error", (error) => {
      isConnected.value = false;
      connectionError.value = error.message;
      console.error("🔌 Connection error:", error);
    });

    // Enhanced notification handling
    socket.value.on("notification", (notification: NotificationData) => {
      notifications.value.unshift({
        ...notification,
        read: false,
        timestamp: new Date(notification.timestamp),
      });
      //   console.log("🔔 New notification:", notification);

      // You can add different handling based on notification type
      switch (notification.type) {
        case "assignment":
          console.log("📝 Assignment notification:", notification.data);

          if (notification.data?.studentName) {
            // @ts-expect-error: Unreachable code error
            toastRef?.value?.addToast({
              status: "success",
              title: notification.title,
              description: notification.message,
            });
          }
          break;
        case "grade":
          //   console.log("📊 Grade notification:", notification.data);
          if (notification.data?.score && notification.data?.maxScore) {
            // Student receiving grade notification
            // @ts-expect-error: Unreachable code error
            toastRef?.value?.addToast({
              type: "info",
              title: "Assignment Graded",
              description: `"${notification.data.assignmentTitle}" graded: ${notification.data.score}/${notification.data.maxScore} (${notification.data.percentage}%)`,
            });
          }
          break;

        // default:
        //   console.log("📢 General notification:", notification);
      }
    });

    socket.value.on("assignment-updated", (data: any) => {
      console.log("📝 Assignment updated:", data);
      // Handle assignment update in your app
    });

    socket.value.on("activity-updated", (data: any) => {
      console.log("🎯 Activity updated:", data);
      // Handle activity update in your app
    });

    socket.value.on("grade-updated", (data: any) => {
      console.log("📊 Grade updated:", data);
      // Handle grade update in your app
    });

    // Confirmation events
    socket.value.on("joined-user-room", (userId: string) => {
      console.log("✅ Joined user room:", userId);
    });
  };

  const disconnect = () => {
    if (socket.value) {
      socket.value.disconnect();
      socket.value = null;
      isConnected.value = false;
    }
  };

  const clearNotifications = () => {
    notifications.value = [];
  };

  // Add method to get notifications by type
  const getNotificationsByType = (type: string) => {
    return notifications.value.filter((n) => n.type === type);
  };

  // Add method to mark notifications as read
  const markAsRead = (index: number) => {
    if (notifications.value[index]) {
      notifications.value[index].read = true;
    }
  };

  const identify = (userId: string) => {
    if (socket.value && isConnected.value) {
      console.log("👤 Identifying user:", userId);
      socket.value.emit("identify", userId);
    } else {
      console.warn("Cannot identify: socket not connected");
    }
  };

  const joinUserRoom = (userId: string) => {
    if (socket.value && isConnected.value) {
      console.log("👤 Joining user room:", userId);
      socket.value.emit("join-user-room", userId);
    } else {
      console.warn("Cannot join user room: socket not connected");
    }
  };

  onUnmounted(() => {
    disconnect();
  });

  return {
    socket: socket.value,
    isConnected,
    notifications,
    connect,
    disconnect,
    clearNotifications,
    getNotificationsByType,
    markAsRead,
    identify,
    joinUserRoom,
    connectionError,
  };
}
