import { defineStore } from "pinia";
import { ref } from "vue";

export const useUIStore = defineStore("ui", () => {
  const isDarkMode = ref(false);
  const selectedStudents = ref<Set<string>>(new Set());
  const isStudentDetailOpen = ref(false);
  const selectedStudentId = ref<string | null>(null);
  const viewMode = ref<"table" | "card">("table");

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    document.documentElement.classList.toggle("dark", isDarkMode.value);
    localStorage.setItem("dark-mode", isDarkMode.value.toString());
  };

  const initializeDarkMode = () => {
    const stored = localStorage.getItem("dark-mode");
    if (stored) {
      isDarkMode.value = stored === "true";
      document.documentElement.classList.toggle("dark", isDarkMode.value);
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    if (selectedStudents.value.has(studentId)) {
      selectedStudents.value.delete(studentId);
    } else {
      selectedStudents.value.add(studentId);
    }
  };

  const selectAllStudents = (studentIds: string[]) => {
    selectedStudents.value = new Set(studentIds);
  };

  const clearSelection = () => {
    selectedStudents.value.clear();
  };

  const openStudentDetail = (studentId: string) => {
    selectedStudentId.value = studentId;
    isStudentDetailOpen.value = true;
  };

  const closeStudentDetail = () => {
    isStudentDetailOpen.value = false;
    selectedStudentId.value = null;
  };

  const setViewMode = (mode: "table" | "card") => {
    viewMode.value = mode;
    localStorage.setItem("view-mode", mode);
  };

  return {
    isDarkMode,
    selectedStudents,
    isStudentDetailOpen,
    selectedStudentId,
    viewMode,
    toggleDarkMode,
    initializeDarkMode,
    toggleStudentSelection,
    selectAllStudents,
    clearSelection,
    openStudentDetail,
    closeStudentDetail,
    setViewMode,
  };
});
