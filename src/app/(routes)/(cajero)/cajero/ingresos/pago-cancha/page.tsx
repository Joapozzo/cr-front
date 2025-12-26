'use client';

import { useState } from 'react';
import { PageHeader } from '@/app/components/ui/PageHeader';
import { usePagosPendientes } from '@/app/hooks/usePagosCancha';
import { DollarSign, RefreshCw, History } from 'lucide-react';
import PagosCanchaTable from '@/app/components/pagos-cancha/PagosCanchaTable';
import { useQueryClient } from '@tanstack/react-query';
import { pagosCanchaKeys } from '@/app/hooks/usePagosCancha';
import { FilterBar } from '@/app/components/ui/FilterBar';
import { FilterDate } from '@/app/components/ui/FilterDate';
import { FilterSelect } from '@/app/components/ui/FilterSelect';
import { ActionButton } from '@/app/components/ui/ActionButton';
import PagosCanchaTableSkeleton from '@/app/components/skeletons/PagosCanchaTableSkeleton';

type EstadoPagoFilter = 'TODOS' | 'PENDIENTE' | 'PARCIAL' | 'PAGADO' | 'VENCIDO';

export default function PagoCanchaPage() {
    const [fecha, setFecha] = useState<Date | undefined>(undefined); // Sin filtro de fecha por defecto
    const [estadoFiltro, setEstadoFiltro] = useState<EstadoPagoFilter>('TODOS');
    const queryClient = useQueryClient();
    const { data, isLoading, error, refetch } = usePagosPendientes(
        undefined, 
        fecha, 
        undefined, 
        undefined, 
        estadoFiltro === 'TODOS' ? undefined : estadoFiltro,
        {
            staleTime: 0, // Siempre considerar los datos como obsoletos para forzar refetch
            refetchOnWindowFocus: true,
            refetchOnMount: true,
        }
    );

    // Función para forzar actualización
    const handleRefetch = async () => {
        // Invalidar y refetch
        await queryClient.invalidateQueries({ 
            queryKey: pagosCanchaKeys.pendientes({ fecha, estado_pago: estadoFiltro === 'TODOS' ? undefined : estadoFiltro }) 
        });
        await refetch();
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Registrar pago de cancha"
                description="Gestionar pagos de cancha - Ver historial de movimientos en Caja"
                actions={
                    <FilterBar>
                        <FilterDate
                            value={fecha}
                            onChange={setFecha}
                            placeholder="Filtrar por fecha"
                        />
                        <FilterSelect
                            value={estadoFiltro}
                            onChange={(value) => setEstadoFiltro(value as EstadoPagoFilter)}
                            options={[
                                { value: 'TODOS', label: 'Todos los estados' },
                                { value: 'PENDIENTE', label: 'Pendientes' },
                                { value: 'PARCIAL', label: 'Parciales' },
                                { value: 'PAGADO', label: 'Pagados' },
                                { value: 'VENCIDO', label: 'Vencidos' }
                            ]}
                        />
                        <ActionButton
                            href="/cajero/caja"
                            icon={<History className="w-4 h-4" />}
                        >
                            Movimientos
                        </ActionButton>
                        <ActionButton
                            onClick={handleRefetch}
                            disabled={isLoading}
                            icon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
                        >
                            Actualizar
                        </ActionButton>
                    </FilterBar>
                }
            />

            {isLoading ? (
                <PagosCanchaTableSkeleton />
            ) : error ? (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
                    Error al cargar pagos: {error.message}
                </div>
            ) : data && data.pagos.length > 0 ? (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white">
                            {estadoFiltro === 'TODOS' 
                                ? `Todos los pagos (${data.pagos.length})`
                                : `Pagos ${estadoFiltro.toLowerCase()} (${data.pagos.length})`
                            }
                        </h2>
                    </div>
                    <PagosCanchaTable pagos={data.pagos} onPagoRegistrado={handleRefetch} />
                </>
            ) : (
                <div className="bg-[var(--black-900)] border border-[var(--gray-300)] rounded-lg p-12 text-center">
                    <DollarSign className="w-16 h-16 text-[var(--gray-300)] mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                        {estadoFiltro === 'TODOS' ? 'No hay pagos' : `No hay pagos ${estadoFiltro.toLowerCase()}`}
                    </h3>
                    <p className="text-[var(--gray-100)]">
                        {fecha 
                            ? `No hay pagos para la fecha seleccionada${estadoFiltro !== 'TODOS' ? ` con estado ${estadoFiltro.toLowerCase()}` : ''}`
                            : `No hay pagos en este momento${estadoFiltro !== 'TODOS' ? ` con estado ${estadoFiltro.toLowerCase()}` : ''}`}
                    </p>
                </div>
            )}
        </div>
    );
}
