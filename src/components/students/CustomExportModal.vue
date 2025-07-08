<template>
  <TransitionRoot as="template" :show="true">
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
        <div
          class="fixed inset-0 bg-[#414141a9] bg-opacity-75 transition-opacity"
        />
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
              class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 dark:bg-[#121212]"
            >
              <div>
                <div
                  class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black dark:bg-white"
                >
                  <DocumentArrowDownIcon
                    class="h-6 w-6 text-white dark:text-black"
                  />
                </div>
                <div class="mt-3 text-center sm:mt-5">
                  <DialogTitle
                    as="h3"
                    class="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    Custom Export
                  </DialogTitle>
                  <div class="mt-2">
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      Choose specific filters for your export
                    </p>
                  </div>
                </div>
              </div>

              <div class="mt-6 space-y-4">
                <!-- Role Filter -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Role
                  </label>
                  <select v-model="filters.role" class="input">
                    <option value="">All Roles</option>
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <!-- Grade Filter -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Grade
                  </label>
                  <input
                    v-model.number="filters.grade"
                    type="number"
                    placeholder="Enter grade"
                    class="input"
                  />
                </div>

                <!-- Search Filter -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Search (Name/Email)
                  </label>
                  <input
                    v-model="filters.search"
                    type="text"
                    placeholder="Search students..."
                    class="input"
                  />
                </div>

                <!-- Active Status Filter -->
                <div>
                  <label
                    class="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Account Status
                  </label>
                  <select v-model="filters.isActive" class="input">
                    <option :value="null">All Status</option>
                    <option :value="true">Active</option>
                    <option :value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div
                class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3"
              >
                <button
                  type="button"
                  @click="$emit('close')"
                  class="btn btn-primary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  @click="handleExport"
                  class="btn bg-white text-black"
                >
                  Export
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { DocumentArrowDownIcon } from "@heroicons/vue/24/outline";

const emit = defineEmits(["close", "export"]);

const filters = ref({
  role: "",
  grade: null as number | null,
  search: "",
  isActive: null as boolean | null,
});

const handleExport = () => {
  // Clean up filters - remove empty values
  const cleanFilters = Object.fromEntries(
    Object.entries(filters.value).filter(
      ([_, value]) => value !== null && value !== undefined && value !== ""
    )
  );

  emit("export", cleanFilters);
};
</script>
