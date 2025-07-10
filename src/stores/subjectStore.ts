import api from "@/api/axios";
import { defineStore } from "pinia";

export type SubjectProp = {
  id: string;
  name: string;
  code: string;
  description: string;
  teacher: string;
  students: [
    {
      student: string;
      progress: number;
      grade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D+" | "D" | "F";
      timeSpent: number;
      engagementScore: number;
      lastAccessed: number;
    }
  ];
  isActive: boolean;
};

interface SubjectsResponse {
  data: SubjectProp[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const useSubjectStore = defineStore("subject", {
  state: () => ({
    subjects: [] as SubjectProp[],
    currentSubject: null as SubjectProp | null,
    loading: false,
    error: null as null | unknown,
    pagination: {
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 0,
    },
  }),
  actions: {
    async fetchSubjects(params?: {
      page?: number;
      limit?: number;
      search?: string;
      sort?: string;
    }) {
      this.loading = true;
      try {
        const res = await api.get<SubjectsResponse>("/subjects", { params });

        this.subjects = res.data.data;
        this.pagination.total = res.data.pagination.total;
        this.pagination.page = res.data.pagination.page;
        this.pagination.limit = res.data.pagination.limit;
        this.pagination.totalPages = res.data.pagination.pages;

        this.error = null;
      } catch (err: any) {
        console.error("Error in fetchSubjects:", err);
        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to fetch subjects";
        this.error = error;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchSubject(id: string) {
      this.loading = true;
      try {
        const res = await api.get(`/subjects/${id}`);
        this.currentSubject = res.data.data;
        this.error = null;
      } catch (err: any) {
        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to fetch subject";
        this.error = error;
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
