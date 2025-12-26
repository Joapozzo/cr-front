'use client';

import { useState } from 'react';
import { PageHeader } from '@/app/components/ui/PageHeader';
import { useDashboard } from '@/app/hooks/useDashboard';
import { FilterBar } from '@/app/components/ui/FilterBar';
import { FilterDate } from '@/app/components/ui/FilterDate';
import { FilterSelect } from '@/app/components/ui/FilterSelect';
import { ActionButton } from '@/app/components/ui/ActionButton';
import { RefreshCw, Calendar, TrendingUp } from 'lucide-react';
import TarjetasResumen from '@/app/components/dashboard/TarjetasResumen';
import GraficoIngresosEgresos from '@/app/components/dashboard/GraficoIngresosEgresos';
import GraficoDeudasPendientes from '@/app/components/dashboard/GraficoDeudasPendientes';
import GraficoMovimientosPorCategoria from '@/app/components/dashboard/GraficoMovimientosPorCategoria';
import GraficoPorTorneo from '@/app/components/dashboard/GraficoPorTorneo';
import GraficoMetodosPago from '@/app/components/dashboard/GraficoMetodosPago';
import { useEdicionStore } from '@/app/stores/edicionStore';
import { useCategoriasPorEdicion } from '@/app/hooks/useCategorias';

export default function CajeroDashboard() {
    const { edicionSeleccionada } = useEdicionStore();
    const [fechaDesde, setFechaDesde] = useState<Date | undefined>(() => {
        const date = new Date();
        date.setDate(date.getDate() - 30); // Últimos 30 días (igual que historial)
        return date;
    });
    const [fechaHasta, setFechaHasta] = useState<Date | undefined>(new Date());
    const [categoriaFiltro, setCategoriaFiltro] = useState<number | undefined>(undefined);

    // Obtener categorías para el filtro
    const { data: categoriasData } = useCategoriasPorEdicion(
        edicionSeleccionada?.id_edicion || 0,
        { enabled: !!edicionSeleccionada?.id_edicion }
    );
    const categorias = categoriasData?.data || [];

    const { data, isLoading, error, refetch } = useDashboard({
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
        id_edicion: edicionSeleccionada?.id_edicion,
        id_categoria_edicion: categoriaFiltro
    });

    const categoriaOptions = categorias?.map(cat => ({
        value: cat.id_categoria_edicion.toString(),
        label: cat.categoria?.division
            ? `${cat.categoria.division.nombre} - ${cat.categoria.nombreCategoria.nombre_categoria}`
            : cat.categoria?.nombreCategoria?.nombre_categoria || 'Sin categoría'
    })) || [];

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                description="Resumen financiero y estadísticas de movimientos"
                actions={
                    <FilterBar>
                        <FilterDate
                            value={fechaDesde}
                            onChange={setFechaDesde}
                            placeholder="Desde"
                        />
                        <span className="text-[var(--gray-100)] text-sm">hasta</span>
                        <FilterDate
                            value={fechaHasta}
                            onChange={setFechaHasta}
                            placeholder="Hasta"
                        />
                        {edicionSeleccionada && categorias && categorias.length > 0 && (
                            <FilterSelect
                                value={categoriaFiltro?.toString() || 'TODAS'}
                                onChange={(value) => setCategoriaFiltro(value === 'TODAS' ? undefined : parseInt(value))}
                                options={[
                                    { value: 'TODAS', label: 'Todas las categorías' },
                                    ...categoriaOptions
                                ]}
                            />
                        )}
                        <ActionButton
                            onClick={() => refetch()}
                            icon={<RefreshCw className="w-4 h-4" />}
                            disabled={isLoading}
                        >
                            Actualizar
                        </ActionButton>
                    </FilterBar>
                }
            />

            {error ? (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 text-red-500">
                    Error al cargar dashboard: {error instanceof Error ? error.message : 'Error desconocido'}
                </div>
            ) : (
                <>
                    {/* Tarjetas de resumen */}
                    {data && (
                        <TarjetasResumen resumen={data.resumen} isLoading={isLoading} />
                    )}

                    {/* Gráficos principales */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Ingresos vs Egresos */}
                        {data && (
                            <GraficoIngresosEgresos 
                                data={data.por_fecha} 
                                isLoading={isLoading} 
                            />
                        )}

                        {/* Deudas Pendientes */}
                        {data && (
                            <GraficoDeudasPendientes 
                                resumen={data.resumen} 
                                isLoading={isLoading} 
                            />
                        )}

                        {/* Métodos de Pago */}
                        {data && (
                            <GraficoMetodosPago 
                                resumen={data.resumen} 
                                isLoading={isLoading} 
                            />
                        )}

                        {/* Por Torneo */}
                        {data && (
                            <GraficoPorTorneo 
                                data={data.por_torneo} 
                                isLoading={isLoading} 
                            />
                        )}
                    </div>

                    {/* Gráfico de movimientos por categoría (ancho completo) */}
                    {data && data.por_categoria.length > 0 && (
                        <GraficoMovimientosPorCategoria 
                            data={data.por_categoria} 
                            isLoading={isLoading} 
                        />
                    )}
                </>
            )}
        </div>
    );
}
