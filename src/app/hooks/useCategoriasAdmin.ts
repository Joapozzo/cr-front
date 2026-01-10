'use client';

import { useRouter } from 'next/navigation';
import { useCategoriasPorEdicion, useCrearCategoriaEdicion, useDatosParaCrearCategoria } from '@/app/hooks/useCategorias';
import { useCategoriaStore } from '@/app/stores/categoriaStore';
import { FormField, FormDataValue, useModals } from '@/app/components/modals/ModalAdmin';
import { CategoriaEdicionDto, CategoriaDisponible, NombreCategoriaDisponible, DivisionDisponible } from '@/app/types/categoria';
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
            let idDivision: number | undefined;
            
            const categoriaValue = data.id_categoria;
            
            if (typeof categoriaValue === 'string' && categoriaValue.startsWith('nombre_')) {
                // Es un nombre de categoría, extraer el id
                const idNombre = categoriaValue.replace('nombre_', '');
                idNombreCat = parseInt(idNombre);
            } else if (categoriaValue !== undefined && categoriaValue !== null) {
                // Es un id_categoria normal
                idCategoria = typeof categoriaValue === 'number' ? categoriaValue : parseInt(String(categoriaValue));
            }

            // Procesar id_division si existe y no es 0 (Sin división)
            if (data.id_division !== undefined && data.id_division !== null && data.id_division !== '') {
                const divisionValue = typeof data.id_division === 'number' 
                    ? data.id_division 
                    : parseInt(String(data.id_division));
                // Solo agregar si es un número válido y positivo
                if (!isNaN(divisionValue) && divisionValue > 0) {
                    idDivision = divisionValue;
                }
            }

            // Agregar publicada por defecto y color (del formulario o default)
            const dataConDefaults: any = {
                ...data,
                publicada: 'N', // Por defecto no publicada
            };

            // Procesar color: usar el del formulario si existe y es válido, sino usar default
            if (data.color && typeof data.color === 'string' && data.color.trim() !== '') {
                dataConDefaults.color = data.color.trim();
            } else {
                dataConDefaults.color = '#3B82F6'; // Color default (azul)
            }

            // Reemplazar id_categoria con el valor correcto
            delete dataConDefaults.id_categoria;
            if (idCategoria) {
                dataConDefaults.id_categoria = idCategoria;
            } else if (idNombreCat) {
                dataConDefaults.id_nombre_cat = idNombreCat;
            }

            // Eliminar id_division del objeto (para evitar enviar 0 o valores inválidos)
            delete dataConDefaults.id_division;
            
            // Agregar id_division solo si existe y es válido (positivo)
            if (idDivision && idDivision > 0) {
                dataConDefaults.id_division = idDivision;
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

    const divisionOptions = useMemo(() => {
        const options: Array<{ value: number; label: string }> = [];
        
        // Agregar división vacía (opcional)
        options.push({
            value: 0,
            label: 'Sin división'
        });
        
        // Agregar divisiones disponibles
        if (datosCrear?.data?.divisiones_disponibles) {
            datosCrear.data.divisiones_disponibles.forEach((division: DivisionDisponible) => {
                options.push({
                    value: division.id_division,
                    label: division.nombre
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
            name: 'id_division',
            label: 'División (Opcional)',
            type: 'select',
            required: false,
            placeholder: 'Seleccionar división',
            options: divisionOptions
        },
        {
            name: 'tipo_futbol',
            label: 'Tipo de fútbol (Jugadores)',
            type: 'number',
            required: true,
            placeholder: '7'
        },
        {
            name: 'duracion_tiempo',
            label: 'Duración tiempo (minutos)',
            type: 'number',
            required: true,
            placeholder: '45'
        },
        {
            name: 'duracion_entretiempo',
            label: 'Duración entretiempo (minutos)',
            type: 'number',
            required: true,
            placeholder: '15'
        },
        {
            name: 'puntos_victoria',
            label: 'Puntos victoria',
            type: 'number',
            required: true,
            placeholder: '3'
        },
        {
            name: 'puntos_empate',
            label: 'Puntos empate',
            type: 'number',
            required: true,
            placeholder: '1'
        },
        {
            name: 'puntos_derrota',
            label: 'Puntos derrota',
            type: 'number',
            required: true,
            placeholder: '0'
        }
    ], [categoriaOptions, divisionOptions]);

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

