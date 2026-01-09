import { Button } from '@/app/components/ui/Button';
import { ChevronLeft, ChevronRight, Calendar, Star } from 'lucide-react';

interface JornadaNavigatorProps {
    jornadaActual: number;
    indexActual: number;
    jornadasDisponibles: number[];
    cambiarJornada: (direccion: 'anterior' | 'siguiente') => void;
    vistaActual: 'fixture' | 'dreamteam';
    setVistaActual: (vista: 'fixture' | 'dreamteam') => void;
}

/**
 * Componente para navegar entre jornadas y cambiar entre vistas Fixture/DreamTeam
 */
export const JornadaNavigator = ({
    jornadaActual,
    indexActual,
    jornadasDisponibles,
    cambiarJornada,
    vistaActual,
    setVistaActual,
}: JornadaNavigatorProps) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => cambiarJornada('anterior')}
                    disabled={indexActual <= 0}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-[var(--white)] font-medium text-lg text-center">
                    Fecha {jornadaActual}
                </span>
                <Button
                    variant="ghost"
                    onClick={() => cambiarJornada('siguiente')}
                    disabled={indexActual >= jornadasDisponibles.length - 1}
                    className="flex items-end justify-end"
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
            <div className="flex items-center gap-2">
                <Button
                    variant={vistaActual === 'fixture' ? 'more' : 'default'}
                    onClick={() => setVistaActual('fixture')}
                    className="flex items-center gap-2"
                >
                    <Calendar size={14} />
                    Fixture
                </Button>
                <Button
                    variant={vistaActual === 'dreamteam' ? 'more' : 'default'}
                    onClick={() => setVistaActual('dreamteam')}
                    className="flex items-center gap-2"
                >
                    <Star size={14} />
                    DreamTeam
                </Button>
            </div>
        </div>
    );
};

