import { useEffect, useCallback } from "react";

// Custom hook to manage localStorage
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [() => T | null, (newValue: T | null) => void] {
  // Write to localStorage only if the key doesn't exist already
  useEffect(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue === null && initialValue !== undefined && initialValue !== null) {
      localStorage.setItem(key, JSON.stringify(initialValue));
    }
  }, [key, initialValue]);

  // Getter function for retrieving the stored value
  const getStoredValue = useCallback((): T | null => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? (JSON.parse(storedValue) as T) : null;
  }, [key]);

  // Setter function for updating localStorage
  const updateLocalStorage = useCallback((newValue: T | null): void => {
    if (newValue !== undefined && newValue !== null) {
      localStorage.setItem(key, JSON.stringify(newValue));
    } else {
      localStorage.removeItem(key);
    }
  }, [key]);

  return [getStoredValue, updateLocalStorage];
}

export default useLocalStorage;
