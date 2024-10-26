import { useEffect } from 'react';

// Custom hook to manage localStorage
function useLocalStorage<T>(key: string, value: T): [() => T | null, (newValue: T | null) => void] {
  useEffect(() => {
    if (value !== undefined && value !== null) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  // Retrieve data from localStorage
  function getStoredValue(): T | null {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) as T : null;
  }

  // Function to manually update localStorage value
  function updateLocalStorage(newValue: T | null): void {
    if (newValue !== undefined && newValue !== null) {
      localStorage.setItem(key, JSON.stringify(newValue));
    } else {
      localStorage.removeItem(key);
    }
  }

  return [getStoredValue, updateLocalStorage];
}

export default useLocalStorage;
