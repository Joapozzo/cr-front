import { useState } from 'react';
import { useCrearZona, useEditarZona, useEliminarZona, useDatosParaCrearZona, zonasKeys } from './useZonas';
import { useQueryClient } from '@tanstack/react-query';
import { CrearZonaInput, EditarZonaInput, FormatoPosicion } from '../types/zonas';
import { zonasService } from '../services/zonas.services';
import toast from 'react-hot-toast';
import { calcularVacantesOcupadas } from '../utils/vacantesHelpers';
import { Zona } from '../types/zonas';

interface UseZonaActionsProps {
    idCatEdicion: number;
    numeroFase: number;
    zona?: Zona;
}

export const useZonaActions = ({ idCatEdicion, numeroFase, zona }: UseZonaActionsProps) => {
    const queryClient = useQueryClient();
    const { mutate: crearZonaMutation } = useCrearZona();
    const { mutate: editarZonaMutation } = useEditarZona();
    const { mutate: eliminarZonaMutation } = useEliminarZona();
    const { data: datosCrearZona } = useDatosParaCrearZona(zona?.id_zona);
    const { data: datosCrearZonaSinId } = useDatosParaCrearZona(); // Para crear nuevas zonas
    
    const [isDeleting, setIsDeleting] = useState(false);

    const handleCrearZona = async (
        data: CrearZonaInput,
        formatosPosicion: FormatoPosicion[]
    ): Promise<void> => {
        return new Promise((resolve, reject) => {
            crearZonaMutation({
                id_categoria_edicion: idCatEdicion,
                numero_fase: numeroFase,
                data
            }, {
                onSuccess: async (response) => {
                    // Si es zona tipo "todos-contra-todos" y hay formatos, guardarlos
                    const tipoZona = datosCrearZonaSinId?.data?.tiposZona?.find(t => t.id === Number(data.tipo_zona));
                    if (tipoZona?.nombre === 'todos-contra-todos' && formatosPosicion.length > 0) {
                        try {
                            const idZona = (response.data as any).zona?.id_zona || response.data.id_zona;

                            for (const formato of formatosPosicion) {
                                await zonasService.crearFormatoPosicion(idZona, {
                                    posicion_desde: formato.posicion_desde,
                                    posicion_hasta: formato.posicion_hasta,
                                    descripcion: formato.descripcion,
                                    color: formato.color,
                                    orden: formato.orden,
                                });
                            }
                        } catch (error) {
                            console.error('Error al guardar formatos de posición:', error);
                            toast.error('Zona creada, pero hubo un error al guardar los formatos de posición');
                        }
                    }

                    toast.success('Zona creada exitosamente');
                    resolve();
                },
                onError: (error) => {
                    const errorMessage = (error as { message?: string })?.message || 'Error al crear la zona';
                    toast.error(errorMessage);
                    reject(error);
                }
            });
        });
    };

    const handleEditarZona = async (
        idZona: number,
        data: EditarZonaInput,
        formatosPosicion: FormatoPosicion[]
    ): Promise<void> => {
        if (!zona) {
            throw new Error('Zona no encontrada');
        }

        const vacantesOcupadas = calcularVacantesOcupadas(zona);

        if (data.cantidad_equipos && data.cantidad_equipos < vacantesOcupadas) {
            const error = new Error(`No se puede reducir a ${data.cantidad_equipos} equipos. Actualmente hay ${vacantesOcupadas} equipos asignados. Debe vaciar las vacantes primero.`);
            toast.error(error.message);
            throw error;
        }

        return new Promise((resolve, reject) => {
            editarZonaMutation({
                id_zona: idZona,
                id_categoria_edicion: idCatEdicion,
                data
            }, {
                onSuccess: async () => {
                    // Si es zona tipo "todos-contra-todos", guardar formatos de posición
                    if (zona.tipoZona?.nombre === 'todos-contra-todos') {
                        try {
                            const formatosExistentes = zona.formatosPosiciones || [];

                            // Identificar formatos nuevos
                            const formatosNuevos = formatosPosicion.filter(
                                f => !f.id_formato_posicion || f.id_formato_posicion === 0
                            );

                            // Identificar formatos eliminados
                            const formatosEliminados = formatosExistentes.filter(
                                f => !formatosPosicion.some(nf => nf.id_formato_posicion === f.id_formato_posicion)
                            );

                            // Eliminar formatos que ya no están
                            for (const formato of formatosEliminados) {
                                await zonasService.eliminarFormatoPosicion(idZona, formato.id_formato_posicion);
                            }

                            // Crear formatos nuevos
                            for (const formato of formatosNuevos) {
                                await zonasService.crearFormatoPosicion(idZona, {
                                    posicion_desde: formato.posicion_desde,
                                    posicion_hasta: formato.posicion_hasta,
                                    descripcion: formato.descripcion,
                                    color: formato.color,
                                    orden: formato.orden,
                                });
                            }
                        } catch (error) {
                            console.error('Error al guardar formatos de posición:', error);
                            toast.error('Zona actualizada, pero hubo un error al guardar los formatos de posición');
                        }
                    }

                    toast.success('Zona actualizada exitosamente');
                    resolve();
                },
                onError: (error) => {
                    const errorMessage = (error as { message?: string })?.message || 'Error al actualizar la zona';
                    toast.error(errorMessage);
                    reject(error);
                }
            });
        });
    };

    const handleEliminarZona = async (idZona: number) => {
        setIsDeleting(true);
        const toastId = toast.loading("Eliminando zona...");

        try {
            await new Promise(resolve => setTimeout(resolve, 1200));
            await new Promise<void>((resolve, reject) => {
                eliminarZonaMutation(idZona, {
                    onSuccess: () => {
                        resolve();
                    },
                    onError: (error) => {
                        reject(error);
                    }
                });
            });
            toast.success("Zona eliminada exitosamente", { id: toastId });
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Error al eliminar la zona";
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleActualizarFormato = async (idZona: number, idFormato: number, data: {
        posicion_desde?: number;
        posicion_hasta?: number;
        descripcion?: string;
        color?: string | null;
        orden?: number;
    }) => {
        await zonasService.actualizarFormatoPosicion(idZona, idFormato, data);
        queryClient.invalidateQueries({ queryKey: zonasKeys.all });
    };

    const handleEliminarFormato = async (idZona: number, idFormato: number) => {
        await zonasService.eliminarFormatoPosicion(idZona, idFormato);
        queryClient.invalidateQueries({ queryKey: zonasKeys.all });
    };

    return {
        handleCrearZona,
        handleEditarZona,
        handleEliminarZona,
        handleActualizarFormato,
        handleEliminarFormato,
        isDeleting,
        datosCrearZona,
    };
};

