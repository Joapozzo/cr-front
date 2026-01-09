import { Plus, X } from 'lucide-react';
import { JugadorDreamTeam } from '@/app/types/dreamteam';
import { EscudoEquipo } from '../../common/EscudoEquipo';
import { ImagenPublica } from '../../common/ImagenPublica';

interface DreamTeamPlayerSlotProps {
    posicionIndex: number;
    posicionNombre: string;
    jugador: JugadorDreamTeam | undefined;
    isPublished: boolean;
    onSlotClick: () => void;
}

/**
 * Componente presentacional para un slot individual de jugador
 */
export const DreamTeamPlayerSlot = ({
    posicionIndex,
    posicionNombre,
    jugador,
    isPublished,
    onSlotClick,
}: DreamTeamPlayerSlotProps) => {
    return (
        <div className="flex flex-col items-center relative">
            <div
                className={`relative group ${isPublished ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                onClick={onSlotClick}
            >
                {/* Avatar del jugador */}
                <div className={`w-14 h-14 rounded-full border-2 shadow-lg flex items-center justify-center overflow-hidden transition-transform hover:scale-110 bg-[var(--gray-400)] ${
                    jugador 
                        ? 'border-[var(--color-primary)]' 
                        : 'border-[var(--gray-200)]'
                }`}>
                    <ImagenPublica
                        src={jugador?.usuario?.img}
                        alt={`${jugador?.nombre} ${jugador?.apellido}`}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Escudo del equipo - arriba a la izquierda */}
                {jugador?.equipo?.img && (
                    <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full shadow-md flex items-center justify-center z-10">
                        <EscudoEquipo
                            src={jugador.equipo.img}
                            alt={jugador.equipo.nombre}
                            size={16}
                        />
                    </div>
                )}

                {/* Badge de posición */}
                <div className="absolute -bottom-1 -right-1 w-auto min-w-[24px] px-1.5 h-6 bg-[var(--gray-100)] text-[var(--gray-500)] rounded-full text-xs font-bold flex items-center justify-center shadow-md">
                    {posicionNombre || posicionIndex}
                </div>

                {/* Indicador visual de acción */}
                {!isPublished && (
                    jugador ? (
                        <div className="absolute -top-2 -right-2 bg-[var(--color-secondary)] text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10 pointer-events-none flex items-center justify-center">
                            <X className="w-3 h-3" />
                        </div>
                    ) : (
                        <div className="absolute -top-1 -left-1 w-6 h-6 bg-[var(--color-primary)] hover:bg-[var(--color-primary-strong)] text-white rounded-full transition-all duration-200 shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none flex items-center justify-center">
                            <Plus className="w-3 h-3" />
                        </div>
                    )
                )}
            </div>

            {jugador && (
                <div className="mt-3 text-center">
                    <div className="bg-[var(--gray-400)] border border-[var(--gray-300)] text-[var(--white)] text-xs font-medium px-3 py-1 rounded shadow-lg">
                        {jugador.nombre} {jugador.apellido}
                    </div>
                </div>
            )}
        </div>
    );
};

