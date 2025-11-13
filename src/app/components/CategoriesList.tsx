import React from 'react';
import Link from 'next/link';
import { EdicionHome } from '../types/edicion';
import { Categoria } from '../types/categoria';

interface CategoriesListProps {
    ediciones: EdicionHome[];
    categorias: Categoria[];
}

const CategoriesList: React.FC<CategoriesListProps> = ({ ediciones, categorias }) => {
    return (
        <>
            {ediciones.map((edicion) => {
                // Filtrar categorías de esta edición
                const categoriasDeEdicion = categorias.filter(
                    (categoria) => categoria.id_edicion === edicion.id_edicion
                );

                if (categoriasDeEdicion.length === 0) return null;

                return (
                    <div
                        key={edicion.id_edicion}
                        className="flex flex-col bg-[var(--black-900)] rounded-[20px] overflow-hidden"
                    >
                        <div className="px-6 py-4 border-b border-[var(--black-800)] flex flex-col gap-1">
                            <p className="font-bold text-white">
                                {edicion.nombre} {edicion.temporada}
                            </p>
                        </div>

                        <div className="py-2 flex flex-col">
                            {categoriasDeEdicion.map((categoria) => (
                                <Link
                                    key={categoria.id_categoria}
                                    href={`/categoria/posiciones/${categoria.id_categoria}`}
                                    className="px-6 py-2 cursor-pointer font-normal text-sm text-white hover:bg-[var(--black-800)] transition-colors duration-200"
                                >
                                    {categoria.nombre}
                                </Link>
                            ))}
                        </div>
                    </div>
                );
            })}
        </>
    );
};

export default CategoriesList;