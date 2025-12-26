'use client';

import { useState } from 'react';
import { PageHeader } from '@/app/components/ui/PageHeader';
import { useCajaActual, useResumenDia } from '@/app/hooks/useCaja';
import { useMovimientosCaja } from '@/app/hooks/useMovimientosCaja';
import ResumenCajaActual from '@/app/components/caja/ResumenCajaActual';
import TablaMovimientos from '@/app/components/caja/TablaMovimientos';
import CerrarCajaModal from '@/app/components/modals/CerrarCajaModal';
import { Button } from '@/app/components/ui/Button';
import { Calculator, RefreshCw, History } from 'lucide-react';
import { FilterBar } from '@/app/components/ui/FilterBar';
import { FilterSelect } from '@/app/components/ui/FilterSelect';
import { ActionButton } from '@/app/components/ui/ActionButton';

export default function CajaPage() {
    const { data: caja, refetch: refetchCaja } = useCajaActual();
    const { data: resumen } = useResumenDia();
    const [categoriaFiltro, setCategoriaFiltro] = useState<'INGRESO' | 'EGRESO' | undefined>(undefined);
    const [cerrarCajaModalAbierto, setCerrarCajaModalAbierto] = useState(false);

    const { data: movimientosData, isLoading: isLoadingMovimientos, refetch: refetchMovimientos } = useMovimientosCaja(
        caja?.id_caja || null,
        categoriaFiltro,
        100, // limit
        0, // offset
        {
            refetchInterval: 10000, // Refrescar cada 10 segundos
            refetchOnWindowFocus: true
        }
    );

    // El saldo esperado es solo el físico (efectivo)
    const saldoEsperado = resumen?.saldo_fisico ?? 
        (resumen 
            ? (resumen.saldo_inicial || 0) + (resumen.total_ingresos_fisico || 0) - (resumen.total_egresos_fisico || 0)
            : 0);

    const handleRefresh = () => {
        refetchCaja();
        refetchMovimientos();
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Caja"
                description="Gestión de apertura, cierre y movimientos de caja"
                actions={
                    <FilterBar>
                        {caja && (
                            <>
                                <FilterSelect
                                    value={categoriaFiltro || 'TODOS'}
                                    onChange={(value) => setCategoriaFiltro(value === 'TODOS' ? undefined : value as 'INGRESO' | 'EGRESO')}
                                    options={[
                                        { value: 'TODOS', label: 'Todos los movimientos' },
                                        { value: 'INGRESO', label: 'Solo ingresos' },
                                        { value: 'EGRESO', label: 'Solo egresos' }
                                    ]}
                                />
                                <Button
                                    onClick={() => setCerrarCajaModalAbierto(true)}
                                    variant="danger"
                                    size="sm"
                                    className="flex items-center justify-center"
                                >
                                    <Calculator className="w-4 h-4 mr-2" />
                                    Cerrar caja
                                </Button>
                            </>
                        )}
                        <ActionButton
                            href="/cajero/caja/historial"
                            icon={<History className="w-4 h-4" />}
                        >
                            Historial
                        </ActionButton>
                        <ActionButton
                            onClick={handleRefresh}
                            icon={<RefreshCw className="w-4 h-4" />}
                        >
                            Actualizar
                        </ActionButton>
                    </FilterBar>
                }
            />

            {/* Resumen de caja actual */}
            <ResumenCajaActual />

            {/* Movimientos */}
            {caja && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">Movimientos de caja</h2>
                        {movimientosData && (
                            <p className="text-sm text-[var(--gray-100)]">
                                {movimientosData.pagination?.total || movimientosData.movimientos.length} movimiento(s)
                            </p>
                        )}
                    </div>
                    <TablaMovimientos
                        movimientos={movimientosData?.movimientos || []}
                        isLoading={isLoadingMovimientos}
                        onRefresh={handleRefresh}
                    />
                </div>
            )}

            {/* Modal de cerrar caja */}
            {caja && (
                <CerrarCajaModal
                    isOpen={cerrarCajaModalAbierto}
                    onClose={() => setCerrarCajaModalAbierto(false)}
                    id_caja={caja.id_caja}
                    saldoEsperado={saldoEsperado}
                    onSuccess={() => {
                        refetchCaja();
                        setCerrarCajaModalAbierto(false);
                    }}
                />
            )}
        </div>
    );
}
