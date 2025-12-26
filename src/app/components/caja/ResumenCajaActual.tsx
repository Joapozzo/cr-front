'use client';

import { useCajaActual } from '@/app/hooks/useCaja';
import { Button } from '../ui/Button';
import { TrendingUp, TrendingDown, Wallet, Loader2, AlertCircle } from 'lucide-react';
import AbrirCajaModal from '../modals/AbrirCajaModal';
import { useState } from 'react';

export default function ResumenCajaActual() {
    const { data: caja, isLoading, refetch } = useCajaActual({
        refetchInterval: 10000, // Refrescar cada 10 segundos
        refetchOnWindowFocus: true
    });
    const [abrirCajaModalAbierto, setAbrirCajaModalAbierto] = useState(false);

    if (isLoading) {
        return (
            <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-8">
                <div className="flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--green)]" />
                </div>
            </div>
        );
    }

    if (!caja) {
        return (
            <>
                <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-8">
                    <div className="text-center">
                        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No hay caja abierta</h3>
                        <p className="text-[var(--gray-100)] mb-6">
                            Debes abrir una caja para comenzar a registrar movimientos
                        </p>
                        <Button
                            onClick={() => setAbrirCajaModalAbierto(true)}
                            variant="footer"
                            className="mx-auto"
                        >
                            <Wallet className="w-4 h-4 mr-2" />
                            Abrir caja
                        </Button>
                    </div>
                </div>

                <AbrirCajaModal
                    isOpen={abrirCajaModalAbierto}
                    onClose={() => setAbrirCajaModalAbierto(false)}
                    onSuccess={() => {
                        refetch();
                        setAbrirCajaModalAbierto(false);
                    }}
                />
            </>
        );
    }

    const saldoFisico = caja.saldo_fisico ?? Number(caja.saldo_inicial);
    const saldoDigital = caja.saldo_digital ?? 0;
    const saldoTotal = caja.saldo_total ?? saldoFisico;
    
    const totalIngresosFisico = caja.total_ingresos_fisico ?? 0;
    const totalEgresosFisico = caja.total_egresos_fisico ?? 0;
    const totalIngresosDigital = caja.total_ingresos_digital ?? 0;
    const totalEgresosDigital = caja.total_egresos_digital ?? 0;

    return (
        <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Caja actual</h2>
                    <p className="text-sm text-[var(--gray-100)]">
                        Abierta el {new Date(caja.fecha).toLocaleDateString('es-AR')}
                        {caja.turno && ` - Turno: ${caja.turno}`}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-[var(--gray-100)] mb-1">Saldo físico</p>
                    <p className="text-3xl font-bold text-[var(--green)]">
                        ${saldoFisico.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    {saldoDigital !== 0 && (
                        <p className="text-sm text-blue-400 mt-1">
                            Digital: ${saldoDigital.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    )}
                </div>
            </div>

            {/* Saldos principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* Saldo inicial */}
                <div className="bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-[var(--gray-100)]">Saldo inicial</p>
                        <Wallet className="w-4 h-4 text-[var(--gray-100)]" />
                    </div>
                    <p className="text-xl font-semibold text-white">
                        ${Number(caja.saldo_inicial).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>

                {/* Saldo físico */}
                <div className="bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-[var(--gray-100)]">Saldo físico (efectivo)</p>
                        <Wallet className="w-4 h-4 text-[var(--green)]" />
                    </div>
                    <p className="text-xl font-semibold text-[var(--green)]">
                        ${saldoFisico.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>

                {/* Saldo digital */}
                <div className="bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-[var(--gray-100)]">Saldo digital</p>
                        <TrendingUp className="w-4 h-4 text-blue-400" />
                    </div>
                    <p className="text-xl font-semibold text-blue-400">
                        ${saldoDigital.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-[var(--gray-100)] mt-1">
                        Transferencias + MercadoPago
                    </p>
                </div>
            </div>

            {/* Desglose de ingresos y egresos */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Ingresos físicos */}
                <div className="bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg p-4">
                    <p className="text-xs text-[var(--gray-100)] mb-1">Ingresos físicos</p>
                    <p className="text-lg font-semibold text-green-400">
                        ${totalIngresosFisico.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>

                {/* Egresos físicos */}
                <div className="bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg p-4">
                    <p className="text-xs text-[var(--gray-100)] mb-1">Egresos físicos</p>
                    <p className="text-lg font-semibold text-red-400">
                        ${totalEgresosFisico.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>

                {/* Ingresos digitales */}
                <div className="bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg p-4">
                    <p className="text-xs text-[var(--gray-100)] mb-1">Ingresos digitales</p>
                    <p className="text-lg font-semibold text-blue-400">
                        ${totalIngresosDigital.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>

                {/* Egresos digitales */}
                <div className="bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg p-4">
                    <p className="text-xs text-[var(--gray-100)] mb-1">Egresos digitales</p>
                    <p className="text-lg font-semibold text-orange-400">
                        ${totalEgresosDigital.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            {caja.observaciones && (
                <div className="bg-[var(--black-950)] border border-[var(--gray-300)] rounded-lg p-4 mb-4">
                    <p className="text-sm text-[var(--gray-100)] mb-1">Observaciones</p>
                    <p className="text-white">{caja.observaciones}</p>
                </div>
            )}
        </div>
    );
}

