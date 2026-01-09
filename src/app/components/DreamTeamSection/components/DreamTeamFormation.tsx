import CardCanchaFutbol from '../../CardCanchaFutbol';
import { DreamTeamPlayerSlot } from './DreamTeamPlayerSlot';
import { JugadorDreamTeam } from '@/app/types/dreamteam';
import { MAPEO_POSICIONES_CODIGOS } from '@/app/utils/formacionesDT';

interface DreamTeamFormationProps {
    formacionActual: number[];
    formacionNombre: string;
    jugadores: JugadorDreamTeam[];
    isPublished: boolean;
    onSlotClick: (posicionIndex: number) => void;
}

/**
 * Helper puro para obtener jugador por posición
 */
const getJugadorPorPosicion = (
    jugadores: JugadorDreamTeam[],
    posicionIndex: number
): JugadorDreamTeam | undefined => {
    return jugadores.find((j) => j.posicion_index === posicionIndex);
};

/**
 * Componente presentacional que renderiza el campo de fútbol con la formación
 */
export const DreamTeamFormation = ({
    formacionActual,
    formacionNombre,
    jugadores,
    isPublished,
    onSlotClick,
}: DreamTeamFormationProps) => {
    return (
        <div
            className="relative bg-transparent border-2 border-[var(--gray-200)] rounded-xl overflow-hidden w-full"
            style={{ aspectRatio: '1.4/1', minHeight: '700px' }}
        >
            <CardCanchaFutbol />

            {/* Jugadores */}
            <div className="absolute inset-0 p-6 z-10 flex flex-col justify-center">
                {formacionActual.map((cantidad, filaIndex) => {
                    const posicionesInicio = formacionActual
                        .slice(0, filaIndex)
                        .reduce((acc, num) => acc + num, 0);

                    // Calcular espaciado vertical - arquero abajo, delanteros arriba
                    const filaInvertida = formacionActual.length - 1 - filaIndex;
                    const espacioVertical = 0.2 + (filaInvertida / (formacionActual.length - 1)) * 0.6;

                    return (
                        <div
                            key={filaIndex}
                            className="absolute flex justify-center items-center w-full"
                            style={{
                                top: `${espacioVertical * 100}%`,
                                transform: 'translateY(-50%)',
                                left: '50%',
                                marginLeft: '-50%',
                            }}
                        >
                            <div
                                className="flex justify-center items-center gap-30"
                                style={{ width: '90%' }}
                            >
                                {Array.from({ length: cantidad }).map((_, jugadorIndex) => {
                                    const posicionIndex = posicionesInicio + jugadorIndex + 1;
                                    const posicionInfo =
                                        MAPEO_POSICIONES_CODIGOS[formacionNombre]?.[String(posicionIndex)];

                                    const jugador = getJugadorPorPosicion(jugadores, posicionIndex);

                                    return (
                                        <DreamTeamPlayerSlot
                                            key={jugadorIndex}
                                            posicionIndex={posicionIndex}
                                            posicionNombre={posicionInfo?.nombre || String(posicionIndex)}
                                            jugador={jugador}
                                            isPublished={isPublished}
                                            onSlotClick={() => onSlotClick(posicionIndex)}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

