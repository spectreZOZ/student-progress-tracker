import { Ref, ref, watch } from "vue";

import type { UnwrapRef } from "vue";

export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  serializer: {
    read: (value: string) => T;
    write: (value: T) => string;
  } = {
    read: JSON.parse,
    write: JSON.stringify,
  }
): [Ref<T>, (value: T) => void] {
  const storedValue = localStorage.getItem(key);
  const initialValue =
    storedValue !== null ? serializer.read(storedValue) : defaultValue;

  const state = ref<T>(initialValue);

  const setState = (value: T) => {
    state.value = value;
    localStorage.setItem(key, serializer.write(value));
  };

  watch(
    state,
    (newValue) => {
      localStorage.setItem(key, serializer.write(newValue));
    },
    { deep: true }
  );

  return [state as Ref<T>, setState];
}
