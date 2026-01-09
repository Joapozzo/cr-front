import React, { useState, useCallback, useRef } from 'react';
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
    const [hasDragged, setHasDragged] = useState(false);
    const hadDragRef = useRef(false);
    const dragStartTargetRef = useRef<HTMLElement | null>(null);

    const handleDragEnd = useCallback(async (event: any, info: any) => {
        const wasDragging = hasDragged;
        setIsDragging(false);
        
        // Si el drag comenzó en un botón, no procesar
        if (dragStartTargetRef.current?.closest('button') || dragStartTargetRef.current?.tagName === 'BUTTON') {
            dragStartTargetRef.current = null;
            setHasDragged(false);
            hadDragRef.current = false;
            return;
        }
        
        // Si no hubo drag significativo, permitir que el click pase al children
        if (!wasDragging || Math.abs(info.offset.x) < 10) {
            dragStartTargetRef.current = null;
            setHasDragged(false);
            hadDragRef.current = false;
            return;
        }
        
        // Marcar que hubo drag para prevenir clicks
        hadDragRef.current = true;
        setHasDragged(false);
        dragStartTargetRef.current = null;
        
        // Resetear el ref después de un breve delay para permitir que el onClick se ejecute primero
        setTimeout(() => {
            hadDragRef.current = false;
        }, 100);
        
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
    }, [hasDragged, disabled, isProcessing, jugador.dorsal, enCancha, jugadoresEnCanchaActuales, limiteEnCancha, onToggleEnCancha, jugador.id_jugador, equipoId]);

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
                dragPropagation={false}
                dragDirectionLock={true}
                dragMomentum={false}
                onDragStart={(event, info) => {
                    // Guardar el elemento inicial para verificar si es un botón
                    const target = event.target as HTMLElement;
                    dragStartTargetRef.current = target;
                    
                    // Si es un click en un botón, no activar drag
                    if (target.closest('button') || target.tagName === 'BUTTON') {
                        return;
                    }
                    if (!disabled && !isProcessing && jugador.dorsal) {
                        setIsDragging(true);
                        setHasDragged(false);
                    }
                }}
                onDrag={(event, info) => {
                    // Si el drag comenzó en un botón, cancelar
                    if (dragStartTargetRef.current?.closest('button') || dragStartTargetRef.current?.tagName === 'BUTTON') {
                        return;
                    }
                    // Activar drag si hay movimiento horizontal significativo
                    if (Math.abs(info.offset.x) > 10) {
                        if (!hasDragged) {
                            setHasDragged(true);
                        }
                    }
                }}
                onDragEnd={handleDragEnd}
                style={{
                    cursor: isDragging ? 'grabbing' : (enCancha ? 'default' : 'grab'),
                }}
                className="relative z-20"
                whileDrag={isDragging ? { scale: 0.98 } : {}}
                onClick={(e) => {
                    // Si hubo drag, no ejecutar el click
                    if (hadDragRef.current) {
                        e.stopPropagation();
                        e.preventDefault();
                        return;
                    }
                    // Si no hubo drag, permitir que el click pase al children
                    // El onClick del div interno se ejecutará normalmente
                }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default SwipeableJugadorRow;
