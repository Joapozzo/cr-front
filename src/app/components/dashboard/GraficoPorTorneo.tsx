'use client';

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Trophy } from 'lucide-react';
import { DashboardPorTorneo } from '@/app/services/dashboard.service';

interface GraficoPorTorneoProps {
    data: DashboardPorTorneo[];
    isLoading?: boolean;
}

export default function GraficoPorTorneo({ data, isLoading }: GraficoPorTorneoProps) {
    if (isLoading) {
        return (
            <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6 h-[400px] flex items-center justify-center">
                <div className="animate-pulse text-[var(--gray-300)]">Cargando gráfico...</div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6 h-[400px] flex flex-col items-center justify-center">
                <Trophy className="w-16 h-16 text-[var(--gray-300)] mb-4" />
                <p className="text-lg font-semibold text-white mb-2">Sin datos</p>
                <p className="text-sm text-[var(--gray-100)]">No hay datos por torneo</p>
            </div>
        );
    }

    // Formatear datos
    const chartData = data.map(item => ({
        torneo: item.nombre_edicion,
        ingresos: item.ingresos,
        egresos: item.egresos,
        saldo: item.saldo_neto,
        deudas: item.deudas_pendientes
    }));

    return (
        <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Datos por Torneo</h3>
                    <p className="text-sm text-[var(--gray-100)]">Ingresos, egresos y saldo neto</p>
                </div>
                <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis 
                        dataKey="torneo" 
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis 
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => `$${value.toLocaleString('es-AR')}`}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'var(--black-950)', 
                            border: '1px solid var(--gray-300)',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                        formatter={(value: number) => [`$${value.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, '']}
                    />
                    <Legend 
                        wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="ingresos" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', r: 4 }}
                        animationDuration={1000}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="egresos" 
                        stroke="#ef4444" 
                        strokeWidth={3}
                        dot={{ fill: '#ef4444', r: 4 }}
                        animationDuration={1000}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="saldo" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 4 }}
                        strokeDasharray="5 5"
                        animationDuration={1000}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

