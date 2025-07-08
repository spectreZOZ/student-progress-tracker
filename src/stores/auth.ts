// src/stores/auth.ts

import api from "@/api/axios";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as null | Record<string, any>,
    loading: false,
    error: null as null | string,
    isAuthenticated: !!localStorage.getItem("token"),
  }),

  actions: {
    async init() {
      const token = localStorage.getItem("token");
      if (token && !this.user) {
        await this.getProfile();
      }
    },
    async register(payload: {
      name: string;
      email: string;
      password: string;
      role: string;
      grade: number;
    }) {
      try {
        this.loading = true;
        this.error = null;
        const res = await api.post("/auth/register", payload);
        const { token } = res.data.data;
        localStorage.setItem("token", token);
        await this.getProfile(); // ✅ get the user and mark authenticated

        this.isAuthenticated = true; // ✅ update state explicitly
        return true; // ✅ success
      } catch (err: any) {
        this.error = err.response?.data?.message || "Registration failed";
      } finally {
        this.loading = false;
      }
    },

    async login(payload: { email: string; password: string }) {
      try {
        this.loading = true;
        this.error = null;

        const res = await api.post("/auth/login", payload);
        const { token } = res.data.data;
        localStorage.setItem("token", token);

        await this.getProfile(); // ✅ get the user and mark authenticated

        this.isAuthenticated = true; // ✅ update state explicitly
        return true;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Login failed";
        this.isAuthenticated = false;
        return false;
      } finally {
        this.loading = false;
      }
    },
    async getProfile() {
      try {
        this.error = null;

        const res = await api.get("/auth/me");

        this.user = res.data.data;
      } catch (err: any) {
        this.user = null;
        this.error = "Could not fetch user";
      }
    },

    logout() {
      this.user = null;
      this.isAuthenticated = false;
      localStorage.removeItem("token");
      // Optionally call logout endpoint if available
    },
  },
});
