export interface CreateClassroomData {
  name: string;
  code: string;
  description: string;
  grade: number;
  academicYear: string;
  teacher?: string;
}

export interface Teacher {
  id: string;
  _id?: string;
  name: string;
  email: string;
}

export interface Classroom {
  id: string;
  _id?: string;
  name: string;
  code: string;
  description: string;
  teacher: Teacher;
  grade: number;
  academicYear: string;
  students?: any[];
  subjects?: any[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

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
  _id?: string;
  title: string;
  description: string;
  type: "homework" | "quiz" | "project" | "exam";
  subject: {
    _id: string;
    name: string;
    code: string;
    averageProgress: number;
    id: string;
  };
  teacher: {
    _id: string;
    name: string;
    email: string;
    overallProgress: number;
    id: string;
  };
  dueDate: Date | string;
  maxScore: number;
  isActive: boolean;
  attachments: any[];
  submissions: any[];
  createdAt: Date | string;
  updatedAt: Date | string;
  __v?: number;
  completionRate: number;
  averageScore: number;
  instructions?: string;
}

export type CreateAssignmentData = {
  title: string;
  description: string;
  type: Assignment["type"];
  subject: string;
  dueDate: string | Date;
  maxScore: number;
  instructions?: string;
};

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
