<template>
  <div
    class="bg-white dark:bg-black shadow-lg rounded-lg border border-gray-200 dark:border-gray-800"
  >
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead class="bg-gray-50 dark:bg-[#121212]">
          <tr>
            <th class="px-6 py-3 text-left">
              <input
                type="checkbox"
                :checked="isAllSelected"
                :indeterminate="isIndeterminate"
                @change="toggleSelectAll"
                class="h-4 w-4 text-black focus:ring-black border-gray-400 dark:border-gray-600 rounded dark:bg-[#0d0d0d] dark:text-white"
              />
            </th>
            <th
              v-for="column in columns"
              :key="column.key"
              :class="[
                'px-6 py-3 text-left text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider',
                column.sortable &&
                  'cursor-pointer hover:bg-gray-100 dark:hover:bg-[#0d0d0d] transition-colors',
              ]"
            >
              <div class="flex items-center space-x-1">
                <span>{{ column.label }}</span>
                <ChevronUpDownIcon v-if="column.sortable" class="h-4 w-4" />
              </div>
            </th>
            <th class="relative px-6 py-3">
              <span class="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody
          class="bg-white dark:bg-black divide-y divide-gray-200 dark:divide-gray-800"
        >
          <tr
            v-for="student in studentsStore.students"
            :key="student._id"
            @click="uiStore.openStudentDetail(student._id)"
            class="hover:bg-gray-50 dark:hover:bg-[#121212] cursor-pointer transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap" @click.stop>
              <input
                type="checkbox"
                :checked="uiStore.selectedStudents.has(student._id)"
                @change="uiStore.toggleStudentSelection(student._id)"
                class="h-4 w-4 text-black focus:ring-black border-gray-400 dark:border-gray-600 rounded dark:bg-[#0d0d0d] dark:text-white"
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <img
                    class="h-10 w-10 rounded-full border-2 border-gray-200 dark:border-gray-700"
                    :src="
                      student.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        student.name
                      )}&background=${
                        uiStore.isDarkMode ? '1f2937' : '000000'
                      }&color=${uiStore.isDarkMode ? 'ffffff' : 'ffffff'}`
                    "
                    :alt="student.name"
                  />
                </div>
                <div class="ml-4">
                  <div class="text-sm font-semibold text-black dark:text-white">
                    {{ student.name }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    {{ student.email }}
                  </div>
                </div>
              </div>
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-white"
            >
              Grade {{ student.grade }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-1 mr-2">
                  <div
                    class="w-full bg-gray-300 dark:bg-[#101010] rounded-full h-2"
                  >
                    <div
                      class="h-2 rounded-full transition-all duration-300"
                      :class="getProgressColor(student.overallProgress)"
                      :style="{ width: `${student.overallProgress}%` }"
                    ></div>
                  </div>
                </div>
                <span class="text-sm font-bold text-black dark:text-white">
                  {{ student.overallProgress }}%
                </span>
              </div>
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400"
            >
              {{
                formatDistanceToNow(new Date(student.lastLogin), {
                  addSuffix: true,
                })
              }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border"
                :class="getStatusColor(student.isActive)"
              >
                {{ student.isActive ? "ACTIVE" : "INACTIVE" }}
              </span>
            </td>
            <td
              class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
              @click.stop
            >
              <Menu as="div" class="relative inline-block text-left">
                <MenuButton
                  class="p-2 hover:bg-gray-100 dark:hover:bg-[#0d0d0d] rounded-md transition-colors"
                >
                  <EllipsisVerticalIcon
                    class="h-4 w-4 text-gray-600 dark:text-gray-400"
                  />
                </MenuButton>
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <MenuItems
                    class="absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-black border border-gray-200 dark:border-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <div class="py-1">
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="uiStore.openStudentDetail(student._id)"
                          :class="[
                            active ? 'bg-gray-100 dark:bg-[#121212]' : '',
                            'block w-full px-4 py-2 text-left text-sm font-medium text-black dark:text-white transition-colors',
                          ]"
                        >
                          View details
                        </button>
                      </MenuItem>

                      <!-- Classroom Actions -->
                      <MenuItem v-slot="{ active }">
                        <button
                          @click="openEnrollModal(student)"
                          :class="[
                            active ? 'bg-gray-100 dark:bg-[#121212]' : '',
                            'block w-full px-4 py-2 text-left text-sm font-medium text-black dark:text-white transition-colors',
                          ]"
                        >
                          Enroll in classroom
                        </button>
                      </MenuItem>

                      <MenuItem v-slot="{ active }">
                        <button
                          @click="openUnenrollModal(student)"
                          :class="[
                            active ? 'bg-gray-100 dark:bg-[#121212]' : '',
                            'block w-full px-4 py-2 text-left text-sm font-medium text-black dark:text-white transition-colors',
                          ]"
                        >
                          Unenroll from classroom
                        </button>
                      </MenuItem>

                      <MenuItem v-slot="{ active }">
                        <button
                          :class="[
                            active ? 'bg-gray-100 dark:bg-[#121212]' : '',
                            'block w-full px-4 py-2 text-left text-sm font-medium text-black dark:text-white transition-colors',
                          ]"
                        >
                          Send message
                        </button>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <button
                          :class="[
                            active ? 'bg-gray-100 dark:bg-[#121212]' : '',
                            'block w-full px-4 py-2 text-left text-sm font-medium text-black dark:text-white transition-colors',
                          ]"
                        >
                          Generate report
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Enroll Modal -->
    <EnrollStudentModal
      :is-open="showEnrollModal"
      :student="selectedStudent"
      @close="closeEnrollModal"
      @enrolled="handleEnrollSuccess"
    />

    <!-- Unenroll Modal -->
    <UnenrollStudentModal
      :is-open="showUnenrollModal"
      :student="selectedStudent"
      @close="closeUnenrollModal"
      @unenrolled="handleUnenrollSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
import {
  EllipsisVerticalIcon,
  ChevronUpDownIcon,
} from "@heroicons/vue/24/outline";
import { useStudentsStore } from "@/stores/students";
import { useUIStore } from "@/stores/ui";
import { formatDistanceToNow } from "date-fns";
import EnrollStudentModal from "@/components/classrooms/EnrollStudentModal.vue";
import UnenrollStudentModal from "@/components/classrooms/UnenrollStudentModal.vue";

const studentsStore = useStudentsStore();
const uiStore = useUIStore();

// Modal state
const showEnrollModal = ref(false);
const showUnenrollModal = ref(false);
const selectedStudent = ref(null);

const columns = [
  { key: "name", label: "Student", sortable: true },
  { key: "grade", label: "Grade", sortable: true },
  { key: "overallProgress", label: "Progress", sortable: true },
  { key: "lastActivity", label: "Last Activity", sortable: true },
  { key: "status", label: "Status", sortable: true },
];

const isAllSelected = computed(
  () =>
    studentsStore.students.length > 0 &&
    studentsStore.students.every((s) => uiStore.selectedStudents.has(s._id))
);

const isIndeterminate = computed(
  () => uiStore.selectedStudents.size > 0 && !isAllSelected.value
);

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    uiStore.clearSelection();
  } else {
    uiStore.selectAllStudents(studentsStore.students.map((s) => s._id));
  }
};

// Modal handlers
const openEnrollModal = (student: any) => {
  selectedStudent.value = student;
  showEnrollModal.value = true;
};

const closeEnrollModal = () => {
  showEnrollModal.value = false;
  selectedStudent.value = null;
};

const openUnenrollModal = (student: any) => {
  selectedStudent.value = student;
  showUnenrollModal.value = true;
};

const closeUnenrollModal = () => {
  showUnenrollModal.value = false;
  selectedStudent.value = null;
};

const handleEnrollSuccess = () => {
  closeEnrollModal();
  // Optionally refresh student data or show success message
};

const handleUnenrollSuccess = () => {
  closeUnenrollModal();
  // Optionally refresh student data or show success message
};

const getProgressColor = (progress: number) => {
  if (progress >= 80) return "bg-green-500";
  if (progress >= 60) return "bg-yellow-500";
  return "bg-red-500";
};

const getStatusColor = (isActive: boolean) => {
  return isActive
    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    : "bg-gray-100 text-gray-800 dark:bg-[#101010] dark:text-gray-300";
};
</script>
