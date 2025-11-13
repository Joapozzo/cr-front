import React from 'react';
import { ButtonFilter } from "./ui/ButtonFilter";
import { CardComponent } from './CardComponent';

interface PartidosFiltrosProps {
    filtroActivo: string;
    setFiltroActivo: (filtro: string) => void;
}

export const PartidosFiltros: React.FC<PartidosFiltrosProps> = ({
    filtroActivo,
    setFiltroActivo,
}) => {
    return (

            <CardComponent titulo='Filtrar partidos'>
                <div className="flex items-center gap-2.5">
                    <ButtonFilter
                        isActive={filtroActivo === "categoria"}
                        onClick={() => setFiltroActivo("categoria")}
                    >
                        Por categoría
                    </ButtonFilter>

                    <ButtonFilter
                        isActive={filtroActivo === "dia"}
                        onClick={() => setFiltroActivo("dia")}
                    >
                        Por día
                    </ButtonFilter>
                </div>
            </CardComponent>
    );
};