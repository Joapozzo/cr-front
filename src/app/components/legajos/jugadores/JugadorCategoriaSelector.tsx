'use client';

import { HistorialEquiposJugador } from '@/app/types/legajos';
import { useMemo } from 'react';

interface CategoriaOption {
    id_categoria_edicion: number;
    categoria: { nombre: string | null; division: string | null };
    edicion: { nombre: string | null; temporada: number | null };
}

interface JugadorCategoriaSelectorProps {
    equipos: HistorialEquiposJugador[] | undefined;
    categoriaSeleccionada: number | undefined;
    onCategoriaChange: (idCategoria: number) => void;
}

export const JugadorCategoriaSelector = ({
    equipos,
    categoriaSeleccionada,
    onCategoriaChange,
}: JugadorCategoriaSelectorProps) => {
    // Obtener categorías disponibles desde equipos
    const categoriasUnicas = useMemo<CategoriaOption[]>(() => {
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

        // Eliminar duplicados
        return categoriasDisponibles.filter((cat, index, self) =>
            index === self.findIndex(c => c.id_categoria_edicion === cat.id_categoria_edicion)
        );
    }, [equipos]);

    if (categoriasUnicas.length === 0) {
        return null;
    }

    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-4">
            <label className="text-sm font-medium text-[var(--white)] mb-2 block">
                Seleccionar categoría
            </label>
            <select
                value={categoriaSeleccionada || ''}
                onChange={(e) => onCategoriaChange(Number(e.target.value))}
                className="block w-full px-3 py-2 border border-[var(--gray-300)] rounded-lg bg-[var(--gray-300)] text-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            >
                {categoriasUnicas.map((cat) => (
                    <option key={cat.id_categoria_edicion} value={cat.id_categoria_edicion}>
                        {cat.categoria.nombre || 'Categoría'} - {cat.edicion.nombre || cat.edicion.temporada}
                    </option>
                ))}
            </select>
        </div>
    );
};
