'use client';

import { useRouter } from 'next/navigation';
import { useCrearEdicion, useTodasLasEdiciones } from '@/app/hooks/useEdiciones';
import { useEdicionStore } from '@/app/stores/edicionStore';
import { FormField, FormDataValue, useModals } from '@/app/components/modals/ModalAdmin';
import { CrearEdicion, EdicionAdmin } from '@/app/types/edicion';
import toast from 'react-hot-toast';
import { crearEdicionSchema } from '@/app/schemas/edicion.schema';

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
        return new Promise((resolve, reject) => {
            // Convertir datos del formulario a CrearEdicion
            // Si img es un File, lo omitimos del objeto ya que el tipo espera string | null
            // El backend probablemente maneja el archivo por separado
            const edicionData: CrearEdicion = {
                nombre: String(data.nombre || ''),
                temporada: Number(data.temporada || 0),
                cantidad_eventuales: Number(data.cantidad_eventuales || 0),
                partidos_eventuales: Number(data.partidos_eventuales || 0),
                apercibimientos: Number(data.apercibimientos || 0),
                puntos_descuento: Number(data.puntos_descuento || 0),
                img: data.img instanceof File ? undefined : (data.img ? String(data.img) : undefined),
            };

            crearEdicion(edicionData, {
                onSuccess: () => {
                    toast.success('Edición creada exitosamente');
                    resolve();
                },
                onError: (error) => {
                    toast.error(error.message || 'Error al crear la edición');
                    reject(error);
                }
            });
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
        { name: 'cantidad_eventuales', label: 'Cantidad de Eventuales', type: 'number', required: true, placeholder: '5' },
        { name: 'partidos_eventuales', label: 'Partidos Eventuales', type: 'number', required: true, placeholder: '3' },
        { name: 'apercibimientos', label: 'Apercibimientos', type: 'number', required: true, placeholder: '5' },
        { name: 'puntos_descuento', label: 'Puntos de Descuento', type: 'number', required: true, placeholder: '1' },
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

