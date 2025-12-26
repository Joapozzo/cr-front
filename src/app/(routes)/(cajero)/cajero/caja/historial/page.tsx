'use client';

import { useState } from 'react';
import { PageHeader } from '@/app/components/ui/PageHeader';
import { useHistorialCajas } from '@/app/hooks/useCaja';
import { Button } from '@/app/components/ui/Button';
import { RefreshCw, Wallet, Calculator } from 'lucide-react';
import CerrarCajaModal from '@/app/components/modals/CerrarCajaModal';
import { useRouter } from 'next/navigation';
import { FilterBar } from '@/app/components/ui/FilterBar';
import { FilterDate } from '@/app/components/ui/FilterDate';
import { ActionButton } from '@/app/components/ui/ActionButton';
import CajaHistorialTableSkeleton from '@/app/components/skeletons/CajaHistorialTableSkeleton';
import { CajaDiaria } from '@/app/services/caja.service';
import { MovimientoCaja } from '@/app/services/movimientoCaja.service';

type CajaDiariaConMovimientos = CajaDiaria & {
    movimientos?: MovimientoCaja[];
};

// Función simple para formatear fecha
const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

export default function HistorialCajaPage() {
    const router = useRouter();
    const [fechaDesde, setFechaDesde] = useState<Date | undefined>(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date;
    });
    const [fechaHasta, setFechaHasta] = useState<Date | undefined>(() => {
        return new Date();
    });
    const [cajaCerrar, setCajaCerrar] = useState<CajaDiariaConMovimientos & { saldoEsperado?: number } | null>(null);
    const [cerrarCajaModalAbierto, setCerrarCajaModalAbierto] = useState(false);

    const { data, isLoading, error, refetch } = useHistorialCajas(
        fechaDesde,
        fechaHasta
    );

    const cajas = data?.cajas || [];

    const handleCerrarCaja = (caja: CajaDiariaConMovimientos, e: React.MouseEvent) => {
        e.stopPropagation(); // Evitar que el click en el botón propague al row
        // Calcular saldo esperado
        const ingresos = caja.movimientos?.filter((m: MovimientoCaja) => m.categoria === 'INGRESO' && m.afecta_saldo_fisico)
            .reduce((sum: number, m: MovimientoCaja) => sum + Number(m.monto || 0), 0) || 0;
        const egresos = caja.movimientos?.filter((m: MovimientoCaja) => m.categoria === 'EGRESO' && m.afecta_saldo_fisico)
            .reduce((sum: number, m: MovimientoCaja) => sum + Number(m.monto || 0), 0) || 0;
        const saldoEsperado = Number(caja.saldo_inicial || 0) + ingresos - egresos;
        
        setCajaCerrar({ ...caja, saldoEsperado });
        setCerrarCajaModalAbierto(true);
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Historial de cajas"
                description="Ver historial de cajas cerradas"
                actions={
                    <FilterBar>
                        <FilterDate
                            value={fechaDesde}
                            onChange={setFechaDesde}
                            placeholder="Fecha desde"
                        />
                        <span className="text-[var(--gray-100)] text-sm">hasta</span>
                        <FilterDate
                            value={fechaHasta}
                            onChange={setFechaHasta}
                            placeholder="Fecha hasta"
                        />
                        <ActionButton
                            onClick={() => refetch()}
                            icon={<RefreshCw className="w-4 h-4" />}
                        >
                            Actualizar
                        </ActionButton>
                    </FilterBar>
                }
            />

            {isLoading ? (
                <CajaHistorialTableSkeleton />
            ) : error ? (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
                    Error al cargar historial: {error instanceof Error ? error.message : 'Error desconocido'}
                </div>
            ) : cajas.length > 0 ? (
                <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[var(--black-950)] border-b border-[var(--gray-300)]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                        Turno
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                        Saldo inicial
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                        Ingresos
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                        Egresos
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                        Saldo final
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-[var(--gray-100)] uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--gray-300)]">
                                {cajas.map((caja: CajaDiariaConMovimientos) => {
                                    const ingresos = caja.movimientos?.filter((m: MovimientoCaja) => m.categoria === 'INGRESO' && m.afecta_saldo_fisico)
                                        .reduce((sum: number, m: MovimientoCaja) => sum + Number(m.monto || 0), 0) || 0;
                                    const egresos = caja.movimientos?.filter((m: MovimientoCaja) => m.categoria === 'EGRESO' && m.afecta_saldo_fisico)
                                        .reduce((sum: number, m: MovimientoCaja) => sum + Number(m.monto || 0), 0) || 0;
                                    const saldoEsperado = Number(caja.saldo_inicial || 0) + ingresos - egresos;
                                    const diferencia = Number(caja.saldo_final || 0) - saldoEsperado;

                                    return (
                                        <tr 
                                            key={caja.id_caja} 
                                            className="hover:bg-[var(--black-950)] transition-colors cursor-pointer"
                                            onClick={() => router.push(`/cajero/caja/${caja.id_caja}`)}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                                {formatDate(caja.fecha)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--gray-100)]">
                                                {caja.turno || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-white text-right">
                                                ${Number(caja.saldo_inicial || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 text-right">
                                                ${ingresos.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-400 text-right">
                                                ${egresos.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white text-right">
                                                ${Number(caja.saldo_final || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                        caja.cerrada 
                                                            ? 'bg-green-500/20 text-green-400' 
                                                            : 'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                        {caja.cerrada ? 'Cerrada' : 'Abierta'}
                                                    </span>
                                                    {caja.cerrada && Math.abs(diferencia) > 0.01 && (
                                                        <span className={`text-xs ${
                                                            diferencia > 0 ? 'text-green-400' : 'text-red-400'
                                                        }`}>
                                                            {diferencia > 0 ? '+' : ''}${diferencia.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center" onClick={(e) => e.stopPropagation()}>
                                                {!caja.cerrada && (
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={(e) => handleCerrarCaja(caja, e)}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Calculator className="w-4 h-4" />
                                                        Cerrar
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-12 text-center">
                    <Wallet className="w-16 h-16 text-[var(--gray-300)] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No hay cajas en el historial</h3>
                    <p className="text-[var(--gray-100)]">
                        No se encontraron cajas para el rango de fechas seleccionado
                    </p>
                </div>
            )}

            {/* Modal de cerrar caja */}
            {cajaCerrar && (
                <CerrarCajaModal
                    isOpen={cerrarCajaModalAbierto}
                    onClose={() => {
                        setCerrarCajaModalAbierto(false);
                        setCajaCerrar(null);
                    }}
                    id_caja={cajaCerrar.id_caja}
                    saldoEsperado={cajaCerrar.saldoEsperado ?? 0}
                    onSuccess={() => {
                        refetch();
                        setCerrarCajaModalAbierto(false);
                        setCajaCerrar(null);
                    }}
                />
            )}
        </div>
    );
}
