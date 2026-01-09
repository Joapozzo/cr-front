'use client';

import { useState, useMemo, useEffect } from 'react';
import { HistorialPartidosEquipoResponse, FixtureEquipo, PartidoEquipo as PartidoEquipoLegajo, EquipoInformacionBasica } from '@/app/types/legajos';
import MatchCard from '@/app/components/CardPartidoGenerico';
import { PartidoEquipo, EstadoPartido } from '@/app/types/partido';
import { Pagination } from '@/app/components/legajos/shared/Pagination';
import { FiltrosFixture } from '@/app/components/fixture/FiltrosFixture';
import { ListaPartidos } from '@/app/components/fixture/ListaPartidos';
import { formatearFechaCompleta } from '@/app/utils/fechas';
import { Calendar, History } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface EquipoPartidosTabProps {
    partidos: HistorialPartidosEquipoResponse | undefined;
    fixturesProximos: FixtureEquipo[] | undefined;
    fixturesRecientes: FixtureEquipo[] | undefined;
    isLoading: boolean;
    isLoadingProximos: boolean;
    isLoadingRecientes: boolean;
    categoriaSeleccionada: number | undefined;
    page: number;
    onPageChange: (page: number) => void;
    idEquipo: number;
    equipoInfo?: EquipoInformacionBasica;
}

// Tipo para partido simplificado (usado en ListaPartidos) - compatible con Partido
interface PartidoSimplificado {
    id_partido: number;
    jornada: number;
    dia: string;
    hora: string;
    estado: EstadoPartido;
    goles_local: number | null;
    goles_visita: number | null;
    id_equipolocal: number;
    id_equipovisita: number;
    arbitro: string | null;
    equipoLocal: {
        nombre: string;
        img?: string | null;
    };
    equipoVisita: {
        nombre: string;
        img?: string | null;
    };
    cancha: number;
}

// Tipo interno para MatchCard que extiende PartidoEquipo con expulsiones tipadas correctamente
interface PartidoMatchCard extends Omit<PartidoEquipo, 'incidencias'> {
    incidencias: {
        goles: Array<{
            id_equipo: number;
            id: number;
            nombre: string;
            apellido: string;
            tipo: string;
            id_jugador: number | null;
            minuto: number;
            penal: 'S' | 'N';
            en_contra: 'S' | 'N';
        }>;
        expulsiones: Array<{
            id: number;
            id_equipo: number;
        }>;
    };
}

// Función para convertir PartidoEquipo (legajos) a PartidoEquipo (formato del componente MatchCard)
const convertirPartido = (partido: PartidoEquipoLegajo | FixtureEquipo, idEquipo: number, equipoInfo?: EquipoInformacionBasica): PartidoMatchCard => {
    // Si es un fixture, puede que solo tenga rival
    if ('rival' in partido) {
        const fixture = partido as FixtureEquipo;
        const rivalNombre = fixture.rival?.nombre || 'Por definir';
        const rivalImg = fixture.rival?.img || undefined;
        const rivalId = fixture.rival?.id_equipo || 0;
        
        // Determinar si el equipo es local o visita basándose en el rival
        // Si el rival está definido, asumimos que nuestro equipo es el opuesto
        const esLocal = true; // Por defecto asumimos que es local en fixtures
        
        return {
            id_partido: fixture.id_partido,
            jornada: fixture.jornada,
            dia: fixture.fecha || '',
            hora: fixture.hora || '',
            estado: fixture.resultado ? 'F' : 'P',
            goles_local: fixture.goles_local ?? null,
            goles_visita: fixture.goles_visita ?? null,
            pen_local: null,
            pen_visita: null,
            cancha: fixture.cancha?.id_cancha || 0,
            id_zona: 0,
            id_categoria_edicion: 0,
            id_equipolocal: esLocal ? idEquipo : rivalId,
            id_equipovisita: esLocal ? rivalId : idEquipo,
            equipoLocal: {
                nombre: esLocal ? (equipoInfo?.nombre || 'Mi equipo') : rivalNombre,
                img: esLocal ? (equipoInfo?.img || undefined) : rivalImg,
            },
            equipoVisita: {
                nombre: esLocal ? rivalNombre : (equipoInfo?.nombre || 'Mi equipo'),
                img: esLocal ? rivalImg : (equipoInfo?.img || undefined),
            },
            incidencias: {
                goles: [],
                expulsiones: [],
            },
        };
    }
    
    // Si es un PartidoEquipo normal
    const partidoNormal = partido as PartidoEquipoLegajo;
    const esLocal = partidoNormal.equipo_local?.id_equipo === idEquipo;
    
    return {
        id_partido: partidoNormal.id_partido,
        jornada: partidoNormal.jornada,
        dia: partidoNormal.fecha || '',
        hora: partidoNormal.hora || '',
        estado: partidoNormal.estado || 'P',
        goles_local: partidoNormal.goles_local ?? null,
        goles_visita: partidoNormal.goles_visita ?? null,
        pen_local: null,
        pen_visita: null,
        cancha: partidoNormal.cancha?.id_cancha || 0,
        id_zona: partidoNormal.zona?.id_zona || 0,
        id_categoria_edicion: partidoNormal.categoria_edicion?.id_categoria_edicion || 0,
        id_equipolocal: partidoNormal.equipo_local?.id_equipo || 0,
        id_equipovisita: partidoNormal.equipo_visita?.id_equipo || 0,
        equipoLocal: {
            nombre: partidoNormal.equipo_local?.nombre || 'TBD',
            img: partidoNormal.equipo_local?.img || undefined,
        },
        equipoVisita: {
            nombre: partidoNormal.equipo_visita?.nombre || 'TBD',
            img: partidoNormal.equipo_visita?.img || undefined,
        },
        incidencias: {
            goles: partidoNormal.goles_equipo?.map(gol => ({
                id_equipo: esLocal ? partidoNormal.equipo_local?.id_equipo || 0 : partidoNormal.equipo_visita?.id_equipo || 0,
                id: gol.id_gol || 0,
                nombre: gol.jugador?.nombre || '',
                apellido: gol.jugador?.apellido || '',
                tipo: gol.tipo === 'penal' ? 'penal' : gol.tipo === 'autogol' ? 'autogol' : 'normal',
                id_jugador: gol.jugador?.id_jugador || null,
                minuto: gol.minuto || 0,
                penal: gol.tipo === 'penal' ? 'S' : 'N',
                en_contra: gol.tipo === 'autogol' ? 'S' : 'N',
            })) || [],
            expulsiones: partidoNormal.tarjetas?.rojas?.map(roja => ({
                id: roja.id_expulsion || 0,
                id_equipo: esLocal ? partidoNormal.equipo_local?.id_equipo || 0 : partidoNormal.equipo_visita?.id_equipo || 0,
            })) || [],
        },
    };
};

