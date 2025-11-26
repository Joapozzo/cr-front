'use client';

import { EquipoInformacionBasica, EstadisticasEquipo } from '@/app/types/legajos';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Trophy, Users, Calendar, TrendingUp, Target, Award, Activity, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { FaFutbol, FaChartLine, FaChartPie } from 'react-icons/fa';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface EquipoInfoTabProps {
    equipoInfo: EquipoInformacionBasica | undefined;
    estadisticas: EstadisticasEquipo | undefined;
    isLoading: boolean;
    isLoadingEstadisticas: boolean;
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

export const EquipoInfoTab = ({ equipoInfo, estadisticas, isLoading, isLoadingEstadisticas }: EquipoInfoTabProps) => {
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

    if (!equipoInfo) {
        return (
            <p className="text-[var(--gray-100)] text-center py-8">No se pudo cargar la información</p>
        );
    }

    // Datos para el gráfico de resultados
    const datosResultados = estadisticas ? [
        { name: 'Ganados', value: estadisticas.estadisticas_generales.partidos_ganados, color: '#10b981' },
        { name: 'Empatados', value: estadisticas.estadisticas_generales.partidos_empatados, color: '#f59e0b' },
        { name: 'Perdidos', value: estadisticas.estadisticas_generales.partidos_perdidos, color: '#ef4444' },
    ] : [];

    // Datos para el gráfico de goles
    const datosGoles = estadisticas ? [
        { name: 'Goles a Favor', value: estadisticas.estadisticas_generales.goles_favor, color: '#10b981' },
        { name: 'Goles en Contra', value: estadisticas.estadisticas_generales.goles_contra, color: '#ef4444' },
    ] : [];

    return (
        <div className="space-y-6">
            {/* Información Básica - Background diferente */}
            <div className="bg-[var(--gray-500)] rounded-lg border border-[var(--gray-300)] p-6">
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-[var(--green)]" />
                    <h2 className="text-xl font-bold text-[var(--white)]">Información Básica</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-[var(--gray-400)] rounded-lg">
                            <Users className="w-4 h-4 text-[var(--green)]" />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--gray-100)] mb-1">Nombre</p>
                            <p className="text-[var(--white)] font-semibold">{equipoInfo.nombre}</p>
                        </div>
                    </div>
                    {equipoInfo.descripcion && (
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-[var(--gray-400)] rounded-lg">
                                <FileText className="w-4 h-4 text-[var(--green)]" />
                            </div>
                            <div>
                                <p className="text-sm text-[var(--gray-100)] mb-1">Descripción</p>
                                <p className="text-[var(--white)]">{equipoInfo.descripcion}</p>
                            </div>
                        </div>
                    )}
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-[var(--gray-400)] rounded-lg">
                            <Trophy className="w-4 h-4 text-[var(--yellow)]" />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--gray-100)] mb-1">Categorías Activas</p>
                            <p className="text-[var(--white)] font-semibold">{equipoInfo.resumen.categorias_activas}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-[var(--gray-400)] rounded-lg">
                            <Users className="w-4 h-4 text-[var(--green)]" />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--gray-100)] mb-1">Total de Jugadores</p>
                            <p className="text-[var(--white)] font-semibold">{equipoInfo.resumen.total_jugadores}</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-[var(--gray-400)] rounded-lg">
                            <Calendar className="w-4 h-4 text-[var(--blue)]" />
                        </div>
                        <div>
                            <p className="text-sm text-[var(--gray-100)] mb-1">Total de Partidos</p>
                            <p className="text-[var(--white)] font-semibold">{equipoInfo.resumen.total_partidos}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estadísticas Generales - Background diferente */}
            {isLoadingEstadisticas ? (
                <SkeletonTheme baseColor="#1f1f1f" highlightColor="#333333">
                    <Skeleton height={300} borderRadius={6} />
                </SkeletonTheme>
            ) : estadisticas ? (
                <div className="bg-[var(--gray-300)] rounded-lg border border-[var(--gray-200)] p-6 space-y-6">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[var(--green)]" />
                        <h2 className="text-xl font-bold text-[var(--white)]">Estadísticas Generales</h2>
                    </div>
                    
                    {/* Cards de estadísticas */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-[var(--blue)]" />
                                <p className="text-sm text-[var(--gray-100)]">Partidos Jugados</p>
                            </div>
                            <p className="text-2xl font-bold text-[var(--white)]">{estadisticas.estadisticas_generales.partidos_jugados}</p>
                        </div>
                        <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--green)]/30">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-[var(--green)]" />
                                <p className="text-sm text-[var(--gray-100)]">Ganados</p>
                            </div>
                            <p className="text-2xl font-bold text-[var(--green)]">{estadisticas.estadisticas_generales.partidos_ganados}</p>
                        </div>
                        <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--yellow)]/30">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-[var(--yellow)]" />
                                <p className="text-sm text-[var(--gray-100)]">Empatados</p>
                            </div>
                            <p className="text-2xl font-bold text-[var(--yellow)]">{estadisticas.estadisticas_generales.partidos_empatados}</p>
                        </div>
                        <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--red)]/30">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp className="w-4 h-4 text-[var(--red)] rotate-180" />
                                <p className="text-sm text-[var(--gray-100)]">Perdidos</p>
                            </div>
                            <p className="text-2xl font-bold text-[var(--red)]">{estadisticas.estadisticas_generales.partidos_perdidos}</p>
                        </div>
                        <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--green)]/30">
                            <div className="flex items-center gap-2 mb-2">
                                <FaFutbol className="w-4 h-4 text-[var(--green)]" />
                                <p className="text-sm text-[var(--gray-100)]">Goles a Favor</p>
                            </div>
                            <p className="text-2xl font-bold text-[var(--white)]">{estadisticas.estadisticas_generales.goles_favor}</p>
                        </div>
                        <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--red)]/30">
                            <div className="flex items-center gap-2 mb-2">
                                <FaFutbol className="w-4 h-4 text-[var(--red)]" />
                                <p className="text-sm text-[var(--gray-100)]">Goles en Contra</p>
                            </div>
                            <p className="text-2xl font-bold text-[var(--white)]">{estadisticas.estadisticas_generales.goles_contra}</p>
                        </div>
                        <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                            <div className="flex items-center gap-2 mb-2">
                                <BarChart3 className="w-4 h-4 text-[var(--blue)]" />
                                <p className="text-sm text-[var(--gray-100)]">Diferencia</p>
                            </div>
                            <p className="text-2xl font-bold text-[var(--white)]">{estadisticas.estadisticas_generales.diferencia_goles}</p>
                        </div>
                        <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--green)]/30">
                            <div className="flex items-center gap-2 mb-2">
                                <Award className="w-4 h-4 text-[var(--green)]" />
                                <p className="text-sm text-[var(--gray-100)]">Puntos</p>
                            </div>
                            <p className="text-2xl font-bold text-[var(--green)]">{estadisticas.estadisticas_generales.puntos}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-[var(--gray-100)] text-center py-8">No se pudieron cargar las estadísticas</p>
            )}

            {/* Gráficos - Background diferente */}
            {estadisticas && (
                <div className="bg-[var(--black-900)] rounded-lg border border-[#262626] p-6 space-y-6">
                    <div className="flex items-center gap-2">
                        <FaChartLine className="w-5 h-5 text-[var(--green)]" />
                        <h2 className="text-xl font-bold text-[var(--white)]">Gráficos</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Gráfico de resultados (Pie Chart) */}
                        {datosResultados.length > 0 && (
                            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <PieChartIcon className="w-5 h-5 text-[var(--green)]" />
                                    <h3 className="text-lg font-semibold text-[var(--white)]">Resultados</h3>
                                </div>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={datosResultados}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            animationDuration={1000}
                                        >
                                            {datosResultados.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        {/* Gráfico de goles (Bar Chart) */}
                        {datosGoles.length > 0 && (
                            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <BarChart3 className="w-5 h-5 text-[var(--blue)]" />
                                    <h3 className="text-lg font-semibold text-[var(--white)]">Goles</h3>
                                </div>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={datosGoles}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis dataKey="name" stroke="#9ca3af" />
                                        <YAxis stroke="#9ca3af" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1f2937',
                                                border: '1px solid #374151',
                                                borderRadius: '6px',
                                            }}
                                        />
                                        <Bar dataKey="value" fill="#10b981" animationDuration={1000}>
                                            {datosGoles.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

