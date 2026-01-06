'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Check, Loader2, Upload, AlertTriangle, Shield } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { BaseModal } from './ModalAdmin';
import { useActualizarEquipo } from '../../hooks/useEquipos';
import { convertirABase64 } from '../../services/upload.service';
import toast from 'react-hot-toast';
import { Equipo } from '../../types/equipo';

interface ModalEditarEquipoProps {
    isOpen: boolean;
    onClose: () => void;
    equipo: Equipo;
    onSuccess?: () => void;
}

const MAX_FILE_SIZE_MB = 5; // Máximo 5MB
const MAX_WIDTH = 1024;
const MAX_HEIGHT = 1024;

const ModalEditarEquipo = ({ isOpen, onClose, equipo, onSuccess }: ModalEditarEquipoProps) => {
    const [nombre, setNombre] = useState(equipo.nombre || '');
    const [imagenFile, setImagenFile] = useState<File | null>(null);
    const [imagenBase64, setImagenBase64] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isProcessing, setIsProcessing] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { mutate: actualizarEquipo, isPending } = useActualizarEquipo();

    // Imagen preview: si hay una nueva seleccionada (base64), usar esa, sino usar la del equipo
    const imagenPreview = imagenBase64 || equipo.img || null;

    // Resetear formulario cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            setNombre(equipo.nombre || '');
            setImagenFile(null);
            setImagenBase64(null);
            setErrors({});
        }
    }, [isOpen, equipo.id_equipo, equipo.nombre]); // Solo cuando se abre o cambia el equipo

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validar nombre
        if (!nombre.trim()) {
            newErrors.nombre = 'El nombre del equipo es requerido';
        } else if (nombre.trim().length < 2) {
            newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
        } else if (nombre.trim().length > 100) {
            newErrors.nombre = 'El nombre no puede exceder 100 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo (solo PNG)
        if (file.type !== 'image/png') {
            toast.error('Solo se permiten archivos PNG');
            setImagenFile(null);
            setImagenBase64(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        // Validar tamaño (máximo 5MB antes de comprimir)
        const maxSizeBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            toast.error(`El archivo es demasiado grande. Máximo ${MAX_FILE_SIZE_MB}MB`);
            setImagenFile(null);
            setImagenBase64(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            return;
        }

        setImagenFile(file);

        try {
            // Convertir a Base64 para preview
            const base64 = await convertirABase64(file);
            setImagenBase64(base64);
            setErrors(prev => ({ ...prev, imagen: '' }));
        } catch (error) {
            console.error('Error al procesar imagen:', error);
            toast.error('Error al procesar la imagen');
            setImagenFile(null);
            setImagenBase64(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveImage = () => {
        setImagenFile(null);
        setImagenBase64(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);

        try {
            // Preparar datos para actualizar
            const data: { nombre?: string; imagen_base64?: string } = {};

            // Si el nombre cambió, agregarlo
            if (nombre.trim() !== equipo.nombre) {
                data.nombre = nombre.trim();
            }

            // Si hay una nueva imagen, agregarla
            if (imagenBase64) {
                data.imagen_base64 = imagenBase64;
            }

            // Si no hay cambios, no hacer nada
            if (Object.keys(data).length === 0) {
                toast('No hay cambios para guardar');
                setIsProcessing(false);
                return;
            }

            actualizarEquipo(
                {
                    id_equipo: equipo.id_equipo,
                    data,
                },
                {
                    onSuccess: async () => {
                        // Limpiar estados
                        setImagenFile(null);
                        setImagenBase64(null);
                        setIsProcessing(false);

                        // Mostrar toast
                        toast.success('Equipo actualizado exitosamente');

                        // Actualizar datos en el componente padre
                        if (onSuccess) {
                            await onSuccess();
                        }

                        // Cerrar modal después de actualizar
                        onClose();
                    },
                    onError: (error: Error) => {
                        toast.error(error.message || 'Error al actualizar el equipo');
                        setIsProcessing(false);
                    },
                }
            );
        } catch (error: any) {
            console.error('Error al actualizar equipo:', error);
            toast.error(error.message || 'Error al actualizar el equipo');
            setIsProcessing(false);
        }
    };

    const isLoading = isPending || isProcessing;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Editar equipo"
            type="edit"
            maxWidth="max-w-2xl"
        >
            <div className="space-y-6">
                {/* Información sobre formato de imagen */}
                <div className="p-4 bg-[var(--blue)]/10 border border-[var(--blue)]/30 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-[var(--blue)] flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-[var(--blue)] mb-1">
                                Requisitos de la imagen
                            </h4>
                            <ul className="text-xs text-[var(--gray-100)] space-y-1">
                                <li>• Formato: <strong>PNG</strong> únicamente</li>
                                <li>• Tamaño máximo: <strong>{MAX_FILE_SIZE_MB}MB</strong></li>
                                <li>• Dimensiones recomendadas: {MAX_WIDTH}x{MAX_HEIGHT}px</li>
                                <li>• <strong>Debe ser sin fondo (transparente)</strong></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Campo de nombre */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--white)]">
                        Nombre del equipo
                        <span className="text-[var(--color-secondary)] ml-1">*</span>
                    </label>
                    <Input
                        type="text"
                        value={nombre}
                        onChange={(e) => {
                            setNombre(e.target.value);
                            if (errors.nombre) {
                                setErrors(prev => ({ ...prev, nombre: '' }));
                            }
                        }}
                        placeholder="Ej: Celta de Vino"
                        error={errors.nombre}
                        disabled={isLoading}
                    />
                </div>

                {/* Campo de imagen */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--white)]">
                        Foto de perfil (PNG)
                    </label>

                    {/* Preview de imagen */}
                    {imagenPreview && (
                        <div className="relative inline-block">
                            <div className="w-32 h-32 rounded-full bg-[var(--gray-200)] flex items-center justify-center overflow-hidden border-2 border-[var(--gray-300)]">
                                {imagenPreview && (imagenPreview.startsWith('data:') || imagenPreview.startsWith('http')) ? (
                                    <Image
                                        src={imagenPreview}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <Shield className="w-12 h-12 text-[var(--gray-100)]" />
                                )}
                            </div>
                            {imagenBase64 && (
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--color-secondary)] rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                    disabled={isLoading}
                                >
                                    <X className="w-3 h-3 text-white" />
                                </button>
                            )}
                        </div>
                    )}

                    {/* Input de archivo */}
                    <div className="flex items-center gap-3">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/png"
                            onChange={handleImageChange}
                            className="hidden"
                            id="imagen-equipo"
                            disabled={isLoading}
                        />
                        <label
                            htmlFor="imagen-equipo"
                            className={`flex items-center gap-2 px-4 py-2 bg-[var(--gray-300)] border border-[var(--gray-200)] rounded-lg text-[var(--white)] cursor-pointer hover:bg-[var(--gray-200)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${errors.imagen ? 'border-[var(--color-secondary)]' : ''}`}
                        >
                            <Upload className="w-4 h-4" />
                            <span className="text-sm">
                                {imagenFile ? 'Cambiar imagen' : 'Seleccionar imagen PNG'}
                            </span>
                        </label>
                    </div>

                    {errors.imagen && (
                        <p className="text-[var(--color-secondary)] text-sm flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4" />
                            {errors.imagen}
                        </p>
                    )}

                    {imagenFile && (
                        <p className="text-xs text-[var(--gray-100)]">
                            Archivo seleccionado: {imagenFile.name} ({(imagenFile.size / 1024 / 1024).toFixed(2)}MB)
                        </p>
                    )}
                </div>

                {/* Botones de acción */}
                <div className="flex justify-end gap-3 pt-4 border-t border-[var(--gray-300)]">
                    <Button
                        variant="more"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="success"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex items-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Guardar cambios
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </BaseModal>
    );
};

export default ModalEditarEquipo;

