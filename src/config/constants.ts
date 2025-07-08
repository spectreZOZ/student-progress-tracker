export const APP_NAME = "Student Progress Tracker";
export const VERSION = "1.0.0";

export const API_ENDPOINTS = {
  STUDENTS: "/api/students",
  ACTIVITIES: "/api/activities",
  AUTH: "/api/auth",
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

export const CACHE_DURATION = {
  STUDENTS: 5 * 60 * 1000, // 5 minutes
  ACTIVITIES: 2 * 60 * 1000, // 2 minutes
};

export const THEME = {
  DEFAULT_MODE: "light" as const,
  STORAGE_KEY: "edu-tracker-theme",
};
