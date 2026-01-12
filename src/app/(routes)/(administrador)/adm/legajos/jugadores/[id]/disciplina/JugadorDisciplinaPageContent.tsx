'use client';

import { useParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { useJugadorEquipos, useJugadorDisciplina } from '@/app/hooks/legajos/useJugadores';
import { JugadorDisciplinaTab } from '@/app/components/legajos/jugadores/JugadorDisciplinaTab';
import { JugadorCategoriaSelector } from '@/app/components/legajos/jugadores/JugadorCategoriaSelector';

export default function JugadorDisciplinaPageContent() {
    const params = useParams();
    
    const idJugador = useMemo(() => {
        if (params?.id) {
            const id = Number(params.id);
            return !isNaN(id) && id > 0 ? id : null;
        }
        return null;
    }, [params?.id]);

    // Cargar equipos para obtener categorías
    const { data: equipos } = useJugadorEquipos(
        idJugador ?? 0,
        { enabled: idJugador !== null }
    );

    // Obtener categorías disponibles desde equipos
    const categoriasUnicas = useMemo(() => {
        if (!equipos) return [];
        const categoriasDisponibles = equipos.flatMap(edicion =>
            edicion.categorias.flatMap(cat =>
                cat.planteles.map(plantel => ({
                    id_categoria_edicion: plantel.categoria_edicion.id_categoria_edicion,
                    categoria: cat.categoria,
                    edicion: edicion.edicion
                }))
            )
        );
        return categoriasDisponibles.filter((cat, index, self) =>
            index === self.findIndex(c => c.id_categoria_edicion === cat.id_categoria_edicion)
        );
    }, [equipos]);

    const [selectedCategoria, setSelectedCategoria] = useState<number | undefined>(undefined);

    // Seleccionar primera categoría por defecto cuando se cargan las categorías
    useEffect(() => {
        if (categoriasUnicas.length > 0 && !selectedCategoria) {
            setSelectedCategoria(categoriasUnicas[0].id_categoria_edicion);
        }
    }, [categoriasUnicas, selectedCategoria]);

    const categoriaSeleccionada = selectedCategoria || categoriasUnicas[0]?.id_categoria_edicion;

    const { data: disciplina, isLoading: isLoadingDisciplina } = useJugadorDisciplina(
        idJugador ?? 0,
        categoriaSeleccionada,
        { enabled: idJugador !== null && !!categoriaSeleccionada }
    );

    if (!idJugador) {
        return null;
    }

    return (
        <>
            <JugadorCategoriaSelector
                equipos={equipos}
                categoriaSeleccionada={categoriaSeleccionada}
                onCategoriaChange={setSelectedCategoria}
            />
            <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-6">
                <JugadorDisciplinaTab
                    disciplina={disciplina}
                    isLoading={isLoadingDisciplina}
                    categoriaSeleccionada={categoriaSeleccionada}
                />
            </div>
        </>
    );
}

