'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { DashboardPorFecha } from '@/app/services/dashboard.service';

interface GraficoIngresosEgresosProps {
    data: DashboardPorFecha[];
    isLoading?: boolean;
}

export default function GraficoIngresosEgresos({ data, isLoading }: GraficoIngresosEgresosProps) {
    if (isLoading) {
        return (
            <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6 h-[400px] flex items-center justify-center">
                <div className="animate-pulse text-[var(--gray-300)]">Cargando gráfico...</div>
            </div>
        );
    }

    // Formatear datos para el gráfico
    const chartData = data.map(item => ({
        fecha: new Date(item.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' }),
        ingresos: item.ingresos,
        egresos: item.egresos,
        saldo: item.saldo_neto
    }));

    return (
        <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Ingresos vs Egresos</h3>
                    <p className="text-sm text-[var(--gray-100)]">Últimos 30 días</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-[var(--gray-100)]">Ingresos</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-red-400" />
                        <span className="text-xs text-[var(--gray-100)]">Egresos</span>
                    </div>
                </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis 
                        dataKey="fecha" 
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
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
                    <Bar 
                        dataKey="ingresos" 
                        fill="#10b981" 
                        radius={[4, 4, 0, 0]}
                        animationDuration={1000}
                    />
                    <Bar 
                        dataKey="egresos" 
                        fill="#ef4444" 
                        radius={[4, 4, 0, 0]}
                        animationDuration={1000}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

