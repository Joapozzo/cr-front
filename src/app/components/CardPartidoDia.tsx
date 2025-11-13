import React from 'react';
import { CardPartidoGenerico } from './CardPartidoGenerico';
import { Partido } from '../types/partido';

interface CategoriaPartidos {
    id_categoria_edicion: number;
    nombre_categoria: string;
    jornada: number;
    zonas: {
        nombre_zona: string;
        partidos: Partido[];
    }[];
}

interface CardPartidoCategoriaProps {
    categoria: CategoriaPartidos;
}

export const CardPartidoCategoria: React.FC<CardPartidoCategoriaProps> = ({
    categoria
}) => {
    // Aplanar todos los partidos de todas las zonas
    const todosLosPartidos = categoria.zonas.flatMap(zona => zona.partidos);

    return (
        <div className="bg-[var(--black-900)] rounded-2xl overflow-hidden">
            {/* Header con título de categoría */}
            <div className="flex items-center justify-between px-6 py-4 bg-[var(--black-800)]">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-white font-bold">{categoria.nombre_categoria}</span>
                    <span className="text-[var(--black-300)]">| Fecha {categoria.jornada}</span>
                </div>
            </div>

            {/* Lista de partidos */}
            <div className="flex flex-col">
                {todosLosPartidos.map((partido) => (
                    <CardPartidoGenerico
                        key={partido.id_partido}
                        partido={partido}
                        mostrarDia={true}
                    />
                ))}
            </div>
        </div>
    );
};