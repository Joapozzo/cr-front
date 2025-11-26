'use client';

import { CategoriaEquipo } from '@/app/types/legajos';

interface CategoriaSelectorProps {
    categorias: CategoriaEquipo[];
    categoriaSeleccionada: number | undefined;
    onCategoriaChange: (id: number) => void;
}

export const CategoriaSelector = ({ categorias, categoriaSeleccionada, onCategoriaChange }: CategoriaSelectorProps) => {
    if (!categorias || categorias.length === 0) return null;

    return (
        <div className="bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] p-4">
            <label className="text-sm font-medium text-[var(--white)] mb-2 block">
                Seleccionar Categoría-Edición
            </label>
            <select
                value={categoriaSeleccionada || ''}
                onChange={(e) => onCategoriaChange(Number(e.target.value))}
                className="block w-full px-3 py-2 border border-[var(--gray-300)] rounded-lg bg-[var(--gray-300)] text-[var(--white)] focus:outline-none focus:ring-2 focus:ring-[var(--green)]"
            >
                {categorias.map((cat) => (
                    <option key={cat.categoria_edicion.id_categoria_edicion} value={cat.categoria_edicion.id_categoria_edicion}>
                        {cat.categoria_edicion.categoria.nombre || 'Categoría'} - {cat.categoria_edicion.edicion.nombre || cat.categoria_edicion.edicion.temporada}
                    </option>
                ))}
            </select>
        </div>
    );
};

