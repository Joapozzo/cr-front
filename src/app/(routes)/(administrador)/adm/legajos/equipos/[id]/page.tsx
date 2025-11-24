'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, Users, Trophy, Calendar, FileText, Award, Shield, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import Image from 'next/image';
import {
    useEquipoDetalle,
    useEquipoCategorias,
    useEquipoPlantel,
    useEquipoEstadisticas,
    useEquipoPartidos,
    useEquipoTabla,
    useEquipoGoleadores,
    useEquipoCapitanes,
    useEquipoSanciones,
    useEquipoFixtures,
    useEquipoSolicitudes,
} from '@/app/hooks/legajos/useEquipos';
import { Pagination } from '@/app/components/legajos/shared/Pagination';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

type TabType = 'info' | 'plantel' | 'estadisticas' | 'partidos' | 'tabla' | 'goleadores' | 'capitanes' | 'fixtures' | 'solicitudes';

const EquipoDetallePage = () => {
    const params = useParams();
    const router = useRouter();
    const idEquipo = Number(params.id);
    const [activeTab, setActiveTab] = useState<TabType>('info');
    const [selectedCategoria, setSelectedCategoria] = useState<number | undefined>(undefined);
    const [pagePartidos, setPagePartidos] = useState(1);

    // Obtener información básica
    const { data: equipoInfo, isLoading: isLoadingInfo, error: errorInfo } = useEquipoDetalle(idEquipo);
    const { data: categorias, isLoading: isLoadingCategorias } = useEquipoCategorias(idEquipo);

    // Seleccionar primera categoría por defecto
    const categoriaSeleccionada = selectedCategoria || categorias?.[0]?.categoria_edicion.id_categoria_edicion;

    // Hooks condicionales según la categoría seleccionada
    const { data: plantel, isLoading: isLoadingPlantel } = useEquipoPlantel(
        idEquipo,
        categoriaSeleccionada!,
        { enabled: !!categoriaSeleccionada && activeTab === 'plantel' }
    );

    const { data: estadisticas, isLoading: isLoadingEstadisticas } = useEquipoEstadisticas(
        idEquipo,
        categoriaSeleccionada!,
        { enabled: !!categoriaSeleccionada && activeTab === 'estadisticas' }
    );

    const { data: partidos, isLoading: isLoadingPartidos } = useEquipoPartidos(
        idEquipo,
        {
            page: pagePartidos,
            limit: 10,
            id_categoria_edicion: categoriaSeleccionada,
        },
        { enabled: activeTab === 'partidos' }
    );

    const { data: tabla, isLoading: isLoadingTabla } = useEquipoTabla(
        idEquipo,
        categoriaSeleccionada!,
        { enabled: !!categoriaSeleccionada && activeTab === 'tabla' }
    );

    const { data: goleadores, isLoading: isLoadingGoleadores } = useEquipoGoleadores(
        idEquipo,
        categoriaSeleccionada!,
        'goles',
        { enabled: !!categoriaSeleccionada && activeTab === 'goleadores' }
    );

    const { data: capitanes, isLoading: isLoadingCapitanes } = useEquipoCapitanes(
        idEquipo,
        categoriaSeleccionada!,
        { enabled: !!categoriaSeleccionada && activeTab === 'capitanes' }
    );

    const { data: sanciones, isLoading: isLoadingSanciones } = useEquipoSanciones(
        idEquipo,
        { enabled: activeTab === 'sanciones' }
    );

    const { data: fixturesProximos, isLoading: isLoadingFixturesProximos } = useEquipoFixtures(
        idEquipo,
        categoriaSeleccionada!,
        'proximos',
        { enabled: !!categoriaSeleccionada && activeTab === 'fixtures' }
    );

    const { data: fixturesRecientes, isLoading: isLoadingFixturesRecientes } = useEquipoFixtures(
        idEquipo,
        categoriaSeleccionada!,
        'recientes',
        { enabled: !!categoriaSeleccionada && activeTab === 'fixtures' }
    );

    const { data: solicitudes, isLoading: isLoadingSolicitudes } = useEquipoSolicitudes(
        idEquipo,
        categoriaSeleccionada!,
        undefined,
        { enabled: !!categoriaSeleccionada && activeTab === 'solicitudes' }
    );

    const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
        { id: 'info', label: 'Información', icon: <FileText className="w-4 h-4" /> },
        { id: 'plantel', label: 'Plantel', icon: <Users className="w-4 h-4" /> },
        { id: 'estadisticas', label: 'Estadísticas', icon: <Trophy className="w-4 h-4" /> },
        { id: 'partidos', label: 'Partidos', icon: <Calendar className="w-4 h-4" /> },
        { id: 'tabla', label: 'Tabla', icon: <Award className="w-4 h-4" /> },
        { id: 'goleadores', label: 'Goleadores', icon: <Trophy className="w-4 h-4" /> },
        { id: 'capitanes', label: 'Capitanes', icon: <Shield className="w-4 h-4" /> },
        { id: 'fixtures', label: 'Fixtures', icon: <Calendar className="w-4 h-4" /> },
        { id: 'solicitudes', label: 'Solicitudes', icon: <FileText className="w-4 h-4" /> },
    ];

    if (isLoadingInfo) {
        return (
            <div className="space-y-6">
                <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                    <Skeleton height={40} width={200} borderRadius={6} />
                    <Skeleton height={300} borderRadius={6} />
                </SkeletonTheme>
            </div>
        );
    }

    if (errorInfo || !equipoInfo) {
        return (
            <div className="bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-[var(--red)] mx-auto mb-3" />
                <h3 className="text-[var(--red)] font-medium mb-2">Error al cargar el equipo</h3>
                <p className="text-[var(--red)]/80 text-sm mb-4">
                    {errorInfo?.message || 'No se pudo cargar la información del equipo'}
                </p>
                <Button variant="danger" onClick={() => router.back()}>
                    Volver
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => router.back()}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                </Button>
            </div>

            {/* Información del equipo */}
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                <div className="flex items-start gap-6">
                    {equipoInfo.img ? (
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-[var(--gray-300)] flex-shrink-0">
                            <Image
                                src={equipoInfo.img}
                                alt={equipoInfo.nombre}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="w-24 h-24 rounded-lg bg-[var(--gray-300)] flex items-center justify-center flex-shrink-0">
                            <Users className="w-12 h-12 text-[var(--gray-100)]" />
                        </div>
                    )}
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-[var(--white)] mb-2">{equipoInfo.nombre}</h1>
                        {equipoInfo.descripcion && (
                            <p className="text-[var(--gray-100)] mb-4">{equipoInfo.descripcion}</p>
                        )}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-[var(--gray-100)]" />
                                <span className="text-[var(--white)] font-semibold">
                                    {equipoInfo.resumen.categorias_activas} categorías
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-5 h-5 text-[var(--gray-100)]" />
                                <span className="text-[var(--white)] font-semibold">
                                    {equipoInfo.resumen.total_jugadores} jugadores
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[var(--gray-100)]" />
                                <span className="text-[var(--white)] font-semibold">
                                    {equipoInfo.resumen.total_partidos} partidos
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Selector de categoría */}
            {categorias && categorias.length > 0 && (
                <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-4">
                    <label className="text-sm font-medium text-[var(--white)] mb-2 block">
                        Seleccionar Categoría-Edición
                    </label>
                    <select
                        value={categoriaSeleccionada || ''}
                        onChange={(e) => setSelectedCategoria(Number(e.target.value))}
                        className="block w-full px-3 py-2 border border-[var(--gray-300)] rounded-lg bg-[var(--gray-300)] text-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                        {categorias.map((cat) => (
                            <option key={cat.categoria_edicion.id_categoria_edicion} value={cat.categoria_edicion.id_categoria_edicion}>
                                {cat.categoria_edicion.categoria.nombre || 'Categoría'} - {cat.categoria_edicion.edicion.nombre || cat.categoria_edicion.edicion.temporada}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Tabs */}
            <div className="border-b border-[var(--gray-300)]">
                <nav className="flex -mb-px space-x-8 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2
                                    ${
                                        isActive
                                            ? 'border-[var(--primary)] text-[var(--primary)]'
                                            : 'border-transparent text-[var(--gray-100)] hover:text-[var(--white)] hover:border-[var(--gray-200)]'
                                    }
                                `}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Contenido de tabs */}
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                {activeTab === 'info' && (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-[var(--white)] mb-4">Información Básica</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-[var(--gray-100)] mb-1">Nombre</p>
                                <p className="text-[var(--white)] font-semibold">{equipoInfo.nombre}</p>
                            </div>
                            {equipoInfo.descripcion && (
                                <div>
                                    <p className="text-sm text-[var(--gray-100)] mb-1">Descripción</p>
                                    <p className="text-[var(--white)]">{equipoInfo.descripcion}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-[var(--gray-100)] mb-1">Categorías Activas</p>
                                <p className="text-[var(--white)] font-semibold">{equipoInfo.resumen.categorias_activas}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[var(--gray-100)] mb-1">Total de Jugadores</p>
                                <p className="text-[var(--white)] font-semibold">{equipoInfo.resumen.total_jugadores}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[var(--gray-100)] mb-1">Total de Partidos</p>
                                <p className="text-[var(--white)] font-semibold">{equipoInfo.resumen.total_partidos}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'plantel' && (
                    <div>
                        {!categoriaSeleccionada ? (
                            <p className="text-[var(--gray-100)] text-center py-8">Selecciona una categoría para ver el plantel</p>
                        ) : isLoadingPlantel ? (
                            <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                                <Skeleton height={200} borderRadius={6} />
                            </SkeletonTheme>
                        ) : plantel ? (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-[var(--white)]">
                                    Plantel - {plantel.categoria_edicion.categoria.nombre} - {plantel.categoria_edicion.edicion.nombre}
                                </h2>
                                
                                {plantel.capitanes.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-[var(--white)] mb-3">Capitanes</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {plantel.capitanes.map((capitan) => (
                                                <div key={capitan.id_jugador} className="bg-[var(--gray-300)] rounded-lg p-4">
                                                    <p className="text-[var(--white)] font-semibold">
                                                        {capitan.nombre} {capitan.apellido}
                                                    </p>
                                                    <p className="text-sm text-[var(--gray-100)]">
                                                        Desde: {new Date(capitan.fecha_inicio).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-lg font-semibold text-[var(--white)] mb-3">Jugadores</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-[var(--gray-300)]">
                                                    <th className="text-left py-2 px-4 text-[var(--white)] font-semibold">Jugador</th>
                                                    <th className="text-left py-2 px-4 text-[var(--white)] font-semibold">Tipo</th>
                                                    <th className="text-left py-2 px-4 text-[var(--white)] font-semibold">Partidos</th>
                                                    <th className="text-left py-2 px-4 text-[var(--white)] font-semibold">Goles</th>
                                                    <th className="text-left py-2 px-4 text-[var(--white)] font-semibold">Estado</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {plantel.jugadores.map((jugador) => (
                                                    <tr key={jugador.jugador.id_jugador} className="border-b border-[var(--gray-300)]">
                                                        <td className="py-2 px-4 text-[var(--white)]">
                                                            {jugador.jugador.nombre} {jugador.jugador.apellido}
                                                        </td>
                                                        <td className="py-2 px-4 text-[var(--gray-100)]">
                                                            <span className={`px-2 py-1 rounded text-xs ${
                                                                jugador.tipo === 'titular' 
                                                                    ? 'bg-[var(--primary)] text-[var(--white)]' 
                                                                    : 'bg-[var(--gray-300)] text-[var(--gray-100)]'
                                                            }`}>
                                                                {jugador.tipo}
                                                            </span>
                                                        </td>
                                                        <td className="py-2 px-4 text-[var(--gray-100)]">{jugador.partidos_jugados}</td>
                                                        <td className="py-2 px-4 text-[var(--gray-100)]">{jugador.estadisticas.goles}</td>
                                                        <td className="py-2 px-4">
                                                            <span className={`px-2 py-1 rounded text-xs ${
                                                                jugador.estado === 'activo'
                                                                    ? 'bg-[var(--green)] text-[var(--white)]'
                                                                    : 'bg-[var(--red)] text-[var(--white)]'
                                                            }`}>
                                                                {jugador.estado}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-[var(--gray-100)] text-center py-8">No se pudo cargar el plantel</p>
                        )}
                    </div>
                )}

                {activeTab === 'estadisticas' && (
                    <div>
                        {!categoriaSeleccionada ? (
                            <p className="text-[var(--gray-100)] text-center py-8">Selecciona una categoría para ver las estadísticas</p>
                        ) : isLoadingEstadisticas ? (
                            <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                                <Skeleton height={200} borderRadius={6} />
                            </SkeletonTheme>
                        ) : estadisticas ? (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-[var(--white)] mb-4">Estadísticas Generales</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-[var(--gray-300)] rounded-lg p-4">
                                        <p className="text-sm text-[var(--gray-100)] mb-1">Partidos Jugados</p>
                                        <p className="text-2xl font-bold text-[var(--white)]">{estadisticas.estadisticas_generales.partidos_jugados}</p>
                                    </div>
                                    <div className="bg-[var(--gray-300)] rounded-lg p-4">
                                        <p className="text-sm text-[var(--gray-100)] mb-1">Ganados</p>
                                        <p className="text-2xl font-bold text-[var(--green)]">{estadisticas.estadisticas_generales.partidos_ganados}</p>
                                    </div>
                                    <div className="bg-[var(--gray-300)] rounded-lg p-4">
                                        <p className="text-sm text-[var(--gray-100)] mb-1">Empatados</p>
                                        <p className="text-2xl font-bold text-[var(--yellow)]">{estadisticas.estadisticas_generales.partidos_empatados}</p>
                                    </div>
                                    <div className="bg-[var(--gray-300)] rounded-lg p-4">
                                        <p className="text-sm text-[var(--gray-100)] mb-1">Perdidos</p>
                                        <p className="text-2xl font-bold text-[var(--red)]">{estadisticas.estadisticas_generales.partidos_perdidos}</p>
                                    </div>
                                    <div className="bg-[var(--gray-300)] rounded-lg p-4">
                                        <p className="text-sm text-[var(--gray-100)] mb-1">Goles a Favor</p>
                                        <p className="text-2xl font-bold text-[var(--white)]">{estadisticas.estadisticas_generales.goles_favor}</p>
                                    </div>
                                    <div className="bg-[var(--gray-300)] rounded-lg p-4">
                                        <p className="text-sm text-[var(--gray-100)] mb-1">Goles en Contra</p>
                                        <p className="text-2xl font-bold text-[var(--white)]">{estadisticas.estadisticas_generales.goles_contra}</p>
                                    </div>
                                    <div className="bg-[var(--gray-300)] rounded-lg p-4">
                                        <p className="text-sm text-[var(--gray-100)] mb-1">Diferencia</p>
                                        <p className="text-2xl font-bold text-[var(--white)]">{estadisticas.estadisticas_generales.diferencia_goles}</p>
                                    </div>
                                    <div className="bg-[var(--gray-300)] rounded-lg p-4">
                                        <p className="text-sm text-[var(--gray-100)] mb-1">Puntos</p>
                                        <p className="text-2xl font-bold text-[var(--primary)]">{estadisticas.estadisticas_generales.puntos}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-[var(--gray-100)] text-center py-8">No se pudieron cargar las estadísticas</p>
                        )}
                    </div>
                )}

                {activeTab === 'partidos' && (
                    <div>
                        {isLoadingPartidos ? (
                            <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                                <Skeleton height={200} borderRadius={6} />
                            </SkeletonTheme>
                        ) : partidos && partidos.data.length > 0 ? (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-[var(--white)] mb-4">Historial de Partidos</h2>
                                <div className="space-y-3">
                                    {partidos.data.map((partido) => (
                                        <div key={partido.id_partido} className="bg-[var(--gray-300)] rounded-lg p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <p className="text-[var(--white)] font-semibold">
                                                        {partido.equipo_local?.nombre || 'TBD'} vs {partido.equipo_visita?.nombre || 'TBD'}
                                                    </p>
                                                    <p className="text-sm text-[var(--gray-100)]">
                                                        Jornada {partido.jornada} - {partido.fecha && new Date(partido.fecha).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                {partido.resultado && (
                                                    <div className="text-right">
                                                        <p className="text-lg font-bold text-[var(--white)]">
                                                            {partido.goles_local ?? '-'} - {partido.goles_visita ?? '-'}
                                                        </p>
                                                        <p className="text-xs text-[var(--gray-100)]">
                                                            {partido.resultado === 'G' ? 'Ganado' : partido.resultado === 'E' ? 'Empatado' : 'Perdido'}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {partidos.pagination && partidos.pagination.totalPages > 1 && (
                                    <div className="flex justify-center pt-4">
                                        <Pagination
                                            currentPage={partidos.pagination.currentPage}
                                            totalPages={partidos.pagination.totalPages}
                                            onPageChange={setPagePartidos}
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-[var(--gray-100)] text-center py-8">No hay partidos registrados</p>
                        )}
                    </div>
                )}

                {activeTab === 'tabla' && (
                    <div>
                        {!categoriaSeleccionada ? (
                            <p className="text-[var(--gray-100)] text-center py-8">Selecciona una categoría para ver la tabla</p>
                        ) : isLoadingTabla ? (
                            <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                                <Skeleton height={200} borderRadius={6} />
                            </SkeletonTheme>
                        ) : tabla ? (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-[var(--white)] mb-4">Tabla de Posiciones</h2>
                                {tabla.tablas.map((tablaZona, idx) => (
                                    <div key={idx} className="space-y-4">
                                        <h3 className="text-lg font-semibold text-[var(--white)]">
                                            {tablaZona.zona.nombre}
                                        </h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-[var(--gray-300)]">
                                                        <th className="text-left py-2 px-4 text-[var(--white)] font-semibold">Pos</th>
                                                        <th className="text-left py-2 px-4 text-[var(--white)] font-semibold">Equipo</th>
                                                        <th className="text-center py-2 px-4 text-[var(--white)] font-semibold">PJ</th>
                                                        <th className="text-center py-2 px-4 text-[var(--white)] font-semibold">G</th>
                                                        <th className="text-center py-2 px-4 text-[var(--white)] font-semibold">E</th>
                                                        <th className="text-center py-2 px-4 text-[var(--white)] font-semibold">P</th>
                                                        <th className="text-center py-2 px-4 text-[var(--white)] font-semibold">GF</th>
                                                        <th className="text-center py-2 px-4 text-[var(--white)] font-semibold">GC</th>
                                                        <th className="text-center py-2 px-4 text-[var(--white)] font-semibold">DG</th>
                                                        <th className="text-center py-2 px-4 text-[var(--white)] font-semibold">Pts</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {tablaZona.tabla.map((equipo, index) => (
                                                        <tr
                                                            key={equipo.equipo.id_equipo}
                                                            className={`border-b border-[var(--gray-300)] ${
                                                                equipo.equipo.id_equipo === idEquipo
                                                                    ? 'bg-[var(--primary)]/20'
                                                                    : ''
                                                            }`}
                                                        >
                                                            <td className="py-2 px-4 text-[var(--white)] font-semibold">{index + 1}</td>
                                                            <td className="py-2 px-4 text-[var(--white)]">{equipo.equipo.nombre}</td>
                                                            <td className="py-2 px-4 text-center text-[var(--gray-100)]">{equipo.partidos_jugados}</td>
                                                            <td className="py-2 px-4 text-center text-[var(--green)]">{equipo.ganados}</td>
                                                            <td className="py-2 px-4 text-center text-[var(--yellow)]">{equipo.empatados}</td>
                                                            <td className="py-2 px-4 text-center text-[var(--red)]">{equipo.perdidos}</td>
                                                            <td className="py-2 px-4 text-center text-[var(--gray-100)]">{equipo.goles_favor}</td>
                                                            <td className="py-2 px-4 text-center text-[var(--gray-100)]">{equipo.goles_contra}</td>
                                                            <td className="py-2 px-4 text-center text-[var(--gray-100)]">{equipo.diferencia_goles}</td>
                                                            <td className="py-2 px-4 text-center text-[var(--primary)] font-bold">{equipo.puntos}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[var(--gray-100)] text-center py-8">No se pudo cargar la tabla</p>
                        )}
                    </div>
                )}

                {activeTab === 'goleadores' && (
                    <div>
                        {!categoriaSeleccionada ? (
                            <p className="text-[var(--gray-100)] text-center py-8">Selecciona una categoría para ver los goleadores</p>
                        ) : isLoadingGoleadores ? (
                            <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                                <Skeleton height={200} borderRadius={6} />
                            </SkeletonTheme>
                        ) : goleadores && goleadores.length > 0 ? (
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-[var(--white)] mb-4">Goleadores</h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-[var(--gray-300)]">
                                                <th className="text-left py-2 px-4 text-[var(--white)] font-semibold">Jugador</th>
                                                <th className="text-center py-2 px-4 text-[var(--white)] font-semibold">Goles</th>
                                                <th className="text-center py-2 px-4 text-[var(--white)] font-semibold">Partidos</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {goleadores.map((goleador, index) => (
                                                <tr key={index} className="border-b border-[var(--gray-300)]">
                                                    <td className="py-2 px-4 text-[var(--white)]">
                                                        {goleador.jugador
                                                            ? `${goleador.jugador.nombre} ${goleador.jugador.apellido}`
                                                            : 'N/A'}
                                                    </td>
                                                    <td className="py-2 px-4 text-center text-[var(--primary)] font-bold">
                                                        {goleador.total}
                                                    </td>
                                                    <td className="py-2 px-4 text-center text-[var(--gray-100)]">
                                                        {goleador.partidos_jugados || '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <p className="text-[var(--gray-100)] text-center py-8">No hay goleadores registrados</p>
                        )}
                    </div>
                )}

                {activeTab === 'capitanes' && (
                    <div>
                        {!categoriaSeleccionada ? (
                            <p className="text-[var(--gray-100)] text-center py-8">Selecciona una categoría para ver los capitanes</p>
                        ) : isLoadingCapitanes ? (
                            <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                                <Skeleton height={200} borderRadius={6} />
                            </SkeletonTheme>
                        ) : capitanes ? (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-[var(--white)] mb-4">Historial de Capitanes</h2>
                                
                                {capitanes.capitanes_actuales.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-[var(--white)] mb-3">Capitanes Actuales</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {capitanes.capitanes_actuales.map((capitan) => (
                                                <div key={capitan.id_jugador} className="bg-[var(--gray-300)] rounded-lg p-4">
                                                    <p className="text-[var(--white)] font-semibold">
                                                        {capitan.nombre} {capitan.apellido}
                                                    </p>
                                                    <p className="text-sm text-[var(--gray-100)]">
                                                        Desde: {new Date(capitan.fecha_inicio).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {capitanes.capitanes_anteriores.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-[var(--white)] mb-3">Capitanes Anteriores</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {capitanes.capitanes_anteriores.map((capitan) => (
                                                <div key={capitan.id_jugador} className="bg-[var(--gray-300)] rounded-lg p-4">
                                                    <p className="text-[var(--white)] font-semibold">
                                                        {capitan.nombre} {capitan.apellido}
                                                    </p>
                                                    <p className="text-sm text-[var(--gray-100)]">
                                                        {new Date(capitan.fecha_inicio).toLocaleDateString()} -{' '}
                                                        {capitan.fecha_fin
                                                            ? new Date(capitan.fecha_fin).toLocaleDateString()
                                                            : 'Presente'}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p className="text-[var(--gray-100)] text-center py-8">No se pudo cargar el historial de capitanes</p>
                        )}
                    </div>
                )}

                {activeTab === 'fixtures' && (
                    <div>
                        {!categoriaSeleccionada ? (
                            <p className="text-[var(--gray-100)] text-center py-8">Selecciona una categoría para ver los fixtures</p>
                        ) : (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-[var(--white)] mb-4">Fixtures</h2>
                                
                                <div>
                                    <h3 className="text-lg font-semibold text-[var(--white)] mb-3">Próximos Partidos</h3>
                                    {isLoadingFixturesProximos ? (
                                        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                                            <Skeleton height={100} borderRadius={6} />
                                        </SkeletonTheme>
                                    ) : fixturesProximos && fixturesProximos.length > 0 ? (
                                        <div className="space-y-3">
                                            {fixturesProximos.map((fixture) => (
                                                <div key={fixture.id_partido} className="bg-[var(--gray-300)] rounded-lg p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-[var(--white)] font-semibold">
                                                                vs {fixture.rival?.nombre || 'TBD'}
                                                            </p>
                                                            <p className="text-sm text-[var(--gray-100)]">
                                                                Jornada {fixture.jornada} - {fixture.fecha && new Date(fixture.fecha).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        {fixture.cancha && (
                                                            <p className="text-sm text-[var(--gray-100)]">
                                                                {fixture.cancha.nombre}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-[var(--gray-100)] text-center py-4">No hay próximos partidos</p>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-[var(--white)] mb-3">Partidos Recientes</h3>
                                    {isLoadingFixturesRecientes ? (
                                        <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                                            <Skeleton height={100} borderRadius={6} />
                                        </SkeletonTheme>
                                    ) : fixturesRecientes && fixturesRecientes.length > 0 ? (
                                        <div className="space-y-3">
                                            {fixturesRecientes.map((fixture) => (
                                                <div key={fixture.id_partido} className="bg-[var(--gray-300)] rounded-lg p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-[var(--white)] font-semibold">
                                                                vs {fixture.rival?.nombre || 'TBD'}
                                                            </p>
                                                            <p className="text-sm text-[var(--gray-100)]">
                                                                Jornada {fixture.jornada} - {fixture.fecha && new Date(fixture.fecha).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        {fixture.resultado && (
                                                            <div className="text-right">
                                                                <p className="text-lg font-bold text-[var(--white)]">
                                                                    {fixture.goles_local ?? '-'} - {fixture.goles_visita ?? '-'}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-[var(--gray-100)] text-center py-4">No hay partidos recientes</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'solicitudes' && (
                    <div>
                        {!categoriaSeleccionada ? (
                            <p className="text-[var(--gray-100)] text-center py-8">Selecciona una categoría para ver las solicitudes</p>
                        ) : isLoadingSolicitudes ? (
                            <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                                <Skeleton height={200} borderRadius={6} />
                            </SkeletonTheme>
                        ) : solicitudes ? (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-[var(--white)] mb-4">Solicitudes</h2>
                                
                                {solicitudes.jugadores_solicitaron.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-[var(--white)] mb-3">Jugadores que Solicitaron</h3>
                                        <div className="space-y-3">
                                            {solicitudes.jugadores_solicitaron.map((solicitud) => (
                                                <div key={solicitud.id_solicitud} className="bg-[var(--gray-300)] rounded-lg p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-[var(--white)] font-semibold">
                                                                {solicitud.jugador.nombre} {solicitud.jugador.apellido}
                                                            </p>
                                                            {solicitud.mensaje_jugador && (
                                                                <p className="text-sm text-[var(--gray-100)] mt-1">
                                                                    {solicitud.mensaje_jugador}
                                                                </p>
                                                            )}
                                                            <p className="text-xs text-[var(--gray-100)] mt-1">
                                                                {new Date(solicitud.fecha_solicitud).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded text-sm ${
                                                            solicitud.estado === 'aceptado'
                                                                ? 'bg-[var(--green)] text-[var(--white)]'
                                                                : solicitud.estado === 'rechazado'
                                                                ? 'bg-[var(--red)] text-[var(--white)]'
                                                                : 'bg-[var(--yellow)] text-[var(--white)]'
                                                        }`}>
                                                            {solicitud.estado}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {solicitudes.invitaciones_enviadas.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-[var(--white)] mb-3">Invitaciones Enviadas</h3>
                                        <div className="space-y-3">
                                            {solicitudes.invitaciones_enviadas.map((invitacion) => (
                                                <div key={invitacion.id_solicitud} className="bg-[var(--gray-300)] rounded-lg p-4">
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className="text-[var(--white)] font-semibold">
                                                                {invitacion.jugador.nombre} {invitacion.jugador.apellido}
                                                            </p>
                                                            {invitacion.mensaje_capitan && (
                                                                <p className="text-sm text-[var(--gray-100)] mt-1">
                                                                    {invitacion.mensaje_capitan}
                                                                </p>
                                                            )}
                                                            <p className="text-xs text-[var(--gray-100)] mt-1">
                                                                {new Date(invitacion.fecha_solicitud).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded text-sm ${
                                                            invitacion.estado === 'aceptado'
                                                                ? 'bg-[var(--green)] text-[var(--white)]'
                                                                : invitacion.estado === 'rechazado'
                                                                ? 'bg-[var(--red)] text-[var(--white)]'
                                                                : 'bg-[var(--yellow)] text-[var(--white)]'
                                                        }`}>
                                                            {invitacion.estado}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {solicitudes.jugadores_solicitaron.length === 0 && solicitudes.invitaciones_enviadas.length === 0 && (
                                    <p className="text-[var(--gray-100)] text-center py-8">No hay solicitudes</p>
                                )}
                            </div>
                        ) : (
                            <p className="text-[var(--gray-100)] text-center py-8">No se pudieron cargar las solicitudes</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EquipoDetallePage;

