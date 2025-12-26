'use client';

import { JugadorInformacionBasica, EstadisticasJugador } from '@/app/types/legajos';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, User, Calendar, Target, Award, Activity, Trophy } from 'lucide-react';
import { FaChartLine } from 'react-icons/fa';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface JugadorInfoTabProps {
    jugadorInfo: JugadorInformacionBasica | undefined;
    estadisticas: EstadisticasJugador | undefined;
    isLoading: boolean;
    isLoadingEstadisticas: boolean;
}

export const JugadorInfoTab = ({ jugadorInfo, estadisticas, isLoading }: JugadorInfoTabProps) => {
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

    if (!jugadorInfo) {
        return (
            <p className="text-[var(--gray-100)] text-center py-8">No se pudo cargar la información</p>
        );
    }

    const nombreCompleto = `${jugadorInfo.usuario.nombre} ${jugadorInfo.usuario.apellido}`;

    // Datos para el gráfico de goles por tipo
    const datosGoles = estadisticas ? [
        { name: 'Normales', value: estadisticas.goles_normales, color: '#10b981' },
        { name: 'Penales', value: estadisticas.goles_penales, color: '#3b82f6' },
        { name: 'Autogoles', value: estadisticas.goles_autogoles, color: '#ef4444' },
    ].filter(item => item.value > 0) : [];

    // Datos para el gráfico de partidos (titular vs suplente)
    const datosPartidos = estadisticas ? [
        { name: 'Titular', value: estadisticas.partidos_titular, color: '#10b981' },
        { name: 'Suplente', value: estadisticas.partidos_suplente, color: '#f59e0b' },
    ] : [];

    return (
        <div className="space-y-6">
            {/* Información Básica - Background diferente */}
            <div className="bg-[var(--gray-500)] rounded-lg border border-[var(--gray-300)] p-6">
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-[var(--green)]" />
                    <h2 className="text-xl font-bold text-[var(--white)]">Información básica</h2>
                </div>
                <div className="flex flex-wrap gap-x-8 gap-y-3">
                    <div className="flex items-start gap-2 max-w-xs">
                        <div className="p-2 bg-[var(--gray-400)] rounded-lg flex-shrink-0">
                            <User className="w-4 h-4 text-[var(--green)]" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs text-[var(--gray-100)] mb-0.5">Nombre completo</p>
                            <p className="text-[var(--white)] font-semibold text-sm">{nombreCompleto}</p>
                        </div>
                    </div>
                    {jugadorInfo.usuario.dni && (
                        <div className="flex items-start gap-2 max-w-xs">
                            <div className="p-2 bg-[var(--gray-400)] rounded-lg flex-shrink-0">
                                <FileText className="w-4 h-4 text-[var(--green)]" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-[var(--gray-100)] mb-0.5">DNI</p>
                                <p className="text-[var(--white)] text-sm">{jugadorInfo.usuario.dni}</p>
                            </div>
                        </div>
                    )}
                    {jugadorInfo.posicion && (
                        <div className="flex items-start gap-2 max-w-xs">
                            <div className="p-2 bg-[var(--gray-400)] rounded-lg flex-shrink-0">
                                <Trophy className="w-4 h-4 text-[var(--yellow)]" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-[var(--gray-100)] mb-0.5">Posición</p>
                                <p className="text-[var(--white)] font-semibold text-sm">{jugadorInfo.posicion.nombre} ({jugadorInfo.posicion.codigo})</p>
                            </div>
                        </div>
                    )}
                    {jugadorInfo.usuario.edad && (
                        <div className="flex items-start gap-2 max-w-xs">
                            <div className="p-2 bg-[var(--gray-400)] rounded-lg flex-shrink-0">
                                <Calendar className="w-4 h-4 text-[var(--blue)]" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-[var(--gray-100)] mb-0.5">Edad</p>
                                <p className="text-[var(--white)] font-semibold text-sm">{jugadorInfo.usuario.edad} años</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Estadísticas Generales - Background diferente */}
            {estadisticas && (
                <div className="bg-[var(--gray-300)] rounded-lg border border-[var(--gray-300)] p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-[var(--green)]" />
                        <h2 className="text-xl font-bold text-[var(--white)]">Estadísticas generales</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                            <div className="flex items-center gap-2 mb-2">
                                <Calendar className="w-4 h-4 text-[var(--blue)]" />
                                <p className="text-xs text-[var(--gray-100)]">Partidos</p>
                            </div>
                            <p className="text-2xl font-bold text-[var(--white)]">{estadisticas.partidos_jugados}</p>
                        </div>
                        <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-4 h-4 text-[var(--green)]" />
                                <p className="text-xs text-[var(--gray-100)]">Goles</p>
                            </div>
                            <p className="text-2xl font-bold text-[var(--white)]">{estadisticas.goles_totales}</p>
                        </div>
                        <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                            <div className="flex items-center gap-2 mb-2">
                                <Award className="w-4 h-4 text-[var(--yellow)]" />
                                <p className="text-xs text-[var(--gray-100)]">Asistencias</p>
                            </div>
                            <p className="text-2xl font-bold text-[var(--white)]">{estadisticas.asistencias}</p>
                        </div>
                        <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-4 h-4 text-[var(--yellow)]" />
                                <p className="text-xs text-[var(--gray-100)]">Amarillas</p>
                            </div>
                            <p className="text-2xl font-bold text-[var(--white)]">{estadisticas.amarillas}</p>
                        </div>
                        <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                            <div className="flex items-center gap-2 mb-2">
                                <Activity className="w-4 h-4 text-[var(--red)]" />
                                <p className="text-xs text-[var(--gray-100)]">Rojas</p>
                            </div>
                            <p className="text-2xl font-bold text-[var(--white)]">{estadisticas.rojas}</p>
                        </div>
                        <div className="bg-[var(--gray-400)] rounded-lg p-4 border border-[var(--gray-300)]">
                            <div className="flex items-center gap-2 mb-2">
                                <Trophy className="w-4 h-4 text-[var(--green)]" />
                                <p className="text-xs text-[var(--gray-100)]">Destacado</p>
                            </div>
                            <p className="text-2xl font-bold text-[var(--white)]">{estadisticas.destacado}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Gráficos - Background diferente */}
            {estadisticas && (datosGoles.length > 0 || datosPartidos.length > 0) && (
                <div className="bg-[var(--black-900)] rounded-lg border border-[var(--gray-300)] p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <FaChartLine className="w-5 h-5 text-[var(--green)]" />
                        <h2 className="text-xl font-bold text-[var(--white)]">Gráficos</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {datosGoles.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--white)] mb-4">Goles por Tipo</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={datosGoles}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            animationBegin={0}
                                            animationDuration={800}
                                        >
                                            {datosGoles.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                        {datosPartidos.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-[var(--white)] mb-4">Partidos (titular vs suplente)</h3>
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
                                        <Bar dataKey="value" fill="#10b981" animationDuration={800} />
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

