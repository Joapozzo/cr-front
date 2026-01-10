'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import {
    useEquipoDetalle,
    useEquipoCategorias,
    useEquipoPlantel,
    useEquipoEstadisticas,
    useEquipoPartidos,
    useEquipoTabla,
    useEquipoGoleadores,
    useEquipoCapitanes,
    useEquipoFixtures,
    useEquipoSolicitudes,
} from '@/app/hooks/legajos/useEquipos';
import { EquipoHeader } from '@/app/components/legajos/equipos/EquipoHeader';
import { CategoriaSelector } from '@/app/components/legajos/equipos/CategoriaSelector';
import { EquipoTabs } from '@/app/components/legajos/equipos/EquipoTabs';
import { EquipoInfoTab } from '@/app/components/legajos/equipos/EquipoInfoTab';
import { EquipoPlantelTab } from '@/app/components/legajos/equipos/EquipoPlantelTab';
import { EquipoPartidosTab } from '@/app/components/legajos/equipos/EquipoPartidosTab';
import { EquipoTablaTab } from '@/app/components/legajos/equipos/EquipoTablaTab';
import { EquipoGoleadoresTab } from '@/app/components/legajos/equipos/EquipoGoleadoresTab';
import { EquipoCapitanesTab } from '@/app/components/legajos/equipos/EquipoCapitanesTab';
import { EquipoSolicitudesTab } from '@/app/components/legajos/equipos/EquipoSolicitudesTab';
import { EquipoHeaderSkeleton } from '@/app/components/legajos/equipos/EquipoHeaderSkeleton';

type TabType = 'info' | 'plantel' | 'partidos' | 'tabla' | 'goleadores' | 'capitanes' | 'solicitudes';

