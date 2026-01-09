'use client';

import { useRouter } from 'next/navigation';
import { useCrearEdicion, useTodasLasEdiciones } from '@/app/hooks/useEdiciones';
import { useEdicionStore } from '@/app/stores/edicionStore';
import { FormField, FormDataValue, useModals } from '@/app/components/modals/ModalAdmin';
import { CrearEdicion, EdicionAdmin } from '@/app/types/edicion';
import toast from 'react-hot-toast';
import { crearEdicionSchema } from '@/app/schemas/edicion.schema';
import { convertirABase64 } from '@/app/services/upload.service';

export const useEdicionesAdmin = () => {
    const { modals, openModal, closeModal } = useModals();
    const { refetch } = useTodasLasEdiciones();
    const { mutate: crearEdicion } = useCrearEdicion();
    const { setEdicionSeleccionada } = useEdicionStore();
    const router = useRouter();

    const handleRefresh = () => {
        refetch();
    };

    const handleCreate = async (data: Record<string, FormDataValue>): Promise<void> => {
        return new Promise(async (resolve, reject) => {
            try {
                // Convertir datos del formulario a CrearEdicion
                const edicionData: CrearEdicion & { imagen_base64?: string } = {
                    nombre: String(data.nombre || ''),
                    temporada: Number(data.temporada || 0),
                    cantidad_eventuales: Number(data.cantidad_eventuales || 0),
                    partidos_eventuales: Number(data.partidos_eventuales || 0),
                    apercibimientos: Number(data.apercibimientos || 0),
                    puntos_descuento: Number(data.puntos_descuento || 0),
                };

                // Si hay una imagen (File), convertirla a base64
                if (data.img instanceof File) {
                    try {
                        // Validar que sea PNG
                        if (data.img.type !== 'image/png') {
                            toast.error('Solo se permiten archivos PNG');
                            reject(new Error('Solo se permiten archivos PNG'));
                            return;
                        }

                        // Validar tamaño (máximo 5MB)
                        const MAX_FILE_SIZE_MB = 5;
                        const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
                        if (data.img.size > MAX_FILE_SIZE_BYTES) {
                            toast.error(`El archivo es demasiado grande. Máximo ${MAX_FILE_SIZE_MB}MB`);
                            reject(new Error(`El archivo es demasiado grande. Máximo ${MAX_FILE_SIZE_MB}MB`));
                            return;
                        }

                        // Convertir a base64
                        const base64 = await convertirABase64(data.img);
                        edicionData.imagen_base64 = base64;
                    } catch (error: any) {
                        console.error('Error al procesar imagen:', error);
                        toast.error('Error al procesar la imagen');
                        reject(error);
                        return;
                    }
                } else if (data.img && typeof data.img === 'string') {
                    // Si ya es un string (base64), usarlo directamente
                    edicionData.imagen_base64 = data.img;
                }

                crearEdicion(edicionData as any, {
                    onSuccess: () => {
                        toast.success('Edición creada exitosamente');
                        resolve();
                    },
                    onError: (error) => {
                        toast.error(error.message || 'Error al crear la edición');
                        reject(error);
                    }
                });
            } catch (error: any) {
                toast.error(error.message || 'Error al procesar los datos');
                reject(error);
            }
        });
    };

    const handleIngresarEdicion = (ediciones: EdicionAdmin[] | undefined, id_edicion: number) => {
        const edicionSeleccionada = ediciones?.find((edicion) => edicion.id_edicion === id_edicion);

        if (edicionSeleccionada) {
            setEdicionSeleccionada({
                id_edicion: edicionSeleccionada.id_edicion,
                nombre: edicionSeleccionada.nombre,
                temporada: edicionSeleccionada.temporada,
                cantidad_eventuales: edicionSeleccionada.cantidad_eventuales,
                partidos_eventuales: edicionSeleccionada.partidos_eventuales,
                apercibimientos: edicionSeleccionada.apercibimientos,
                puntos_descuento: edicionSeleccionada.puntos_descuento,
                img: edicionSeleccionada.img,
            });
        }
        router.push(`/adm/ediciones/${id_edicion}`);
    };

    const edicionFields: FormField[] = [
        { name: 'nombre', label: 'Nombre', type: 'text', required: true, placeholder: 'Ej: Apertura 2025' },
        { name: 'temporada', label: 'Temporada', type: 'number', required: true, placeholder: '2025' },
        { name: 'cantidad_eventuales', label: 'Cantidad de eventuales', type: 'number', required: true, placeholder: '5' },
        { name: 'partidos_eventuales', label: 'Partidos eventuales', type: 'number', required: true, placeholder: '3' },
        { name: 'apercibimientos', label: 'Apercibimientos', type: 'number', required: true, placeholder: '5' },
        { name: 'puntos_descuento', label: 'Puntos de descuento', type: 'number', required: true, placeholder: '1' },
        { name: 'img', label: 'Imagen', type: 'file', accept: 'image/*' },
    ];

    return {
        // Modals
        modals,
        openModal,
        closeModal,
        
        // Handlers
        handleRefresh,
        handleCreate,
        handleIngresarEdicion,
        
        // Form config
        edicionFields,
        validationSchema: crearEdicionSchema,
    };
};

