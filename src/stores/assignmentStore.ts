import type { Assignment, CreateAssignmentData } from "@/types";

import api from "@/api/axios";
import { defineStore } from "pinia";

type Attachment = {
  filename: string;
  url: string;
};

type GradeSubmissionPayload = {
  score: number;
  feedback: string;
};

interface AssignmentResponse {
  data: Assignment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
export const useAssignmentStore = defineStore("assignment", {
  state: () => ({
    assignments: [] as Assignment[],
    currentAssignment: null as Assignment | null,
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
    async fetchAssignments(params?: {
      page: number;
      limit: number;
      subject?: string;
      type?: string;
      search?: string;
      isActive?: boolean;
    }) {
      this.loading = true;
      try {
        const res = await api.get<AssignmentResponse>("/assignments", {
          params,
        });

        // Check if assignments are being set
        this.assignments = res.data.data;

        // Instead of setting the whole object at once
        this.pagination.total = res.data.pagination.total;
        this.pagination.page = res.data.pagination.page;
        this.pagination.limit = res.data.pagination.limit;
        this.pagination.totalPages = res.data.pagination.pages;

        this.error = null;
      } catch (err: any) {
        console.error("Error in fetchAssignments:", err);
        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to fetch assignments";
        this.error = error;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async fetchAssignment(id: string) {
      this.loading = true;
      try {
        const res = await api.get(`/assignments/${id}`);

        this.currentAssignment = res.data.data;
        this.error = null;
      } catch (err: any) {
        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to fetch assignment";
        this.error = error;
        throw err; // Re-throw the error
      } finally {
        this.loading = false;
      }
    },
    async addAssignment(data: CreateAssignmentData) {
      this.loading = true;
      try {
        await api.post("/assignments", data);
        await this.fetchAssignments();
        this.error = null;
        return true;
      } catch (err: any) {
        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to add assignment";
        this.error = error;
      } finally {
        this.loading = false;
      }
    },
    async editAssignment(id: string, data: CreateAssignmentData) {
      this.loading = true;
      try {
        const res = await api.put(`/assignments/${id}`, data);
        await this.fetchAssignments();
        this.error = null;
        return true; // Return success
      } catch (err: any) {
        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to update assignment";
        this.error = error;
        throw err; // Re-throw for component to catch
      } finally {
        this.loading = false;
      }
    },
    async removeAssignment(id: string) {
      this.loading = true;
      try {
        await api.delete(`/assignments/${id}`);
        await this.fetchAssignments();
        this.error = null;
      } catch (err: any) {
        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to remove assignment";
        this.error = error;
        throw err; // Re-throw the error
      } finally {
        this.loading = false;
      }
    },

    async gradeStudentSubmission(
      assignmentId: string,
      studentId: string,
      payload: GradeSubmissionPayload
    ) {
      this.loading = true;
      try {
        await api.put(
          `/assignments/${assignmentId}/grade/${studentId}`,
          payload
        );
        this.error = null;
        return true;
      } catch (err: any) {
        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to grade student submission";
        this.error = error;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async fetchAssignmentStats(id: string): Promise<{}> {
      this.loading = true;
      try {
        const res = await api.get(`/assignments/${id}/stats`);
        this.error = null;
        return res.data;
      } catch (err: any) {
        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to fetch assignment statistics";
        this.error = error;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    // Student access
    async submitAssignment(id: string, attachments: Attachment[]) {
      this.loading = true;
      try {
        await api.post(`/assignments/${id}/submit`, { attachments });
        this.error = null;
        return true;
      } catch (err: any) {
        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to submit assignment";
        this.error = error;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchMySubmissions(): Promise<any[]> {
      this.loading = true;
      try {
        const res = await api.get("/assignments/my-submissions");
        this.error = null;
        return res.data; // or update a `mySubmissions` state property if needed
      } catch (err: any) {
        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to fetch submissions";
        this.error = error;
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
