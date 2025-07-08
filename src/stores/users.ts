import api from "@/api/axios";
import { defineStore } from "pinia";

type UserQueryParams = {
  page?: number;
  limit?: number;
  role?: "admin" | "teacher" | "student";
  grade?: number;
  search?: string;
  isActive?: boolean;
  sort?: string;
};

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [] as any[],
    user: null as null | Record<string, any>,
    stats: null as null | Record<string, any>,
    loading: false,
    error: null as null | string,
    total: 0,
  }),

  actions: {
    async getAllUsers(params: UserQueryParams = {}) {
      try {
        this.loading = true;
        this.error = null;

        const res = await api.get("/users", { params });

        this.users = res.data?.data || [];
        this.total = res.data?.total || 0;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to fetch users";
      } finally {
        this.loading = false;
      }
    },

    async getUserById(id: string) {
      try {
        this.loading = true;
        this.error = null;
        const res = await api.get(`/users/${id}`);
        this.user = res.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to fetch user";
      } finally {
        this.loading = false;
      }
    },

    async getUserStats() {
      try {
        this.loading = true;
        this.error = null;
        const res = await api.get("/users/stats");
        this.stats = res.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to fetch stats";
      } finally {
        this.loading = false;
      }
    },
  },
});
