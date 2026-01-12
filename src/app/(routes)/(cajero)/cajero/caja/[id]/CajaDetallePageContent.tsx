'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { PageHeader } from '@/app/components/ui/PageHeader';
import { useCajaPorId } from '@/app/hooks/useCaja';
import { Button } from '@/app/components/ui/Button';
import { ArrowLeft, Calculator, RefreshCw } from 'lucide-react';
import TablaMovimientos from '@/app/components/caja/TablaMovimientos';
import CerrarCajaModal from '@/app/components/modals/CerrarCajaModal';
import { formatDateForDisplay } from '@/app/utils/dateHelpers';
import CajaDetalleSkeleton from '@/app/components/skeletons/CajaDetalleSkeleton';
import { CajaDiaria } from '@/app/services/caja.service';
import { MovimientoCaja } from '@/app/services/movimientoCaja.service';

type CajaDiariaConMovimientos = CajaDiaria & {
    movimientos?: MovimientoCaja[];
};

export default function CajaDetallePageContent() {
    const params = useParams();
    const router = useRouter();
    const [cerrarCajaModalAbierto, setCerrarCajaModalAbierto] = useState(false);

    // Memoizar y validar el ID de caja
    const id_caja = useMemo(() => {
        if (params?.id) {
            const parsed = parseInt(params.id as string);
            return !isNaN(parsed) && parsed > 0 ? parsed : null;
        }
        return null;
    }, [params?.id]);

    const { data: cajaData, isLoading, error, refetch } = useCajaPorId(id_caja ?? 0, {
        enabled: id_caja !== null
    });

    // Early return si no hay ID válido DESPUÉS de todos los hooks
    if (!id_caja) {
        return <CajaDetalleSkeleton />;
    }
    const caja = cajaData as CajaDiariaConMovimientos | undefined;

    if (isLoading) {
        return <CajaDetalleSkeleton />;
    }

    if (error || !caja) {
        return (
            <div className="space-y-6">
                <PageHeader
                    title="Caja no encontrada"
                    description="La caja solicitada no existe o no tienes permisos para verla"
                />
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
                    {error instanceof Error ? error.message : 'Error al cargar la caja'}
                </div>
                <Button onClick={() => router.push('/cajero/caja/historial')} variant="secondary">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al historial
                </Button>
            </div>
        );
    }

    const ingresos = caja.movimientos?.filter((m: any) => m.categoria === 'INGRESO' && m.afecta_saldo_fisico)
        .reduce((sum: number, m: any) => sum + Number(m.monto || 0), 0) || 0;
    const egresos = caja.movimientos?.filter((m: any) => m.categoria === 'EGRESO' && m.afecta_saldo_fisico)
        .reduce((sum: number, m: any) => sum + Number(m.monto || 0), 0) || 0;
    const saldoEsperado = Number(caja.saldo_inicial || 0) + ingresos - egresos;

    return (
        <div className="space-y-6">
            <PageHeader
                title={`Caja #${caja.id_caja}`}
                description={`Fecha: ${formatDateForDisplay(caja.fecha)}${caja.turno ? ` - Turno: ${caja.turno}` : ''}`}
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => router.push('/cajero/caja/historial')}
                            variant="secondary"
                            size="sm"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver
                        </Button>
                        {!caja.cerrada && (
                            <Button
                                onClick={() => setCerrarCajaModalAbierto(true)}
                                variant="danger"
                                size="sm"
                            >
                                <Calculator className="w-4 h-4 mr-2" />
                                Cerrar caja
                            </Button>
                        )}
                        <Button
                            onClick={() => refetch()}
                            variant="secondary"
                            size="sm"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Actualizar
                        </Button>
                    </div>
                }
            />

            {/* Resumen de la caja */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-4">
                    <p className="text-sm text-[var(--gray-100)] mb-1">Saldo Inicial</p>
                    <p className="text-2xl font-semibold text-white">
                        ${Number(caja.saldo_inicial || 0).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-4">
                    <p className="text-sm text-[var(--gray-100)] mb-1">Ingresos</p>
                    <p className="text-2xl font-semibold text-[var(--color-primary)]">
                        ${ingresos.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-4">
                    <p className="text-sm text-[var(--gray-100)] mb-1">Egresos</p>
                    <p className="text-2xl font-semibold text-red-400">
                        ${egresos.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-4">
                    <p className="text-sm text-[var(--gray-100)] mb-1">
                        {caja.cerrada ? 'Saldo Final' : 'Saldo Esperado'}
                    </p>
                    <p className="text-2xl font-semibold text-white">
                        ${(caja.cerrada ? Number(caja.saldo_final || 0) : saldoEsperado).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    {caja.cerrada && Math.abs(Number(caja.saldo_final || 0) - saldoEsperado) > 0.01 && (
                        <p className="text-xs mt-1 text-yellow-400">
                            Diferencia: ${(Number(caja.saldo_final || 0) - saldoEsperado).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    )}
                </div>
            </div>

            {/* Estado de la caja */}
            <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-[var(--gray-100)]">Estado</p>
                        <span className={`px-3 py-1 rounded text-sm font-medium ${
                            caja.cerrada 
                                ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]' 
                                : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                            {caja.cerrada ? 'Cerrada' : 'Abierta'}
                        </span>
                    </div>
                    {caja.cerrada && caja.cerrado_en && (
                        <div>
                            <p className="text-sm text-[var(--gray-100)]">Cerrada el</p>
                            <p className="text-sm text-white">{formatDateForDisplay(caja.cerrado_en)}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Movimientos */}
            {caja.movimientos && caja.movimientos.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">Movimientos de caja</h2>
                        <p className="text-sm text-[var(--gray-100)]">
                            {caja.movimientos.length} movimiento(s)
                        </p>
                    </div>
                    <TablaMovimientos
                        movimientos={caja.movimientos}
                        isLoading={false}
                        onRefresh={() => refetch()}
                    />
                </div>
            )}

            {/* Modal de cerrar caja */}
            {!caja.cerrada && (
                <CerrarCajaModal
                    isOpen={cerrarCajaModalAbierto}
                    onClose={() => setCerrarCajaModalAbierto(false)}
                    id_caja={caja.id_caja}
                    saldoEsperado={saldoEsperado}
                    onSuccess={() => {
                        refetch();
                        setCerrarCajaModalAbierto(false);
                    }}
                />
            )}
        </div>
    );
}

