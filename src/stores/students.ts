// src/stores/students.ts
import api from "@/api/axios";
import { defineStore } from "pinia";
import exportService, { type ExportFilters } from "@/services/exportService";

export const useStudentsStore = defineStore("students", {
  state: () => ({
    students: [] as any[],
    selectedStudent: null as any,
    studentActivities: [] as any[],
    isLoading: false,
    isLoadingStudent: false,
    isLoadingActivities: false,
    isExporting: false, // Add export loading state
    error: null as string | null,
    studentError: null as string | null,
    exportError: null as string | null, // Add export error state
    total: 0,
    activitiesTotal: 0,
    // Filters and pagination
    filters: {
      page: 1,
      limit: 10,
      search: "",
      grade: null as number | null,
      role: "student",
      isActive: null as boolean | null,
      sort: "name",
    },
    // Activities filters
    activitiesFilters: {
      page: 1,
      limit: 20,
      type: null as string | null,
      subject: null as string | null,
      startDate: null as string | null,
    },
  }),

  getters: {
    filteredStudents(state) {
      console.log("Students:", state.students.length);
      return state.students;
    },

    getStudentById: (state) => {
      return (id: number | string) => {
        return state.students.find((student) => student.id == id);
      };
    },
  },

  actions: {
    async fetchStudents() {
      try {
        this.isLoading = true;
        this.error = null;
        const params = {
          ...this.filters,
        };
        const res = await api.get("/users", { params });
        console.log("Fetched students:", res.data.data);
        this.students = res.data.data || [];
        this.total = res.data.total || 0;
      } catch (err: any) {
        this.error = err.response?.data?.message || "Failed to fetch students";
      } finally {
        this.isLoading = false;
      }
    },

    async fetchStudentById(id: number | string) {
      try {
        this.isLoadingStudent = true;
        this.studentError = null;
        const res = await api.get(`/users/${id}`);
        console.log("Fetched student:", res.data);
        this.selectedStudent = res.data.data || res.data;
      } catch (err: any) {
        this.studentError =
          err.response?.data?.message || "Failed to fetch student details";
        console.error("Error fetching student:", err);
      } finally {
        this.isLoadingStudent = false;
      }
    },

    async fetchStudentActivities(
      studentId: number | string,
      filters?: Partial<typeof this.activitiesFilters>
    ) {
      try {
        this.isLoadingActivities = true;

        // Merge provided filters with default filters
        const params = {
          ...this.activitiesFilters,
          ...filters,
        };

        // Remove null values from params
        const cleanParams = Object.fromEntries(
          Object.entries(params).filter(
            ([_, value]) => value !== null && value !== undefined
          )
        );

        const res = await api.get(`/activities/student/${studentId}`, {
          params: cleanParams,
        });

        console.log("Fetched student activities:", res.data);
        this.studentActivities = res.data.data || res.data || [];
        this.activitiesTotal = res.data.total || this.studentActivities.length;
      } catch (err: any) {
        console.error("Error fetching student activities:", err);
        this.studentActivities = [];
        this.activitiesTotal = 0;
      } finally {
        this.isLoadingActivities = false;
      }
    },

    // Export methods using the export service
    async exportStudents(exportFilters?: ExportFilters) {
      try {
        this.isExporting = true;
        this.exportError = null;

        const result = await exportService.exportStudents(exportFilters);

        if (!result.success) {
          this.exportError = result.message;
        }

        return result;
      } catch (err: any) {
        this.exportError = "An unexpected error occurred during export";
        return { success: false, message: this.exportError };
      } finally {
        this.isExporting = false;
      }
    },

    async exportCurrentView() {
      return await this.exportStudents({
        grade: this.filters.grade || undefined,
        search: this.filters.search,
        isActive: this.filters.isActive || undefined,
      });
    },

    async exportAllStudents() {
      return await this.exportStudents({});
    },

    async exportSingleStudent(studentId: string | number) {
      try {
        this.isExporting = true;
        this.exportError = null;

        const result = await exportService.exportSingleUser(studentId);

        if (!result.success) {
          this.exportError = result.message;
        }

        return result;
      } catch (err: any) {
        this.exportError = "An unexpected error occurred during export";
        return { success: false, message: this.exportError };
      } finally {
        this.isExporting = false;
      }
    },

    // Update activities filters and refetch
    async updateActivitiesFilter(
      studentId: number | string,
      newFilters: Partial<typeof this.activitiesFilters>
    ) {
      this.activitiesFilters = {
        ...this.activitiesFilters,
        ...newFilters,
        page: newFilters.page || 1, // Reset page unless specifically provided
      };
      await this.fetchStudentActivities(studentId);
    },

    // Change activities page
    async changeActivitiesPage(studentId: number | string, page: number) {
      this.activitiesFilters.page = page;
      await this.fetchStudentActivities(studentId);
    },

    // Clear activities filters
    async clearActivitiesFilters(studentId: number | string) {
      this.activitiesFilters = {
        page: 1,
        limit: 20,
        type: null,
        subject: null,
        startDate: null,
      };
      await this.fetchStudentActivities(studentId);
    },

    updateFilter(newFilters: Partial<typeof this.filters>) {
      this.filters = { ...this.filters, ...newFilters, page: 1 }; // Reset page
      this.fetchStudents();
    },

    updateSort(sort: { field: string; direction: "asc" | "desc" }) {
      this.filters.sort =
        sort.direction === "desc" ? `-${sort.field}` : sort.field;
      this.filters.page = 1;
      this.fetchStudents();
    },

    changePage(page: number) {
      this.filters.page = page;
      this.fetchStudents();
    },

    clearFilters() {
      this.filters = {
        page: 1,
        limit: 10,
        search: "",
        grade: null,
        role: "student",
        isActive: null,
        sort: "name",
      };
      this.fetchStudents();
    },

    // Clear selected student data
    clearSelectedStudent() {
      this.selectedStudent = null;
      this.studentActivities = [];
      this.studentError = null;
      this.activitiesTotal = 0;
      // Reset activities filters
      this.activitiesFilters = {
        page: 1,
        limit: 20,
        type: null,
        subject: null,
        startDate: null,
      };
    },

    // Clear export error
    clearExportError() {
      this.exportError = null;
    },
  },
});
