import React, { useState, useCallback } from 'react';
import { JugadorPlantel } from '@/app/types/partido';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface SwipeableJugadorRowProps {
    jugador: JugadorPlantel;
    equipoId: number;
    equipo: 'local' | 'visita';
    limiteEnCancha: number;
    jugadoresEnCanchaActuales: number;
    enCancha: boolean;
    esTitularOriginal: boolean; // true = titular desde inicio, false = entró después
    onToggleEnCancha: (jugadorId: number, equipoId: number) => Promise<void>;
    children: React.ReactNode;
    disabled?: boolean;
}

const SWIPE_THRESHOLD = 50;

const SwipeableJugadorRow: React.FC<SwipeableJugadorRowProps> = ({
    jugador,
    equipoId,
    limiteEnCancha,
    jugadoresEnCanchaActuales,
    enCancha,
    esTitularOriginal: _esTitularOriginal,
    onToggleEnCancha,
    children,
    disabled = false
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnd = useCallback(async (event: any, info: any) => {
        setIsDragging(false);
        
        if (disabled || isProcessing || !jugador.dorsal) {
            return;
        }

        const offset = info.offset.x;
        const velocity = info.velocity.x;

        // Swipe hacia la derecha = marcar en cancha
        if (offset > SWIPE_THRESHOLD || velocity > 500) {
            if (!enCancha) {
                // Validar límite
                if (jugadoresEnCanchaActuales >= limiteEnCancha) {
                    if (navigator.vibrate) {
                        navigator.vibrate(200);
                    }
                    toast.error(`Máximo ${limiteEnCancha} jugadores en cancha`);
                    return;
                }

                setIsProcessing(true);
                try {
                    await onToggleEnCancha(jugador.id_jugador, equipoId);
                    if (navigator.vibrate) {
                        navigator.vibrate(50);
                    }
                } catch (error: any) {
                    console.error('Error al marcar jugador en cancha:', error);
                    if (navigator.vibrate) {
                        navigator.vibrate(200);
                    }
                    toast.error(error?.message || 'Error al marcar jugador');
                } finally {
                    setIsProcessing(false);
                }
            }
        } 
        // Swipe hacia la izquierda = desmarcar de cancha
        else if (offset < -SWIPE_THRESHOLD || velocity < -500) {
            if (enCancha) {
                setIsProcessing(true);
                try {
                    await onToggleEnCancha(jugador.id_jugador, equipoId);
                    if (navigator.vibrate) {
                        navigator.vibrate(50);
                    }
                } catch (error: any) {
                    console.error('Error al desmarcar jugador:', error);
                    if (navigator.vibrate) {
                        navigator.vibrate(200);
                    }
                    toast.error(error?.message || 'Error al desmarcar jugador');
                } finally {
                    setIsProcessing(false);
                }
            }
        }
    }, [disabled, isProcessing, jugador.dorsal, enCancha, jugadoresEnCanchaActuales, limiteEnCancha, onToggleEnCancha, jugador.id_jugador, equipoId]);

    // No permitir swipe si no tiene dorsal o está deshabilitado
    if (!jugador.dorsal || disabled) {
        return <>{children}</>;
    }

    return (
        <div className="relative" style={{ marginBottom: '2px' }}>
            {/* Contenido con swipe - sin desplazamiento visual */}
            <motion.div
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragStart={() => {
                    if (!disabled && !isProcessing && jugador.dorsal) {
                        setIsDragging(true);
                    }
                }}
                onDragEnd={handleDragEnd}
                style={{
                    cursor: isDragging ? 'grabbing' : (enCancha ? 'default' : 'grab'),
                }}
                className="relative z-20"
                whileDrag={{ scale: 0.98 }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default SwipeableJugadorRow;

