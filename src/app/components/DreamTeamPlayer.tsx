import React from 'react';
import { JugadorDreamTeam } from '../types/dreamteam';
import { EscudoEquipo } from './common/EscudoEquipo';
import { ImagenPublica } from './common/ImagenPublica';

interface DreamTeamPlayerProps {
    jugador: JugadorDreamTeam;
}

export const DreamTeamPlayer: React.FC<DreamTeamPlayerProps> = ({ jugador }) => {

    return (
        <div className="flex flex-col items-center gap-1 text-center">
            {/* Logo Jugador con escudo del equipo */}
            <div className="relative flex">
                <ImagenPublica
                    src={jugador.usuario?.img}
                    alt={`${jugador.nombre} ${jugador.apellido}`}
                    width={33}
                    height={33}
                    className="rounded-full object-cover"
                />
                {/* Escudo del equipo */}
                {jugador.equipo?.img && (
                    <div className="absolute -bottom-0.5 -right-2.5">
                        <EscudoEquipo
                            src={jugador.equipo.img}
                            alt={jugador.equipo.nombre}
                            width={20}
                            height={20}
                        />
                    </div>
                )}
            </div>

            {/* Nombre del jugador */}
            <span className="text-white text-xs font-medium max-w-[60px] leading-tight">
                {jugador.nombre} {jugador.apellido}
            </span>
        </div>
    );
};

