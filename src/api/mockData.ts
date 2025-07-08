import type { Activity, Student } from "@/types";

export const mockStudents: Student[] = [
  {
    id: "1",
    name: "Emma Thompson",
    email: "emma.thompson@school.edu",
    grade: 9,
    overallProgress: 87,
    lastActivity: new Date("2024-07-06T14:30:00"),
    status: "active",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    enrollmentDate: new Date("2024-01-15"),
    subjects: [
      {
        id: "s1",
        name: "Mathematics",
        progress: 92,
        grade: "A",
        lastAccessed: new Date("2024-07-06T10:15:00"),
        timeSpent: 245,
        engagementScore: 95,
        assignments: [
          {
            id: "a1",
            title: "Quadratic Equations Quiz",
            type: "quiz",
            status: "graded",
            dueDate: new Date("2024-07-05"),
            submittedDate: new Date("2024-07-04"),
            score: 18,
            maxScore: 20,
            subject: "Mathematics",
          },
        ],
      },
      {
        id: "s2",
        name: "Science",
        progress: 78,
        grade: "B+",
        lastAccessed: new Date("2024-07-05T16:20:00"),
        timeSpent: 180,
        engagementScore: 82,
        assignments: [
          {
            id: "a2",
            title: "Chemistry Lab Report",
            type: "project",
            status: "submitted",
            dueDate: new Date("2024-07-08"),
            submittedDate: new Date("2024-07-06"),
            maxScore: 100,
            subject: "Science",
          },
        ],
      },
    ],
  },
  {
    id: "2",
    name: "Alex Rodriguez",
    email: "alex.rodriguez@school.edu",
    grade: 10,
    overallProgress: 62,
    lastActivity: new Date("2024-07-03T09:45:00"),
    status: "at-risk",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    enrollmentDate: new Date("2024-01-15"),
    subjects: [
      {
        id: "s3",
        name: "Mathematics",
        progress: 55,
        grade: "C",
        lastAccessed: new Date("2024-07-03T09:45:00"),
        timeSpent: 120,
        engagementScore: 65,
        assignments: [
          {
            id: "a3",
            title: "Algebra Homework",
            type: "homework",
            status: "overdue",
            dueDate: new Date("2024-07-02"),
            maxScore: 50,
            subject: "Mathematics",
          },
        ],
      },
    ],
  },
  {
    id: "3",
    name: "Sophia Chen",
    email: "sophia.chen@school.edu",
    grade: 11,
    overallProgress: 94,
    lastActivity: new Date("2024-07-06T16:45:00"),
    status: "active",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    enrollmentDate: new Date("2024-01-15"),
    subjects: [
      {
        id: "s4",
        name: "Mathematics",
        progress: 96,
        grade: "A+",
        lastAccessed: new Date("2024-07-06T16:45:00"),
        timeSpent: 320,
        engagementScore: 98,
        assignments: [
          {
            id: "a4",
            title: "Calculus Project",
            type: "project",
            status: "graded",
            dueDate: new Date("2024-07-01"),
            submittedDate: new Date("2024-06-30"),
            score: 95,
            maxScore: 100,
            subject: "Mathematics",
          },
        ],
      },
    ],
  },
];

export const mockActivities: Activity[] = [
  {
    id: "act1",
    studentId: "1",
    type: "quiz_complete",
    description: "Completed Quadratic Equations Quiz",
    timestamp: new Date("2024-07-06T14:30:00"),
    platform: "MathPlatform",
    duration: 25,
  },
  {
    id: "act2",
    studentId: "1",
    type: "login",
    description: "Logged into Science Lab",
    timestamp: new Date("2024-07-06T10:15:00"),
    platform: "ScienceLab",
  },
  {
    id: "act3",
    studentId: "2",
    type: "login",
    description: "Logged into Math Platform",
    timestamp: new Date("2024-07-03T09:45:00"),
    platform: "MathPlatform",
  },
];
