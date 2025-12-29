'use client';

import { TrendingUp, TrendingDown, DollarSign, AlertCircle, Calendar } from 'lucide-react';
import { DashboardResumen } from '@/app/services/dashboard.service';

interface TarjetasResumenProps {
    resumen: DashboardResumen;
    isLoading?: boolean;
}

export default function TarjetasResumen({ resumen, isLoading }: TarjetasResumenProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6 animate-pulse">
                        <div className="h-4 bg-[var(--gray-300)] rounded w-1/2 mb-4"></div>
                        <div className="h-8 bg-[var(--gray-300)] rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    const tarjetas = [
        {
            titulo: 'Ingresos Totales',
            valor: resumen.ingresos_totales,
            icono: <TrendingUp className="w-6 h-6" />,
            color: 'text-green-400',
            bgColor: 'bg-green-500/10',
            borderColor: 'border-green-500/30',
            hoy: resumen.ingresos_hoy
        },
        {
            titulo: 'Egresos Totales',
            valor: resumen.egresos_totales,
            icono: <TrendingDown className="w-6 h-6" />,
            color: 'text-red-400',
            bgColor: 'bg-red-500/10',
            borderColor: 'border-red-500/30',
            hoy: resumen.egresos_hoy
        },
        {
            titulo: 'Saldo Neto',
            valor: resumen.saldo_neto,
            icono: <DollarSign className="w-6 h-6" />,
            color: resumen.saldo_neto >= 0 ? 'text-green-400' : 'text-red-400',
            bgColor: resumen.saldo_neto >= 0 ? 'bg-green-500/10' : 'bg-red-500/10',
            borderColor: resumen.saldo_neto >= 0 ? 'border-green-500/30' : 'border-red-500/30',
            hoy: resumen.saldo_neto_hoy
        },
        {
            titulo: 'Deudas Pendientes',
            valor: resumen.total_deudas,
            icono: <AlertCircle className="w-6 h-6" />,
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/10',
            borderColor: 'border-yellow-500/30',
            hoy: null
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {tarjetas.map((tarjeta, index) => (
                <div 
                    key={index}
                    className={`bg-[var(--black-900)] border ${tarjeta.borderColor} rounded-lg p-6 hover:border-opacity-60 transition-all`}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium text-[var(--gray-100)]">{tarjeta.titulo}</h3>
                        <div className={`${tarjeta.bgColor} ${tarjeta.color} p-2 rounded-lg`}>
                            {tarjeta.icono}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p className={`text-2xl font-bold ${tarjeta.color}`}>
                            ${tarjeta.valor.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        {tarjeta.hoy !== null && (
                            <div className="flex items-center gap-2 text-xs text-[var(--gray-100)]">
                                <Calendar className="w-3 h-3" />
                                <span>Hoy: ${tarjeta.hoy.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

