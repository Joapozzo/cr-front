'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { AlertCircle, DollarSign } from 'lucide-react';
import { DashboardResumen } from '@/app/services/dashboard.service';

interface GraficoDeudasPendientesProps {
    resumen: DashboardResumen;
    isLoading?: boolean;
}

export default function GraficoDeudasPendientes({ resumen, isLoading }: GraficoDeudasPendientesProps) {
    if (isLoading) {
        return (
            <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6 h-[400px] flex items-center justify-center">
                <div className="animate-pulse text-[var(--gray-300)]">Cargando gráfico...</div>
            </div>
        );
    }

    const data = [
        { 
            name: 'Pendientes', 
            value: resumen.deudas_pendientes,
            color: '#ef4444'
        },
        { 
            name: 'Parciales', 
            value: resumen.deudas_parciales,
            color: '#f59e0b'
        }
    ].filter(item => item.value > 0);

    if (data.length === 0) {
        return (
            <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6 h-[400px] flex flex-col items-center justify-center">
                <DollarSign className="w-16 h-16 text-[var(--gray-300)] mb-4" />
                <p className="text-lg font-semibold text-white mb-2">Sin deudas pendientes</p>
                <p className="text-sm text-[var(--gray-100)]">Todos los pagos están al día</p>
            </div>
        );
    }

    return (
        <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Deudas Pendientes</h3>
                    <p className="text-sm text-[var(--gray-100)]">
                        Total: ${resumen.total_deudas.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <AlertCircle className="w-5 h-5 text-yellow-400" />
            </div>
            <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        animationDuration={1000}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
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
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

