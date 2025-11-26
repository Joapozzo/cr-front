'use client';

import { useState, useMemo, useEffect } from 'react';
import { HistorialPartidosEquipoResponse, FixtureEquipo, PartidoEquipo } from '@/app/types/legajos';
import MatchCard from '@/app/components/CardPartidoGenerico';
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
}

// Tipo para el partido convertido (formato del componente MatchCard)
interface PartidoConvertido {
    id_partido: number;
    jornada: number;
    dia: string;
    hora: string;
    estado: string;
    goles_local: number | null;
    goles_visita: number | null;
    pen_local: number | null;
    pen_visita: number | null;
    cancha: number;
    id_zona: number;
    id_categoria_edicion: number;
    id_equipolocal: number;
    id_equipovisita: number;
    equipoLocal: {
        nombre: string;
        img?: string;
    };
    equipoVisita?: {
        nombre: string;
        img?: string;
    };
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

// Tipo para partido simplificado (usado en ListaPartidos)
interface PartidoSimplificado {
    id_partido: number;
    jornada: number;
    dia: string;
    hora: string;
    estado: string;
    goles_local: number | null;
    goles_visita: number | null;
    equipoLocal: {
        nombre: string;
        img?: string;
    };
    equipoVisita?: {
        nombre: string;
        img?: string;
    };
    cancha: number;
}

// Función para convertir PartidoEquipo (legajos) a PartidoEquipo (formato del componente)
const convertirPartido = (partido: PartidoEquipo | FixtureEquipo, idEquipo: number): PartidoConvertido => {
    // Si es un fixture, puede que solo tenga rival
    if ('rival' in partido) {
        const fixture = partido as FixtureEquipo;
        if (!fixture.rival) {
            // Si no hay rival, retornar estructura básica
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
                id_equipolocal: idEquipo,
                id_equipovisita: 0,
                equipoLocal: {
                    nombre: 'Mi Equipo',
                    img: undefined,
                },
                equipoVisita: undefined,
                incidencias: {
                    goles: [],
                    expulsiones: [],
                },
            };
        }
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
            id_equipolocal: idEquipo,
            id_equipovisita: fixture.rival.id_equipo,
            equipoLocal: {
                nombre: 'Mi Equipo',
                img: undefined,
            },
            equipoVisita: {
                nombre: fixture.rival.nombre,
                img: fixture.rival.img || undefined,
            },
            incidencias: {
                goles: [],
                expulsiones: [],
            },
        };
    }
    
    // Si es un PartidoEquipo normal
    const partidoNormal = partido as PartidoEquipo;
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
        equipoVisita: partidoNormal.equipo_visita ? {
            nombre: partidoNormal.equipo_visita.nombre,
            img: partidoNormal.equipo_visita.img || undefined,
        } : undefined,
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
    page: _page,
    onPageChange,
    idEquipo,
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
            const partidoConvertido = convertirPartido(fixture, idEquipo);
            return {
                id_partido: partidoConvertido.id_partido,
                jornada: partidoConvertido.jornada,
                dia: partidoConvertido.dia,
                hora: partidoConvertido.hora,
                estado: partidoConvertido.estado,
                goles_local: partidoConvertido.goles_local,
                goles_visita: partidoConvertido.goles_visita,
                equipoLocal: partidoConvertido.equipoLocal,
                equipoVisita: partidoConvertido.equipoVisita,
                cancha: partidoConvertido.cancha,
            };
        };
    }, [idEquipo]);

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

    // Inicializar jornada seleccionada
    useEffect(() => {
        if (vistaActiva === 'jornada' && !jornadaSeleccionada && jornadasDisponibles.length > 0) {
            setJornadaSeleccionada(jornadasDisponibles[0]);
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
                                ? 'border-[var(--green)] text-[var(--green)]'
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
                                ? 'border-[var(--green)] text-[var(--green)]'
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
                            <h3 className="text-lg font-semibold text-[var(--white)] mb-4">Próximos Partidos</h3>
                            {isLoadingProximos ? (
                                <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                                    <Skeleton height={100} borderRadius={6} />
                                </SkeletonTheme>
                            ) : (
                                <div className="space-y-4">
                                    {/* Tabs y Filtros */}
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex gap-2 bg-[var(--black-900)] border border-[#262626] rounded-xl p-1">
                                            <button
                                                onClick={() => {
                                                    setVistaActiva('jornada');
                                                    setJornadaSeleccionada(jornadasDisponibles[0]);
                                                }}
                                                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                                    vistaActiva === 'jornada'
                                                        ? 'bg-[var(--green)] text-white'
                                                        : 'text-[#737373] hover:text-white'
                                                }`}
                                            >
                                                Por Jornada
                                            </button>
                                            <button
                                                onClick={() => setVistaActiva('fecha')}
                                                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                                                    vistaActiva === 'fecha'
                                                        ? 'bg-[var(--green)] text-white'
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
                                    </div>

                                    {/* Contenido */}
                                    {vistaActiva === 'jornada' ? (
                                        jornadaSeleccionada && partidosJornadaActual.length > 0 ? (
                                            <ListaPartidos
                                                partidos={partidosJornadaActual}
                                                titulo={`Jornada ${jornadaSeleccionada}`}
                                                subtitulo={partidosJornadaActual[0]?.dia ? formatearFechaCompleta(partidosJornadaActual[0].dia) : undefined}
                                            />
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
                                                {fechasOrdenadas.map((fecha) => (
                                                    <ListaPartidos
                                                        key={fecha}
                                                        partidos={proximosPorFecha[fecha]}
                                                        titulo={formatearFechaCompleta(fecha)}
                                                    />
                                                ))}
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

                    {/* Partidos Recientes */}
                    {tieneRecientes && (
                        <div>
                            <h3 className="text-lg font-semibold text-[var(--white)] mb-3">Partidos Recientes</h3>
                            {isLoadingRecientes ? (
                                <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                                    <Skeleton height={100} borderRadius={6} />
                                </SkeletonTheme>
                            ) : (
                                <div className="space-y-3">
                                    {fixturesRecientes!.map((fixture) => {
                                        const partidoConvertido = convertirPartido(fixture, idEquipo);
                                        return (
                                            <div key={fixture.id_partido} className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
                                                <MatchCard partido={partidoConvertido} misEquiposIds={[idEquipo]} />
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
                            <div className="space-y-3">
                                {partidos!.data.map((partido) => {
                                    const partidoConvertido = convertirPartido(partido, idEquipo);
                                    return (
                                        <div key={partido.id_partido} className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
                                            <MatchCard partido={partidoConvertido} misEquiposIds={[idEquipo]} />
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

