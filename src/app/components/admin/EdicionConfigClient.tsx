'use client';

import { useState } from 'react';
import { useEdicionStore } from '@/app/stores/edicionStore';
import { useTodasLasEdiciones, useActualizarEdicion } from '@/app/hooks/useEdiciones';
import { useEdicionConfig } from '@/app/hooks/useEdicionConfig';
import { useEdicionImagen } from '@/app/hooks/useEdicionImagen';
import { useEstadoEdicion } from '@/app/hooks/useEstadoEdicion';
import { EdicionAdmin } from '@/app/types/edicion';
import { EdicionHeader } from './EdicionHeader';
import { EdicionEstadoAlert } from './EdicionEstadoAlert';
import { EdicionForm } from './EdicionForm';
import { EdicionActions } from './EdicionActions';
import { Button } from '@/app/components/ui/Button';
import { Flag } from 'lucide-react';
import ConfirmActionModal from '@/app/components/modals/ConfirmActionModal';
import toast from 'react-hot-toast';

interface EdicionConfigClientProps {
    initialEdicion?: EdicionAdmin | null;
}

export const EdicionConfigClient = ({ initialEdicion }: EdicionConfigClientProps) => {
    const { edicionSeleccionada } = useEdicionStore();
    const { data: todasLasEdiciones } = useTodasLasEdiciones();
    const { mutate: actualizarEdicion } = useActualizarEdicion();

    // Obtener el estado actual de la edición
    const edicionActual = initialEdicion || 
        todasLasEdiciones?.find(e => e.id_edicion === edicionSeleccionada?.id_edicion) || 
        null;

    // Hooks personalizados
    const imagenHook = useEdicionImagen();
    const configHook = useEdicionConfig({
        edicionSeleccionada,
        imagenPreview: imagenHook.imagenPreview,
    });
    const estadoHook = useEstadoEdicion({ edicionActual });

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!edicionSeleccionada?.id_edicion) {
            toast.error('No se encontró la edición a actualizar');
            return;
        }

        // Validar que la edición no esté terminada
        if (estadoHook.isTerminada) {
            toast.error('No se pueden realizar cambios en una edición terminada');
            return;
        }

        setIsLoading(true);
        try {
            // Preparar datos - solo enviar lo que cambió
            const datosActualizar: Partial<{
                nombre: string;
                temporada: number;
                cantidad_eventuales: number;
                partidos_eventuales: number;
                apercibimientos: number;
                puntos_descuento: number;
                imagen_base64: string;
            }> = configHook.getDatosActualizar();

            // Si hay una nueva imagen, agregarla
            if (imagenHook.imagenPreview) {
                datosActualizar.imagen_base64 = imagenHook.imagenPreview;
            }

            // Verificar que hay cambios
            if (Object.keys(datosActualizar).length === 0) {
                toast('No hay cambios para guardar', { icon: 'ℹ️' });
                setIsLoading(false);
                return;
            }

            // Delay para mostrar loading
            await new Promise(resolve => setTimeout(resolve, 1200));

            actualizarEdicion(
                { id: edicionSeleccionada.id_edicion, data: datosActualizar },
                {
                    onSuccess: (response) => {
                        toast.success(response.message || 'Edición actualizada exitosamente');
                        configHook.resetConfig();
                        imagenHook.clearImage();
                        setIsLoading(false);
                    },
                    onError: (error) => {
                        toast.error(error.message || 'Error al actualizar la edición');
                        setIsLoading(false);
                    }
                }
            );
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error inesperado');
            setIsLoading(false);
        }
    };

    if (!edicionSeleccionada) {
        return (
            <div className="space-y-8">
                <p className="text-[var(--gray-100)]">No hay edición seleccionada</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <EdicionHeader nombreEdicion={edicionSeleccionada.nombre || ""} />
                {!estadoHook.isTerminada && (
                    <Button
                        variant="danger"
                        onClick={() => estadoHook.setIsTerminarModalOpen(true)}
                        className="flex items-center gap-2"
                        disabled={estadoHook.isChangingEstado}
                    >
                        <Flag className="w-4 h-4" />
                        Terminar edición
                    </Button>
                )}
            </div>

            {/* Mensaje si la edición está terminada */}
            {estadoHook.isTerminada && <EdicionEstadoAlert />}

            {/* Formulario de configuración */}
            <EdicionForm
                config={configHook.config}
                onInputChange={configHook.handleInputChange}
                imagenActual={edicionSeleccionada.img}
                imagenPreview={imagenHook.imagenPreview}
                imagenFile={imagenHook.imagenFile}
                fileInputRef={imagenHook.fileInputRef}
                onImageChange={imagenHook.handleImageChange}
                onRemoveImage={imagenHook.handleRemoveImage}
                disabled={estadoHook.isTerminada || isLoading}
                MAX_FILE_SIZE_MB={imagenHook.MAX_FILE_SIZE_MB}
            />

            {/* Botón Actualizar (Footer) */}
            <EdicionActions
                isTerminada={estadoHook.isTerminada}
                hasChanges={configHook.hasChanges}
                isLoading={isLoading}
                onSubmit={handleSubmit}
            />

            {/* Modal Terminar Edición */}
            <ConfirmActionModal
                isOpen={estadoHook.isTerminarModalOpen}
                onClose={() => estadoHook.setIsTerminarModalOpen(false)}
                onConfirm={estadoHook.handleTerminarEdicion}
                title="Terminar edición"
                message={`¿Estás seguro de que deseas terminar la edición "${edicionSeleccionada?.nombre}"?`}
                confirmText="Terminar"
                cancelText="Cancelar"
                variant="danger"
                isLoading={estadoHook.isChangingEstado}
                details={
                    <div className="text-left space-y-1 text-sm">
                        <p className="text-[var(--gray-200)]">
                            <span className="font-medium text-[var(--white)]">Edición:</span> {edicionSeleccionada?.nombre}
                        </p>
                        <p className="text-[var(--gray-200)]">
                            <span className="font-medium text-[var(--white)]">Temporada:</span> {edicionSeleccionada?.temporada}
                        </p>
                        <p className="text-[var(--yellow)] text-xs mt-2">
                            ⚠️ Una vez terminada, la edición no podrá ser reactivada.
                        </p>
                    </div>
                }
            />
        </div>
    );
};

