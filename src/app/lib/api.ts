import { useAuthStore } from '@/app/stores/authStore';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ApiOptions extends RequestInit {
    timeout?: number;
}

export const apiFetch = async <T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> => {
  const { token } = useAuthStore.getState(); // ✅ Acceso directo al estado de zustand

  const { timeout = 10000, ...fetchOptions } = options;
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}), // ← agrega token
    ...fetchOptions.headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: defaultHeaders,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || `Error ${response.status}`;
      } catch {
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }

      throw new Error(errorMessage);
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }

    throw error;
  }
};


export const api = {
    get: <T>(endpoint: string, options?: ApiOptions) =>
        apiFetch<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, data?: any, options?: ApiOptions) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
        }),

    put: <T>(endpoint: string, data?: any, options?: ApiOptions) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
        }),

    delete: <T>(endpoint: string, options?: ApiOptions) =>
        apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),

    patch: <T>(endpoint: string, data?: any, options?: ApiOptions) =>
        apiFetch<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: data ? JSON.stringify(data) : undefined,
        }),
};