'use client';

import { useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useCrearDivision } from '@/app/hooks/useCategorias';
import { useQueryClient } from '@tanstack/react-query';
import { categoriasKeys } from '@/app/hooks/useCategorias';
import toast from 'react-hot-toast';

interface HelperCrearDivisionProps {
    onSuccess?: () => void;
}

const HelperCrearDivision = ({ onSuccess }: HelperCrearDivisionProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [nombre, setNombre] = useState('');
    const queryClient = useQueryClient();

    const crearDivision = useCrearDivision({
        onSuccess: () => {
            toast.success('División creada exitosamente');
            setNombre('');
            setIsOpen(false);
            // Invalidar la query para refrescar los datos disponibles
            queryClient.invalidateQueries({ queryKey: categoriasKeys.datosCrear() });
            onSuccess?.();
        },
        onError: (error: Error) => {
            // El error ya viene con el mensaje del backend
            toast.error(error.message || 'Error al crear la división');
        },
    });

    const handleCrear = () => {
        if (!nombre.trim()) {
            toast.error('El nombre de la división es requerido');
            return;
        }

        if (nombre.trim().length < 3) {
            toast.error('El nombre debe tener al menos 3 caracteres');
            return;
        }

        if (nombre.trim().length > 100) {
            toast.error('El nombre no puede exceder 100 caracteres');
            return;
        }

        crearDivision.mutate({ nombre: nombre.trim(), genero: 'M' });
    };

    if (!isOpen) {
        return (
            <div className="mb-4 p-3 bg-[var(--gray-300)] rounded-lg border border-[var(--gray-200)]">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-[var(--white)] font-medium">
                            ¿No encuentras la división que necesitas?
                        </p>
                        <p className="text-xs text-[var(--gray-100)] mt-1">
                            Crea una nueva rápidamente
                        </p>
                    </div>
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => setIsOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Crear división
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-4 p-4 bg-[var(--gray-300)] rounded-lg border border-[var(--color-primary)]">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-[var(--white)]">
                    Crear nueva división
                </h3>
                <button
                    onClick={() => {
                        setIsOpen(false);
                        setNombre('');
                    }}
                    className="text-[var(--gray-100)] hover:text-[var(--white)] transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
            <div className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-[var(--white)] mb-1">
                        Nombre
                        <span className="text-[var(--color-danger)] ml-1">*</span>
                    </label>
                    <Input
                        type="text"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej: Serie A, Golden, Silver"
                        className="w-full"
                        maxLength={100}
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={() => {
                            setIsOpen(false);
                            setNombre('');
                        }}
                        disabled={crearDivision.isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="success"
                        size="sm"
                        onClick={handleCrear}
                        disabled={crearDivision.isPending || !nombre.trim()}
                        className="flex items-center gap-2"
                    >
                        {crearDivision.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Creando...</span>
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                <span>Crear</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HelperCrearDivision;

