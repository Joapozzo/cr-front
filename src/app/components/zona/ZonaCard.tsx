import { useState } from "react";
import { FormField, FormModal, useModals } from "../modals/ModalAdmin";
import { Zona, FormatoPosicion } from "../../types/zonas";
import { EditarZonaInput, editarZonaSchema } from "../../schemas/zona.schema";
import { useDatosParaCrearZona } from "../../hooks/useZonas";
import { useZonaActions } from "../../hooks/useZonaActions";
import { Equipo } from "../../types/equipo";
import { ZonaHeader } from "./ZonaHeader";
import { ZonaExpandedContent } from "./ZonaExpandedContent";
import { ZonaActions } from "./ZonaActions";
import { ZonaEditTabs } from "./ZonaEditTabs";

interface ZonaCardProps {
    zona: Zona;
}

const ZonaCard = ({ zona }: ZonaCardProps) => {
    const idZona = Number(zona.id_zona);
    const [isExpanded, setIsExpanded] = useState(false);
    const [formatosPosicion, setFormatosPosicion] = useState<FormatoPosicion[]>([]);
    const [activeTab, setActiveTab] = useState<'info' | 'formatos'>('info');

    const { data: datosCrearZona } = useDatosParaCrearZona(idZona);
    const { modals, openModal, closeModal } = useModals();
    
    const { handleEditarZona, handleEliminarZona, handleActualizarFormato, handleEliminarFormato, isDeleting } = useZonaActions({
        idCatEdicion: zona.id_categoria_edicion,
        numeroFase: zona.numero_fase,
        zona,
    });

    const handleToggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const handleToggleWithPrevention = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest('[data-dropdown]')) {
            return;
        }
        if (!isDeleting) {
            handleToggleExpanded();
        }
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
        return {
            nombre: zona.nombre || "",
            id_tipo_zona: zona.tipoZona?.id,
            cantidad_equipos: zona.cantidad_equipos,
            campeon: zona.campeon || "N",
            terminada: zona.terminada || "N",
            id_equipo_campeon: zona.id_equipo_campeon || undefined,
        };
    };

    const handleEditarZonaSubmit = async (data: EditarZonaInput): Promise<void> => {
        await handleEditarZona(idZona, data, formatosPosicion);
        setFormatosPosicion([]);
        setActiveTab('info');
        closeModal('edit');
    };

    return (
        <>
            <div className={`bg-[var(--gray-400)] border border-[var(--gray-300)] rounded-lg relative ${isDeleting ? 'opacity-60' : ''}`}>
                {isDeleting && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-10">
                        <div className="bg-[var(--gray-400)] border border-[var(--gray-300)] rounded-lg px-4 py-3 flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-[var(--color-danger)] border-t-transparent rounded-full animate-spin" />
                            <span className="text-[var(--white)] text-sm font-medium">
                                Eliminando zona...
                            </span>
                        </div>
                    </div>
                )}

                <div
                    className="p-4 transition-colors cursor-pointer hover:bg-[var(--gray-300)]"
                    onClick={handleToggleWithPrevention}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <ZonaHeader zona={zona} isExpanded={isExpanded} onToggle={handleToggleExpanded} />
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                            <ZonaActions
                                onEditar={() => openModal('edit')}
                                onEliminar={() => handleEliminarZona(idZona)}
                                isDeleting={isDeleting}
                            />
                        </div>
                    </div>
                </div>

                {isExpanded && (
                    <ZonaExpandedContent zona={zona} />
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
                onSubmit={handleEditarZonaSubmit}
                type="edit"
                validationSchema={editarZonaSchema}
                submitText="Actualizar zona"
                maxWidth="max-w-4xl"
            >
                {zona.tipoZona?.nombre === 'todos-contra-todos' && zona.cantidad_equipos ? (
                    <ZonaEditTabs
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        formatosPosicion={formatosPosicion}
                        setFormatosPosicion={setFormatosPosicion}
                        cantidadEquipos={zona.cantidad_equipos}
                        formatosIniciales={zona.formatosPosiciones}
                        onActualizarFormato={(id_formato, data) => handleActualizarFormato(idZona, id_formato, data)}
                        onEliminarFormato={(id_formato) => handleEliminarFormato(idZona, id_formato)}
                    />
                ) : null}
            </FormModal>
        </>
    );
};

export default ZonaCard;

