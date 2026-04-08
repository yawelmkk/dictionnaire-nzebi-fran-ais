import { useMemo, useRef, useEffect, useState } from 'react';

/**
 * Custom hook for debounced search with caching
 */
export function useDebouncedSearch<T>(
  items: T[],
  searchTerm: string,
  filterFn: (item: T, term: string) => boolean
) {
  const cacheRef = useRef<Map<string, T[]>>(new Map());

  const results = useMemo(() => {
    // Return cached result if available
    if (cacheRef.current.has(searchTerm)) {
      return cacheRef.current.get(searchTerm) || [];
    }

    // Filter items based on search term
    const filtered = items.filter(item => filterFn(item, searchTerm));
    
    // Cache the result (keep last 10 searches)
    if (cacheRef.current.size > 10) {
      const firstKey = cacheRef.current.keys().next().value as string | undefined;
      if (firstKey) {
        cacheRef.current.delete(firstKey);
      }
    }
    cacheRef.current.set(searchTerm, filtered);
    
    return filtered;
  }, [items, searchTerm, filterFn]);

  return results;
}

/**
 * Hook for tracking search state with debouncing
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
