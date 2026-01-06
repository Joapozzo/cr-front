import { useAuthStore } from '@/app/stores/authStore';
import { auth } from '../lib/firebase.config';
import { obtenerToken } from '../services/auth.services';

/**
 * Obtiene la URL base del API desde la variable de entorno
 */
export const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!envUrl) {
    throw new Error('NEXT_PUBLIC_API_URL no está definida en las variables de entorno');
  }
  return envUrl;
};

// Exportar alias para uso directo cuando sea necesario
export const getApiUrl = () => getApiBaseUrl();

export interface ApiOptions extends RequestInit {
    timeout?: number;
}

// Mapa para almacenar peticiones en curso y evitar duplicados
const pendingRequests = new Map<string, Promise<any>>();

/**
 * Crea una clave única para una petición basada en endpoint
 * Solo para GET requests, para evitar peticiones duplicadas simultáneas
 */
const createRequestKey = (endpoint: string): string => {
  return `GET:${endpoint}`;
};

/**
 * Obtiene el token de autenticación según el entorno
 * - Servidor: usa cookies de Next.js
 * - Cliente: usa Firebase auth
 */
async function getAuthToken(): Promise<string | null> {
  // Detectar si estamos en servidor
  const isServer = typeof window === 'undefined';
  
  if (isServer) {
    try {
      // En servidor: usar cookies de Next.js
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const token = cookieStore.get('auth-token')?.value;
      return token || null;
    } catch (error) {
      // Si cookies() falla, no estamos en un Server Component
      // Esto puede pasar en algunos contextos, retornar null
      return null;
    }
  } else {
    // En cliente: usar Firebase auth
    let token: string | null = null;
    try {
      if (auth.currentUser) {
        // Obtener token fresco, forzando renovación si está por expirar
        token = await obtenerToken(false); // false = solo renovar si está por expirar
      } else {
        // Si no hay usuario actual, intentar usar el token guardado como fallback
        const { token: storedToken } = useAuthStore.getState();
        token = storedToken;
      }
    } catch (error) {
      console.error('Error al obtener token:', error);
      // Fallback al token guardado si falla obtener uno fresco
      const { token: storedToken } = useAuthStore.getState();
      token = storedToken;
    }
    
    // Si aún no hay token, intentar obtenerlo del store
    if (!token) {
      const { token: storedToken } = useAuthStore.getState();
      token = storedToken;
    }
    
    return token;
  }
}

export const apiFetch = async <T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> => {
  // Para GET requests, usar deduplicación (evitar peticiones simultáneas duplicadas)
  const isGetRequest = !options.method || options.method === 'GET';
  const requestKey = isGetRequest ? createRequestKey(endpoint) : '';
  
  // Si es GET y ya hay una petición en curso con la misma key, reutilizarla
  if (isGetRequest && requestKey && pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey)!;
  }
  
  // Obtener token según el entorno (servidor o cliente)
  const token = await getAuthToken();

  const { timeout = 10000, ...fetchOptions } = options;
  // Obtener la URL dinámicamente en cada request (por si cambió la ubicación)
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}), // ← agrega token
    ...fetchOptions.headers,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Crear la promesa de la petición
  const requestPromise = (async () => {
    try {
      const isServer = typeof window === 'undefined';
      const response = await fetch(url, {
        ...fetchOptions,
        headers: defaultHeaders,
        signal: controller.signal,
        // En servidor: no cachear
        ...(isServer ? { cache: 'no-store' as RequestCache } : {}),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMessage;
        let errorData: any = {};
        try {
          errorData = await response.json();
          errorMessage = errorData.error || errorData.message || `Error ${response.status}`;
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }

        const error = new Error(errorMessage);
        (error as any).status = response.status;
        (error as any).response = { status: response.status, data: errorData };
        throw error;
      }

      return response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }

      throw error;
    } finally {
      // Limpiar la petición del mapa cuando termine (solo para GET)
      if (isGetRequest && requestKey) {
        pendingRequests.delete(requestKey);
      }
    }
  })();

  // Almacenar la petición en el mapa (solo para GET)
  if (isGetRequest && requestKey) {
    pendingRequests.set(requestKey, requestPromise);
  }

  return requestPromise;
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