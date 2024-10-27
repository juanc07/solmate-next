import { useEffect, useCallback } from "react";

// Custom hook to manage localStorage safely
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [() => T, (newValue: T | null) => void] {
  // Check if we're in the browser environment
  const isBrowser = typeof window !== "undefined";

  // Write to localStorage only if the key doesn't exist already
  useEffect(() => {
    if (!isBrowser) return; // Prevents execution on the server

    const storedValue = localStorage.getItem(key);
    if (storedValue === null) {
      const valueToStore =
        typeof initialValue === "string" ? initialValue : JSON.stringify(initialValue);
      localStorage.setItem(key, valueToStore);
    }
  }, [isBrowser, key, initialValue]);

  // Getter function for retrieving the stored value
  const getStoredValue = useCallback((): T => {
    if (!isBrowser) return initialValue; // Return initial value on the server

    const storedValue = localStorage.getItem(key);

    // Try parsing JSON, return raw value if parsing fails
    try {
      return storedValue !== null ? (JSON.parse(storedValue) as T) : initialValue;
    } catch {
      return storedValue as T;
    }
  }, [isBrowser, key, initialValue]);

  // Setter function for updating localStorage
  const updateLocalStorage = useCallback((newValue: T | null): void => {
    if (!isBrowser) return; // Prevents execution on the server

    if (newValue !== null) {
      const valueToStore =
        typeof newValue === "string" ? newValue : JSON.stringify(newValue);
      localStorage.setItem(key, valueToStore);
    } else {
      localStorage.removeItem(key);
    }
  }, [isBrowser, key]);

  return [getStoredValue, updateLocalStorage];
}

export default useLocalStorage;
