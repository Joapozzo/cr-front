'use client';

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { CreditCard, Wallet, QrCode } from 'lucide-react';
import { DashboardResumen } from '@/app/services/dashboard.service';

interface GraficoMetodosPagoProps {
    resumen: DashboardResumen;
    isLoading?: boolean;
}

export default function GraficoMetodosPago({ resumen, isLoading }: GraficoMetodosPagoProps) {
    if (isLoading) {
        return (
            <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6 h-[400px] flex items-center justify-center">
                <div className="animate-pulse text-[var(--gray-300)]">Cargando gráfico...</div>
            </div>
        );
    }

    const dataIngresos = [
        { name: 'Efectivo', value: resumen.ingresos_efectivo, color: '#10b981' },
        { name: 'Transferencia', value: resumen.ingresos_transferencia, color: '#3b82f6' },
        { name: 'MercadoPago', value: resumen.ingresos_mercadopago, color: '#8b5cf6' }
    ].filter(item => item.value > 0);

    const totalIngresos = dataIngresos.reduce((sum, item) => sum + item.value, 0);

    if (totalIngresos === 0) {
        return (
            <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6 h-[400px] flex flex-col items-center justify-center">
                <CreditCard className="w-16 h-16 text-[var(--gray-300)] mb-4" />
                <p className="text-lg font-semibold text-white mb-2">Sin ingresos</p>
                <p className="text-sm text-[var(--gray-100)]">No hay ingresos registrados</p>
            </div>
        );
    }

    return (
        <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Ingresos por Método de Pago</h3>
                    <p className="text-sm text-[var(--gray-100)]">
                        Total: ${totalIngresos.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-green-400" />
                    <CreditCard className="w-4 h-4 text-blue-400" />
                    <QrCode className="w-4 h-4 text-purple-400" />
                </div>
            </div>
            <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                    <Pie
                        data={dataIngresos}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent, value }) => 
                            `${name}: ${((percent ?? 0) * 100).toFixed(0)}% ($${value.toLocaleString('es-AR')})`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        animationDuration={1000}
                    >
                        {dataIngresos.map((entry, index) => (
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

