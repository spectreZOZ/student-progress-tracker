// src/services/exportService.ts

import api from "@/api/axios";

export interface ExportFilters {
  role?: string;
  grade?: number;
  search?: string;
  isActive?: boolean;
}

export interface ExportResult {
  success: boolean;
  message: string;
}

class ExportService {
  /**
   * Export multiple users/students with filters
   */
  async exportUsers(filters?: ExportFilters): Promise<ExportResult> {
    try {
      // Remove null/undefined values from filters
      const cleanParams = filters
        ? Object.fromEntries(
            Object.entries(filters).filter(
              ([_, value]) =>
                value !== null && value !== undefined && value !== ""
            )
          )
        : {};

      console.log("Exporting users with params:", cleanParams);

      // Make request with responseType 'blob' for file download
      const response = await api.get("/users/export", {
        params: cleanParams,
        responseType: "blob",
      });

      // Handle file download
      await this.handleFileDownload(response, "users_export");

      console.log("Users export completed successfully");
      return {
        success: true,
        message: "Users exported successfully",
      };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to export users data";
      console.error("Error exporting users:", err);
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Export a single user's details
   */
  async exportSingleUser(userId: string | number): Promise<ExportResult> {
    try {
      console.log("Exporting single user:", userId);

      // Make request with responseType 'blob' for file download
      const response = await api.get(`/users/${userId}/export`, {
        responseType: "blob",
      });

      // Handle file download
      await this.handleFileDownload(response, `user_${userId}_export`);

      console.log("Single user export completed successfully");
      return {
        success: true,
        message: "User data exported successfully",
      };
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to export user data";
      console.error("Error exporting single user:", err);
      return {
        success: false,
        message: errorMessage,
      };
    }
  }

  /**
   * Export students only (convenience method)
   */
  async exportStudents(
    filters?: Omit<ExportFilters, "role">
  ): Promise<ExportResult> {
    return await this.exportUsers({
      ...filters,
      role: "student",
    });
  }

  /**
   * Export teachers only (convenience method)
   */
  async exportTeachers(
    filters?: Omit<ExportFilters, "role">
  ): Promise<ExportResult> {
    return await this.exportUsers({
      ...filters,
      role: "teacher",
    });
  }

  /**
   * Export all users without any filters
   */
  async exportAllUsers(): Promise<ExportResult> {
    return await this.exportUsers({});
  }

  /**
   * Handle file download from blob response
   */
  private async handleFileDownload(
    response: any,
    defaultFilename: string
  ): Promise<void> {
    // Create blob URL and trigger download
    const blob = new Blob([response.data], {
      type:
        response.headers["content-type"] ||
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    // Get filename from response headers or use default
    let filename = `${defaultFilename}.xlsx`;
    const contentDisposition = response.headers["content-disposition"];

    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(
        /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      );
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1].replace(/['"]/g, "");
      }
    }

    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();

    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Check if export is supported by the browser
   */
  isExportSupported(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof document !== "undefined" &&
      typeof URL !== "undefined" &&
      typeof Blob !== "undefined"
    );
  }
}

// Export singleton instance
export const exportService = new ExportService();
export default exportService;
