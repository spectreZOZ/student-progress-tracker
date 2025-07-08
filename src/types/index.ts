export interface Student {
  id: string;
  name: string;
  email: string;
  grade: number;
  overallProgress: number;
  lastActivity: Date;
  status: "active" | "inactive" | "at-risk";
  subjects: Subject[];
  avatar?: string;
  enrollmentDate: Date;
}

export interface Subject {
  id: string;
  name: string;
  progress: number;
  grade: string;
  assignments: Assignment[];
  lastAccessed: Date;
  timeSpent: number; // minutes
  engagementScore: number;
}

export interface Assignment {
  id: string;
  title: string;
  type: "homework" | "quiz" | "project" | "exam";
  status: "pending" | "submitted" | "graded" | "overdue";
  dueDate: Date;
  submittedDate?: Date;
  score?: number;
  maxScore: number;
  subject: string;
}

export interface Activity {
  id: string;
  studentId: string;
  type: "login" | "assignment_submit" | "quiz_complete" | "lesson_view";
  description: string;
  timestamp: Date;
  platform: string;
  duration?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "teacher" | "administrator";
  avatar?: string;
  classrooms?: string[];
}

export type Filter = {
  search: string;
  grade: number | null;
  role: string | null;
  isActive: boolean | null;
};

export type SortOption = {
  field: string;
  direction: "asc" | "desc";
};
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
