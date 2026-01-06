'use client';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { DashboardPorCategoria } from '@/app/services/dashboard.service';

interface GraficoMovimientosPorCategoriaProps {
    data: DashboardPorCategoria[];
    isLoading?: boolean;
}

export default function GraficoMovimientosPorCategoria({ data, isLoading }: GraficoMovimientosPorCategoriaProps) {
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
                <BarChart3 className="w-16 h-16 text-[var(--gray-300)] mb-4" />
                <p className="text-lg font-semibold text-white mb-2">Sin datos</p>
                <p className="text-sm text-[var(--gray-100)]">No hay movimientos por categoría</p>
            </div>
        );
    }

    // Formatear datos - truncar nombres largos
    const chartData = data.map(item => ({
        categoria: item.nombre_categoria.length > 20 
            ? item.nombre_categoria.substring(0, 20) + '...' 
            : item.nombre_categoria,
        categoriaCompleta: item.nombre_categoria,
        ingresos: item.ingresos,
        egresos: item.egresos,
        deudas: item.total_deudas
    }));

    return (
        <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Movimientos por Categoría</h3>
                    <p className="text-sm text-[var(--gray-100)]">Ingresos, egresos y deudas</p>
                </div>
                <BarChart3 className="w-5 h-5 text-[var(--color-primary)]" />
            </div>
            <ResponsiveContainer width="100%" height={400}>
                <BarChart 
                    data={chartData} 
                    margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                    layout="vertical"
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                    <XAxis 
                        type="number"
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                        tickFormatter={(value) => `$${value.toLocaleString('es-AR')}`}
                    />
                    <YAxis 
                        type="category"
                        dataKey="categoria"
                        stroke="#9ca3af"
                        style={{ fontSize: '12px' }}
                        width={150}
                    />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: 'var(--black-950)', 
                            border: '1px solid var(--gray-300)',
                            borderRadius: '8px',
                            color: '#fff'
                        }}
                        formatter={(value: number) => [`$${value.toLocaleString('es-AR', { minimumFractionDigits: 2 })}`, '']}
                        labelFormatter={(label, payload) => {
                            const item = payload?.[0]?.payload;
                            return item?.categoriaCompleta || label;
                        }}
                    />
                    <Legend 
                        wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }}
                    />
                    <Bar 
                        dataKey="ingresos" 
                        fill="#10b981" 
                        radius={[0, 4, 4, 0]}
                        animationDuration={1000}
                    />
                    <Bar 
                        dataKey="egresos" 
                        fill="#ef4444" 
                        radius={[0, 4, 4, 0]}
                        animationDuration={1000}
                    />
                    <Bar 
                        dataKey="deudas" 
                        fill="#f59e0b" 
                        radius={[0, 4, 4, 0]}
                        animationDuration={1000}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

