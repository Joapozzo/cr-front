import React from 'react';
import { JugadorDreamTeam } from '../types/dreamteam';
import { DreamTeamPlayer } from './DreamTeamPlayer';

interface DreamTeamFieldProps {
    jugadoresOrganizados: JugadorDreamTeam[][];
    formacion: string;
}

export const DreamTeamField: React.FC<DreamTeamFieldProps> = ({
    jugadoresOrganizados,
    formacion
}) => {
    return (
        <div className="flex flex-col items-center w-full text-white relative py-4 gap-3 min-h-[350px] max-h-[400px]">
            {/* Formación */}
            <div className="text-center mb-2 z-10">
                <span className="text-[var(--color-primary)] font-medium">{formacion}</span>
            </div>

            {/* Filas de jugadores */}
            {jugadoresOrganizados.map((fila, filaIndex) => (
                <div key={filaIndex} className="flex w-full justify-around items-center gap-5 z-10">
                    {fila.map((jugador) => (
                        <DreamTeamPlayer key={jugador.id_jugador} jugador={jugador} />
                    ))}
                </div>
            ))}

            {/* SVG Background - Cancha de fútbol */}
            <div className="absolute bottom-0 left-0 w-full px-[15%] overflow-hidden rotate-180 z-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 316 174" className="fill-[var(--black-700)] opacity-40">
                    <g id="Group_4486" data-name="Group 4486" transform="translate(84.168)">
                        <path
                            id="Path_2174"
                            d="M57 0h5.907v50.136a5.92 5.92 0 0 0 5.907 5.9H192.85a5.92 5.92 0 0 0 5.907-5.9V0h5.907v50.136a11.84 11.84 0 0 1-11.813 11.8H68.813A11.84 11.84 0 0 1 57 50.136z"
                            data-name="Path 2174"
                            transform="translate(-57)"
                        />
                    </g>
                    <path
                        id="Path_2175"
                        d="M11.813 150.407h90.813a76.778 76.778 0 0 0 110.748 0h90.813A11.839 11.839 0 0 0 316 138.61V0h-5.906v138.61a5.92 5.92 0 0 1-5.907 5.9H11.813a5.92 5.92 0 0 1-5.907-5.9V0H0v138.61a11.84 11.84 0 0 0 11.813 11.797zm193 0a70.761 70.761 0 0 1-93.619 0z"
                        data-name="Path 2175"
                    />
                </svg>
            </div>
        </div>
    );
};

