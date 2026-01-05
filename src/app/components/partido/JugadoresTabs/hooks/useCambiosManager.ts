import { useMemo } from 'react';
import { JugadorPlantel } from '@/app/types/partido';
import { useCambiosPorPartido } from '@/app/hooks/useCambiosJugador';
import { EquipoData, CambioNormalizado, CambiosProp } from '../types';
import { convertirCambiosAIncidencias } from '../utils/incidencias.utils';

interface UseCambiosManagerParams {
    idPartido?: number;
    cambiosProp?: CambiosProp[];
    equipoLocal: EquipoData;
    equipoVisita: EquipoData;
}

export const useCambiosManager = ({
    idPartido,
    cambiosProp,
    equipoLocal,
    equipoVisita
}: UseCambiosManagerParams) => {
    // Si vienen cambios como prop (modo usuario), usarlos directamente
    // Si no, obtenerlos del hook (modo planillero)
    const { data: cambiosData } = useCambiosPorPartido(idPartido || 0, {
        enabled: !!idPartido && !cambiosProp // Solo usar hook si no hay cambios como prop
    });
    
    // Normalizar cambios del backend (formato simplificado) al formato esperado
    const cambiosNormalizados = useMemo<CambioNormalizado[]>(() => {
        if (cambiosProp && cambiosProp.length > 0) {
            return cambiosProp.map(cambio => ({
                id_cambio: cambio.id_cambio,
                id_partido: cambio.id_partido,
                id_jugador_entra: cambio.id_jugador_entra,
                id_jugador_sale: cambio.id_jugador_sale,
                minuto: cambio.minuto,
                tiempo: cambio.tiempo,
                tipo_cambio: cambio.tipo_cambio,
                registrado_por: null,
                registrado_en: '',
                observaciones: null,
                jugadorEntra: cambio.jugadorEntra ? {
                    id_jugador: cambio.jugadorEntra.id_jugador,
                    usuario: {
                        nombre: cambio.jugadorEntra.nombre,
                        apellido: cambio.jugadorEntra.apellido
                    }
                } : null,
                jugadorSale: cambio.jugadorSale ? {
                    id_jugador: cambio.jugadorSale.id_jugador,
                    usuario: {
                        nombre: cambio.jugadorSale.nombre,
                        apellido: cambio.jugadorSale.apellido
                    }
                } : null,
                registrador: null,
                id_equipo: cambio.id_equipo || null
            }));
        }
        // Normalizar cambios del backend a CambioNormalizado
        if (cambiosData?.cambios) {
            return cambiosData.cambios.map(cambio => ({
                id_cambio: cambio.id_cambio,
                id_partido: cambio.id_partido,
                id_jugador_entra: cambio.id_jugador_entra,
                id_jugador_sale: cambio.id_jugador_sale,
                minuto: cambio.minuto,
                tiempo: cambio.tiempo,
                tipo_cambio: cambio.tipo_cambio,
                registrado_por: cambio.registrado_por || null,
                registrado_en: cambio.registrado_en || '',
                observaciones: cambio.observaciones || null,
                jugadorEntra: cambio.jugadorEntra || null,
                jugadorSale: cambio.jugadorSale || null,
                registrador: cambio.registrador || null,
                id_equipo: null // CambioJugador no tiene id_equipo
            }));
        }
        return [];
    }, [cambiosProp, cambiosData?.cambios]);
    
    const cambios = cambiosNormalizados;

    // Convertir cambios a formato IncidenciaPartido
    const incidenciasCambios = useMemo(() => {
        return convertirCambiosAIncidencias(cambios, equipoLocal, equipoVisita);
    }, [cambios, equipoLocal, equipoVisita]);

    // Procesar cambios para calcular minuto_entrada y minuto_salida de cada jugador
    const jugadoresConCambios = useMemo(() => {
        if (!cambios || cambios.length === 0) {
            return {
                local: equipoLocal.jugadores,
                visita: equipoVisita.jugadores
            };
        }

        // Crear mapas de cambios por jugador
        const cambiosPorJugador = new Map<number, { entrada?: number; salida?: number }>();
        
        cambios.forEach(cambio => {
            if (cambio.tipo_cambio === 'ENTRADA' && cambio.id_jugador_entra) {
                const jugadorId = cambio.id_jugador_entra;
                if (!cambiosPorJugador.has(jugadorId)) {
                    cambiosPorJugador.set(jugadorId, {});
                }
                const cambiosJugador = cambiosPorJugador.get(jugadorId)!;
                if (!cambiosJugador.entrada || cambio.minuto < cambiosJugador.entrada) {
                    cambiosJugador.entrada = cambio.minuto;
                }
            }
            
            if (cambio.tipo_cambio === 'SALIDA' && cambio.id_jugador_sale) {
                const jugadorId = cambio.id_jugador_sale;
                if (!cambiosPorJugador.has(jugadorId)) {
                    cambiosPorJugador.set(jugadorId, {});
                }
                const cambiosJugador = cambiosPorJugador.get(jugadorId)!;
                if (!cambiosJugador.salida || cambio.minuto > cambiosJugador.salida) {
                    cambiosJugador.salida = cambio.minuto;
                }
            }
        });

        // Actualizar jugadores con minuto_entrada y minuto_salida
        const actualizarJugadores = (jugadores: JugadorPlantel[]) => {
            return jugadores.map(jugador => {
                const cambiosJugador = cambiosPorJugador.get(jugador.id_jugador);
                if (cambiosJugador) {
                    const minutoEntrada = cambiosJugador.entrada ?? jugador.minuto_entrada ?? null;
                    const minutoSalida = cambiosJugador.salida ?? jugador.minuto_salida ?? null;
                    
                    // Determinar si está en cancha:
                    // - Si tiene entrada y no tiene salida, está en cancha
                    // - Si no tiene entrada ni salida, mantener el estado original (probablemente titular)
                    const enCancha = minutoEntrada !== null && minutoEntrada !== undefined
                        ? (minutoSalida === null || minutoSalida === undefined)
                        : (jugador.en_cancha ?? false);
                    
                    return {
                        ...jugador,
                        minuto_entrada: minutoEntrada,
                        minuto_salida: minutoSalida,
                        en_cancha: enCancha
                    };
                }
                return jugador;
            });
        };

        return {
            local: actualizarJugadores(equipoLocal.jugadores),
            visita: actualizarJugadores(equipoVisita.jugadores)
        };
    }, [cambios, equipoLocal.jugadores, equipoVisita.jugadores]);

    return {
        cambios,
        incidenciasCambios,
        jugadoresConCambios
    };
};

