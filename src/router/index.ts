import { createRouter, createWebHistory } from "vue-router";

import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/LoginView.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/register",
      name: "register",
      component: () => import("@/views/RegisterView.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/",
      name: "dashboard",
      component: () => import("@/views/DashboardView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/students",
      name: "students",
      component: () => import("@/views/StudentsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/analytics",
      name: "analytics",
      component: () => import("@/views/AnalyticsView.vue"),
      meta: { requiresAuth: true, roles: ["administrator"] },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("@/views/NotFoundView.vue"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next("/login");
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next("/");
  }
  // else if (to.meta.roles && !to.meta.roles.includes(authStore.user?.role)) {
  //   next("/");
  // }
  else {
    next();
  }
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
