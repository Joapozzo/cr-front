'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import {
    useJugadorDetalle,
    useJugadorEquipos,
    useJugadorEstadisticasGenerales,
    useJugadorEstadisticasPorCategoria,
    useJugadorPartidos,
    useJugadorDisciplina,
    useJugadorSolicitudes,
} from '@/app/hooks/legajos/useJugadores';
import { JugadorHeader } from '@/app/components/legajos/jugadores/JugadorHeader';
import { JugadorTabs } from '@/app/components/legajos/jugadores/JugadorTabs';
import { JugadorInfoTab } from '@/app/components/legajos/jugadores/JugadorInfoTab';
import { JugadorEquiposTab } from '@/app/components/legajos/jugadores/JugadorEquiposTab';
import { JugadorPartidosTab } from '@/app/components/legajos/jugadores/JugadorPartidosTab';
import { JugadorEstadisticasTab } from '@/app/components/legajos/jugadores/JugadorEstadisticasTab';
import { JugadorDisciplinaTab } from '@/app/components/legajos/jugadores/JugadorDisciplinaTab';
import { JugadorSolicitudesTab } from '@/app/components/legajos/jugadores/JugadorSolicitudesTab';
import { JugadorHeaderSkeleton } from '@/app/components/legajos/jugadores/JugadorHeaderSkeleton';

type TabType = 'info' | 'equipos' | 'partidos' | 'estadisticas' | 'disciplina' | 'solicitudes';

