import { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { obtenerToken } from '@/app/services/auth.services';

// Cache global de blobs por URL firmada (exportado para uso compartido)
export const blobCache = new Map<string, string>();

interface UseImagenPrivadaOptions {
    /**
     * Función que retorna una Promise con la URL de la imagen privada
     * O directamente la URL string | null
     */
    urlOrLoader: string | null | (() => Promise<string | null>);
    /**
     * Si es true, solo carga la imagen cuando enabled es true
     */
    enabled?: boolean;
    /**
     * Dependencias adicionales que deben cambiar para recargar la imagen
     * Útil cuando la función loader depende de valores que pueden cambiar
     */
    deps?: React.DependencyList;
    /**
     * Si es true, usa React Query para cachear la URL firmada
     * Útil cuando urlOrLoader es una función que hace un request
     */
    useQueryCache?: boolean;
    /**
     * Query key para React Query (solo si useQueryCache es true)
     * Si no se proporciona, se genera automáticamente
     */
    queryKey?: unknown[];
}

interface UseImagenPrivadaReturn {
    /**
     * URL del blob para usar en componentes Image
     * null si no hay imagen o hubo error
     */
    blobUrl: string | null;
    /**
     * Indica si está cargando la imagen
     */
    isLoading: boolean;
    /**
     * Indica si hubo un error al cargar la imagen
     */
    error: boolean;
}

/**
 * Hook optimizado para cargar y manejar imágenes privadas (URLs firmadas)
 * 
 * Optimizaciones:
 * - Cachea URLs firmadas con React Query (evita requests repetidos)
 * - Cachea blobs en memoria (evita descargar la misma imagen varias veces)
 * - Reutiliza blob URLs existentes
 * 
 * Detecta automáticamente si la URL es firmada (contiene /api/images/secure)
 * y hace fetch con autenticación para convertirla a blob URL.
 * 
 * @example
 * // Con función loader y cache
 * const { blobUrl, isLoading, error } = useImagenPrivada({
 *   urlOrLoader: () => jugadoresLegajosService.obtenerSelfiePrivada(idJugador),
 *   enabled: isOpen,
 *   useQueryCache: true,
 *   queryKey: ['selfie-privada', idJugador]
 * });
 * 
 * @example
 * // Con URL directa
 * const { blobUrl, isLoading, error } = useImagenPrivada({
 *   urlOrLoader: selfieUrl,
 *   enabled: !!selfieUrl
 * });
 */
export const useImagenPrivada = ({
    urlOrLoader,
    enabled = true,
    deps = [],
    useQueryCache = false,
    queryKey,
}: UseImagenPrivadaOptions): UseImagenPrivadaReturn => {
    const [blobUrl, setBlobUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const objectUrlRef = useRef<string | null>(null);
    const loaderRef = useRef(urlOrLoader);
    const lastUrlRef = useRef<string | null>(null);

    // Generar query key automático si no se proporciona
    const autoQueryKey = useMemo(() => {
        if (!useQueryCache || typeof urlOrLoader !== 'function') return null;
        return ['selfie-privada', ...deps];
    }, [useQueryCache, urlOrLoader, deps]);

    const finalQueryKey = queryKey || autoQueryKey;

    // Usar React Query para cachear la URL firmada si está habilitado
    const { data: cachedUrl, isLoading: isLoadingUrl } = useQuery({
        queryKey: finalQueryKey || ['imagen-privada'],
        queryFn: async () => {
            if (typeof loaderRef.current === 'function') {
                return await loaderRef.current();
            }
            return loaderRef.current;
        },
        enabled: enabled && useQueryCache && typeof urlOrLoader === 'function',
        staleTime: 5 * 60 * 1000, // 5 minutos (las URLs expiran en 1 hora)
        gcTime: 10 * 60 * 1000, // 10 minutos
        refetchOnWindowFocus: false,
        retry: 1,
    });

    // Actualizar la referencia de la función sin causar re-renders
    useEffect(() => {
        loaderRef.current = urlOrLoader;
    }, [urlOrLoader]);

    useEffect(() => {
        // Si no está habilitado, limpiar y salir
        if (!enabled) {
            if (objectUrlRef.current) {
                // No revocar si está en cache
                const cachedBlobUrl = lastUrlRef.current ? blobCache.get(lastUrlRef.current) : null;
                if (cachedBlobUrl !== objectUrlRef.current) {
                    URL.revokeObjectURL(objectUrlRef.current);
                }
                objectUrlRef.current = null;
            }
            setBlobUrl(null);
            setIsLoading(false);
            setError(false);
            lastUrlRef.current = null;
            return;
        }

        let cancelled = false;

        const loadImage = async () => {
            setIsLoading(true);
            setError(false);

            try {
                // Obtener la URL: usar cache de React Query si está disponible, sino ejecutar loader
                let url: string | null = null;
                
                if (useQueryCache && cachedUrl !== undefined) {
                    url = cachedUrl;
                } else if (isLoadingUrl) {
                    // Esperar a que React Query termine de cargar
                    setIsLoading(true);
                    return;
                } else {
                    // Obtener la URL usando la referencia actual
                    const currentLoader = loaderRef.current;
                    url = typeof currentLoader === 'function' 
                        ? await currentLoader() 
                        : currentLoader;
                }

                if (cancelled) return;

                // Si no hay URL, terminar
                if (!url) {
                    if (objectUrlRef.current) {
                        const cachedBlobUrl = lastUrlRef.current ? blobCache.get(lastUrlRef.current) : null;
                        if (cachedBlobUrl !== objectUrlRef.current) {
                            URL.revokeObjectURL(objectUrlRef.current);
                        }
                        objectUrlRef.current = null;
                    }
                    setBlobUrl(null);
                    setIsLoading(false);
                    lastUrlRef.current = null;
                    return;
                }

                // Si la URL no cambió y ya tenemos el blob, usar el cacheado
                if (lastUrlRef.current === url) {
                    const cachedBlobUrl = blobCache.get(url);
                    if (cachedBlobUrl && objectUrlRef.current === cachedBlobUrl) {
                        setIsLoading(false);
                        return;
                    }
                }

                // Si la URL cambió, limpiar el blob anterior (solo si no está en cache)
                if (lastUrlRef.current !== url && objectUrlRef.current) {
                    const cachedBlobUrl = lastUrlRef.current ? blobCache.get(lastUrlRef.current) : null;
                    if (cachedBlobUrl !== objectUrlRef.current) {
                        URL.revokeObjectURL(objectUrlRef.current);
                    }
                    objectUrlRef.current = null;
                }

                lastUrlRef.current = url;

                // Verificar si ya tenemos este blob en cache
                const cachedBlobUrl = blobCache.get(url);
                if (cachedBlobUrl) {
                    objectUrlRef.current = cachedBlobUrl;
                    setBlobUrl(cachedBlobUrl);
                    setIsLoading(false);
                    return;
                }

                // Detectar si es una URL firmada (requiere autenticación)
                const isSecureUrl = url.includes('/api/images/secure');

                if (isSecureUrl) {
                    // Para URLs firmadas, hacer fetch con token
                    try {
                        const token = await obtenerToken();
                        if (!token) {
                            if (!cancelled) {
                                setError(true);
                                setIsLoading(false);
                            }
                            return;
                        }

                        if (cancelled) return;

                        const response = await fetch(url, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                            },
                        });

                        if (cancelled) return;

                        if (!response.ok) {
                            if (!cancelled) {
                                setError(true);
                                setIsLoading(false);
                            }
                            return;
                        }

                        const blob = await response.blob();
                        
                        if (cancelled) {
                            URL.revokeObjectURL(URL.createObjectURL(blob));
                            return;
                        }

                        // Crear blob URL y cachearlo
                        const objectUrl = URL.createObjectURL(blob);
                        blobCache.set(url, objectUrl);
                        objectUrlRef.current = objectUrl;
                        setBlobUrl(objectUrl);
                        setIsLoading(false);
                    } catch (err) {
                        console.error('Error al cargar imagen segura:', err);
                        if (!cancelled) {
                            setError(true);
                            setIsLoading(false);
                        }
                    }
                } else {
                    // Para URLs públicas, usar directamente y cachear
                    if (!cancelled) {
                        blobCache.set(url, url);
                        setBlobUrl(url);
                        setIsLoading(false);
                    }
                }
            } catch (err) {
                console.error('Error al obtener URL de imagen privada:', err);
                if (!cancelled) {
                    setError(true);
                    setIsLoading(false);
                }
            }
        };

        loadImage();

        // Cleanup: revocar blob URL cuando cambie la dependencia o se desmonte
        return () => {
            cancelled = true;
            // No revocar si está en cache global
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enabled, ...deps, cachedUrl, isLoadingUrl, useQueryCache]);

    // Cleanup final al desmontar (solo si no está en cache)
    useEffect(() => {
        return () => {
            if (objectUrlRef.current) {
                const cachedBlobUrl = lastUrlRef.current ? blobCache.get(lastUrlRef.current) : null;
                if (cachedBlobUrl !== objectUrlRef.current) {
                    URL.revokeObjectURL(objectUrlRef.current);
                }
            }
        };
    }, []);

    return {
        blobUrl,
        isLoading: isLoading || isLoadingUrl,
        error,
    };
};

