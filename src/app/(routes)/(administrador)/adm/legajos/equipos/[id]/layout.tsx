'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import { useEquipoDetalle, useEquipoCategorias } from '@/app/hooks/legajos/useEquipos';
import { EquipoHeader } from '@/app/components/legajos/equipos/EquipoHeader';
import { CategoriaSelector } from '@/app/components/legajos/equipos/CategoriaSelector';
import { EquipoTabs } from '@/app/components/legajos/equipos/EquipoTabs';
import { EquipoHeaderSkeleton } from '@/app/components/legajos/equipos/EquipoHeaderSkeleton';

// Componente interno que necesita acceso a hooks
const EquipoLayoutContent = ({ children }: { children: React.ReactNode }) => {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();

    // Memoizar y validar el ID de equipo
    const idEquipo = useMemo(() => {
        if (params?.id) {
            const id = Number(params.id);
            return !isNaN(id) && id > 0 ? id : null;
        }
        return null;
    }, [params?.id]);

    // Obtener información básica solo para el header
    const { data: equipoInfo, isLoading: isLoadingInfo, error: errorInfo } = useEquipoDetalle(
        idEquipo ?? 0,
        { enabled: idEquipo !== null }
    );

    // Obtener categorías para el selector
    const { data: categorias } = useEquipoCategorias(
        idEquipo ?? 0,
        { enabled: idEquipo !== null }
    );

    // Obtener categoría de la URL o usar la primera disponible
    const categoriaFromUrl = searchParams?.get('categoria');
    const categoriaSeleccionada = useMemo(() => {
        if (categoriaFromUrl) {
            const categoriaId = Number(categoriaFromUrl);
            if (!isNaN(categoriaId)) return categoriaId;
        }
        return categorias?.[0]?.categoria_edicion.id_categoria_edicion;
    }, [categoriaFromUrl, categorias]);

    const handleCategoriaChange = (id: number) => {
        const pathname = window.location.pathname;
        router.replace(`${pathname}?categoria=${id}`);
    };

    // Early return si no hay ID válido
    if (!idEquipo) {
        return (
            <div className="space-y-6">
                <EquipoHeaderSkeleton />
            </div>
        );
    }

    if (isLoadingInfo) {
        return (
            <div className="space-y-6">
                <EquipoHeaderSkeleton />
            </div>
        );
    }

    if (errorInfo || !equipoInfo) {
        return (
            <div className="bg-[var(--red)]/10 border border-[var(--red)]/30 rounded-lg p-6 text-center flex flex-col items-center justify-center">
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
                onCategoriaChange={handleCategoriaChange}
            />
            <EquipoTabs idEquipo={idEquipo} />
            {children}
        </div>
    );
};

// Layout principal que envuelve en Suspense
export default function EquipoLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense
            fallback={
                <div className="space-y-6">
                    <EquipoHeaderSkeleton />
                </div>
            }
        >
            <EquipoLayoutContent>{children}</EquipoLayoutContent>
        </Suspense>
    );
}