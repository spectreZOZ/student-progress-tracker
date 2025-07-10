import type { Classroom, CreateClassroomData } from "@/types";

import api from "@/api/axios";
import { defineStore } from "pinia";

interface ClassroomResponse {
  data: Classroom[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface ClassroomStatsResponse {
  data: {
    totalStudents: number;
    totalSubjects: number;
    activeAssignments: number;
    // Add other stats properties as needed
  };
}

export const useClassroomStore = defineStore("classroom", {
  state: () => ({
    classrooms: [] as Classroom[],
    currentClassroom: null as Classroom | null,
    classroomStats: null as ClassroomStatsResponse["data"] | null,
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
    async fetchClassrooms(params?: {
      page?: number;
      limit?: number;
      teacher?: string;
      grade?: number;
      academicYear?: string;
      search?: string;
      sort?: string;
    }) {
      this.loading = true;
      try {
        const res = await api.get<ClassroomResponse>("/classrooms", {
          params,
        });

        this.classrooms = res.data.data;
        this.pagination.total = res.data.pagination.total;
        this.pagination.page = res.data.pagination.page;
        this.pagination.limit = res.data.pagination.limit;
        this.pagination.totalPages = res.data.pagination.pages;

        this.error = null;
      } catch (err: any) {
        console.error("Error in fetchClassrooms:", err);
        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to fetch classrooms";
        this.error = error;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchClassroom(id: string) {
      this.loading = true;
      try {
        const res = await api.get(`/classrooms/${id}`);
        this.currentClassroom = res.data.data;
        this.error = null;
      } catch (err: any) {
        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to fetch classroom";
        this.error = error;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async addClassroom(data: CreateClassroomData) {
      this.loading = true;
      try {
        await api.post("/classrooms", data);
        await this.fetchClassrooms();
        this.error = null;
        return true;
      } catch (err: any) {
        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to add classroom";
        this.error = error;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async editClassroom(id: string, data: CreateClassroomData) {
      this.loading = true;
      try {
        await api.put(`/classrooms/${id}`, data);
        await this.fetchClassrooms();
        this.error = null;
        return true;
      } catch (err: any) {
        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to update classroom";
        this.error = error;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async removeClassroom(id: string) {
      this.loading = true;
      try {
        await api.delete(`/classrooms/${id}`);
        await this.fetchClassrooms();
        this.error = null;
      } catch (err: any) {
        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to remove classroom";
        this.error = error;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async enrollStudent(
      classroomId: string,
      studentData: { studentId: string }
    ) {
      this.loading = true;
      try {
        const res = await api.post(
          `/classrooms/${classroomId}/enroll`,
          studentData
        );
        // Optionally refresh the current classroom data
        if (this.currentClassroom?.id === classroomId) {
          await this.fetchClassroom(classroomId);
        }
        this.error = null;
        return res.data;
      } catch (err: any) {
        console.log("Error in enrollStudent:", err);
        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to enroll student";
        this.error = error;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async unenrollStudent(classroomId: string, studentId: string) {
      this.loading = true;
      try {
        const res = await api.delete(
          `/classrooms/${classroomId}/unenroll/${studentId}`
        );
        // Optionally refresh the current classroom data
        if (this.currentClassroom?.id === classroomId) {
          await this.fetchClassroom(classroomId);
        }
        this.error = null;
        return res.data;
      } catch (err: any) {
        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to unenroll student";
        this.error = error;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async addSubjectToClassroom(
      classroomId: string,
      subjectData: { subjectId: string }
    ) {
      this.loading = true;
      try {
        await api.post(`/classrooms/${classroomId}/subjects`, subjectData);
        // Optionally refresh the current classroom data
        if (this.currentClassroom?.id === classroomId) {
          await this.fetchClassroom(classroomId);
        }

        if (!this.currentClassroom?.id) {
          await this.fetchClassrooms();
        }
        this.error = null;
        return true;
      } catch (err: any) {
        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to add subject";
        this.error = error;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async removeSubjectFromClassroom(classroomId: string, subjectId: string) {
      this.loading = true;
      try {
        await api.delete(`/classrooms/${classroomId}/subjects/${subjectId}`);
        // Optionally refresh the current classroom data
        if (this.currentClassroom?.id === classroomId) {
          await this.fetchClassroom(classroomId);
        }

        if (!this.currentClassroom?.id) {
          await this.fetchClassrooms();
        }
        this.error = null;
        return true;
      } catch (err: any) {
        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to remove subject";
        this.error = error;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchClassroomStats(classroomId: string) {
      this.loading = true;
      try {
        const res = await api.get<ClassroomStatsResponse>(
          `/classrooms/${classroomId}/stats`
        );
        this.classroomStats = res.data.data;
        this.error = null;
        return res.data.data; // Return the full response
      } catch (err: any) {
        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to fetch classroom statistics";
        this.error = error;
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
