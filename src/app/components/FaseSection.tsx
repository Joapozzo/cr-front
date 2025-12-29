import DropdownMenu from "./DropDownMenu";
import { Button } from "./ui/Button";
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import ZonaCard from "./ZonaCard";
import DropdownItem from "./DrowDownItem";
import toast from "react-hot-toast";
import { useFases } from "../hooks/useFases";
import { useZonasPorFase, useCrearZona, useDatosParaCrearZona } from "../hooks/useZonas";
import { FormField, FormModal, useModals, FormDataValue } from "./modals/ModalAdmin";
import { Fase } from "../types/fase";
import { CrearZonaInput, FormatoPosicion } from "../types/zonas";
import { crearZonaSchema } from "../schemas/zona.schema";
import { useState } from "react";
import FormatosPosicionStep from "./FormatosPosicionStep";

interface FaseSectionProps {
    fase: Fase;
    idCatEdicion: number;
}

const FaseSection = ({ fase, idCatEdicion }: FaseSectionProps) => {
    const { modals, openModal, closeModal } = useModals();
    const [tipoZonaSeleccionado, setTipoZonaSeleccionado] = useState<number | null>(null);
    const [cantidadEquipos, setCantidadEquipos] = useState<number | null>(null);
    const [formatosPosicion, setFormatosPosicion] = useState<FormatoPosicion[]>([]);

    const {
        data: zonas,
        isLoading: loadingZonas,
        error: errorZonas
    } = useZonasPorFase(idCatEdicion, fase.numero_fase);

    const {
        data: datosCrearZona,
        isLoading: loadingDatos
    } = useDatosParaCrearZona();

    const { mutate: crearZona } = useCrearZona();

    const { eliminarFase } = useFases(idCatEdicion);

    const handleEliminarFase = async (numeroFase: number) => {
        const toastId = toast.loading('Eliminando fase...');
        try {
            await eliminarFase(numeroFase);
            toast.success(`Fase ${numeroFase} eliminada exitosamente`, { id: toastId });
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error || 
                               (error as { message?: string })?.message || 
                               'Error al eliminar la fase';
            toast.error(errorMessage, { id: toastId });
        }
    };

    const handleCrearZona = async (data: CrearZonaInput): Promise<void> => {
        return new Promise((resolve, reject) => {
            crearZona({
                id_categoria_edicion: idCatEdicion,
                numero_fase: fase.numero_fase,
                data
            }, {
                onSuccess: async (response) => {
                    // Si es zona tipo "todos-contra-todos" y hay formatos, guardarlos
                    const tipoZona = datosCrearZona?.data.tiposZona?.find(t => t.id === Number(data.tipo_zona));
                    if (tipoZona?.nombre === 'todos-contra-todos' && formatosPosicion.length > 0) {
                        try {
                            const { zonasService } = await import('../services/zonas.services');
                            // La respuesta tiene estructura: { data: { zona: {...}, partidosCreados: [...] } }
                            const idZona = (response.data as any).zona?.id_zona || response.data.id_zona;

                            // Crear todos los formatos nuevos
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

                    // Resetear estados
                    setFormatosPosicion([]);
                    setCantidadEquipos(null);
                    setTipoZonaSeleccionado(null);

                    toast.success('Zona creada exitosamente');
                    resolve();
                },
                onError: (error) => {
                    toast.error(error.message || 'Error al crear la zona');
                    reject(error);
                }
            });
        });
    };

    // Función para manejar cambios en el campo tipo de zona
    const handleTipoZonaChange = (name: string, value: FormDataValue) => {
        if (name === 'id_tipo_zona') {
            setTipoZonaSeleccionado(value ? Number(value) : null);
        }
        if (name === 'cantidad_equipos') {
            setCantidadEquipos(value ? Number(value) : null);
        }
    };

    // Determinar si se debe mostrar el campo jornada
    // Solo mostrar cuando el tipo de zona NO sea 1 (todos contra todos) ni 3 (todos contra todos ida y vuelta)
    // Es decir, mostrar solo cuando sea 2 o 4
    const mostrarJornada = tipoZonaSeleccionado !== null && tipoZonaSeleccionado !== 1 && tipoZonaSeleccionado !== 3;

    const zonaFields: FormField[] = [
        {
            name: 'nombre',
            label: 'Nombre de la zona',
            type: 'text',
            placeholder: 'Ej: Zona A',
            required: true
        },
        {
            name: 'id_tipo_zona',
            label: 'Tipo de zona',
            type: 'select',
            required: true,
            options: datosCrearZona?.data.tiposZona?.map(tipo => ({
                value: tipo.id,
                label: tipo.nombre
            })) || []
        },
        {
            name: 'cantidad_equipos',
            label: 'Cantidad de equipos',
            type: 'number',
            placeholder: '8',
            required: true
        },
        // Campo jornada solo se muestra cuando el tipo de zona NO es 1 ni 3
        ...(mostrarJornada ? [{
            name: 'jornada',
            label: 'Número de jornada',
            type: 'number' as const,
            placeholder: '1',
            required: true
        }] : []),
        {
            name: 'id_etapa',
            label: 'Etapa',
            type: 'select',
            required: true,
            options: datosCrearZona?.data.etapas?.map(etapa => ({
                value: etapa.id_etapa,
                label: etapa.nombre
            })) || [],
        },
        {
            name: 'campeon',
            label: '¿La zona tendrá campeón?',
            type: 'switch',
            required: true
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-[var(--white)]">
                        Fase {fase.numero_fase}
                    </h2>
                    <Button
                        variant="success"
                        size="sm"
                        onClick={() => openModal('create')}
                        disabled={loadingDatos}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {loadingDatos ? 'Cargando...' : 'Agregar zona'}
                    </Button>
                </div>

                <DropdownMenu
                    trigger={
                        <div className="p-2 hover:bg-[var(--gray-300)] rounded-lg transition-colors">
                            <MoreHorizontal className="w-4 h-4 text-[var(--gray-100)]" />
                        </div>
                    }
                >
                    <DropdownItem
                        onClick={() => handleEliminarFase(fase.numero_fase)}
                        variant="danger"
                    >
                        <Trash2 className="w-4 h-4 inline mr-2" />
                        Eliminar
                    </DropdownItem>
                </DropdownMenu>
            </div>

            {loadingZonas ? (
                <div className="flex items-center justify-center py-12 w-full min-h-[200px]">
                    <div className="flex items-center gap-3 text-[var(--gray-100)]">
                        <div className="w-6 h-6 border-2 border-[var(--green)] border-t-transparent rounded-full animate-spin" />
                        <span>Cargando zonas...</span>
                    </div>
                </div>
            ) : (
                <div className="flex flex-wrap gap-4 items-start">
                    {errorZonas ? (
                        <div className="w-full text-center py-12 bg-[var(--gray-400)] rounded-lg border border-[var(--red)]">
                            <div className="flex flex-col items-center gap-4">
                                <div>
                                    <h3 className="text-[var(--red)] font-medium mb-2">
                                        Error al cargar las zonas
                                    </h3>
                                    <p className="text-[var(--gray-100)] text-sm">
                                        {errorZonas.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : zonas && zonas.length > 0 ? (
                        zonas.map((zona) => (
                            <div 
                                key={zona.id_zona} 
                                className={`${zonas.length === 1 ? 'w-full' : 'w-full xl:w-[calc(50%-0.5rem)]'}`}
                            >
                                <ZonaCard zona={zona} />
                            </div>
                        ))
                    ) : (
                        <div className="w-full text-center py-12 bg-[var(--gray-400)] rounded-lg border border-[var(--gray-300)]">
                            <div className="flex flex-col items-center gap-4">
                                <div>
                                    <h3 className="text-[var(--white)] font-medium mb-2">
                                        No hay zonas para mostrar
                                    </h3>
                                    <p className="text-[var(--gray-100)] text-sm max-w-md">
                                        Comienza creando las zonas para esta fase
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <FormModal
                isOpen={modals.create}
                onClose={() => {
                    closeModal('create');
                    setTipoZonaSeleccionado(null);
                    setCantidadEquipos(null);
                    setFormatosPosicion([]);
                }}
                title={`Crear zona - Fase ${fase.numero_fase}`}
                fields={zonaFields}
                onSubmit={handleCrearZona}
                type="create"
                validationSchema={crearZonaSchema}
                submitText="Crear zona"
                onFieldChange={handleTipoZonaChange}
                maxWidth="max-w-4xl"
            >
                {/* Mostrar step de formatos de posición solo si es tipo "todos-contra-todos" y hay cantidad de equipos */}
                {tipoZonaSeleccionado !== null && 
                 datosCrearZona?.data.tiposZona?.find(t => t.id === tipoZonaSeleccionado)?.nombre === 'todos-contra-todos' &&
                 cantidadEquipos !== null && cantidadEquipos > 0 && (
                    <div className="mb-6">
                        <FormatosPosicionStep
                            cantidadEquipos={cantidadEquipos}
                            onFormatosChange={setFormatosPosicion}
                        />
                    </div>
                )}
            </FormModal>

            <div className="border-t border-[var(--gray-300)] my-8"></div>
        </div>
    );
};

export default FaseSection;