<template>
  <Modal
    :is-open="isOpen"
    @close="$emit('close')"
    :title="subject?.name || 'Subject Details'"
    size="large"
  >
    <div v-if="subject" class="space-y-6">
      <!-- Subject Info -->
      <div class="bg-[#121212] rounded-lg p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-400">
              Subject Code
            </h3>
            <p class="mt-1 text-sm text-black dark:text-white">
              {{ subject.code || "N/A" }}
            </p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-400">
              Teacher
            </h3>
            <p class="mt-1 text-sm text-black dark:text-white">
              {{ subject.teacher.name }}
            </p>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-400">
              Status
            </h3>
            <span
              :class="[
                'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                subject.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800',
              ]"
            >
              {{ subject.isActive ? "Active" : "Inactive" }}
            </span>
          </div>
          <div>
            <h3 class="text-sm font-medium text-gray-700 dark:text-gray-400">
              Total Students
            </h3>
            <p class="mt-1 text-sm text-black dark:text-white">
              {{ subject.students.length }}
            </p>
          </div>
        </div>

        <div v-if="subject.description" class="mt-4">
          <h3 class="text-sm font-medium text-gray-700 dark:text-gray-400">
            Description
          </h3>
          <p class="mt-1 text-sm text-black dark:text-white">
            {{ subject.description }}
          </p>
        </div>
      </div>

      <!-- Students List -->
      <div v-if="canManageStudents">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-black dark:text-white">
            Enrolled Students
          </h3>
          <button
            @click="openEnrollModal"
            class="bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800 transition-colors"
          >
            Enroll Student
          </button>
        </div>

        <div
          v-if="subject.students.length > 0"
          class="bg-[#121212] border border-gray-200 rounded-lg overflow-hidden"
        >
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50 dark:bg-[#090909]">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Student
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Progress
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Grade
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Engagement
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Time Spent
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Last Accessed
                  </th>
                  <th
                    class="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                class="bg-white dark:bg-[#121212] divide-y divide-gray-200"
              >
                <tr
                  v-for="student in subject.students"
                  :key="student.student._id"
                  class="hover:bg-[#2a2a2a]"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-white"
                  >
                    {{ student.student.name }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-400"
                  >
                    <div class="flex items-center">
                      <div class="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div
                          class="bg-black h-2 rounded-full"
                          :style="{ width: `${student.progress}%` }"
                        ></div>
                      </div>
                      <span>{{ student.progress }}%</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      :class="[
                        'inline-flex px-2 py-1 text-xs font-medium rounded-full',
                        getGradeColor(String(student?.grade)),
                      ]"
                    >
                      {{ student.grade }}
                    </span>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-400"
                  >
                    {{ student.engagementScore }}/100
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-400"
                  >
                    {{ formatTime(student.timeSpent) }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-400"
                  >
                    {{ formatDate(student.lastAccessed) }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                  >
                    <div class="flex justify-end space-x-2">
                      <button
                        @click="$emit('update-progress', subject, student)"
                        class="text-black hover:text-gray-700"
                        title="Update Progress"
                      >
                        <svg
                          class="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        @click="handleUnenrollStudent(student.student._id)"
                        class="text-red-600 hover:text-red-800"
                        title="Unenroll Student"
                      >
                        <svg
                          class="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div v-else class="text-center py-8 bg-[#121212] rounded-lg">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 class="mt-2 text-sm font-medium text-black dark:text-white">
            No students enrolled
          </h3>
          <p class="mt-1 text-sm text-gray-700 dark:text-gray-400">
            Get started by enrolling the first student.
          </p>
        </div>
      </div>

      <!-- Student View (for students) -->
      <div v-else-if="userRole === 'student' && studentData">
        <h3 class="text-lg font-medium text-black dark:text-white mb-4">
          Your Progress
        </h3>
        <div class="bg-[#121212] rounded-lg p-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-black">
                {{ studentData.progress }}%
              </div>
              <div class="text-sm text-gray-700 dark:text-gray-400">
                Progress
              </div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-black">
                {{ studentData.grade }}
              </div>
              <div class="text-sm text-gray-700 dark:text-gray-400">Grade</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-black">
                {{ studentData.engagementScore }}
              </div>
              <div class="text-sm text-gray-700 dark:text-gray-400">
                Engagement
              </div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-black">
                {{ formatTime(studentData.timeSpent) }}
              </div>
              <div class="text-sm text-gray-700 dark:text-gray-400">
                Time Spent
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Actions -->
    <template #footer>
      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSubjectStore, type SubjectProp } from "@/stores/subjectStore";
import { useAuthStore } from "@/stores/auth.ts";
import Modal from "@/components/common/Modal.vue";

interface Props {
  isOpen: boolean;
  subject: SubjectProp | null;
  userRole: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  "enroll-student": [subject: SubjectProp];
  "update-progress": [subject: SubjectProp, student: any];
}>();

const subjectStore = useSubjectStore();
const authStore = useAuthStore();

console.log("userRole", props.userRole);
console.log("subject", props.subject);
console.log("user", authStore.user);

const canManageStudents = computed(
  () =>
    props.userRole === "admin" ||
    (props.userRole === "teacher" &&
      props.subject?.teacher._id === authStore.user?._id)
);

const studentData = computed(() => {
  if (props.userRole !== "student" || !props.subject) return null;
  return props.subject.students.find((s) => s.student === authStore.user?.id);
});

const getGradeColor = (grade: string) => {
  const colors = {
    "A+": "bg-green-100 text-green-800",
    A: "bg-green-100 text-green-800",
    "B+": "bg-blue-100 text-blue-800",
    B: "bg-blue-100 text-blue-800",
    "C+": "bg-yellow-100 text-yellow-800",
    C: "bg-yellow-100 text-yellow-800",
    "D+": "bg-orange-100 text-orange-800",
    D: "bg-orange-100 text-orange-800",
    F: "bg-red-100 text-red-800",
  };
  return colors[grade as keyof typeof colors] || "bg-gray-100 text-gray-800";
};

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const formatDate = (timestamp: string | number | Date) => {
  return new Date(timestamp).toLocaleDateString();
};

const openEnrollModal = () => {
  emit("enroll-student", props?.subject as SubjectProp);
};

const handleUnenrollStudent = async (studentId: string) => {
  if (!props.subject) return;

  if (confirm("Are you sure you want to unenroll this student?")) {
    try {
      await subjectStore.unenrollStudentFromSubject(
        props.subject.id,
        studentId
      );
      // Refresh subject data
      await subjectStore.fetchSubject(props.subject.id);
    } catch (error) {
      console.error("Failed to unenroll student:", error);
    }
  }
};
</script>
