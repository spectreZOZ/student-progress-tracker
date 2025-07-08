// src/services/activitiesService.ts

import api from "@/api/axios";

// Types for activities
export interface Activity {
  id: string;
  type: string;
  description?: string;
  action?: string;
  subject?: string;
  studentId: string;
  userId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
}

export interface ActivityFilters {
  page?: number;
  limit?: number;
  type?: string | null;
  subject?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  studentId?: string;
  search?: string;
}

export interface ActivityStats {
  totalActivities: number;
  activitiesByType: Record<string, number>;
  activitiesBySubject: Record<string, number>;
  dailyActivities: Array<{
    date: string;
    count: number;
  }>;
  topStudents: Array<{
    studentId: string;
    studentName: string;
    activityCount: number;
  }>;
}

export interface CreateActivityData {
  type: string;
  description?: string;
  action?: string;
  subject?: string;
  studentId: string;
  metadata?: Record<string, any>;
}

export interface ActivitiesResponse {
  data: Activity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ActivitiesService {
  /**
   * Get all activities with optional filters
   */
  async getActivities(
    filters?: ActivityFilters
  ): Promise<ApiResponse<ActivitiesResponse>> {
    try {
      // Clean up filters - remove null/undefined values
      const cleanFilters = filters
        ? Object.fromEntries(
            Object.entries(filters).filter(
              ([_, value]) =>
                value !== null && value !== undefined && value !== ""
            )
          )
        : {};

      const response = await api.get("/activities", {
        params: cleanFilters,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error("Error fetching activities:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch activities",
        error: error.message,
      };
    }
  }

  /**
   * Create a new activity log entry
   */
  async createActivity(
    activityData: CreateActivityData
  ): Promise<ApiResponse<Activity>> {
    try {
      const response = await api.post("/activities", activityData);

      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error: any) {
      console.error("Error creating activity:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create activity",
        error: error.message,
      };
    }
  }

  /**
   * Get a specific activity by ID
   */
  async getActivityById(activityId: string): Promise<ApiResponse<Activity>> {
    try {
      const response = await api.get(`/activities/${activityId}`);

      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error: any) {
      console.error("Error fetching activity:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch activity",
        error: error.message,
      };
    }
  }

  /**
   * Delete an activity by ID
   */
  async deleteActivity(activityId: string): Promise<ApiResponse<void>> {
    try {
      await api.delete(`/activities/${activityId}`);

      return {
        success: true,
      };
    } catch (error: any) {
      console.error("Error deleting activity:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to delete activity",
        error: error.message,
      };
    }
  }

  /**
   * Get activities for a specific student
   */
  async getStudentActivities(
    studentId: string,
    filters?: Omit<ActivityFilters, "studentId">
  ): Promise<ApiResponse<ActivitiesResponse>> {
    try {
      // Clean up filters - remove null/undefined values
      const cleanFilters = filters
        ? Object.fromEntries(
            Object.entries(filters).filter(
              ([_, value]) =>
                value !== null && value !== undefined && value !== ""
            )
          )
        : {};

      const response = await api.get(`/activities/student/${studentId}`, {
        params: cleanFilters,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      console.error("Error fetching student activities:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch student activities",
        error: error.message,
      };
    }
  }

  /**
   * Get activity statistics
   */
  async getActivityStats(
    filters?: Pick<
      ActivityFilters,
      "startDate" | "endDate" | "type" | "subject"
    >
  ): Promise<ApiResponse<ActivityStats>> {
    try {
      // Clean up filters - remove null/undefined values
      const cleanFilters = filters
        ? Object.fromEntries(
            Object.entries(filters).filter(
              ([_, value]) =>
                value !== null && value !== undefined && value !== ""
            )
          )
        : {};

      const response = await api.get("/activities/stats", {
        params: cleanFilters,
      });

      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error: any) {
      console.error("Error fetching activity stats:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to fetch activity statistics",
        error: error.message,
      };
    }
  }

  /**
   * Bulk create activities (if your API supports it)
   */
  async createBulkActivities(
    activities: CreateActivityData[]
  ): Promise<ApiResponse<Activity[]>> {
    try {
      const response = await api.post("/activities/bulk", { activities });

      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error: any) {
      console.error("Error creating bulk activities:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to create bulk activities",
        error: error.message,
      };
    }
  }

  /**
   * Get activity types (for dropdowns/filters)
   */
  async getActivityTypes(): Promise<ApiResponse<string[]>> {
    try {
      const response = await api.get("/activities/types");

      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error: any) {
      console.error("Error fetching activity types:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Failed to fetch activity types",
        error: error.message,
      };
    }
  }

  /**
   * Get subjects (for dropdowns/filters)
   */
  async getSubjects(): Promise<ApiResponse<string[]>> {
    try {
      const response = await api.get("/activities/subjects");

      return {
        success: true,
        data: response.data.data || response.data,
      };
    } catch (error: any) {
      console.error("Error fetching subjects:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch subjects",
        error: error.message,
      };
    }
  }
}

// Create and export a singleton instance
const activitiesService = new ActivitiesService();
export default activitiesService;

// Export the class as well for testing or custom instances
export { ActivitiesService };
