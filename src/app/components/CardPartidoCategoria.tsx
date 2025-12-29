import React from 'react';
import CardPartidoGenerico from './CardPartidoGenerico';
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
    // Para categorías agrupadas
    categoria?: CategoriaPartidos;
    // Para partidos simples (por día)
    titulo?: string;
    subtitulo?: string;
    partidos?: Partido[];
}

export const CardPartidoCategoria: React.FC<CardPartidoCategoriaProps> = ({
    categoria,
    titulo,
    subtitulo,
    partidos = []
}) => {
    // Determinar los partidos a mostrar y el título
    const partidosAMostrar = categoria 
        ? categoria.zonas.flatMap(zona => zona.partidos)
        : partidos;
    
    const tituloAMostrar = categoria 
        ? categoria.nombre_categoria 
        : titulo || 'Partidos';
    
    const subtituloAMostrar = categoria 
        ? `Fecha ${categoria.jornada}` 
        : subtitulo;

    return (
        <div className="bg-[var(--black-900)] rounded-2xl overflow-hidden">
            {/* Header con título */}
            <div className="flex items-center justify-between px-6 py-4 bg-[var(--black-800)]">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-white font-bold">{tituloAMostrar}</span>
                    {subtituloAMostrar && (
                        <span className="text-[var(--black-300)]">| {subtituloAMostrar}</span>
                    )}
                </div>
            </div>

            {/* Lista de partidos */}
            <div className="flex flex-col">
                {partidosAMostrar.length === 0 ? (
                    <div className="px-6 py-4">
                        <p className="text-[var(--black-400)]">No hay partidos disponibles</p>
                    </div>
                ) : (
                    partidosAMostrar.map((partido) => {
                        // Adaptar Partido a PartidoEquipo con valores por defecto
                        const partidoAdaptado = {
                            ...partido,
                            equipoLocal: {
                                id_equipo: partido.id_equipolocal,
                                nombre: 'Equipo Local',
                                img: null
                            },
                            equipoVisita: {
                                id_equipo: partido.id_equipovisita,
                                nombre: 'Equipo Visita',
                                img: null
                            },
                            incidencias: {
                                goles: [],
                                expulsiones: []
                            }
                        } as any;
                        
                        return (
                            <CardPartidoGenerico
                                key={partido.id_partido}
                                partido={partidoAdaptado}
                            />
                        );
                    })
                )}
            </div>
        </div>
    );
};