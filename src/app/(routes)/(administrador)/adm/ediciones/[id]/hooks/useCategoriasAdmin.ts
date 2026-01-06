'use client';

import { useRouter } from 'next/navigation';
import { useCategoriasPorEdicion, useCrearCategoriaEdicion, useDatosParaCrearCategoria } from '@/app/hooks/useCategorias';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { FormField, FormDataValue, useModals } from '@/app/components/modals/ModalAdmin';
import { CategoriaEdicionDto, CategoriaDisponible, NombreCategoriaDisponible } from '@/app/types/categoria';
import toast from 'react-hot-toast';
import { crearCategoriaEdicionSchema } from '@/app/schemas/categoria.schema';
import { useMemo } from 'react';

export const useCategoriasAdmin = (edicionId: number) => {
    const { modals, openModal, closeModal } = useModals();
    const { refetch } = useCategoriasPorEdicion(edicionId);
    const { mutate: crearCategoriaEdicion } = useCrearCategoriaEdicion();
    const { setCategoriaSeleccionada } = useCategoriaStore();
    const router = useRouter();

    const handleRefresh = () => {
        refetch();
    };

    const handleIngresarCategoria = (categorias: CategoriaEdicionDto[] | undefined, id_categoria: number) => {
        const categoriaEdicion = categorias?.find((cat) => cat.edicion.id_edicion === edicionId && cat.categoria.id_categoria === id_categoria);

        if (categoriaEdicion) {
            setCategoriaSeleccionada({
                id_edicion: categoriaEdicion.edicion.id_edicion,
                id_categoria_edicion: categoriaEdicion.id_categoria_edicion,
                nombre_completo: categoriaEdicion.categoria.nombre_completo,
                tipo_futbol: categoriaEdicion.configuracion.tipo_futbol,
                duracion_tiempo: categoriaEdicion.configuracion.duracion_tiempo,
                duracion_entretiempo: categoriaEdicion.configuracion.duracion_entretiempo,
                publicada: categoriaEdicion.configuracion.publicada,
                puntos_victoria: categoriaEdicion.configuracion.puntos_victoria,
                puntos_empate: categoriaEdicion.configuracion.puntos_empate,
                puntos_derrota: categoriaEdicion.configuracion.puntos_derrota,
                limite_cambios: categoriaEdicion.configuracion.limite_cambios,
                recambio: categoriaEdicion.configuracion.recambio,
                color: categoriaEdicion.configuracion.color,
            });
            
            router.push(`/adm/ediciones/${edicionId}/${id_categoria}/resumen`);
        }
    };

    const handleAgregarCategoria = () => {
        openModal('create');
    };

    const handleCrearCategoria = async (data: Record<string, FormDataValue>): Promise<void> => {
        return new Promise((resolve, reject) => {
            // Procesar id_categoria: puede ser un id_categoria normal o un nombre_xxx
            let idCategoria: number | undefined;
            let idNombreCat: number | undefined;
            
            const categoriaValue = data.id_categoria;
            
            if (typeof categoriaValue === 'string' && categoriaValue.startsWith('nombre_')) {
                // Es un nombre de categoría, extraer el id
                const idNombre = categoriaValue.replace('nombre_', '');
                idNombreCat = parseInt(idNombre);
            } else if (categoriaValue !== undefined && categoriaValue !== null) {
                // Es un id_categoria normal
                idCategoria = typeof categoriaValue === 'number' ? categoriaValue : parseInt(String(categoriaValue));
            }

            // Agregar publicada por defecto y color default
            const dataConDefaults: any = {
                ...data,
                publicada: 'N', // Por defecto no publicada
                color: '#3B82F6', // Color default (azul)
            };

            // Reemplazar id_categoria con el valor correcto
            delete dataConDefaults.id_categoria;
            if (idCategoria) {
                dataConDefaults.id_categoria = idCategoria;
            } else if (idNombreCat) {
                dataConDefaults.id_nombre_cat = idNombreCat;
            }

            crearCategoriaEdicion(
                { id_edicion: edicionId, data: dataConDefaults },
                {
                    onSuccess: () => {
                        toast.success('Categoría creada exitosamente');
                        resolve();
                    },
                    onError: (error) => {
                        toast.error(error.message || 'Error al crear la categoría');
                        reject(error);
                    }
                }
            );
        });
    };

    // Obtener datos para crear categoría (solo cuando el modal está abierto)
    const { data: datosCrear, isLoading: isLoadingDatos } = useDatosParaCrearCategoria({
        enabled: modals.create
    });

    const categoriaOptions = useMemo(() => {
        const options: Array<{ value: string | number; label: string; esNombre?: boolean }> = [];
        
        // Agregar categorías existentes
        if (datosCrear?.data?.categorias) {
            datosCrear.data.categorias.forEach((cat: CategoriaDisponible) => {
                options.push({
                    value: cat.id_categoria,
                    label: cat.nombre_completo,
                    esNombre: false
                });
            });
        }
        
        // Agregar nombres de categoría disponibles (sin categoría asociada)
        if (datosCrear?.data?.nombres_disponibles) {
            datosCrear.data.nombres_disponibles.forEach((nombre: NombreCategoriaDisponible) => {
                options.push({
                    value: `nombre_${nombre.id_nombre_cat}`, // Prefijo para identificar que es un nombre
                    label: `${nombre.nombre_categoria} (nuevo)`,
                    esNombre: true
                });
            });
        }
        
        return options;
    }, [datosCrear?.data]);

    const categoriaFields: FormField[] = useMemo(() => [
        {
            name: 'id_categoria',
            label: 'Categoría',
            type: 'select',
            required: true,
            placeholder: 'Seleccionar categoría',
            options: categoriaOptions
        },
        {
            name: 'tipo_futbol',
            label: 'Tipo de Fútbol (Jugadores)',
            type: 'number',
            required: true,
            placeholder: '7'
        },
        {
            name: 'duracion_tiempo',
            label: 'Duración Tiempo (minutos)',
            type: 'number',
            required: true,
            placeholder: '45'
        },
        {
            name: 'duracion_entretiempo',
            label: 'Duración Entretiempo (minutos)',
            type: 'number',
            required: true,
            placeholder: '15'
        },
        {
            name: 'puntos_victoria',
            label: 'Puntos Victoria',
            type: 'number',
            required: true,
            placeholder: '3'
        },
        {
            name: 'puntos_empate',
            label: 'Puntos Empate',
            type: 'number',
            required: true,
            placeholder: '1'
        },
        {
            name: 'puntos_derrota',
            label: 'Puntos Derrota',
            type: 'number',
            required: true,
            placeholder: '0'
        }
    ], [categoriaOptions]);

    return {
        // Modals
        modals,
        openModal,
        closeModal,
        
        // Handlers
        handleRefresh,
        handleIngresarCategoria,
        handleAgregarCategoria,
        handleCrearCategoria,
        
        // Form config
        categoriaFields,
        validationSchema: crearCategoriaEdicionSchema,
        isLoadingDatos,
    };
};

