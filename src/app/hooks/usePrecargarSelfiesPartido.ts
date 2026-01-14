import { useEffect, useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { jugadoresLegajosService } from '@/app/services/legajos/jugadores.service';
import { obtenerToken } from '@/app/services/auth.services';
import { DatosCompletosPlanillero } from '@/app/types/partido';
import { blobCache } from './useImagenPrivada';

/**
 * Hook para precargar todas las selfies privadas de los jugadores del partido
 * Solo para planillero - carga en background cuando se cargan los datos del partido
 * 
 * Optimizaciones:
 * - Precarga URLs firmadas en paralelo usando React Query
 * - Precarga blobs en background para acceso instantáneo
 * - Usa el mismo cache compartido que useImagenPrivada
 */
export const usePrecargarSelfiesPartido = (
    datosPartido?: DatosCompletosPlanillero,
    enabled: boolean = true
) => {
    // Extraer todos los id_jugador únicos del plantel
    const jugadoresIds = useMemo(() => {
        if (!datosPartido) return [];
        
        const ids = new Set<number>();
        
        // Agregar jugadores del plantel local
        datosPartido.plantel_local?.forEach(jugador => {
            if (jugador.id_jugador) {
                ids.add(jugador.id_jugador);
            }
        });
        
        // Agregar jugadores del plantel visita
        datosPartido.plantel_visita?.forEach(jugador => {
            if (jugador.id_jugador) {
                ids.add(jugador.id_jugador);
            }
        });
        
        return Array.from(ids);
    }, [datosPartido]);

    // Precargar URLs firmadas con React Query (en paralelo)
    const queries = useQueries({
        queries: jugadoresIds.map(idJugador => ({
            queryKey: ['selfie-privada', idJugador],
            queryFn: async () => {
                try {
                    return await jugadoresLegajosService.obtenerSelfiePrivada(idJugador);
                } catch (error) {
                    console.error(`Error al precargar selfie del jugador ${idJugador}:`, error);
                    return null;
                }
            },
            enabled: enabled && idJugador > 0,
            staleTime: 5 * 60 * 1000, // 5 minutos
            gcTime: 10 * 60 * 1000, // 10 minutos
            retry: 1,
            refetchOnWindowFocus: false,
        })),
    });

    // Precargar blobs en background (opcional, puede ser pesado)
    useEffect(() => {
        if (!enabled || jugadoresIds.length === 0) return;

        // Precargar blobs solo para URLs firmadas que ya están cacheadas
        const precargarBlobs = async () => {
            const token = await obtenerToken();
            if (!token) return;

            // Esperar un poco para que las queries de URLs terminen
            await new Promise(resolve => setTimeout(resolve, 500));

            // Precargar blobs solo de las URLs que ya tenemos
            queries.forEach((query, index) => {
                const url = query.data;
                const idJugador = jugadoresIds[index];

                if (url && url.includes('/api/images/secure') && !blobCache.has(url)) {
                    // Precargar en background sin bloquear
                    fetch(url, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    })
                        .then(response => {
                            if (response.ok) {
                                return response.blob();
                            }
                            return null;
                        })
                        .then(blob => {
                            if (blob) {
                                const blobUrl = URL.createObjectURL(blob);
                                blobCache.set(url, blobUrl);
                            }
                        })
                        .catch(error => {
                            console.error(`Error al precargar blob del jugador ${idJugador}:`, error);
                        });
                }
            });
        };

        // Precargar blobs después de un delay para no bloquear la UI
        const timeoutId = setTimeout(precargarBlobs, 1000);

        return () => clearTimeout(timeoutId);
    }, [enabled, queries, jugadoresIds]);

    return {
        totalJugadores: jugadoresIds.length,
        precargadas: queries.filter(q => q.isSuccess).length,
        cargando: queries.some(q => q.isLoading),
    };
};

