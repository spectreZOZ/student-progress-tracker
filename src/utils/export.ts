import type { Student } from "@/types";

export const exportToCSV = (
  students: Student[],
  filename = "students-export.csv"
) => {
  const headers = [
    "Name",
    "Email",
    "Grade",
    "Overall Progress (%)",
    "Status",
    "Last Activity",
    "Subjects Count",
    "Total Time Spent (min)",
  ];

  const rows = students.map((student) => [
    student.name,
    student.email,
    student.grade.toString(),
    student.overallProgress.toString(),
    student.status,
    student.lastActivity.toISOString(),
    student.subjects.length.toString(),
    student.subjects
      .reduce((total, subject) => total + subject.timeSpent, 0)
      .toString(),
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map((field) => `"${field}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const exportToPDF = async (
  students: Student[],
  filename = "students-report.pdf"
) => {
  // This would typically use a library like jsPDF
  // For demo purposes, we'll show an alert
  alert(
    "PDF export functionality would be implemented here using a library like jsPDF"
  );
};
