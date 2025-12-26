'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button';

interface ModalPenalesProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (penLocal: number, penVisita: number) => Promise<void>;
    penLocalActual: number | null;
    penVisitaActual: number | null;
    equipoLocal: string;
    equipoVisita: string;
    isLoading?: boolean;
}

const ModalPenales: React.FC<ModalPenalesProps> = ({
    isOpen,
    onClose,
    onConfirm,
    penLocalActual,
    penVisitaActual,
    equipoLocal,
    equipoVisita,
    isLoading = false,
}) => {
    const [penLocal, setPenLocal] = useState<number>(penLocalActual ?? 0);
    const [penVisita, setPenVisita] = useState<number>(penVisitaActual ?? 0);
    const [error, setError] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setTimeout(() => setIsAnimating(true), 10);
            setPenLocal(penLocalActual ?? 0);
            setPenVisita(penVisitaActual ?? 0);
            setError(null);
        } else {
            setIsAnimating(false);
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen, penLocalActual, penVisitaActual]);

    const handleIncrement = (tipo: 'local' | 'visita') => {
        setError(null);
        if (tipo === 'local') {
            setPenLocal(prev => Math.max(0, prev + 1));
        } else {
            setPenVisita(prev => Math.max(0, prev + 1));
        }
    };

    const handleDecrement = (tipo: 'local' | 'visita') => {
        setError(null);
        if (tipo === 'local') {
            setPenLocal(prev => Math.max(0, prev - 1));
        } else {
            setPenVisita(prev => Math.max(0, prev - 1));
        }
    };

    const handleConfirm = async () => {
        // Validar que haya un ganador
        if (penLocal === penVisita) {
            setError('Debe haber un ganador. Los penales no pueden ser iguales.');
            return;
        }

        // Validar que ambos valores sean mayores a 0
        if (penLocal === 0 && penVisita === 0) {
            setError('Debe registrar al menos un penal para uno de los equipos.');
            return;
        }

        try {
            await onConfirm(penLocal, penVisita);
            handleClose();
        } catch (err: any) {
            setError(err.message || 'Error al registrar los penales');
        }
    };

    const handleClose = () => {
        if (isLoading) return;
        setIsAnimating(false);
        setTimeout(() => {
            setIsVisible(false);
            onClose();
            setError(null);
        }, 300);
    };

    if (!isVisible) return null;

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isLoading) {
            handleClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleOverlayClick}
        >
            {/* Overlay */}
            <div
                className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                    isAnimating ? 'opacity-50' : 'opacity-0'
                }`}
            />

            {/* Modal */}
            <div
                className={`relative bg-[var(--black-900)] rounded-xl border-2 border-[var(--gray-200)] shadow-2xl w-full max-w-md transform transition-all duration-300 ${
                    isAnimating
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 translate-y-4'
                }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[#262626]">
                    <h2 className="text-xl font-semibold text-white">
                        Registrar Penales
                    </h2>
                    <button
                        onClick={handleClose}
                        disabled={isLoading}
                        className="p-2 hover:bg-[var(--black-800)] rounded-lg transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5 text-[var(--gray-100)]" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Error message */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Controles de Penales */}
                    <div className="space-y-6">
                        {/* Equipo Local */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-[var(--gray-200)] text-center">
                                {equipoLocal}
                            </label>
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleDecrement('local')}
                                    disabled={isLoading || penLocal === 0}
                                    className="w-12 h-12 rounded-full bg-[var(--black-800)] border-2 border-[#262626] flex items-center justify-center hover:bg-[var(--black-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                                >
                                    <Minus className="w-6 h-6 text-white" />
                                </button>
                                <div className="w-20 h-20 rounded-lg bg-[var(--black-800)] border-2 border-[#262626] flex items-center justify-center">
                                    <span className="text-3xl font-bold text-white">
                                        {penLocal}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleIncrement('local')}
                                    disabled={isLoading}
                                    className="w-12 h-12 rounded-full bg-[var(--black-800)] border-2 border-[#262626] flex items-center justify-center hover:bg-[var(--black-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                                >
                                    <Plus className="w-6 h-6 text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Separador */}
                        <div className="flex items-center justify-center">
                            <div className="h-px w-full bg-[#262626]" />
                            <span className="px-4 text-[var(--gray-400)] text-sm font-medium">
                                VS
                            </span>
                            <div className="h-px w-full bg-[#262626]" />
                        </div>

                        {/* Equipo Visita */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-[var(--gray-200)] text-center">
                                {equipoVisita}
                            </label>
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleDecrement('visita')}
                                    disabled={isLoading || penVisita === 0}
                                    className="w-12 h-12 rounded-full bg-[var(--black-800)] border-2 border-[#262626] flex items-center justify-center hover:bg-[var(--black-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                                >
                                    <Minus className="w-6 h-6 text-white" />
                                </button>
                                <div className="w-20 h-20 rounded-lg bg-[var(--black-800)] border-2 border-[#262626] flex items-center justify-center">
                                    <span className="text-3xl font-bold text-white">
                                        {penVisita}
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleIncrement('visita')}
                                    disabled={isLoading}
                                    className="w-12 h-12 rounded-full bg-[var(--black-800)] border-2 border-[#262626] flex items-center justify-center hover:bg-[var(--black-700)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                                >
                                    <Plus className="w-6 h-6 text-white" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 border-t border-[#262626]">
                    <Button
                        onClick={handleClose}
                        disabled={isLoading}
                        variant="secondary"
                        className="flex-1"
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isLoading || penLocal === penVisita}
                        className="flex-1"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2 justify-center">
                                <Loader2 size={16} className="animate-spin" />
                                Guardando...
                            </span>
                        ) : (
                            'Guardar Penales'
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ModalPenales;

