import { useState } from "react";
import { ChevronDown, MoreHorizontal, Trash2, Edit3 } from 'lucide-react';
import DropdownMenu from "./DropDownMenu";
import DropdownItem from "./DrowDownItem";
import { useDatosParaCrearZona, useEditarZona, useEliminarZona } from "../hooks/useZonas";
import { useQueryClient } from '@tanstack/react-query';
import toast from "react-hot-toast";
import { Zona, FormatoPosicion } from "../types/zonas";
import { FormField, FormModal, useModals } from "./modals/ModalAdmin";
import { EditarZonaInput, editarZonaSchema } from "../schemas/zona.schema";
import CardVacanteZona from "./CardVacanteZona";
import { calcularVacantesOcupadas } from '../utils/vacantesHelpers';
import { Equipo } from "../types/equipo";
import FormatosPosicionStep from "./FormatosPosicionStep";
import Campeon from "./Campeon";
import { useEdicionStore } from "../stores/edicionStore";

// Componente de Tabs para edición de zona
const ZonaEditTabs = ({
    activeTab,
    setActiveTab,
    setFormatosPosicion,
    cantidadEquipos,
    formatosIniciales,
    onActualizarFormato,
    onEliminarFormato,
}: {
    activeTab: 'info' | 'formatos';
    setActiveTab: (tab: 'info' | 'formatos') => void;
    formatosPosicion: FormatoPosicion[];
    setFormatosPosicion: (formatos: FormatoPosicion[]) => void;
    cantidadEquipos: number;
    formatosIniciales?: FormatoPosicion[];
    idZona: number;
    onActualizarFormato: (id_formato: number, data: {
        posicion_desde?: number;
        posicion_hasta?: number;
        descripcion?: string;
        color?: string | null;
        orden?: number;
    }) => Promise<void>;
    onEliminarFormato: (id_formato: number) => Promise<void>;
}) => {
    return (
        <div className="w-full">
            {/* Tabs */}
            <div className="flex border-b border-[var(--gray-300)] mb-4 -mt-2">
                <button
                    onClick={() => setActiveTab('info')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'info'
                            ? 'text-[var(--white)] border-b-2 border-[var(--color-primary)]'
                            : 'text-[var(--gray-100)] hover:text-[var(--white)]'
                    }`}
                >
                    Información
                </button>
                <button
                    onClick={() => setActiveTab('formatos')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'formatos'
                            ? 'text-[var(--white)] border-b-2 border-[var(--color-primary)]'
                            : 'text-[var(--gray-100)] hover:text-[var(--white)]'
                    }`}
                >
                    Formatos de Posición
                </button>
            </div>

            {/* Contenido de tabs - solo formatos cuando está activo */}
            {activeTab === 'formatos' && (
                <div className="mt-2">
                    <FormatosPosicionStep
                        cantidadEquipos={cantidadEquipos}
                        onFormatosChange={setFormatosPosicion}
                        formatosIniciales={formatosIniciales}
                        onActualizarFormato={onActualizarFormato}
                        onEliminarFormato={onEliminarFormato}
                    />
                </div>
            )}
        </div>
    );
};

