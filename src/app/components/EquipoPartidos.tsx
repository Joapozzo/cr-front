import React from 'react';
import { CardUltimoPartido } from './CardUltimoPartido';
import { CardPartidoGenerico } from './CardPartidoGenerico';
import { Partido } from '../types/partido';
import { NextMatch } from './NextMatch';
import NextMatchSkeleton from './skeletons/NextMatchSkeleton';
import CardUltimoPartidoSkeleton from './skeletons/CardUltimoPartido'; 
import CardPartidoCategoriaSkeleton from './skeletons/CardPartidoCategoriaSkeleton'; 
import CardPartidoGenericoSkeleton from './skeletons/CardPartidoGenericoSkeleton';

interface EquipoPartidosProps {
    ultimoPartido?: Partido | null;
    ultimosPartidos?: Partido[];
    proximoPartido?: Partido | null;
    equipoSeleccionado?: number;
    nombreEquipo?: string;
    loadingProximo?: boolean;
    loadingUltimo?: boolean;
    loadingUltimos?: boolean;
}

export const EquipoPartidos: React.FC<EquipoPartidosProps> = ({
    ultimoPartido,
    ultimosPartidos = [],
    equipoSeleccionado,
    nombreEquipo = "Equipo",
    proximoPartido,
    loadingProximo = false,
    loadingUltimo = false,
    loadingUltimos = false,
}) => {
    
    return (
        <div className="flex flex-col w-full gap-5">
            {/* Próximo partido */}
            {loadingProximo ? (
                <NextMatchSkeleton />
            ) : proximoPartido ? (
                <NextMatch
                    partido={proximoPartido}
                    miEquipo={equipoSeleccionado}
                    nombreEquipo={nombreEquipo}
                />
            ) : null}

            {/* Último partido y últimos partidos */}
            <div>
                {loadingUltimo ? (
                    <CardUltimoPartidoSkeleton />
                ) : ultimoPartido ? (
                    <CardUltimoPartido
                        partido={ultimoPartido}
                        miEquipo={equipoSeleccionado}
                        nombreEquipo={nombreEquipo}
                    />
                ) : null}

                {loadingUltimos ? (
                    <CardPartidoGenericoSkeleton />
                ) : ultimosPartidos.length > 0 ? (
                    <div className="flex flex-col w-full rounded-b-lg overflow-hidden bg-[var(--black-900)]">
                        {ultimosPartidos.slice(0, 5).map((partido) => (
                            <CardPartidoGenerico
                                key={partido.id_partido}
                                partido={partido}
                                miEquipo={equipoSeleccionado}
                                mostrarDia={true}
                            />
                        ))}
                    </div>
                ) : null}
            </div>
        </div>
    );
};