<template>
  <TransitionRoot as="template" :show="isOpen">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-white/10 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6"
            >
              <div v-if="oneClassroom">
                <!-- Header -->
                <div class="flex items-center justify-between mb-6">
                  <div class="flex items-center space-x-3">
                    <DialogTitle
                      as="h3"
                      class="text-xl font-semibold leading-6 text-black dark:text-white"
                    >
                      {{ oneClassroom?.name }}
                    </DialogTitle>
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    >
                      Grade {{ oneClassroom?.grade }}
                    </span>
                  </div>
                  <button
                    @click="$emit('close')"
                    class="rounded-md text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                  >
                    <svg
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <!-- Tabs -->
                <div class="mb-6">
                  <nav class="flex space-x-8" aria-label="Tabs">
                    <button
                      @click="activeTab = 'overview'"
                      :class="[
                        activeTab === 'overview'
                          ? '!border-black dark:!border-white text-black dark:text-white'
                          : '!border-transparent text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:!border-neutral-300 dark:hover:!border-neutral-600',
                        'whitespace-nowrap cursor-pointer py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                      ]"
                    >
                      Overview
                    </button>
                    <button
                      v-if="canViewStats"
                      @click="activeTab = 'stats'"
                      :class="[
                        activeTab === 'stats'
                          ? '!border-black dark:!border-white text-black dark:text-white'
                          : '!border-transparent text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:!border-neutral-300 dark:hover:!border-neutral-600',
                        'whitespace-nowrap cursor-pointer py-2 px-1 border-b-2 font-medium text-sm transition-colors',
                      ]"
                    >
                      Statistics
                    </button>
                  </nav>
                </div>

                <!-- Tab Content -->
                <div class="tab-content">
                  <!-- Overview Tab -->
                  <ClassroomOverviewTab
                    v-if="activeTab === 'overview'"
                    :classroom="oneClassroom"
                    :can-manage="canManage"
                    :add-subject-modal="openAddSubjectModal"
                    :remove-subject-modal="openRemoveSubjectModal"
                  />

                  <!-- Statistics Tab -->
                  <ClassroomStatsTab
                    v-if="activeTab === 'stats' && canViewStats"
                    :classroom="classroom"
                  />
                </div>

                <!-- Actions -->
                <div
                  class="flex justify-end space-x-3 pt-6 border-t border-neutral-200 dark:border-white/10"
                >
                  <button
                    @click="$emit('close')"
                    class="px-4 py-2 text-sm font-medium text-black dark:text-white bg-neutral-100 dark:bg-white/10 border border-neutral-300 dark:border-white/10 rounded hover:bg-neutral-200 dark:hover:bg-white/20 transition-colors"
                  >
                    Close
                  </button>

                  <div v-if="canManage" class="flex space-x-3">
                    <button
                      @click="$emit('edit')"
                      class="px-4 py-2 text-sm font-medium text-black dark:text-white bg-neutral-100 dark:bg-white/10 rounded hover:bg-neutral-200 dark:hover:bg-white/20 transition-colors"
                    >
                      Edit Classroom
                    </button>
                    <button
                      @click="$emit('delete')"
                      class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                    >
                      Delete Classroom
                    </button>
                  </div>
                </div>
              </div>

              <!-- Add Subject Modal -->
              <AddSubjectModal
                :is-open="showAddSubjectModal"
                :classroom="classroom"
                @close="closeAddSubjectModal"
                @added="handleSubjectAdded"
              />

              <!-- Remove Subject Modal -->
              <RemoveSubjectModal
                :is-open="showRemoveSubjectModal"
                :classroom="classroom"
                @close="closeRemoveSubjectModal"
                @removed="handleSubjectRemoved"
              />
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import type { Classroom } from "@/types";
import { computed, ref, watch } from "vue";
import { useClassroomStore } from "@/stores/classroomStore";
import AddSubjectModal from "@/components/classrooms/subjects/AddSubjectModal.vue";
import RemoveSubjectModal from "@/components/classrooms/subjects/RemoveSubjectModal.vue";
import { useAuthStore } from "@/stores/auth";
import ClassroomOverviewTab from "@/components/classrooms/ClassroomOverviewTab.vue";
import ClassroomStatsTab from "@/components/classrooms/ClassroomStatsTab.vue";

interface Props {
  isOpen: boolean;
  classroom: Classroom | null;
  canManage: boolean;
}

const props = defineProps<Props>();
const authStore = useAuthStore();
const activeTab = ref<"overview" | "stats">("overview");

const userRole = computed(() => authStore.user?.role);

const canViewStats = computed(
  () => userRole.value === "admin" || userRole.value === "teacher"
);

defineEmits<{
  close: [];
  edit: [];
  delete: [];
}>();
const classroomStore = useClassroomStore();

// Make this reactive by using computed
const oneClassroom = computed(() => classroomStore.currentClassroom);

// Modal state
const showAddSubjectModal = ref(false);
const showRemoveSubjectModal = ref(false);

// Modal handlers
const openAddSubjectModal = () => {
  showAddSubjectModal.value = true;
};

const closeAddSubjectModal = () => {
  showAddSubjectModal.value = false;
};

const openRemoveSubjectModal = () => {
  showRemoveSubjectModal.value = true;
};

const closeRemoveSubjectModal = () => {
  showRemoveSubjectModal.value = false;
};

const handleSubjectAdded = () => {
  closeAddSubjectModal();
  // Optionally emit an event to refresh classroom data
};

const handleSubjectRemoved = () => {
  closeRemoveSubjectModal();
  // Optionally emit an event to refresh classroom data
};

watch(
  () => props.isOpen && props.classroom?.id,
  async (shouldFetch) => {
    if (shouldFetch && props.classroom?.id) {
      await classroomStore.fetchClassroom(props.classroom?.id);
    }
  }
);

// Reset tab when modal opens
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      activeTab.value = "overview";
    }
  }
);
</script>