const ZonaCard = ({ zona }: { zona: Zona }) => {
    const temporadas = zona.temporadas || [];
    const idZona = Number(zona.id_zona);

    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [formatosPosicion, setFormatosPosicion] = useState<FormatoPosicion[]>([]);
    const [activeTab, setActiveTab] = useState<'info' | 'formatos'>('info');

    const {
        data: datosCrearZona
    } = useDatosParaCrearZona(idZona);
    const eliminarZonaMutation = useEliminarZona();
    const { modals, openModal, closeModal } = useModals();
    const { mutate: editar } = useEditarZona();
    const queryClient = useQueryClient();
    const { edicionSeleccionada } = useEdicionStore();

    const vacantesOcupadas = calcularVacantesOcupadas(zona);
    const isCompleto = vacantesOcupadas === zona.cantidad_equipos

    const getTipoZonaLabel = (tipo: string | null | undefined): string => {
        if (!tipo) return '';
        const labels: Record<string, string> = {
            'todos-contra-todos': 'Todos contra todos',
            'eliminacion-directa': 'Eliminación directa',
            'eliminacion-directa-ida-vuelta': 'Eliminación directa (Ida y Vuelta)',
        };
        return labels[tipo] || tipo;
    };

    const handleEliminarZona = async (idZona: number) => {
        setIsDeleting(true);
        const toastId = toast.loading("Eliminando zona...");

        try {
            // Simular demora de 1.2 segundos
            await new Promise(resolve => setTimeout(resolve, 1200));

            // Usar mutateAsync para poder capturar errores
            await eliminarZonaMutation.mutateAsync(idZona);

            // Solo se ejecuta si NO hay error
            toast.success("Zona eliminada exitosamente", { id: toastId });
        } catch (error: unknown) {
            // Solo se ejecuta si HAY error
            const errorMessage = error instanceof Error ? error.message : "Error al eliminar la zona";
            toast.error(errorMessage, { id: toastId });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditarZona = async (data: EditarZonaInput): Promise<void> => {
        return new Promise((resolve, reject) => {

            if (data.cantidad_equipos && data.cantidad_equipos < vacantesOcupadas) {
                const error = new Error(`No se puede reducir a ${data.cantidad_equipos} equipos. Actualmente hay ${vacantesOcupadas} equipos asignados. Debe vaciar las vacantes primero.`);
                toast.error(error.message);
                reject(error);
                return;
            }

            editar({
                id_zona: idZona,
                id_categoria_edicion: zona.id_categoria_edicion,
                data
            }, {
                onSuccess: async () => {
                    // Si es zona tipo "todos-contra-todos", guardar formatos de posición
                    if (zona.tipoZona?.nombre === 'todos-contra-todos') {
                        try {
                            const { zonasService } = await import('../services/zonas.services');
                            
                            // Obtener formatos existentes
                            const formatosExistentes = zona.formatosPosiciones || [];

                            // Identificar formatos nuevos (sin id_formato_posicion o id = 0)
                            const formatosNuevos = formatosPosicion.filter(
                                f => !f.id_formato_posicion || f.id_formato_posicion === 0
                            );

                            // Identificar formatos eliminados (existen en BD pero no en el estado)
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

                            // Nota: La actualización de formatos existentes se manejaría aquí si fuera necesario
                            // Por ahora, solo creamos nuevos y eliminamos los que ya no están
                        } catch (error) {
                            console.error('Error al guardar formatos de posición:', error);
                            // No rechazamos la promesa porque la zona ya se actualizó
                            toast.error('Zona actualizada, pero hubo un error al guardar los formatos de posición');
                        }
                    }

                    toast.success('Zona actualizada exitosamente');
                    resolve();
                },
                onError: (error) => {
                    toast.error(error.message || 'Error al actualizar la zona');
                    reject(error);
                }
            });
        });
    };

    const getEditarZonaFields = (zona: Zona, campeones: Equipo[] = []): FormField[] => {
        const fields: FormField[] = [
            {
                name: 'nombre',
                label: 'Nombre de la zona',
                type: 'text',
                placeholder: 'Ej: Zona A',
                required: false
            },
            {
                name: 'id_tipo_zona',
                label: 'Tipo de zona',
                type: 'select',
                required: false,
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
                required: false
            },
            {
                name: 'campeon',
                label: '¿La zona tiene campeón?',
                type: 'switch',
                required: false
            }
        ];

        // Si campeon es 'S', agregar campo para seleccionar equipo campeón
        if (zona.campeon === 'S') {
            fields.push({
                name: 'id_equipo_campeon',
                label: 'Equipo campeón',
                type: 'select',
                required: false,
                options: campeones.map(equipo => ({
                    value: equipo.id_equipo,
                    label: equipo.nombre
                }))
            });
        }

        // Si es tipo "todos contra todos", agregar campo terminada
        if (zona.tipoZona?.nombre === 'todos-contra-todos') {
            fields.push({
                name: 'terminada',
                label: '¿Zona terminada?',
                type: 'switch',
                required: false
            });
        }

        return fields;
    };

    const getInitialData = (zona: Zona) => {
        // ✅ SIEMPRE precargar el equipo campeón si existe (no solo al editar)
        return {
            nombre: zona.nombre || "",
            id_tipo_zona: zona.tipoZona?.id,
            cantidad_equipos: zona.cantidad_equipos,
            campeon: zona.campeon || "N",
            terminada: zona.terminada || "N",
            id_equipo_campeon: zona.id_equipo_campeon || undefined, // Siempre precargar si existe
        };
    };

    return (
        <>
            <div className={`bg-[var(--gray-400)] border border-[var(--gray-300)] rounded-lg relative ${isDeleting ? 'opacity-60' : ''}`}>

                {isDeleting && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                        <div className="bg-[var(--gray-400)] border border-[var(--gray-300)] rounded-lg px-4 py-3 flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin" />
                            <span className="text-[var(--white)] text-sm font-medium">
                                Eliminando zona...
                            </span>
                        </div>
                    </div>
                )}

                {/* Header de la zona */}
                <div
                    className={`p-4 transition-colors ${isDeleting
                        ? 'cursor-not-allowed'
                        : 'cursor-pointer hover:bg-[var(--gray-300)]'
                        }`}
                    onClick={(e) => {
                        // Prevenir toggle si se clickea el dropdown
                        if ((e.target as HTMLElement).closest('[data-dropdown]')) {
                            return;
                        }
                        if (!isDeleting) {
                            setIsExpanded(!isExpanded);
                        }
                    }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <ChevronDown
                                className={`w-5 h-5 text-[var(--gray-100)] transition-transform ${isExpanded ? 'rotate-180' : ''
                                    }`}
                            />
                            <div>
                                <h3 className="text-[var(--white)] font-medium flex items-center gap-2">
                                    {zona.nombre}
                                    <span
                                        className={`px-2 py-1 rounded-lg text-xs font-semibold backdrop-blur-md bg-opacity-20 border ${zona.etapa.id_etapa === 1
                                            ? 'bg-yellow-400/20 border-yellow-400 text-yellow-300'
                                            : zona.etapa.id_etapa === 2
                                                ? 'bg-slate-300/20 border-slate-300 text-slate-200'
                                                : 'bg-white/10 border-white/20 text-white/70'
                                            }`}
                                    >
                                        {zona.etapa.nombre}
                                    </span>
                                </h3>

                                <p className="text-sm text-[var(--gray-100)] mt-1">
                                    {getTipoZonaLabel(zona.tipoZona?.nombre)}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className={`text-sm ${isCompleto ? 'text-[var(--color-primary)]' : 'text-[var(--orange)]'}`}>
                                        {vacantesOcupadas} / {zona.cantidad_equipos} vacantes ocupadas
                                    </span>
                                    {zona.tipoZona?.nombre === 'todos-contra-todos' && (
                                        <span className={`text-sm ${zona.terminada === 'S' ? 'text-[var(--color-primary)]' : 'text-[var(--gray-100)]'}`}>
                                            {zona.terminada === 'S' ? 'Zona terminada' : 'Zona sin terminar'}
                                        </span>
                                    )}
                                </div>

                                {/* Mostrar campeón si existe (todos contra todos o eliminación directa) */}
                                {zona.campeon === 'S' && zona.equipoCampeon && (
                                    <div className="mt-3 pt-3 border-t border-[var(--gray-300)]">
                                        <Campeon
                                            equipo={zona.equipoCampeon}
                                            nombreEdicion={edicionSeleccionada?.nombre}
                                            size="sm"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <DropdownMenu
                            trigger={
                                <div
                                    data-dropdown
                                    className={`z-999 p-2 rounded-lg transition-colors ${isDeleting
                                        ? 'cursor-not-allowed opacity-50'
                                        : 'hover:bg-[var(--gray-200)] cursor-pointer'
                                        }`}>
                                    <MoreHorizontal className="w-4 h-4 text-[var(--gray-100)]" />
                                </div>
                            }
                        >
                            <DropdownItem
                                onClick={() => openModal('edit')}
                            >
                                <Edit3 className="w-4 h-4 inline mr-2" />
                                Editar
                            </DropdownItem>
                            <DropdownItem
                                onClick={() => handleEliminarZona(idZona)}
                                variant="danger"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin inline mr-2" />
                                        Eliminando...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="w-4 h-4 inline mr-2" />
                                        Eliminar
                                    </>
                                )}
                            </DropdownItem>
                        </DropdownMenu>
                    </div>
                </div>

                {isExpanded && (
                    <div className="border-t border-[var(--gray-300)] p-2">
                        {zona.tipoZona?.id === 2 && zona.partidos && zona.partidos.length > 0 ? (
                            <div
                                className={`grid ${zona.partidos.length === 1 ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-1'
                                    }`}
                            >
                                {zona.partidos.map((partido, index) => {
                                    const faseLetra = String.fromCharCode(64 + zona.numero_fase);

                                    return (
                                        <div
                                            key={partido.id_partido}
                                            className="bg-[var(--gray-400)] rounded-lg p-2 relative"
                                        >
                                            <div className="text-xs text-[var(--gray-100)] font-medium mb-2 text-center">
                                                CRUCE {index + 1}
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 relative">
                                                {/* Equipo LOCAL */}
                                                <CardVacanteZona
                                                    equipo={partido.equipoLocal || null}
                                                    vacante={partido.vacante_local}
                                                    idZona={zona.id_zona}
                                                    idCategoriaEdicion={zona.id_categoria_edicion}
                                                    nomenclatura={`${faseLetra}${partido.vacante_local}`}
                                                    temporada={{
                                                        ...partido.temporadaLocal,
                                                        info_vacante: partido.info_vacante_local,
                                                    }}
                                                    esEliminacionDirecta={true}
                                                    numeroFaseActual={zona.numero_fase}
                                                    partido={partido}
                                                />

                                                {/* VS divisor */}
                                                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                                                    <div className="bg-[var(--gray-400)] border border-[var(--gray-200)] rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                                                        <span className="text-xs font-bold text-[var(--gray-100)]">
                                                            VS
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Equipo VISITA */}
                                                <CardVacanteZona
                                                    equipo={partido.equipoVisita || null}
                                                    vacante={partido.vacante_visita}
                                                    idZona={zona.id_zona}
                                                    idCategoriaEdicion={zona.id_categoria_edicion}
                                                    nomenclatura={`${faseLetra}${partido.vacante_visita}`}
                                                    temporada={{
                                                        ...partido.temporadaVisita,
                                                        info_vacante: partido.info_vacante_visita,
                                                    }}
                                                    esEliminacionDirecta={true}
                                                    numeroFaseActual={zona.numero_fase}
                                                    partido={partido}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {temporadas.map((temporada) => {
                                    const equipo = temporada.equipo;
                                    const vacante = temporada.vacante;
                                    return (
                                        <CardVacanteZona
                                            key={`${zona.id_zona}-${vacante}`}
                                            equipo={equipo || null}
                                            vacante={vacante}
                                            idZona={zona.id_zona}
                                            idCategoriaEdicion={zona.id_categoria_edicion}
                                            temporada={{
                                                ...temporada,
                                                info_vacante: temporada.info_vacante,
                                            }}
                                            esEliminacionDirecta={false}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <FormModal
                isOpen={modals.edit}
                onClose={() => {
                    closeModal('edit');
                    setFormatosPosicion([]);
                    setActiveTab('info');
                }}
                title={`Editar zona: ${zona.nombre}`}
                fields={
                    zona.tipoZona?.nombre === 'todos-contra-todos' && activeTab === 'formatos'
                        ? undefined
                        : getEditarZonaFields(zona, datosCrearZona?.data.equipos || [])
                }
                initialData={getInitialData(zona)}
                onSubmit={handleEditarZona}
                type="edit"
                validationSchema={editarZonaSchema}
                submitText="Actualizar zona"
                maxWidth="max-w-4xl"
            >
                {/* Mostrar tabs solo si es tipo "todos-contra-todos" */}
                {zona.tipoZona?.nombre === 'todos-contra-todos' && zona.cantidad_equipos ? (
                    <ZonaEditTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        formatosPosicion={formatosPosicion}
                        setFormatosPosicion={setFormatosPosicion}
                        cantidadEquipos={zona.cantidad_equipos}
                        formatosIniciales={zona.formatosPosiciones}
                        idZona={idZona}
                        onActualizarFormato={async (id_formato, data) => {
                            const { zonasService } = await import('../services/zonas.services');
                            await zonasService.actualizarFormatoPosicion(idZona, id_formato, data);
                            // Invalidar queries para refrescar datos
                            queryClient.invalidateQueries({ queryKey: ['zonas'] });
                        }}
                        onEliminarFormato={async (id_formato) => {
                            const { zonasService } = await import('../services/zonas.services');
                            await zonasService.eliminarFormatoPosicion(idZona, id_formato);
                            // Invalidar queries para refrescar datos
                            queryClient.invalidateQueries({ queryKey: ['zonas'] });
                        }}
                    />
                ) : null}
            </FormModal>
        </>
    );
};

export default ZonaCard;