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
              <div v-if="oneAssignment">
                <!-- Header -->
                <AssignmentModalHeader
                  :assignment="oneAssignment"
                  @close="$emit('close')"
                />

                <!-- Tabs -->
                <AssignmentModalTabs
                  v-model:activeTab="activeTab"
                  :assignment="oneAssignment"
                  :userRole="userRole"
                />

                <!-- Tab Content -->
                <div class="tab-content">
                  <AssignmentOverviewTab
                    v-if="activeTab === 'overview'"
                    :assignment="oneAssignment"
                    :userRole="userRole"
                    :currentUserId="currentUserId"
                    @submit-assignment="handleSubmitAssignment"
                  />

                  <AssignmentSubmissionsTab
                    v-if="activeTab === 'submissions'"
                    :assignment="oneAssignment"
                    :canEditAssignment="canEditAssignment"
                    @grade-submission="$emit('grade-submission', $event)"
                  />
                </div>

                <!-- Actions -->
                <AssignmentModalActions
                  :canEditAssignment="canEditAssignment"
                  :userRole="userRole"
                  @close="$emit('close')"
                  @edit="$emit('edit')"
                  @delete="$emit('delete')"
                />
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import type { Assignment } from "@/types";
import { useAuthStore } from "@/stores/auth";
import { useAssignmentStore } from "@/stores/assignmentStore";

// Import components
import AssignmentModalHeader from "./AssignmentModal/AssignmentModalHeader.vue";
import AssignmentModalTabs from "./AssignmentModal/AssignmentModalTabs.vue";
import AssignmentOverviewTab from "./AssignmentModal/AssignmentOverviewTab.vue";
import AssignmentSubmissionsTab from "./AssignmentModal/AssignmentSubmissionsTab.vue";
import AssignmentModalActions from "./AssignmentModal/AssignmentModalActions.vue";

interface Props {
  isOpen: boolean;
  assignment: Assignment | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  edit: [];
  delete: [];
  "grade-submission": [submission: any];
  submit: []; // Add this emit
}>();

const authStore = useAuthStore();
const assignmentStore = useAssignmentStore();

// Tab state
const activeTab = ref<"overview" | "submissions">("overview");

// Make this reactive by using computed
const oneAssignment = computed(() => assignmentStore.currentAssignment);

const userRole = computed(() => authStore.user?.role);
const currentUserId = computed(() => authStore.user?._id);

// Role-based permissions
const canEditAssignment = computed(() => {
  if (!oneAssignment.value || userRole.value !== "teacher") return false;
  return (
    oneAssignment.value?.teacher?.id === currentUserId.value ||
    oneAssignment.value?.teacher?._id === currentUserId.value
  );
});

// Handle submit assignment
const handleSubmitAssignment = () => {
  emit("submit");
};

// Reset tab when modal opens
watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      activeTab.value = "overview";
    }
  }
);

watch(
  () => props.isOpen && props.assignment?.id,
  async (shouldFetch) => {
    if (shouldFetch && props.assignment?.id) {
      await assignmentStore.fetchAssignment(props.assignment.id);
    }
  }
);
</script>
