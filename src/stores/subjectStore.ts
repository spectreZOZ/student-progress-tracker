import { Teacher } from "@/types";
import api from "@/api//axios";
import { defineStore } from "pinia";

export type SubjectProp = {
  id: string;
  name: string;
  code: string;
  description: string;
  teacher: Teacher;
  students: [
    {
      student: {
        _id: string;
        name: string;
        email: string;
        grade: number;
        overallProgress: number;
        id: string;
      };
      progress: number;
      grade: number | null;
      timeSpent: number;
      engagementScore: number;
      lastAccessed: string | Date;
      _id: string;
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

type CreateSubjectData = {
  name: string;
  description?: string;
  code?: string;
  teacher?: string;
};

type UpdateSubjectData = Partial<CreateSubjectData> & {
  teacher: string;
  isActive: boolean;
};

type EnrollStudentData = {
  studentId: string;
};

type UpdateStudentProgressData = {
  progress: number;
  grade: string;
  engagementScore: number;
};

export const useSubjectStore = defineStore("subject", {
  state: () => ({
    subjects: [] as SubjectProp[],
    currentSubject: null as SubjectProp | null,
    loading: false,
    error: null as null | unknown,
    stats: null as null | Record<string, any>,
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
      teacher?: string;
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

    async createSubject(data: CreateSubjectData) {
      try {
        this.loading = true;
        this.error = null;

        const res = await api.post("/subjects", data);

        // Add the new subject to the list
        this.subjects.push(res.data);
        return res.data;
      } catch (err: any) {
        console.error("Error in createSubject:", err);

        const error =
          err.response?.data?.errors?.map((e: any) => e.msg).join(", ") ||
          err.response?.data?.message ||
          "Failed to create subject";
        this.error = error;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateSubject(id: string, data: UpdateSubjectData) {
      try {
        this.loading = true;
        this.error = null;

        const res = await api.put(`/subjects/${id}`, data);

        // Update the subject in the list
        const index = this.subjects.findIndex((subject) => subject.id === id);
        if (index !== -1) {
          this.subjects[index] = res.data;
        }

        // Update current subject if it matches
        if (this.currentSubject?.id === id) {
          this.currentSubject = res.data;
        }

        return res.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to update subject";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteSubject(id: string) {
      try {
        this.loading = true;
        this.error = null;

        await api.delete(`/subjects/${id}`);

        // Remove the subject from the list
        this.subjects = this.subjects.filter((subject) => subject.id !== id);

        // Clear current subject if it matches
        if (this.currentSubject?.id === id) {
          this.currentSubject = null;
        }
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to delete subject";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async enrollStudentInSubject(subjectId: string, data: EnrollStudentData) {
      try {
        this.loading = true;
        this.error = null;

        const res = await api.post(`/subjects/${subjectId}/enroll`, data);

        return res.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to enroll student";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async unenrollStudentFromSubject(subjectId: string, studentId: string) {
      try {
        this.loading = true;
        this.error = null;

        await api.delete(`/subjects/${subjectId}/unenroll/${studentId}`);
      } catch (err: any) {
        this.error =
          err.response?.data?.message || "Failed to unenroll student";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateStudentProgress(
      subjectId: string,
      studentId: string,
      data: UpdateStudentProgressData
    ) {
      try {
        this.loading = true;
        this.error = null;

        const res = await api.put(
          `/subjects/${subjectId}/students/${studentId}/progress`,
          data
        );

        return res.data;
      } catch (err: any) {
        this.error =
          err.response?.data?.message || "Failed to update student progress";
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async getSubjectStats(id: string) {
      try {
        this.loading = true;
        this.error = null;
        const res = await api.get(`/subjects/${id}/stats`);
        this.stats = res.data.data;
        return res.data.data;
      } catch (err: any) {
        this.error =
          err.response?.data?.message || "Failed to fetch subject stats";
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
