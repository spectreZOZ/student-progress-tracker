import type { ApiResponse } from "@/types";
import { ref } from "vue";

export function useApi() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const execute = async <T>(
    apiCall: () => Promise<T>,
    options: {
      showLoading?: boolean;
      onSuccess?: (data: T) => void;
      onError?: (error: string) => void;
    } = {}
  ): Promise<ApiResponse<T>> => {
    const { showLoading = true, onSuccess, onError } = options;

    if (showLoading) isLoading.value = true;
    error.value = null;

    try {
      const data = await apiCall();

      if (onSuccess) onSuccess(data);

      return {
        data,
        success: true,
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      error.value = errorMessage;

      if (onError) onError(errorMessage);

      return {
        data: {} as T,
        success: false,
        message: errorMessage,
      };
    } finally {
      if (showLoading) isLoading.value = false;
    }
  };

  return {
    isLoading,
    error,
    execute,
  };
}
