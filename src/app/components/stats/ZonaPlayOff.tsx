import { Trophy } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { TablaPosiciones } from '../posiciones/TablaPosiciones';
import { useZonaStore } from '@/app/stores/zonaStore';
import { PosicionTabla } from '@/app/types/categoria';
import { Zona, FormatoPosicion } from '@/app/types/zonas';
import PlayoffBracket from '../playoff/PlayoffBracket';
import TablaPosicionesSkeleton from '../skeletons/TablePosicionesSkeleton';
import { zonasService } from '@/app/services/zonas.services';

interface ZonasPlayoffProps {
    zonasPlayoff: Zona[];
    zonasTodosContraTodos: Zona[]
    id_categoria_edicion: number;
    posiciones?: PosicionTabla[];
    isLoading: boolean;
}


const ZonasPlayoff = ({ zonasPlayoff, zonasTodosContraTodos, posiciones, isLoading }: ZonasPlayoffProps) => {
    const [tipoVistaActiva, setTipoVistaActiva] = useState<'todos_contra_todos' | 'playoff'>('todos_contra_todos');
    const [etapaPlayoffActiva, setEtapaPlayoffActiva] = useState<number>(0);
    const { zonaSeleccionada, setZonaSeleccionada } = useZonaStore();


    // Obtener etapas únicas de playoffs
    const etapasPlayoff = Array.from(
        new Map(zonasPlayoff.map(z => [z.etapa.id_etapa, z.etapa])).values()
    );

    // Establecer etapa de playoff activa inicial
    React.useEffect(() => {
        if (etapasPlayoff.length > 0 && etapaPlayoffActiva === 0) {
            setEtapaPlayoffActiva(etapasPlayoff[0].id_etapa);
        }
    }, [etapasPlayoff, etapaPlayoffActiva]);

    // Filtrar zonas de playoff por etapa activa
    const zonasPlayoffEtapaActiva = zonasPlayoff.filter(z => z.etapa.id_etapa === etapaPlayoffActiva);

    // Inicializar zona seleccionada
    React.useEffect(() => {
        if (zonasTodosContraTodos.length > 0 && zonaSeleccionada === 0) {
            setZonaSeleccionada(zonasTodosContraTodos[0].id_zona);
        }
    }, [zonasTodosContraTodos, zonaSeleccionada, setZonaSeleccionada]);

    // Determinar vista inicial
    React.useEffect(() => {
        if (zonasTodosContraTodos.length > 0) {
            setTipoVistaActiva('todos_contra_todos');
        } else if (zonasPlayoff.length > 0) {
            setTipoVistaActiva('playoff');
        }
    }, [zonasTodosContraTodos.length, zonasPlayoff.length]);

    // Determinar si mostrar tabs principales
    const mostrarTabsPrincipales = zonasTodosContraTodos.length > 0 && zonasPlayoff.length > 0;

    // Determinar si mostrar selector de zonas
    const mostrarSelectorZonas = tipoVistaActiva === 'todos_contra_todos' && zonasTodosContraTodos.length > 1;

    // Determinar si mostrar selector de etapas (solo en playoff)
    const mostrarSelectorEtapas = tipoVistaActiva === 'playoff' && etapasPlayoff.length > 1;

    // Obtener zona actual
    const zonaActual = zonasTodosContraTodos.find(z => z.id_zona === zonaSeleccionada);
    
    // Estado para formatos de posición
    const [formatosPosicion, setFormatosPosicion] = useState<FormatoPosicion[]>([]);
    
    // Obtener formatos de posición de la zona actual
    useEffect(() => {
        const obtenerFormatos = async () => {
            // Primero intentar obtener de la zona actual si ya los tiene
            if (zonaActual?.formatosPosiciones && zonaActual.formatosPosiciones.length > 0) {
                setFormatosPosicion(zonaActual.formatosPosiciones);
                return;
            }
            
            // Si no los tiene, obtenerlos del servicio
            if (zonaSeleccionada && zonaSeleccionada > 0) {
                try {
                    const formatos = await zonasService.obtenerFormatosPosicion(zonaSeleccionada);
                    setFormatosPosicion(formatos || []);
                } catch (error) {
                    console.error('Error al obtener formatos de posición:', error);
                    setFormatosPosicion([]);
                }
            } else {
                setFormatosPosicion([]);
            }
        };
        
        obtenerFormatos();
    }, [zonaSeleccionada, zonaActual]);

    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-[var(--gray-300)]">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <h3 className="text-[var(--white)] font-semibold text-lg flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-[var(--color-primary)]" />
                        {tipoVistaActiva === 'todos_contra_todos' ? 'Tabla de posiciones' : 'Playoffs'}
                    </h3>

                    {/* Tabs principales: Fase de Grupos / Playoff */}
                    {mostrarTabsPrincipales && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTipoVistaActiva('todos_contra_todos')}
                                className={`
                                    px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                                    ${tipoVistaActiva === 'todos_contra_todos'
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-[var(--gray-300)] text-[var(--gray-100)] hover:bg-[var(--gray-200)]'
                                    }
                                `}
                            >
                                Fase de Grupos
                            </button>
                            <button
                                onClick={() => setTipoVistaActiva('playoff')}
                                className={`
                                    px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                                    ${tipoVistaActiva === 'playoff'
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-[var(--gray-300)] text-[var(--gray-100)] hover:bg-[var(--gray-200)]'
                                    }
                                `}
                            >
                                Playoffs
                            </button>
                        </div>
                    )}
                </div>

                {/* Selector de zonas (cuando hay múltiples zonas de todos contra todos) */}
                {mostrarSelectorZonas && (
                    <div className="mt-4">
                        <select
                            value={zonaSeleccionada}
                            onChange={(e) => setZonaSeleccionada(Number(e.target.value))}
                            className="w-full px-4 py-2 bg-[var(--gray-300)] text-[var(--white)] rounded-lg border border-[var(--gray-200)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                        >
                            {zonasTodosContraTodos.map((zona) => (
                                <option key={zona.id_zona} value={zona.id_zona}>
                                    {zona.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Selector de etapas (solo cuando es playoff y hay múltiples etapas) */}
                {mostrarSelectorEtapas && (
                    <div className="mt-4 flex gap-2">
                        {etapasPlayoff.map((etapa) => (
                            <button
                                key={etapa.id_etapa}
                                onClick={() => setEtapaPlayoffActiva(etapa.id_etapa)}
                                className={`
                                    px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200
                                    ${etapaPlayoffActiva === etapa.id_etapa
                                        ? 'bg-[var(--color-primary)] text-white'
                                        : 'bg-[var(--gray-300)] text-[var(--gray-100)] hover:bg-[var(--gray-200)]'
                                    }
                                `}
                            >
                                {etapa.nombre}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div>
                {tipoVistaActiva === 'todos_contra_todos' ? (
                    // Vista de Todos contra Todos
                    isLoading ? (
                        <TablaPosicionesSkeleton />
                    ) : posiciones && Array.isArray(posiciones) && posiciones.length > 0 ? (
                        <TablaPosiciones 
                          variant="simple"
                          posiciones={posiciones
                            ?.sort((a, b) => a.posicion - b.posicion)
                            ?.map(pos => ({
                            id_equipo: pos.equipo.id_equipo,
                            nombre_equipo: pos.equipo.nombre,
                            img_equipo: pos.equipo.img || undefined,
                            partidos_jugados: pos.partidos_jugados,
                            ganados: pos.ganados,
                            empatados: pos.empatados,
                            perdidos: pos.perdidos,
                            goles_favor: pos.goles_favor,
                            goles_contra: pos.goles_contra,
                            diferencia_goles: pos.diferencia_goles,
                            puntos: pos.puntos,
                            puntos_descontados: pos.puntos_descontados,
                            puntos_finales: pos.puntos_finales ?? pos.puntos,
                            apercibimientos: pos.apercibimientos,
                            ultima_actualizacion: pos.ultima_actualizacion,
                            puntos_live: pos.puntos_live,
                            goles_favor_live: pos.goles_favor_live,
                            goles_contra_live: pos.goles_contra_live,
                            diferencia_goles_live: pos.diferencia_goles_live,
                            puntos_finales_live: pos.puntos_finales_live,
                            partidos_jugados_live: pos.partidos_jugados_live,
                            partidos_ganados_live: pos.partidos_ganados_live,
                            partidos_empatados_live: pos.partidos_empatados_live,
                            partidos_perdidos_live: pos.partidos_perdidos_live,
                            en_vivo: pos.en_vivo
                          })) || []}
                          formatosPosicion={formatosPosicion}
                        />
                    ) : (
                        <div className="p-8 text-center">
                            <p className="text-[var(--gray-200)] italic">
                                {isLoading ? 'Cargando posiciones...' : 'No hay posiciones disponibles para esta zona'}
                            </p>
                        </div>
                    )
                ) : (
                    // Vista de Playoffs
                    <div className="p-4">
                        <PlayoffBracket zonas={zonasPlayoffEtapaActiva} />
                    </div>
                )}
            </div>

            {/* Sin zonas */}
            {zonasTodosContraTodos.length === 0 && zonasPlayoff.length === 0 && (
                <div className="p-8 text-center">
                    <p className="text-[var(--gray-200)] italic">
                        No hay zonas creadas
                    </p>
                </div>
            )}
        </div>
    );
};

export default ZonasPlayoff;