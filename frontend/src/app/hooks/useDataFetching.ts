import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';

interface FetchOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
  cacheTime?: number; // Cache duration in milliseconds
  debounceTime?: number; // Debounce time in milliseconds
}

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheItem<any>>();

export function useDataFetching<T>({
  url,
  method = 'GET',
  body,
  headers = {},
  cacheTime = 5 * 60 * 1000, // 5 minutes default cache
  debounceTime = 300, // 300ms default debounce
}: FetchOptions) {
  const { data: session } = useSession();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    const cacheKey = `${method}:${url}:${JSON.stringify(body)}`;
    const cachedItem = cache.get(cacheKey);

    // Check cache if it's a GET request
    if (method === 'GET' && cachedItem) {
      const now = Date.now();
      if (now - cachedItem.timestamp < cacheTime) {
        setData(cachedItem.data);
        setLoading(false);
        return;
      }
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(session?.user?.accessToken && {
            Authorization: `Bearer ${session.user.accessToken}`,
          }),
          ...headers,
        },
        ...(body && { body: JSON.stringify(body) }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Cache GET requests
      if (method === 'GET') {
        cache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
        });
      }

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url, method, body, headers, cacheTime, session]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const debouncedFetch = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        fetchData();
      }, debounceTime);
    };

    debouncedFetch();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [fetchData, debounceTime]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
} 