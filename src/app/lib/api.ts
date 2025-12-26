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

export const apiFetch = async <T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> => {
  // Obtener token fresco de Firebase (siempre actualizado)
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

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: defaultHeaders,
      signal: controller.signal,
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

    // Detectar error de certificado SSL o Mixed Content
    // El error puede venir como TypeError con "Failed to fetch" o como un error de red
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorString = String(error);
    
    // Detectar Mixed Content (página HTTPS intentando cargar HTTP)
    const isMixedContent = 
      errorMessage.includes('Mixed Content') ||
      errorString.includes('Mixed Content') ||
      (errorMessage.includes('insecure resource') && url.startsWith('http://'));
    
    if (isMixedContent) {
      console.error('Error de Mixed Content detectado. URL:', url);
      throw new Error('Error de Mixed Content: La página está en HTTPS pero intenta cargar recursos HTTP. Asegúrate de que NEXT_PUBLIC_API_URL use HTTPS cuando el frontend esté en HTTPS.');
    }
    
    // Detectar diferentes formas de error SSL
    const isSSLError = 
      errorMessage.includes('ERR_CERT_AUTHORITY_INVALID') ||
      errorMessage.includes('ERR_CERT_INVALID') ||
      errorMessage.includes('ERR_SSL_PROTOCOL_ERROR') ||
      errorString.includes('ERR_CERT_AUTHORITY_INVALID') ||
      errorString.includes('ERR_CERT_INVALID') ||
      errorString.includes('ERR_SSL_PROTOCOL_ERROR') ||
      (errorMessage.includes('Failed to fetch') && url.startsWith('https://') && !url.includes('localhost'));

    if (isSSLError) {
      console.error('Error de certificado SSL detectado. URL:', url);
      throw new Error('Error de certificado SSL. Acepta el certificado en tu navegador o verifica que el certificado del backend sea válido.');
    }

    // Re-lanzar el error original si no es un error de SSL
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