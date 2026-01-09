import { JugadorDestacadoDt } from '@/app/types/jugador';
import { JugadorCard } from './JugadorCard';

interface JugadoresGridProps {
    jugadores: JugadorDestacadoDt[];
    jugadorSeleccionado: number | null;
    onSelectJugador: (jugadorId: number) => void;
}

/**
 * Componente presentacional que renderiza el grid de jugadores
 */
export const JugadoresGrid = ({
    jugadores,
    jugadorSeleccionado,
    onSelectJugador,
}: JugadoresGridProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {jugadores.map((jugador) => (
                <JugadorCard
                    key={jugador.id_jugador}
                    jugador={jugador}
                    isSelected={jugadorSeleccionado === jugador.id_jugador}
                    onSelect={onSelectJugador}
                />
            ))}
        </div>
    );
};

