'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useCrearNombreCategoria } from '@/app/hooks/useCategorias';
import toast from 'react-hot-toast';

interface ModalCrearCategoriaProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const ModalCrearCategoria = ({ isOpen, onClose, onSuccess }: ModalCrearCategoriaProps) => {
    const [nombre, setNombre] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    const crearNombre = useCrearNombreCategoria({
        onSuccess: () => {
            toast.success('Nombre de categoría creado exitosamente');
            setNombre('');
            onSuccess?.();
            onClose();
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Error al crear el nombre de categoría');
        },
    });

    // Animación del modal
    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen]);

    // Limpiar el formulario al cerrar
    useEffect(() => {
        if (!isOpen) {
            setNombre('');
        }
    }, [isOpen]);

    if (!isVisible) return null;

    const handleCrear = () => {
        if (!nombre.trim()) {
            toast.error('El nombre de la categoría es requerido');
            return;
        }

        if (nombre.trim().length < 3) {
            toast.error('El nombre debe tener al menos 3 caracteres');
            return;
        }

        if (nombre.trim().length > 50) {
            toast.error('El nombre no puede exceder 50 caracteres');
            return;
        }

        crearNombre.mutate({ nombre: nombre.trim() });
    };

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-300 ${
                isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className={`bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)] shadow-xl w-full max-w-md mx-4 transition-transform duration-300 ${
                    isAnimating ? 'scale-100' : 'scale-95'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-[var(--gray-300)]">
                    <h2 className="text-xl font-semibold text-[var(--white)]">Agregar nombre de categoría</h2>
                    <button
                        onClick={onClose}
                        className="text-[var(--gray-100)] hover:text-[var(--white)] transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--white)] mb-2">
                                Nombre de la categoría
                                <span className="text-[var(--color-danger)] ml-1">*</span>
                            </label>
                            <Input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej: Primera División, Segunda División..."
                                className="w-full"
                                maxLength={50}
                            />
                            <p className="mt-2 text-xs text-[var(--gray-200)]">
                                Este nombre estará disponible para usar al crear categorías. El ID se generará automáticamente.
                            </p>
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                variant="default"
                                onClick={onClose}
                                disabled={crearNombre.isPending}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="success"
                                onClick={handleCrear}
                                disabled={crearNombre.isPending || !nombre.trim()}
                                className="flex items-center gap-2"
                            >
                                {crearNombre.isPending ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Creando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        <span>Crear nombre</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalCrearCategoria;
