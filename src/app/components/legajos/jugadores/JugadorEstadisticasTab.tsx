'use client';

import { EstadisticasJugador } from '@/app/types/legajos';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BarChart3, TrendingUp, Target, Award } from 'lucide-react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface JugadorEstadisticasTabProps {
    estadisticasGenerales: EstadisticasJugador | undefined;
    estadisticasPorCategoria: EstadisticasJugador | undefined;
    isLoading: boolean;
    categoriaSeleccionada: number | undefined;
}

export const JugadorEstadisticasTab = ({
    estadisticasGenerales,
    estadisticasPorCategoria,
    isLoading,
    categoriaSeleccionada,
}: JugadorEstadisticasTabProps) => {
    if (isLoading) {
        return (
            <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                <div className="space-y-4">
                    <Skeleton height={200} borderRadius={6} />
                    <Skeleton height={200} borderRadius={6} />
                </div>
            </SkeletonTheme>
        );
    }

    const estadisticas = estadisticasPorCategoria || estadisticasGenerales;

    if (!estadisticas) {
        return (
            <p className="text-[var(--gray-100)] text-center py-8">
                {categoriaSeleccionada ? 'Selecciona una categoría para ver las estadísticas' : 'No hay estadísticas disponibles'}
            </p>
        );
    }

    // Datos para gráfico de goles por tipo
    const datosGoles = [
        { name: 'Normales', value: estadisticas.goles_normales, color: '#10b981' },
        { name: 'Penales', value: estadisticas.goles_penales, color: '#3b82f6' },
        { name: 'Autogoles', value: estadisticas.goles_autogoles, color: '#ef4444' },
    ].filter(item => item.value > 0);

    // Datos para gráfico de partidos
    const datosPartidos = [
        { name: 'Titular', value: estadisticas.partidos_titular },
        { name: 'Suplente', value: estadisticas.partidos_suplente },
    ];

    // Datos para gráfico de disciplina
    const datosDisciplina = [
        { name: 'Amarillas', value: estadisticas.amarillas, color: '#f59e0b' },
        { name: 'Rojas', value: estadisticas.rojas, color: '#ef4444' },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-[var(--gray-500)] rounded-lg border border-[var(--gray-300)] p-6">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-[var(--green)]" />
                    <h2 className="text-xl font-bold text-[var(--white)]">Estadísticas Detalladas</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                        <p className="text-xs text-[var(--gray-100)] mb-1">Partidos Jugados</p>
                        <p className="text-2xl font-bold text-[var(--white)]">{estadisticas.partidos_jugados}</p>
                    </div>
                    <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                        <p className="text-xs text-[var(--gray-100)] mb-1">Goles Totales</p>
                        <p className="text-2xl font-bold text-[var(--green)]">{estadisticas.goles_totales}</p>
                    </div>
                    <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                        <p className="text-xs text-[var(--gray-100)] mb-1">Asistencias</p>
                        <p className="text-2xl font-bold text-[var(--yellow)]">{estadisticas.asistencias}</p>
                    </div>
                    <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                        <p className="text-xs text-[var(--gray-100)] mb-1">Promedio Goles/Partido</p>
                        <p className="text-2xl font-bold text-[var(--white)]">{estadisticas.promedio_goles_por_partido.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            <div className="bg-[var(--black-900)] rounded-lg border border-[var(--gray-300)] p-6">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-[var(--green)]" />
                    <h2 className="text-xl font-bold text-[var(--white)]">Gráficos</h2>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {datosGoles.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-[var(--white)] mb-4">Goles por Tipo</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={datosGoles}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="name" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1f1f1f',
                                            border: '1px solid #374151',
                                            borderRadius: '6px',
                                        }}
                                    />
                                    <Bar dataKey="value" fill="#10b981" animationDuration={800} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                    {datosPartidos.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-[var(--white)] mb-4">Partidos (Titular vs Suplente)</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={datosPartidos}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="name" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1f1f1f',
                                            border: '1px solid #374151',
                                            borderRadius: '6px',
                                        }}
                                    />
                                    <Bar dataKey="value" fill="#3b82f6" animationDuration={800} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