// Componente interno con la lógica
const JugadorDetallePageContent = () => {
    const params = useParams();
    const router = useRouter();
    const idJugador = Number(params.id);
    const [activeTab, setActiveTab] = useState<TabType>('info');
    const [selectedCategoria, setSelectedCategoria] = useState<number | undefined>(undefined);
    const [pagePartidos, setPagePartidos] = useState(1);

    // Obtener información básica
    const { data: jugadorInfo, isLoading: isLoadingInfo, error: errorInfo } = useJugadorDetalle(idJugador);
    // Cargar equipos siempre para obtener categorías
    const { data: equipos, isLoading: isLoadingEquipos } = useJugadorEquipos(idJugador);

    // Obtener categorías disponibles desde equipos
    const categoriasDisponibles = equipos?.flatMap(edicion => 
        edicion.categorias.flatMap(cat => 
            cat.planteles.map(plantel => ({
                id_categoria_edicion: plantel.categoria_edicion.id_categoria_edicion,
                categoria: cat.categoria,
                edicion: edicion.edicion
            }))
        )
    ) || [];

    // Eliminar duplicados de categorías
    const categoriasUnicas = categoriasDisponibles.filter((cat, index, self) =>
        index === self.findIndex(c => c.id_categoria_edicion === cat.id_categoria_edicion)
    );

    // Seleccionar primera categoría por defecto cuando se cargan las categorías
    useEffect(() => {
        if (categoriasUnicas.length > 0 && !selectedCategoria) {
            setSelectedCategoria(categoriasUnicas[0].id_categoria_edicion);
        }
    }, [categoriasUnicas, selectedCategoria]);

    const categoriaSeleccionada = selectedCategoria || categoriasUnicas[0]?.id_categoria_edicion;

    // Hooks condicionales según la categoría seleccionada - SIEMPRE cargar cuando hay categoría
    const { data: estadisticasGenerales, isLoading: isLoadingEstadisticasGenerales } = useJugadorEstadisticasGenerales(
        idJugador,
        { enabled: true }
    );

    const { data: estadisticasPorCategoria, isLoading: isLoadingEstadisticasPorCategoria } = useJugadorEstadisticasPorCategoria(
        idJugador,
        categoriaSeleccionada!,
        { enabled: !!categoriaSeleccionada }
    );

    const { data: partidos, isLoading: isLoadingPartidos } = useJugadorPartidos(
        idJugador,
        {
            page: pagePartidos,
            limit: 15,
            id_categoria_edicion: categoriaSeleccionada,
        },
        { enabled: !!categoriaSeleccionada }
    );

    const { data: disciplina, isLoading: isLoadingDisciplina } = useJugadorDisciplina(
        idJugador,
        categoriaSeleccionada,
        { enabled: !!categoriaSeleccionada }
    );

    const { data: solicitudes, isLoading: isLoadingSolicitudes } = useJugadorSolicitudes(
        idJugador,
        undefined,
        { enabled: true }
    );

    // Resetear página cuando cambia la categoría
    useEffect(() => {
        setPagePartidos(1);
    }, [categoriaSeleccionada]);

    if (isLoadingInfo) {
        return (
            <div className="space-y-6">
                <JugadorHeaderSkeleton />
            </div>
        );
    }

    if (errorInfo || !jugadorInfo) {
        return (
            <div className="bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg p-6 text-center flex flex-col items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-[var(--red)] mx-auto mb-3" />
                <h3 className="text-[var(--red)] font-medium mb-2">Error al cargar el jugador</h3>
                <p className="text-[var(--red)]/80 text-sm mb-4">
                    {errorInfo?.message || 'No se pudo cargar la información del jugador'}
                </p>
                <Button variant="danger" onClick={() => router.back()}>
                    Volver
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <JugadorHeader jugadorInfo={jugadorInfo} onBack={() => router.back()} />

            {categoriasUnicas.length > 0 && (
                <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-4">
                    <label className="text-sm font-medium text-[var(--white)] mb-2 block">
                        Seleccionar categoría
                    </label>
                    <select
                        value={categoriaSeleccionada || ''}
                        onChange={(e) => setSelectedCategoria(Number(e.target.value))}
                        className="block w-full px-3 py-2 border border-[var(--gray-300)] rounded-lg bg-[var(--gray-300)] text-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    >
                        {categoriasUnicas.map((cat) => (
                            <option key={cat.id_categoria_edicion} value={cat.id_categoria_edicion}>
                                {cat.categoria.nombre || 'Categoría'} - {cat.edicion.nombre || cat.edicion.temporada}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <JugadorTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                {activeTab === 'info' && (
                    <JugadorInfoTab
                        jugadorInfo={jugadorInfo}
                        estadisticas={estadisticasGenerales}
                        isLoading={isLoadingInfo}
                        isLoadingEstadisticas={isLoadingEstadisticasGenerales}
                    />
                )}

                {activeTab === 'equipos' && (
                    <JugadorEquiposTab
                        equipos={equipos}
                        isLoading={isLoadingEquipos}
                    />
                )}

                {activeTab === 'partidos' && (
                    <JugadorPartidosTab
                        partidos={partidos}
                        isLoading={isLoadingPartidos}
                        categoriaSeleccionada={categoriaSeleccionada}
                        page={pagePartidos}
                        onPageChange={setPagePartidos}
                        idJugador={idJugador}
                    />
                )}

                {activeTab === 'estadisticas' && (
                    <JugadorEstadisticasTab
                        estadisticasGenerales={estadisticasGenerales}
                        estadisticasPorCategoria={estadisticasPorCategoria}
                        isLoading={isLoadingEstadisticasGenerales || isLoadingEstadisticasPorCategoria}
                        categoriaSeleccionada={categoriaSeleccionada}
                    />
                )}

                {activeTab === 'disciplina' && (
                    <JugadorDisciplinaTab
                        disciplina={disciplina}
                        isLoading={isLoadingDisciplina}
                        categoriaSeleccionada={categoriaSeleccionada}
                    />
                )}

                {activeTab === 'solicitudes' && (
                    <JugadorSolicitudesTab
                        solicitudes={solicitudes}
                        isLoading={isLoadingSolicitudes}
                    />
                )}
            </div>
        </div>
    );
};

// Componente principal que envuelve en Suspense
export default function JugadorDetallePage() {
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <JugadorHeaderSkeleton />
      </div>
    }>
      <JugadorDetallePageContent />
    </Suspense>
  );
}

