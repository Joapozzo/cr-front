'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useEquipoCategorias, useEquipoGoleadores } from '@/app/hooks/legajos/useEquipos';
import { EquipoGoleadoresTab } from '@/app/components/legajos/equipos/EquipoGoleadoresTab';

export default function EquipoGoleadoresPageContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    
    const idEquipo = useMemo(() => {
        if (params?.id) {
            const id = Number(params.id);
            return !isNaN(id) && id > 0 ? id : null;
        }
        return null;
    }, [params?.id]);

    // Obtener categoría de la URL o usar la primera disponible
    const categoriaFromUrl = searchParams?.get('categoria');
    
    // Cargar categorías para obtener la primera si no hay en URL
    const { data: categorias } = useEquipoCategorias(
        idEquipo ?? 0,
        { enabled: idEquipo !== null }
    );

    const categoriaSeleccionada = useMemo(() => {
        if (categoriaFromUrl) {
            const categoriaId = Number(categoriaFromUrl);
            if (!isNaN(categoriaId)) return categoriaId;
        }
        return categorias?.[0]?.categoria_edicion.id_categoria_edicion;
    }, [categoriaFromUrl, categorias]);

    const { data: goleadores, isLoading: isLoadingGoleadores } = useEquipoGoleadores(
        idEquipo ?? 0,
        categoriaSeleccionada ?? 0,
        'goles',
        { enabled: idEquipo !== null && !!categoriaSeleccionada }
    );

    if (!idEquipo) {
        return null;
    }

    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
            <EquipoGoleadoresTab
                goleadores={goleadores}
                isLoading={isLoadingGoleadores}
                categoriaSeleccionada={categoriaSeleccionada}
            />
        </div>
    );
}

