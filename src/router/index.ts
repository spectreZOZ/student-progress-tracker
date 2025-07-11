import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "@/stores/auth";

// Define user roles for better type safety
export type UserRole = "admin" | "teacher" | "student";

// Define route meta types for better TypeScript support
declare module "vue-router" {
  interface RouteMeta {
    requiresAuth?: boolean;
    requiresGuest?: boolean;
    roles?: UserRole[];
    title?: string;
    icon?: string;
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
      meta: {
        requiresGuest: true,
        title: "Login",
      },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/RegisterView.vue"),
      meta: {
        requiresGuest: true,
        title: "Register",
      },
    },
    {
      path: "/",
      name: "dashboard",
      component: () => import("@/views/DashboardView.vue"),
      meta: {
        requiresAuth: true,
        roles: ["admin", "teacher"],
        title: "Dashboard",
        icon: "HomeIcon",
      },
    },
    {
      path: "/students",
      name: "students",
      component: () => import("@/views/StudentsView.vue"),
      meta: {
        requiresAuth: true,
        roles: ["admin", "teacher"],
        title: "Students",
        icon: "UsersIcon",
      },
    },
    {
      path: "/analytics",
      name: "analytics",
      component: () => import("@/views/AnalyticsView.vue"),
      meta: {
        requiresAuth: true,
        roles: ["admin"],
        title: "Analytics",
        icon: "ChartBarIcon",
      },
    },
    {
      path: "/assignments",
      name: "assignments",
      component: () => import("@/views/AssignmentsView.vue"),
      meta: {
        requiresAuth: true,
        roles: ["teacher", "student"],
        title: "Assignments",
        icon: "ClipboardDocumentListIcon",
      },
    },
    {
      path: "/classrooms",
      name: "classrooms",
      component: () => import("@/views/ClassroomsView.vue"),
      meta: {
        requiresAuth: true,
        title: "Classrooms",
        icon: "BookOpenIcon",
        roles: ["admin", "teacher", "student"],
      },
    },
    {
      path: "/subjects", // Changed from /classrooms/subjects
      name: "subjects",
      component: () => import("@/views/SubjectsView.vue"),
      meta: {
        requiresAuth: true,
        roles: ["admin", "teacher", "student"],
        title: "Subjects",
      },
    },
    // Unauthorized access page
    {
      path: "/unauthorized",
      name: "unauthorized",
      component: () => import("@/views/UnauthorizedView.vue"),
      meta: {
        title: "Unauthorized Access",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/views/NotFoundView.vue"),
      meta: {
        title: "Page Not Found",
      },
    },
  ],
});

// Enhanced router guard with proper authorization
router.beforeEach(async (to, _, next) => {
  // Initialize auth store
  const authStore = useAuthStore();

  // Wait for auth store to initialize if needed
  await authStore.init();

  const isAuthenticated = authStore.isAuthenticated;
  const userRole = authStore.user?.role as UserRole | undefined;

  console.log("Navigation Guard:", {
    to: to.path,
    isAuthenticated,
    userRole,
    requiredRoles: to.meta.roles,
  });

  // Set document title
  document.title = `${to.meta.title || "App"} | EduTracker`;

  // Check if route requires guest access (login/register pages)
  if (to.meta.requiresGuest && isAuthenticated) {
    console.log(
      "User is authenticated, redirecting from guest page to dashboard"
    );
    return next({ name: "dashboard" });
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return next({
      name: "login",
      query: { redirect: to.fullPath },
    });
  }

  // Check if user has required role for the route
  if (to.meta.requiresAuth && to.meta.roles && userRole) {
    if (!to.meta.roles.includes(userRole)) {
      console.warn(
        `Access denied: User with role '${userRole}' attempted to access route requiring roles: ${to.meta.roles.join(
          ", "
        )}`
      );

      return next({
        name: "unauthorized",
        query: {
          from: to.fullPath,
          required: to.meta.roles.join(","),
        },
      });
    }
  }

  console.log("Navigation allowed");
  next();
});

export default router;

// Add the following TypeScript declaration to fix the ImportMeta.env error
declare global {
  interface ImportMetaEnv {
    readonly BASE_URL?: string;
    // add other env variables here if needed
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