export const EquipoPartidosTab = ({
    partidos,
    fixturesProximos,
    fixturesRecientes,
    isLoading,
    isLoadingProximos,
    isLoadingRecientes,
    categoriaSeleccionada,
    onPageChange,
    idEquipo,
    equipoInfo,
}: EquipoPartidosTabProps) => {
    const [tabActivo, setTabActivo] = useState<'fixture' | 'historial'>('fixture');
    const [vistaActiva, setVistaActiva] = useState<'fecha' | 'jornada'>('jornada');
    const [jornadaSeleccionada, setJornadaSeleccionada] = useState<number | undefined>(undefined);

    const tienePartidos = partidos && partidos.data.length > 0;
    const tieneProximos = fixturesProximos && fixturesProximos.length > 0;
    const tieneRecientes = fixturesRecientes && fixturesRecientes.length > 0;

    // Convertir fixtures a formato Partido para usar con ListaPartidos
    const convertirFixtureAPartido = useMemo(() => {
        return (fixture: FixtureEquipo): PartidoSimplificado => {
            const partidoConvertido = convertirPartido(fixture, idEquipo, equipoInfo);
            return {
                id_partido: partidoConvertido.id_partido,
                jornada: partidoConvertido.jornada,
                dia: partidoConvertido.dia,
                hora: partidoConvertido.hora,
                estado: partidoConvertido.estado as EstadoPartido,
                goles_local: partidoConvertido.goles_local,
                goles_visita: partidoConvertido.goles_visita,
                id_equipolocal: partidoConvertido.id_equipolocal,
                id_equipovisita: partidoConvertido.id_equipovisita,
                arbitro: null,
                equipoLocal: partidoConvertido.equipoLocal,
                equipoVisita: partidoConvertido.equipoVisita,
                cancha: partidoConvertido.cancha,
            };
        };
    }, [idEquipo, equipoInfo]);

    // Agrupar próximos partidos por jornada
    const proximosPorJornada = useMemo(() => {
        if (!fixturesProximos) return {};
        return fixturesProximos.reduce((acc, fixture) => {
            if (!acc[fixture.jornada]) {
                acc[fixture.jornada] = [];
            }
            acc[fixture.jornada].push(convertirFixtureAPartido(fixture));
            return acc;
        }, {} as Record<number, PartidoSimplificado[]>);
    }, [fixturesProximos, convertirFixtureAPartido]);

    // Agrupar próximos partidos por fecha
    const proximosPorFecha = useMemo(() => {
        if (!fixturesProximos) return {};
        return fixturesProximos.reduce((acc, fixture) => {
            const fecha = fixture.fecha;
            if (!fecha) return acc;
            if (!acc[fecha]) {
                acc[fecha] = [];
            }
            acc[fecha].push(convertirFixtureAPartido(fixture));
            return acc;
        }, {} as Record<string, PartidoSimplificado[]>);
    }, [fixturesProximos, convertirFixtureAPartido]);

    // Obtener jornadas disponibles de próximos partidos
    const jornadasDisponibles = useMemo(() => {
        if (!fixturesProximos) return [];
        const jornadas = [...new Set(fixturesProximos.map(f => f.jornada))].sort((a, b) => a - b);
        return jornadas;
    }, [fixturesProximos]);

    // Resetear jornada cuando cambia la categoría
    useEffect(() => {
        setJornadaSeleccionada(undefined);
    }, [categoriaSeleccionada]);

    // Inicializar jornada seleccionada
    useEffect(() => {
        if (vistaActiva === 'jornada' && jornadasDisponibles.length > 0) {
            // Si no hay jornada seleccionada o la jornada seleccionada no está en las disponibles, seleccionar la primera
            if (!jornadaSeleccionada || !jornadasDisponibles.includes(jornadaSeleccionada)) {
                setJornadaSeleccionada(jornadasDisponibles[0]);
            }
        }
    }, [jornadasDisponibles, vistaActiva, jornadaSeleccionada]);

    // Ordenar fechas
    const fechasOrdenadas = useMemo(() => {
        return Object.keys(proximosPorFecha).sort((a, b) => 
            new Date(a).getTime() - new Date(b).getTime()
        );
    }, [proximosPorFecha]);

    const partidosJornadaActual = jornadaSeleccionada ? (proximosPorJornada[jornadaSeleccionada] || []) : [];

    // Early return después de todos los hooks
    if (!categoriaSeleccionada) {
        return (
            <p className="text-[var(--gray-100)] text-center py-8">Selecciona una categoría para ver los partidos</p>
        );
    }

    if (isLoading && !tienePartidos) {
        return (
            <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                <div className="space-y-4">
                    <Skeleton height={200} borderRadius={6} />
                    <Skeleton height={200} borderRadius={6} />
                </div>
            </SkeletonTheme>
        );
    }

    return (
        <div className="space-y-6">
            {/* Tabs principales: Fixture vs Historial */}
            <div className="border-b border-[var(--gray-300)]">
                <nav className="flex -mb-px space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setTabActivo('fixture')}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                            ${tabActivo === 'fixture'
                                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                                : 'border-transparent text-[var(--gray-100)] hover:text-[var(--white)] hover:border-[var(--gray-200)]'
                            }
                        `}
                    >
                        <Calendar className="w-4 h-4" />
                        Fixture
                    </button>
                    <button
                        onClick={() => setTabActivo('historial')}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                            ${tabActivo === 'historial'
                                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                                : 'border-transparent text-[var(--gray-100)] hover:text-[var(--white)] hover:border-[var(--gray-200)]'
                            }
                        `}
                    >
                        <History className="w-4 h-4" />
                        Historial
                    </button>
                </nav>
            </div>

            {/* Contenido según tab activo */}
            {tabActivo === 'fixture' ? (
                <div className="space-y-6">
                    {/* Próximos Partidos */}
                    {tieneProximos && (
                        <div>
                            <h3 className="text-lg font-semibold text-[var(--white)] mb-4">Próximos partidos</h3>
                            {isLoadingProximos ? (
                                <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                                    <Skeleton height={100} borderRadius={6} />
                                </SkeletonTheme>
                            ) : (
                                <div className="space-y-4">
                                    {/* Tabs, Filtros y Título */}
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <div className="flex gap-2 bg-[var(--black-900)] border border-[#262626] rounded-xl p-1">
                                            <button
                                                onClick={() => {
                                                    setVistaActiva('jornada');
                                                    setJornadaSeleccionada(jornadasDisponibles[0]);
                                                }}
                                                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                                    vistaActiva === 'jornada'
                                                        ? 'bg-[var(--color-primary)] text-white'
                                                        : 'text-[#737373] hover:text-white'
                                                }`}
                                            >
                                                Por Jornada
                                            </button>
                                            <button
                                                onClick={() => setVistaActiva('fecha')}
                                                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                                    vistaActiva === 'fecha'
                                                        ? 'bg-[var(--color-primary)] text-white'
                                                        : 'text-[#737373] hover:text-white'
                                                }`}
                                            >
                                                Por Fecha
                                            </button>
                                        </div>

                                        {vistaActiva === 'jornada' && jornadasDisponibles.length > 0 && (
                                            <FiltrosFixture
                                                jornadas={jornadasDisponibles}
                                                jornadaActual={jornadaSeleccionada || jornadasDisponibles[0]}
                                                onJornadaChange={(jornada) => {
                                                    setJornadaSeleccionada(jornada);
                                                }}
                                                loading={isLoadingProximos}
                                            />
                                        )}

                                        {/* Título junto a los selectores */}
                                        {vistaActiva === 'jornada' && jornadaSeleccionada && partidosJornadaActual.length > 0 && (
                                            <div className="flex-shrink-0">
                                                <h4 className="text-sm font-semibold text-[var(--white)]">Jornada {jornadaSeleccionada}</h4>
                                                {partidosJornadaActual[0]?.dia && (
                                                    <p className="text-xs text-[#737373]">{formatearFechaCompleta(partidosJornadaActual[0].dia)}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Contenido */}
                                    {vistaActiva === 'jornada' ? (
                                        jornadaSeleccionada && partidosJornadaActual.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {partidosJornadaActual.map((partido) => {
                                                    const fixture = fixturesProximos!.find(f => f.id_partido === partido.id_partido);
                                                    if (!fixture) return null;
                                                    const partidoConvertido = convertirPartido(fixture, idEquipo, equipoInfo);
                                                    return (
                                                        <div key={partido.id_partido} className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
                                                            <MatchCard partido={partidoConvertido as unknown as PartidoEquipo} misEquiposIds={[idEquipo]} />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-8 text-center">
                                                <p className="text-[#737373] text-sm">
                                                    No hay partidos programados para esta jornada
                                                </p>
                                            </div>
                                        )
                                    ) : (
                                        fechasOrdenadas.length > 0 ? (
                                            <div className="space-y-4">
                                                {fechasOrdenadas.map((fecha) => {
                                                    const partidosFecha = proximosPorFecha[fecha];
                                                    return (
                                                        <div key={fecha}>
                                                            <div className="flex items-center gap-4 mb-3 flex-wrap">
                                                                <div className="flex-shrink-0">
                                                                    <h4 className="text-sm font-semibold text-[var(--white)]">{formatearFechaCompleta(fecha)}</h4>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                {partidosFecha.map((partido) => {
                                                                    const fixture = fixturesProximos!.find(f => f.id_partido === partido.id_partido);
                                                                    if (!fixture) return null;
                                                                    const partidoConvertido = convertirPartido(fixture, idEquipo, equipoInfo);
                                                                    return (
                                                                        <div key={partido.id_partido} className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
                                                                            <MatchCard partido={partidoConvertido as unknown as PartidoEquipo} misEquiposIds={[idEquipo]} />
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-8 text-center">
                                                <p className="text-[#737373] text-sm">
                                                    No hay partidos disponibles
                                                </p>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Partidos recientes */}
                    {tieneRecientes && (
                        <div>
                            <h3 className="text-lg font-semibold text-[var(--white)] mb-3">Partidos recientes</h3>
                            {isLoadingRecientes ? (
                                <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                                    <Skeleton height={100} borderRadius={6} />
                                </SkeletonTheme>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {fixturesRecientes!.map((fixture) => {
                                        const partidoConvertido = convertirPartido(fixture, idEquipo, equipoInfo);
                                        return (
                                            <div key={fixture.id_partido} className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
                                                <MatchCard partido={partidoConvertido as unknown as PartidoEquipo} misEquiposIds={[idEquipo]} />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {!tieneProximos && !tieneRecientes && !isLoadingProximos && !isLoadingRecientes && (
                        <p className="text-[var(--gray-100)] text-center py-8">No hay partidos programados</p>
                    )}
                </div>
            ) : (
                <div>
                    {/* Historial de Partidos */}
                    {tienePartidos ? (
                        <div>
                            <h3 className="text-lg font-semibold text-[var(--white)] mb-3">Historial de partidos</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {partidos!.data.map((partido) => {
                                    const partidoConvertido = convertirPartido(partido, idEquipo, equipoInfo);
                                    return (
                                        <div key={partido.id_partido} className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
                                            <MatchCard partido={partidoConvertido as unknown as PartidoEquipo} misEquiposIds={[idEquipo]} />
                                        </div>
                                    );
                                })}
                            </div>
                            {partidos!.pagination && partidos!.pagination.totalPages > 1 && (
                                <div className="flex justify-center pt-4">
                                    <Pagination
                                        currentPage={partidos!.pagination.currentPage}
                                        totalPages={partidos!.pagination.totalPages}
                                        onPageChange={onPageChange}
                                    />
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-[var(--gray-100)] text-center py-8">No hay partidos en el historial</p>
                    )}
                </div>
            )}
        </div>
    );
};