// Componente interno con la lógica
const EquipoDetallePageContent = () => {
    const params = useParams();
    const router = useRouter();
    const idEquipo = Number(params.id);
    const [activeTab, setActiveTab] = useState<TabType>('info');
    const [selectedCategoria, setSelectedCategoria] = useState<number | undefined>(undefined);
    const [pagePartidos, setPagePartidos] = useState(1);

    // Obtener información básica
    const { data: equipoInfo, isLoading: isLoadingInfo, error: errorInfo } = useEquipoDetalle(idEquipo);
    const { data: categorias, isLoading: isLoadingCategorias } = useEquipoCategorias(idEquipo);

    // Seleccionar primera categoría por defecto cuando se cargan las categorías
    useEffect(() => {
        if (categorias && categorias.length > 0 && !selectedCategoria) {
            setSelectedCategoria(categorias[0].categoria_edicion.id_categoria_edicion);
        }
    }, [categorias, selectedCategoria]);

    const categoriaSeleccionada = selectedCategoria || categorias?.[0]?.categoria_edicion.id_categoria_edicion;

    // Hooks condicionales según la categoría seleccionada - SIEMPRE cargar cuando hay categoría
    const { data: plantel, isLoading: isLoadingPlantel } = useEquipoPlantel(
        idEquipo,
        categoriaSeleccionada!,
        { enabled: !!categoriaSeleccionada }
    );

    // Estadísticas siempre cargadas porque están unificadas con información
    const { data: estadisticas, isLoading: isLoadingEstadisticas } = useEquipoEstadisticas(
        idEquipo,
        categoriaSeleccionada!,
        { enabled: !!categoriaSeleccionada }
    );

    const { data: partidos, isLoading: isLoadingPartidos } = useEquipoPartidos(
        idEquipo,
        {
            page: pagePartidos,
            limit: 15,
            id_categoria_edicion: categoriaSeleccionada,
        },
        { enabled: !!categoriaSeleccionada }
    );

    const { data: tabla, isLoading: isLoadingTabla } = useEquipoTabla(
        idEquipo,
        categoriaSeleccionada!,
        { enabled: !!categoriaSeleccionada }
    );

    const { data: goleadores, isLoading: isLoadingGoleadores } = useEquipoGoleadores(
        idEquipo,
        categoriaSeleccionada!,
        'goles',
        { enabled: !!categoriaSeleccionada }
    );

    const { data: capitanes, isLoading: isLoadingCapitanes } = useEquipoCapitanes(
        idEquipo,
        categoriaSeleccionada!,
        { enabled: !!categoriaSeleccionada }
    );

    const { data: fixturesProximos, isLoading: isLoadingFixturesProximos } = useEquipoFixtures(
        idEquipo,
        categoriaSeleccionada!,
        'proximos',
        { enabled: !!categoriaSeleccionada }
    );

    const { data: fixturesRecientes, isLoading: isLoadingFixturesRecientes } = useEquipoFixtures(
        idEquipo,
        categoriaSeleccionada!,
        'recientes',
        { enabled: !!categoriaSeleccionada }
    );

    const { data: solicitudes, isLoading: isLoadingSolicitudes } = useEquipoSolicitudes(
        idEquipo,
        categoriaSeleccionada!,
        undefined,
        { enabled: !!categoriaSeleccionada }
    );

    // Resetear página cuando cambia la categoría
    useEffect(() => {
        setPagePartidos(1);
    }, [categoriaSeleccionada]);

    if (isLoadingInfo) {
        return (
            <div className="space-y-6">
                <EquipoHeaderSkeleton />
            </div>
        );
    }

    if (errorInfo || !equipoInfo) {
        return (
            <div className="bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg p-6 text-center flex items-center justify-center flex-col">
                <AlertTriangle className="w-8 h-8 text-[var(--red)] mx-auto mb-3" />
                <h3 className="text-[var(--red)] font-medium mb-2">Error al cargar el equipo</h3>
                <p className="text-[var(--red)]/80 text-sm mb-4">
                    {errorInfo?.message || 'No se pudo cargar la información del equipo'}
                </p>
                <Button variant="danger" onClick={() => router.back()}>
                    Volver
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <EquipoHeader equipoInfo={equipoInfo} onBack={() => router.back()} />

            <CategoriaSelector
                categorias={categorias || []}
                categoriaSeleccionada={categoriaSeleccionada}
                onCategoriaChange={setSelectedCategoria}
            />

            <EquipoTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                {activeTab === 'info' && (
                    <EquipoInfoTab
                        equipoInfo={equipoInfo}
                        estadisticas={estadisticas}
                        isLoading={isLoadingInfo}
                        isLoadingEstadisticas={isLoadingEstadisticas}
                    />
                )}

                {activeTab === 'plantel' && (
                    <EquipoPlantelTab
                        plantel={plantel}
                        isLoading={isLoadingPlantel}
                        categoriaSeleccionada={categoriaSeleccionada}
                    />
                )}

                {activeTab === 'partidos' && (
                    <EquipoPartidosTab
                        partidos={partidos}
                        fixturesProximos={fixturesProximos}
                        fixturesRecientes={fixturesRecientes}
                        isLoading={isLoadingPartidos}
                        isLoadingProximos={isLoadingFixturesProximos}
                        isLoadingRecientes={isLoadingFixturesRecientes}
                        categoriaSeleccionada={categoriaSeleccionada}
                        page={pagePartidos}
                        onPageChange={setPagePartidos}
                        idEquipo={idEquipo}
                        equipoInfo={equipoInfo}
                    />
                )}

                {activeTab === 'tabla' && (
                    <EquipoTablaTab
                        tabla={tabla}
                        isLoading={isLoadingTabla}
                        categoriaSeleccionada={categoriaSeleccionada}
                        idEquipo={idEquipo}
                    />
                )}

                {activeTab === 'goleadores' && (
                    <EquipoGoleadoresTab
                        goleadores={goleadores}
                        isLoading={isLoadingGoleadores}
                        categoriaSeleccionada={categoriaSeleccionada}
                    />
                )}

                {activeTab === 'capitanes' && (
                    <EquipoCapitanesTab
                        capitanes={capitanes}
                        isLoading={isLoadingCapitanes}
                        categoriaSeleccionada={categoriaSeleccionada}
                    />
                )}

                {activeTab === 'solicitudes' && (
                    <EquipoSolicitudesTab
                        solicitudes={solicitudes}
                        isLoading={isLoadingSolicitudes}
                        categoriaSeleccionada={categoriaSeleccionada}
                    />
                )}
            </div>
        </div>
    );
};

// Componente principal que envuelve en Suspense
export default function EquipoDetallePage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <EquipoHeaderSkeleton />
      </div>
    }>
      <EquipoDetallePageContent />
    </Suspense>
  );
}
