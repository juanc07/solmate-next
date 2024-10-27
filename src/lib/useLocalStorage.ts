import { useEffect, useCallback } from "react";

// Custom hook to manage localStorage
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [() => T, (newValue: T | null) => void] {
  // Write to localStorage only if the key doesn't exist already
  useEffect(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null) {
      const valueToStore =
        typeof initialValue === "string" ? initialValue : JSON.stringify(initialValue);
      localStorage.setItem(key, valueToStore);
    }
  }, [key, initialValue]);

  // Getter function for retrieving the stored value
  const getStoredValue = useCallback((): T => {
    const storedValue = localStorage.getItem(key);

    // Try parsing JSON, but return raw value if parsing fails
    try {
      return storedValue !== null ? (JSON.parse(storedValue) as T) : initialValue;
    } catch {
      return storedValue as T;
    }
  }, [key, initialValue]);

  // Setter function for updating localStorage
  const updateLocalStorage = useCallback((newValue: T | null): void => {
    if (newValue !== null) {
      const valueToStore =
        typeof newValue === "string" ? newValue : JSON.stringify(newValue);
      localStorage.setItem(key, valueToStore);
    } else {
      localStorage.removeItem(key);
    }
  }, [key]);

  return [getStoredValue, updateLocalStorage];
}

export default useLocalStorage;
