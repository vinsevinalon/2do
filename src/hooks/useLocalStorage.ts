import { useState, useEffect, useCallback, useRef } from 'react';

function useDebounce<T>(func: (value: T) => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  return useCallback((value: T) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => func(value), delay);
  }, [func, delay]);
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  debounceDelay: number = 500
): [T, (value: T | ((val: T) => T)) => void, boolean, string | null] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial value from localStorage
  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsedValue = JSON.parse(item);
        // Convert dueDate strings back to Date objects for tasks
        if (Array.isArray(parsedValue)) {
          const convertedValue = parsedValue.map((task: { dueDate?: string | Date }) => ({
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          }));
          setStoredValue(convertedValue as T);
        } else {
          setStoredValue(parsedValue);
        }
      }
      setError(null);
    } catch (error) {
      console.error(`Error loading from localStorage key "${key}":`, error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  // Debounced save function
  const debouncedSave = useDebounce((valueToSave: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(valueToSave));
      setError(null);
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, debounceDelay);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // Save to localStorage with debouncing
      debouncedSave(valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
      setError(error instanceof Error ? error.message : 'Unknown error');
    }
  }, [key, storedValue, debouncedSave]);

  return [storedValue, setValue, isLoading, error];
}