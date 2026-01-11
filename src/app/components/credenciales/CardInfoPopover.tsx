'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Credencial } from './types';
import { EstadoCredencial } from './EstadoCredencial';

interface CardInfoPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLElement | null>;
    credencial: Credencial;
}

export const CardInfoPopover: React.FC<CardInfoPopoverProps> = ({
    isOpen,
    onClose,
    anchorRef,
    credencial,
}) => {
    const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && anchorRef.current) {
            const updatePosition = () => {
                const rect = anchorRef.current!.getBoundingClientRect();
                const scrollY = window.scrollY;
                const scrollX = window.scrollX;

                // Calculamos posición inicial (arriba a la derecha del icono)
                let top = rect.top + scrollY - 10; // Un poco arriba
                let left = rect.left + scrollX - 210; // Centrado hacia la izquierda (ancho aprox 200px)

                // Ajustes básicos de viewport (simple collision detection)
                if (left < 10) left = 10; // No salir por izquierda

                // Si está muy abajo, subirlo más
                if (window.innerHeight - rect.bottom < 200) {
                    top = rect.top + scrollY - 200;
                }

                setCoords({ top, left });
            };

            updatePosition();
            window.addEventListener('scroll', updatePosition);
            window.addEventListener('resize', updatePosition);

            return () => {
                window.removeEventListener('scroll', updatePosition);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [isOpen, anchorRef]);

    // Click outside handler
    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (
                popoverRef.current &&
                !popoverRef.current.contains(e.target as Node) &&
                anchorRef.current &&
                !anchorRef.current.contains(e.target as Node)
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose, anchorRef]);

    if (!isOpen || !coords) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={popoverRef}
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ duration: 0.2 }}
                    style={{
                        position: 'absolute',
                        top: coords.top,
                        left: coords.left,
                        zIndex: 9999, // High z-index to sit on top of everything
                    }}
                    className="w-[200px] bg-neutral-900/95 backdrop-blur-md border border-white/10 rounded-xl shadow-xl p-4 origin-bottom-right"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-3 border-b border-white/10 pb-2">Detalles</h3>
                    <div className="space-y-3">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Equipo</span>
                            <span className="text-white text-xs font-medium truncate">{credencial.equipo.nombre}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Categoría</span>
                            <span className="text-white text-xs font-medium">{credencial.equipo.categoria}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Temporada</span>
                            <span className="text-white text-xs font-medium">{credencial.temporada}</span>
                        </div>
                        <div className="pt-2 border-t border-white/5">
                            <EstadoCredencial estado={credencial.estado} variant="minimal" />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};
