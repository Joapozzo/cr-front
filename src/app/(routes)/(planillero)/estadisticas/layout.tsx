'use client';

import { useMemo, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { UserPageWrapper } from '@/app/components/layouts/UserPageWrapper';
import { EdicionLayout } from '@/app/components/layouts/EdicionLayout';
import { SelectorEdicionCategoria } from '@/app/components/estadisticas/SelectorEdicionCategoria';
import { EstadisticasTabs, EstadisticaTab } from '@/app/components/estadisticas/EstadisticasTabs';
import { useEdicionCategoria } from '@/app/contexts/EdicionCategoriaContext';

interface EstadisticasLayoutProps {
  children: React.ReactNode;
}

function EstadisticasLayoutContent({ children }: EstadisticasLayoutProps) {
  const searchParams = useSearchParams();
  const categoriaQueryProcessed = useRef(false);

  const {
    categoriaSeleccionada,
    edicionActual,
    isLoading: loadingCategorias,
    categoriasDisponibles,
    setCategoriaSeleccionada
  } = useEdicionCategoria();

  // Memoizar el ID de categoría del query param para evitar re-parsing
  const categoriaIdFromQuery = useMemo(() => {
    const categoriaParam = searchParams.get('categoria');
    if (!categoriaParam) return null;
    const parsed = parseInt(categoriaParam, 10);
    return isNaN(parsed) ? null : parsed;
  }, [searchParams]);

  // Obtener el tipo de estadística desde search params o pathname
  const tipoEstadistica = useMemo(() => {
    const tipoParam = searchParams.get('tipo');
    if (tipoParam && ['posiciones', 'goleadores', 'asistencias', 'amarillas', 'rojas', 'mvps'].includes(tipoParam)) {
      return tipoParam as EstadisticaTab;
    }
    // Si no hay tipo, default a posiciones
    return 'posiciones' as EstadisticaTab;
  }, [searchParams]);

  // Leer query param de categoría y seleccionarla (optimizado para performance)
  useEffect(() => {
    if (categoriaIdFromQuery && categoriasDisponibles.length > 0) {
      if (categoriaSeleccionada?.id === categoriaIdFromQuery) {
        categoriaQueryProcessed.current = true;
        return;
      }

      const categoria = categoriasDisponibles.find(cat => cat.id === categoriaIdFromQuery);
      if (categoria && !categoriaQueryProcessed.current) {
        setCategoriaSeleccionada(categoria);
        categoriaQueryProcessed.current = true;
        // No actualizamos la URL aquí porque ya viene del query param
      }
    } else {
      categoriaQueryProcessed.current = false;
    }
  }, [categoriaIdFromQuery, categoriasDisponibles, categoriaSeleccionada?.id, setCategoriaSeleccionada]);

  return (
    <UserPageWrapper>
      <EdicionLayout
        nombreEdicion={edicionActual?.nombre || 'Copa Relámpago'}
        temporada={edicionActual?.temporada?.toString() || '2025'}
        nombreCategoria={categoriaSeleccionada?.nombre}
        logoEdicion={edicionActual?.img || undefined}
        loading={loadingCategorias}
      >
        <div className="w-full space-y-6">
          {/* Selector de edición y categoría */}
          <SelectorEdicionCategoria />

          {/* Tabs de estadísticas - Solo mostrar si hay categoría seleccionada */}
          {categoriaSeleccionada ? (
            <>
              <Suspense fallback={<div className="h-16 bg-[var(--black-800)] rounded-xl animate-pulse" />}>
                <EstadisticasTabs activeTab={tipoEstadistica} />
              </Suspense>
              <div className="min-h-[300px]">
                {children}
              </div>
            </>
          ) : edicionActual && !loadingCategorias ? (
            <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12">
              <p className="text-[#737373] text-center text-sm">
                Esta edición no tiene categorías disponibles
              </p>
            </div>
          ) : !edicionActual && !loadingCategorias ? (
            <div className="bg-[var(--black-900)] border border-[#262626] rounded-xl p-12">
              <p className="text-[#737373] text-center text-sm">
                No hay ediciones disponibles
              </p>
            </div>
          ) : null}
        </div>
      </EdicionLayout>
    </UserPageWrapper>
  );
}

export default function EstadisticasLayout({ children }: EstadisticasLayoutProps) {
  return (
    <Suspense fallback={
      <UserPageWrapper>
        <div className="w-full space-y-6">
          <div className="h-10 bg-[var(--black-800)] rounded-lg animate-pulse" />
          <div className="h-64 bg-[var(--black-800)] rounded-xl animate-pulse" />
        </div>
      </UserPageWrapper>
    }>
      <EstadisticasLayoutContent>{children}</EstadisticasLayoutContent>
    </Suspense>
  );
}

